from pathlib import Path
import os
import subprocess
import sys


def _build_script_path(script_name):
    return Path(__file__).resolve().parent / "scripts" / script_name


def run_linux_disk_erase(device, enhanced=False, crypto=False):
    env = os.environ.copy()
    env["DATAWIPE_ARMED"] = "1"
    env["DATAWIPE_TARGET"] = device

    script_path = _build_script_path("linux(ssd).py")
    cmd = [sys.executable, str(script_path), device]

    if enhanced:
        cmd.append("--enhanced")
    if crypto:
        cmd.append("--crypto")

    completed = subprocess.run(cmd, env=env, capture_output=True, text=True, check=True)
    return {
        "runner": "linux_ssd",
        "device": device,
        "mode": "crypto" if crypto else ("enhanced" if enhanced else "standard"),
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }