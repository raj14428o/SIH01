from pathlib import Path
import os
import subprocess
import sys


def _build_script_path(script_name):
    return Path(__file__).resolve().parent / "scripts" / script_name

def run_windows_disk_erase(drive, full=True):
    env = os.environ.copy()
    env["DATAWIPE_ARMED"] = "1"
    env["DATAWIPE_TARGET"] = drive

    # OS wipe must be explicitly allowed
    if drive.upper() == os.environ.get("SystemDrive", "C:").upper():
        env["DATAWIPE_ALLOW_OS"] = "1"

    script_path = _build_script_path("windows(ssd).py")
    cmd = [sys.executable, str(script_path)]
    if full:
        cmd.append("--full")

    completed = subprocess.run(cmd, env=env, capture_output=True, text=True, check=True)
    return {
        "runner": "windows_ssd",
        "drive": drive,
        "mode": "full" if full else "quick",
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }
