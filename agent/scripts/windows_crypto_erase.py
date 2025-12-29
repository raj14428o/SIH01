import subprocess
import sys
import os
import time

DRY_RUN = os.environ.get("DATAWIPE_ARMED") != "1"

def run(cmd, allow_fail=False):
    print(">>>", cmd)
    if DRY_RUN:
        print("[DRY-RUN]")
        return ""

    p = subprocess.run(cmd, shell=True, capture_output=True, text=True)
    print(p.stdout.strip())
    print(p.stderr.strip())

    if p.returncode != 0 and not allow_fail:
        raise RuntimeError(cmd)

    return p.stdout or ""

def is_bitlocker_enabled(drive):
    out = run(f"manage-bde -status {drive}", allow_fail=True)
    return "Protection Status:    Protection On" in out

def try_enable_bitlocker(drive):
    out = run(f"manage-bde -on {drive} -RecoveryPassword", allow_fail=True)
    if "does not support this feature" in out.lower():
        return False
    time.sleep(5)
    return True

def crypto_erase(drive):
    if not is_bitlocker_enabled(drive):
        if not try_enable_bitlocker(drive):
            raise RuntimeError("BITLOCKER_UNSUPPORTED")

    run(f"manage-bde -off {drive}", allow_fail=True)
    run(f"format {drive} /FS:NTFS /Q /Y")
    print("Crypto erase completed")

if __name__ == "__main__":
    crypto_erase(sys.argv[1])




