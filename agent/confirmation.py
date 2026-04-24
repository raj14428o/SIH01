import os
import secrets
import sys
import time


def confirm_disk_erase(disk, approval=None):
    if os.environ.get("DATAWIPE_ALLOW_DISK_ERASE") == "1":
        print(f"Disk erase auto-approved for: {disk}")
        return True

    if approval is not None and str(approval).strip().upper() in {"ERASE", "CONFIRM", "YES", "APPROVE"}:
        print(f"Disk erase confirmed by command payload for: {disk}")
        return True

    if not sys.stdin.isatty():
        raise RuntimeError("Disk erase confirmation required but no interactive terminal is available")

    code = secrets.token_hex(3).upper()
    expiry = time.time() + 60

    print("\n⚠️  DANGEROUS OPERATION ⚠️")
    print(f"Disk erase requested for: {disk}")
    print(f"To confirm, type exactly: ERASE-{code}")
    print("This code expires in 60 seconds\n")

    user_input = input("CONFIRMATION: ").strip()

    if time.time() > expiry:
        print("Confirmation expired")
        return False

    if user_input == f"ERASE-{code}":
        print("Confirmation accepted")
        return True

    print("Incorrect confirmation")
    return False
