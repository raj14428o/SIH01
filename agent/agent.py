import time
from dispatcher import handle_command
# from server import poll_server

POLL_INTERVAL = 5  # seconds
def mock_poll_server():
    """
    TEMPORARY: simulates a server command
    """
    return {
        "action": "DISK_ERASE",
        "disk": "E:",   # change to test
        "method": "FULL"
    }

def main():
    print("[Agent] DataWipe agent started")
    cmd =  mock_poll_server()
    if cmd:
            try:
                handle_command(cmd)
            except Exception as e:
                print("[Agent] Error:", e)
    time.sleep(POLL_INTERVAL)
    print("[Agent] Command processed. Exiting.")
if __name__ == "__main__":
    main()
