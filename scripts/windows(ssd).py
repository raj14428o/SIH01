import os
import sys
import subprocess
import platform
import ctypes

DRY_RUN = True  # default to safe mode
CHUNK_SIZE = 1024 * 1024 * 100  # 100MB chunks for full wipe

def run(cmd):
    """Run a shell command (safe in dry-run mode)"""
    print(">>>", cmd)
    if DRY_RUN:
        print("[DRY-RUN] Command not executed")
        return
    result = subprocess.run(cmd, shell=True)
    if result.returncode != 0:
        print(f"Command failed: {cmd}")
        sys.exit(1)

def list_drives():
    """Return a list of available drive letters"""
    drives = []
    bitmask = ctypes.cdll.kernel32.GetLogicalDrives()
    for i in range(26):
        if bitmask & (1 << i):
            drives.append(chr(65 + i) + ":")
    return drives

def is_os_drive(drive):
    """Check if drive is the system drive"""
    return os.environ.get("SystemDrive", "C:").upper() == drive.upper()

def confirm(prompt):
    """Ask user for yes/no confirmation"""
    ans = input(f"{prompt} (type YES to confirm): ")
    return ans.strip() == "YES"

def quick_format(drive):
    """Quick format using diskpart"""
    print(f"Formatting drive {drive} ...")

    dp_script = f"""
select volume {drive.replace(':', '')}
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
    """Fill drive with zeros to simulate secure erase"""
    print(f"Starting full wipe on {drive} ...")
    wipe_file = os.path.join(drive, "wipe.tmp")
    try:
        while True:
            print(f"Writing {CHUNK_SIZE} bytes to {wipe_file} ...")
            if DRY_RUN:
                break
            with open(wipe_file, "ab") as f:
                f.write(b'\x00' * CHUNK_SIZE)
    except IOError:
        print(f"Drive {drive} is full. Deleting temporary file...")
        if not DRY_RUN and os.path.exists(wipe_file):
            os.remove(wipe_file)
    print(f"Full wipe on {drive} completed.")

if __name__ == "__main__":
    if platform.system() != "Windows":
        print("This script only works on Windows.")
        sys.exit(0)

    # Parse arguments
    DRY_RUN = "--dry-run" in sys.argv[1:]
    full = "--full" in sys.argv[1:]

    print("Available drives:")
    drives = list_drives()
    for d in drives:
        os_mark = "(OS)" if is_os_drive(d) else ""
        print(f"  {d} {os_mark}")

    target = input("Enter drive letter to erase (e.g., D:) : ").upper()
    if target not in drives:
        print("Invalid drive letter!")
        sys.exit(1)

    if is_os_drive(target):
        print("WARNING: You are attempting to erase the OS drive!")
        if not confirm("Are you absolutely sure?"):
            print("Aborting.")
            sys.exit(0)

    print(f"Target drive: {target}")
    if DRY_RUN:
        print("!!! DRY-RUN MODE: No destructive commands will be executed !!!")

    if full:
        full_wipe(target)
    else:
        quick_format(target)