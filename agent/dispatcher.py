"""Dispatch commands received from the backend into local runner actions."""

import platform

from confirmation import confirm_disk_erase
from validator import validate_disk, validate_disk_policy, validate_path


def _command_id(cmd):
    return cmd.get("commandId") if isinstance(cmd, dict) else None


def _result(cmd, action, success=True, message="", details=None):
    return {
        "success": success,
        "commandId": _command_id(cmd),
        "action": action,
        "platform": platform.system(),
        "message": message,
        "details": details or {},
    }


def _normalize_platform_name(value):
    normalized = str(value or "").strip().lower()
    aliases = {
        "win": "windows",
        "windows": "windows",
        "linux": "linux",
    }
    return aliases.get(normalized, normalized)


def _require_matching_platform(cmd):
    requested = _normalize_platform_name(cmd.get("platform"))
    if not requested:
        return

    actual = _normalize_platform_name(platform.system())
    if requested != actual:
        raise RuntimeError(
            f"Platform mismatch: command requires {requested}, but agent is running on {actual}"
        )


def handle_command(cmd):
    if not isinstance(cmd, dict):
        raise RuntimeError("Command payload must be a JSON object")

    action = str(cmd.get("action") or "").strip().upper()
    if not action:
        raise RuntimeError("Command is missing action")

    _require_matching_platform(cmd)

    if action == "PING":
        return _result(cmd, action, True, "pong", {"message": "Ping received"})

    if action in {"FILE_WIPE", "FOLDER_WIPE"}:
        path = cmd.get("path")
        if not path:
            raise RuntimeError("path is required for file or folder wipe")

        validate_path(path)

        method = str(cmd.get("method") or "DEFAULT").strip().upper()
        wipe_type = "folder" if action == "FOLDER_WIPE" else "file"

        from runner_files import run_file_wipe, run_folder_wipe

        if wipe_type == "folder":
            runner_result = run_folder_wipe(path, method=method)
        else:
            runner_result = run_file_wipe(path, method=method)

        return _result(
            cmd,
            action,
            True,
            f"{wipe_type.capitalize()} wipe completed",
            {
                "path": path,
                "method": method,
                "validated": True,
                "implemented": True,
                "runner": runner_result,
            },
        )

    if action == "DISK_ERASE":
        disk = cmd.get("disk")
        if not disk:
            raise RuntimeError("disk is required for disk erase")

        disk = validate_disk(disk)

        confirmation = cmd.get("confirmation") or cmd.get("confirm")
        confirmed = confirm_disk_erase(disk, approval=confirmation)
        if not confirmed:
            return _result(cmd, action, False, "Disk erase cancelled locally", {"disk": disk})

        method = str(cmd.get("method") or "FULL").strip().upper()
        system = platform.system()
        validate_disk_policy(disk, system, method)

        if system == "Windows":
            if method == "CRYPTO":
                from runner_crypto_windows import run_windows_crypto_erase

                try:
                    runner_result = run_windows_crypto_erase(disk)
                except RuntimeError as error:
                    if "BITLOCKER_UNSUPPORTED" in str(error):
                        from runner_windows import run_windows_disk_erase

                        runner_result = run_windows_disk_erase(disk, full=True)
                        runner_result["fallback"] = "logical_wipe"
                    else:
                        raise
            else:
                from runner_windows import run_windows_disk_erase

                runner_result = run_windows_disk_erase(disk, full=(method != "QUICK"))

        elif system == "Linux":
            from runner_linux import run_linux_disk_erase

            runner_result = run_linux_disk_erase(
                disk,
                enhanced=(method == "ENHANCED"),
                crypto=(method == "CRYPTO"),
            )
        else:
            raise RuntimeError("Unsupported OS")

        return _result(
            cmd,
            action,
            True,
            "Disk erase completed",
            {
                "disk": disk,
                "method": method,
                "runner": runner_result,
                "confirmed": True,
            },
        )

    raise RuntimeError(f"Unknown action: {action}")
