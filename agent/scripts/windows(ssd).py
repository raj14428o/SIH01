import os
import sys
import subprocess
import platform
import ctypes

CHUNK_SIZE = 1024 * 1024 * 100  # 100MB

# Agent controls destructive mode
DRY_RUN = os.environ.get("DATAWIPE_ARMED") != "1"

def run(cmd):
    print(">>>", cmd)
    if DRY_RUN:
        print("[DRY-RUN] Command not executed")
        return
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"Command failed: {cmd}")
        sys.exit(1)

def list_drives():
    drives = []
    bitmask = ctypes.cdll.kernel32.GetLogicalDrives()
    for i in range(26):
        if bitmask & (1 << i):
            drives.append(chr(65 + i) + ":")
    return drives

def is_os_drive(drive):
    return os.environ.get("SystemDrive", "C:").upper() == drive.upper()

def confirm(prompt):
    ans = input(f"{prompt} (type YES to confirm): ")
    return ans.strip() == "YES"

def quick_format(drive):
    print(f"Formatting drive {drive} ...")
    dp_script = f"""
select volume {drive.replace(':','')}
format fs=ntfs quick
exit
"""
    script_path = "format_script.txt"
    with open(script_path, "w") as f:
        f.write(dp_script)

    run(f"diskpart /s {script_path}")

    if not DRY_RUN and os.path.exists(script_path):
        os.remove(script_path)

def full_wipe(drive):
    print(f"Starting full wipe on {drive} ...")
    wipe_file = os.path.join(drive, "wipe.tmp")
    try:
        while True:
            print(f"Writing {CHUNK_SIZE} bytes...")
            if DRY_RUN:
                break
            with open(wipe_file, "ab") as f:
                f.write(b'\x00' * CHUNK_SIZE)
    except IOError:
        print("Drive full, removing temp file")
        if not DRY_RUN and os.path.exists(wipe_file):
            os.remove(wipe_file)
    print("Full wipe completed")

if __name__ == "__main__":
    if platform.system() != "Windows":
        print("This script only works on Windows")
        sys.exit(0)

    # CLI override ONLY for testing
    if "--dry-run" in sys.argv[1:]:
        DRY_RUN = True

    full = "--full" in sys.argv[1:]

    drives = list_drives()
    print("Available drives:")
    for d in drives:
        print(" ", d, "(OS)" if is_os_drive(d) else "")

    target = os.environ.get("DATAWIPE_TARGET")
    if not target:
        target = input("Enter drive letter to erase (e.g., D:) : ").upper()

    if target not in drives:
        print("Invalid drive letter")
        sys.exit(1)

    if is_os_drive(target) and os.environ.get("DATAWIPE_ALLOW_OS") != "1":
        print("OS drive wipe blocked")
        sys.exit(1)

    print("Target:", target)
    if DRY_RUN:
        print("!!! DRY RUN MODE !!!")

    if full:
        quick_format(target)
        full_wipe(target)
    else:
        quick_format(target)
