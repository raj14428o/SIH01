#!/usr/bin/env python3
import subprocess
import shlex
import sys
import time
import os

# Agent must explicitly arm
DRY_RUN = os.environ.get("DATAWIPE_ARMED") != "1"

def run(cmd):
    print(">>>", cmd)
    if DRY_RUN:
        print("[DRY-RUN] Command not executed")
        return ""

    proc = subprocess.run(
        shlex.split(cmd),
        capture_output=True,
        text=True,
        check=False
    )

    if proc.stdout:
        print(proc.stdout.strip())
    if proc.stderr:
        print(proc.stderr.strip())

    if proc.returncode != 0:
        raise RuntimeError(f"Command failed: {cmd}")

    return proc.stdout


# ---------------- SATA (ATA Secure Erase) ---------------- #

def check_support_sata(dev):
    out = run(f"hdparm -I {dev}")
    return "Security:" in out and "supported" in out.lower()

def set_password_sata(dev, pwd):
    run(f"hdparm --user-master u --security-set-pass {pwd} {dev}")

def issue_erase_sata(dev, pwd, enhanced=False):
    if enhanced:
        run(f"hdparm --user-master u --security-erase-enhanced {pwd} {dev}")
    else:
        run(f"hdparm --user-master u --security-erase {pwd} {dev}")

def disable_password_sata(dev, pwd):
    try:
        run(f"hdparm --user-master u --security-disable {pwd} {dev}")
    except Exception:
        print("Warning: could not disable ATA password")

def secure_erase_sata(dev, enhanced=False):
    print("=== SATA ATA Secure Erase ===")
    print("NOTE: If drive is frozen, suspend/resume the system.")

    if not check_support_sata(dev):
        raise RuntimeError("Drive does not support ATA Secure Erase")

    pwd = "TempErasePwd123"
    set_password_sata(dev, pwd)
    time.sleep(1)

    try:
        issue_erase_sata(dev, pwd, enhanced)
    finally:
        disable_password_sata(dev, pwd)

    print("ATA Secure Erase command issued")


# ---------------- NVMe Secure Erase ---------------- #

def check_support_nvme(dev):
    out = run(f"nvme id-ctrl {dev}")
    return "sanitize" in out.lower() or "format" in out.lower()

def secure_erase_nvme(dev, crypto=False):
    print("=== NVMe Secure Erase ===")

    if not check_support_nvme(dev):
        raise RuntimeError("NVMe device does not support sanitize/format")

    if crypto:
        print("Issuing NVMe CRYPTO ERASE")
        run(f"nvme format {dev} -s 2")
    else:
        print("Issuing NVMe SECURE ERASE")
        run(f"nvme format {dev} -s 1")

    print("NVMe erase command issued")


# ---------------- Main ---------------- #

if __name__ == "__main__":
    if os.geteuid() != 0:
        print("ERROR: Must be run as root")
        sys.exit(1)

    if len(sys.argv) < 2:
        print("Usage: secure_erase.py /dev/sdX | /dev/nvmeXn1 [--enhanced | --crypto]")
        sys.exit(1)

    dev = sys.argv[1]
    enhanced = "--enhanced" in sys.argv
    crypto = "--crypto" in sys.argv

    print("Target device:", dev)
    if DRY_RUN:
        print("!!! DRY RUN MODE !!!")

    if "nvme" in dev:
        secure_erase_nvme(dev, crypto)
    else:
        secure_erase_sata(dev, enhanced)
