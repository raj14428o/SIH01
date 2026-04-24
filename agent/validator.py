# validator.py
import ctypes
import os
import re

FORBIDDEN_PATHS = ["/", "/boot", "/etc", "C:\\Windows"]

def validate_path(path):
    path = os.path.realpath(path)

    for forbidden in FORBIDDEN_PATHS:
        if path.startswith(forbidden):
            raise RuntimeError("Forbidden path")

    if not os.path.exists(path):
        raise RuntimeError("Path does not exist")

def validate_disk(disk):
    disk_value = str(disk or "").strip()

    # Linux disks
    if disk_value.startswith("/dev/"):
        return disk_value

    # Windows drive letters (D:, E:, etc.)
    if re.fullmatch(r"[A-Za-z]:", disk_value):
        return disk_value.upper()

    raise RuntimeError("Invalid disk identifier")


def _is_windows_admin():
    try:
        return bool(ctypes.windll.shell32.IsUserAnAdmin())
    except Exception:
        return False


def _linux_root_mount_source():
    try:
        with open("/proc/mounts", "r", encoding="utf-8") as mounts_file:
            for line in mounts_file:
                parts = line.split()
                if len(parts) >= 2 and parts[1] == "/":
                    return parts[0]
    except Exception:
        return None
    return None


def validate_disk_policy(disk, system_name, method):
    system = str(system_name or "").strip().lower()
    selected_method = str(method or "").strip().upper()

    if system == "windows":
        if not _is_windows_admin():
            raise RuntimeError("Permission denied: run agent as Administrator for disk erase")

        if selected_method not in {"QUICK", "FULL", "CRYPTO"}:
            raise RuntimeError(f"Unsupported disk erase method for Windows: {selected_method}")

        system_drive = os.environ.get("SystemDrive", "C:").upper()
        allow_system_disk = os.environ.get("DATAWIPE_ALLOW_OS_DISK_ERASE") == "1"
        if disk.upper() == system_drive and not allow_system_disk:
            raise RuntimeError(
                "Compliance block: system drive erase is disabled (set DATAWIPE_ALLOW_OS_DISK_ERASE=1 to override)"
            )
        return

    if system == "linux":
        if hasattr(os, "geteuid") and os.geteuid() != 0:
            raise RuntimeError("Permission denied: run agent as root for disk erase")

        if selected_method not in {"STANDARD", "ENHANCED", "CRYPTO"}:
            raise RuntimeError(f"Unsupported disk erase method for Linux: {selected_method}")

        root_source = _linux_root_mount_source()
        allow_system_disk = os.environ.get("DATAWIPE_ALLOW_OS_DISK_ERASE") == "1"

        if root_source and not allow_system_disk:
            # Block obvious root-device erase attempts for compliance safety.
            if root_source == disk or root_source.startswith(disk) or disk.startswith(root_source):
                raise RuntimeError(
                    "Compliance block: root/system device erase is disabled (set DATAWIPE_ALLOW_OS_DISK_ERASE=1 to override)"
                )
        return

    raise RuntimeError(f"Unsupported OS for disk policy validation: {system_name}")

