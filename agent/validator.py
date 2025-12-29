# validator.py
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
    # Linux disks
    if disk.startswith("/dev/"):
        return

    # Windows drive letters (D:, E:, etc.)
    if re.fullmatch(r"[A-Z]:", disk):
        return

    raise RuntimeError("Invalid disk identifier")

