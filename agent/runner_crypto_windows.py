from pathlib import Path
import os
import subprocess
import sys


def _build_script_path(script_name):
    return Path(__file__).resolve().parent / "scripts" / script_name

def run_windows_crypto_erase(drive):
    env = os.environ.copy()
    env["DATAWIPE_ARMED"] = "1"

    script_path = _build_script_path("windows_crypto_erase.py")
    completed = subprocess.run(
        [sys.executable, str(script_path), drive],
        env=env,
        capture_output=True,
        text=True,
        check=True
    )

    return {
        "runner": "windows_crypto",
        "drive": drive,
        "returncode": completed.returncode,
        "stdout": completed.stdout,
        "stderr": completed.stderr,
    }

