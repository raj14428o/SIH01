import subprocess, os

def run_windows_crypto_erase(drive):
    env = os.environ.copy()
    env["DATAWIPE_ARMED"] = "1"

    subprocess.run(
        ["python", "scripts/windows_crypto_erase.py", drive],
        env=env,
        check=True
    )

