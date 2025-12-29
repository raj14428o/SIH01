import secrets
import time

def confirm_disk_erase(disk):
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
