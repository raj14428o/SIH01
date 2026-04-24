from __future__ import annotations

import os
import random
import shutil
import string
from pathlib import Path


CHUNK_SIZE = 1024 * 1024


def _normalize_method(method):
    value = str(method or "DEFAULT").strip().lower()
    aliases = {
        "dod_3pass": "dod_3pass",
        "dod-3pass": "dod_3pass",
        "dod_7pass": "dod_7pass",
        "dod-7pass": "dod_7pass",
        "hmg-is4": "hmg_is5_enhanced",
        "hmg-is5": "hmg_is5_enhanced",
        "hmg-is5-enhanced": "hmg_is5_enhanced",
        "prng": "prng_stream",
        "prng_stream": "prng_stream",
        "prng-stream": "prng_stream",
        "delete": "delete",
        "default": "default",
    }
    return aliases.get(value, value.replace("-", "_"))


def _random_bytes(size):
    return os.urandom(size)


def _pattern_bytes(pattern_byte, size):
    return bytes([pattern_byte]) * size


def _rewrite_file(file_path: Path, fill_mode: str):
    if not file_path.exists() or not file_path.is_file():
        return False

    file_size = file_path.stat().st_size
    with file_path.open("r+b") as handle:
        remaining = file_size
        handle.seek(0)
        while remaining > 0:
            to_write = min(CHUNK_SIZE, remaining)
            if fill_mode == "zeros":
                chunk = _pattern_bytes(0x00, to_write)
            elif fill_mode == "ones":
                chunk = _pattern_bytes(0xFF, to_write)
            else:
                chunk = _random_bytes(to_write)

            # Ensure each chunk is fully written before moving to the next one.
            view = memoryview(chunk)
            total_written = 0
            while total_written < to_write:
                written = handle.write(view[total_written:])
                if written is None or written <= 0:
                    raise RuntimeError(f"Failed to fully overwrite file: {file_path}")
                total_written += written

            remaining -= to_write

        handle.truncate(file_size)
        handle.flush()
        os.fsync(handle.fileno())
    return True


def _verify_file(file_path: Path, expected_byte: int):
    expected_chunk = bytes([expected_byte]) * CHUNK_SIZE
    with file_path.open("rb") as handle:
        while True:
            chunk = handle.read(CHUNK_SIZE)
            if not chunk:
                break
            if len(chunk) == CHUNK_SIZE:
                if chunk != expected_chunk:
                    return False
            else:
                if chunk != bytes([expected_byte]) * len(chunk):
                    return False
    return True


def _rename_random(file_path: Path):
    suffix = "".join(random.choices(string.ascii_letters + string.digits, k=12))
    renamed = file_path.with_name(f"{suffix}{file_path.suffix}")
    file_path.rename(renamed)
    return renamed


def _remove_path(path: Path):
    if path.is_dir():
        path.rmdir()
    else:
        path.unlink(missing_ok=True)


def _passes_for_method(method):
    method = _normalize_method(method)
    supported_methods = {
        "default",
        "delete",
        "prng_stream",
        "hmg_is5_enhanced",
        "dod_7pass",
        "dod_3pass",
    }

    if method not in supported_methods:
        raise RuntimeError(f"Unsupported wipe method: {method}")

    if method == "delete":
        return ["delete"]
    if method == "default":
        return ["zeros", "ones", "random"]
    if method == "prng_stream":
        return ["random"]
    if method == "hmg_is5_enhanced":
        # HMG IS5 Enhanced verifies after deterministic passes, then does random pass.
        return ["zeros", "verify_0", "ones", "verify_1", "random"]
    if method == "dod_7pass":
        return ["random", "zeros", "ones", "random", "zeros", "ones", "random"]
    if method == "dod_3pass":
        return ["zeros", "ones", "random"]


def _secure_delete_file(file_path: Path, method):
    if not file_path.exists() or not file_path.is_file():
        raise RuntimeError(f"File does not exist: {file_path}")

    normalized = _normalize_method(method)
    steps = _passes_for_method(normalized)
    applied = []

    if normalized == "delete":
        _remove_path(file_path)
        return {
            "path": str(file_path),
            "deleted": True,
            "passes": applied,
        }

    for step in steps:
        if step == "zeros":
            _rewrite_file(file_path, "zeros")
            applied.append("zeros")
        elif step == "ones":
            _rewrite_file(file_path, "ones")
            applied.append("ones")
        elif step == "random":
            _rewrite_file(file_path, "random")
            applied.append("random")
        elif step == "verify_0":
            if not _verify_file(file_path, 0x00):
                raise RuntimeError(f"Verification failed for zeros: {file_path}")
            applied.append("verify_0")
        elif step == "verify_1":
            if not _verify_file(file_path, 0xFF):
                raise RuntimeError(f"Verification failed for ones: {file_path}")
            applied.append("verify_1")

    renamed = _rename_random(file_path)
    _remove_path(renamed)

    return {
        "path": str(file_path),
        "deleted": True,
        "passes": applied,
    }


def run_file_wipe(path, method="DEFAULT"):
    file_path = Path(path)
    result = _secure_delete_file(file_path, method)
    result["mode"] = "file"
    result["method"] = _normalize_method(method)
    return result


def run_folder_wipe(path, method="DEFAULT"):
    folder_path = Path(path)

    if not folder_path.exists() or not folder_path.is_dir():
        raise RuntimeError(f"Folder does not exist: {folder_path}")

    normalized = _normalize_method(method)
    wiped_files = []

    for entry in sorted(folder_path.rglob("*"), key=lambda item: len(item.parts), reverse=True):
        if entry.is_file():
            wiped_files.append(_secure_delete_file(entry, normalized))

    shutil.rmtree(folder_path, ignore_errors=False)

    return {
        "path": str(folder_path),
        "deleted": True,
        "mode": "folder",
        "method": normalized,
        "filesProcessed": len(wiped_files),
        "files": wiped_files,
    }