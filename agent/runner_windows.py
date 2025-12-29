import subprocess
import os
import sys

def run_windows_disk_erase(drive, full=True):
    env = os.environ.copy()
    env["DATAWIPE_ARMED"] = "1"
    env["DATAWIPE_TARGET"] = drive

    # OS wipe must be explicitly allowed
    if drive.upper() == os.environ.get("SystemDrive", "C:").upper():
        env["DATAWIPE_ALLOW_OS"] = "1"

    cmd = ["python", "scripts/windows(ssd).py"]
    if full:
        cmd.append("--full")

    subprocess.run(cmd, env=env, check=True)
