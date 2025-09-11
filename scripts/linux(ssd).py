#!/usr/bin/env python3
import subprocess
import shlex
import sys
import time

DRY_RUN = False  # global flag

def run(cmd):
    print(">>>", cmd)
    if DRY_RUN:
        return "[DRY-RUN] Command not executed"

    proc = subprocess.run(shlex.split(cmd), capture_output=True, text=True)
    if proc.stdout:
        print(proc.stdout.strip())
    if proc.stderr:
        print(proc.stderr.strip())
    if proc.returncode != 0:
        raise RuntimeError(f"Command failed: {cmd}\nReturn {proc.returncode}\n{proc.stderr}")
    return proc.stdout

# ---------------- SATA (hdparm) functions ---------------- #
def check_support_sata(dev):
    out = run(f"sudo hdparm -I {dev}")
    return "Security:" in out

def set_password_sata(dev, pwd="erasepwd"):
    run(f"sudo hdparm --user-master u --security-set-pass {pwd} {dev}")

def issue_erase_sata(dev, pwd="erasepwd", enhanced=False):
    if enhanced:
        cmd = f"sudo hdparm --user-master u --security-erase-enhanced {pwd} {dev}"
    else:
        cmd = f"sudo hdparm --user-master u --security-erase {pwd} {dev}"
    run(cmd)

def disable_password_sata(dev, pwd="erasepwd"):
    """Best effort cleanup so drive is not left locked if erase fails."""
    try:
        run(f"sudo hdparm --user-master u --security-disable {pwd} {dev}")
    except Exception as e:
        print(f"Warning: could not disable password: {e}")

def secure_erase_sata(dev, pwd="erasepwd", enhanced=False):
    print("=== SATA Secure Erase ===")
    print("If device is frozen by BIOS/UEFI, secure erase will fail.")
    print("You may need to put system to sleep/resume or use vendor tools to unfreeze.")
    time.sleep(1)

    if not check_support_sata(dev):
        raise SystemExit("Device does not advertise Security support (or hdparm couldn't read it).")

    set_password_sata(dev, pwd)
    print("Password set. Issuing secure erase. This can take a long time.")
    try:
        issue_erase_sata(dev, pwd, enhanced=enhanced)
    finally:
        disable_password_sata(dev, pwd)
    print("Erase command issued. Verify with hdparm -I or SMART logs.")

# ---------------- NVMe (nvme-cli) functions ---------------- #
def check_support_nvme(dev):
    """Check NVMe sanitize support via controller data."""
    out = run(f"sudo nvme id-ctrl {dev}")
    return "oacs" in out or "Format" in out

def secure_erase_nvme(dev, crypto=False):
    print("=== NVMe Secure Erase ===")
    if not check_support_nvme(dev):
        raise SystemExit("Device does not advertise sanitize/format support.")

    if crypto:
        print("Issuing Crypto Erase (destroys encryption keys).")
        run(f"sudo nvme format {dev} -s 2")
    else:
        print("Issuing Secure Erase (wipes all NAND).")
        run(f"sudo nvme format {dev} -s 1")
    print("Erase command issued. Verify with: sudo nvme list -o json")

# ---------------- Main logic ---------------- #
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python3 secure_erase.py /dev/sdX|/dev/nvmeXn1 [--enhanced|--crypto] [--dry-run]")
        sys.exit(1)

    dev = sys.argv[1]
    enhanced = "--enhanced" in sys.argv[2:]
    crypto = "--crypto" in sys.argv[2:]
    DRY_RUN = "--dry-run" in sys.argv[2:]

    print(f"Target device: {dev}")
    if DRY_RUN:
        print("!!! DRY RUN MODE: No destructive commands will be executed !!!")

    if "nvme" in dev:
        secure_erase_nvme(dev, crypto=crypto)
    else:
        secure_erase_sata(dev, pwd="TempPwd123", enhanced=enhanced)