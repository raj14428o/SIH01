# dispatcher.py
from confirmation import confirm_disk_erase
from validator import validate_path, validate_disk
import platform

def handle_command(cmd):
    action = cmd.get("action")

    if action == "FILE_WIPE":
        path = cmd.get("path")
        method = cmd.get("method")

        validate_path(path)

        print("[Dispatcher] FILE WIPE")
        print("Path:", path)
        print("Method:", method)
        print("File wipe would execute here (not wired yet)")

    elif action == "DISK_ERASE":
        disk = cmd.get("disk")
        method = cmd.get("method")

        validate_disk(disk)

        # LOCAL HUMAN CONFIRMATION (MANDATORY)
        if not confirm_disk_erase(disk):
            print("[Agent] Disk erase cancelled locally")
            return

        print("[Agent] Disk erase CONFIRMED")
        print("Disk:", disk)
        print("Method:", method)

        system = platform.system()

        if system == "Linux":
            print("→ Linux disk erase would run here")

        elif system == "Windows":
            if method == "CRYPTO":
                from runner_crypto_windows import run_windows_crypto_erase
                try:
                    run_windows_crypto_erase(disk)
                except RuntimeError as e:
                    if "BITLOCKER_UNSUPPORTED" in str(e):
                        print("⚠️ Crypto erase unsupported, falling back to LOGICAL WIPE")
                        from runner_windows import run_windows_disk_erase
                        run_windows_disk_erase(disk, full=True)
                    else:
                        raise
            else:
                from runner_windows import run_windows_disk_erase
                run_windows_disk_erase(disk, full=(method == "FULL"))

        else:
            raise RuntimeError("Unsupported OS")

    else:
        raise RuntimeError("Unknown action")
