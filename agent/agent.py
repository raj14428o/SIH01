import json
import os
import socket
import time
from urllib import error, parse, request

from dispatcher import handle_command

SERVER_URL = os.getenv('DATAWIPE_SERVER_URL', 'http://localhost:5000').rstrip('/')
AGENT_ID = os.getenv('DATAWIPE_AGENT_ID', socket.gethostname())
POLL_INTERVAL = int(os.getenv('DATAWIPE_POLL_INTERVAL', '5'))


def _request_json(method, path, payload=None):
    url = f"{SERVER_URL}{path}"
    data = None
    headers = {
        'Content-Type': 'application/json',
        'x-agent-id': AGENT_ID,
    }

    if payload is not None:
        data = json.dumps(payload).encode('utf-8')

    req = request.Request(url, data=data, method=method, headers=headers)

    with request.urlopen(req, timeout=15) as response:
        raw = response.read().decode('utf-8')
        return json.loads(raw) if raw else {}


def report_status(status='online', last_command_id=None, details=None):
    payload = {
        'agentId': AGENT_ID,
        'status': status,
        'lastCommandId': last_command_id,
        'details': details,
    }
    return _request_json('POST', '/api/agent/status', payload=payload)


def poll_server_for_command():
    for queue_id in (AGENT_ID, 'default'):
        query = parse.urlencode({'agentId': queue_id})
        response = _request_json('GET', f'/api/agent/commands/next?{query}')
        command = response.get('command')
        if command:
            return command

    return None


def execute_command(command):
    result = handle_command(command)
    action = result.get('action', 'UNKNOWN')

    if result.get('success'):
        print(f"[Agent] {action} completed successfully")
    else:
        print(f"[Agent] {action} finished with a non-success result")

    return result


def report_command_state(command_id, status, details):
    return report_status(status=status, last_command_id=command_id, details=details)


def main():
    print(f'[Agent] DataWipe agent started (id={AGENT_ID})')

    while True:
        try:
            report_status(status='online')
            command = poll_server_for_command()

            if command:
                command_id = command.get('commandId')
                print(f"[Agent] Received command: {command}")
                report_command_state(
                    command_id,
                    'busy',
                    {
                        'phase': 'received',
                        'action': command.get('action'),
                    },
                )
                try:
                    result = execute_command(command)
                    report_command_state(
                        command_id,
                        'online',
                        {
                            'phase': 'completed',
                            'result': result,
                        },
                    )
                except Exception as command_error:
                    print(f"[Agent] Command {command_id} failed: {command_error}")
                    report_command_state(
                        command_id,
                        'error',
                        {
                            'phase': 'failed',
                            'action': command.get('action'),
                            'message': str(command_error),
                        },
                    )
            else:
                print('[Agent] No command received')

        except error.HTTPError as http_error:
            print(f'[Agent] HTTP error: {http_error.code} {http_error.reason}')
            report_status(status='error', details={'message': str(http_error)})
        except error.URLError as url_error:
            print(f'[Agent] Network error: {url_error}')
        except Exception as exc:
            print(f'[Agent] Error: {exc}')
            try:
                report_status(status='error', details={'message': str(exc)})
            except Exception:
                pass

        time.sleep(POLL_INTERVAL)


if __name__ == '__main__':
    main()
