import base64
import json
import os
from typing import Optional
from fastapi import FastAPI, Query
from pydantic import BaseModel
from cryptography.hazmat.primitives import hashes, serialization
from cryptography.hazmat.primitives.asymmetric import ec, padding
from cryptography.exceptions import InvalidSignature

# Optional: Required only if reading physical drives
try:
    import win32file
    import win32con
except ImportError:
    win32file = None
    win32con = None

app = FastAPI(title="Wipe Verifier for Windows")
def read_sector(drive_number=None, sector=0, count=1, sector_size=512, file_path=None):
    if file_path:
        try:
            with open(file_path, "rb") as f:
                f.seek(sector * sector_size)
                return f.read(count * sector_size)
        except Exception as e:
            return str(e).encode()
    elif win32file:
        try:
            path = f"\\\\.\\PhysicalDrive{drive_number}"
            handle = win32file.CreateFile(
                path,
                win32con.GENERIC_READ,
                win32con.FILE_SHARE_READ | win32con.FILE_SHARE_WRITE,
                None,
                win32con.OPEN_EXISTING,
                0,
                None,
            )
            win32file.SetFilePointer(handle, sector * sector_size, win32con.FILE_BEGIN)
            result, data = win32file.ReadFile(handle, count * sector_size)
            handle.close()
            return data
        except Exception as e:
            return str(e).encode()
    else:
        return b"win32file module not available"

# --- Analyze the data pattern ---
def analyze_sample(data):
    patterns = {
        "zeros": data.count(b"\x00"),
        "ones": data.count(b"\xFF")
    }
    total = len(data)
    analysis = {}
    for k, v in patterns.items():
        if v > total * 0.95:
            analysis["pattern"] = k
    if any(sig in data for sig in [b"NTFS", b"PDF", b"%PDF", b"PK", b"JFIF", b"exe", b"PE\x00\x00"]):
        analysis["found_signature"] = True
    return analysis or {"pattern": "random_or_data"}

def verify_json_signature(cert_path, pubkey_path):
    try:
        with open(cert_path, 'r') as f:
            data = json.load(f)
        signature = base64.b64decode(data.pop("signature"))
        payload = json.dumps(data, sort_keys=True, separators=(',', ':')).encode()
        with open(pubkey_path, 'rb') as f:
            pubkey = serialization.load_pem_public_key(f.read())
        if isinstance(pubkey, ec.EllipticCurvePublicKey):
            pubkey.verify(signature, payload, ec.ECDSA(hashes.SHA256()))
        else:
            pubkey.verify(signature, payload, padding.PKCS1v15(), hashes.SHA256())
        return {"ok": True}
    except InvalidSignature:
        return {"ok": False, "error": "Invalid signature"}
    except Exception as e:
        return {"ok": False, "error": str(e)}

class VerifyResult(BaseModel): new Base Model
    drive: int
    sample: str
    analysis: dict
    cert_check: Optional[dict]
    final: str

@app.get("/verify", response_model=VerifyResult)
def verify(
    drive: Optional[int] = Query(None, description="Drive number (e.g. 0 for PhysicalDrive0)"),
    file: Optional[str] = Query(None, description="Path to a binary file for test input"),
    cert: Optional[str] = Query(None, description="Path to JSON wipe certificate"),
    pub: Optional[str] = Query(None, description="Path to public key PEM file")
):
    data = read_sector(drive_number=drive, file_path=file)
    analysis = analyze_sample(data)
    cert_check = verify_json_signature(cert, pub) if cert and pub else None
    final = "CLEAN" if analysis.get("pattern") in ["zeros", "ones"] and not analysis.get("found_signature") else "NOT CLEAN"
    return {
        "drive": drive if drive is not None else -1,
        "sample": data[:64].hex(),
        "analysis": analysis,
        "cert_check": cert_check,
        "final": final
    }

    def testFunc:
        

# import base64
# import json
# import os
# import struct
# import win32file
# import win32api
# import win32con
# import win32com.client
# from fastapi import FastAPI
# from pydantic import BaseModel
# from cryptography.hazmat.primitives import hashes, serialization
# from cryptography.hazmat.primitives.asymmetric import ec, padding
# from cryptography.exceptions import InvalidSignature
# from typing import Optional

# app = FastAPI(title="Wipe Verifier for Windows")

# def read_sector(drive_number, sector=0, count=1, sector_size=512):
#     path = f"\\\\.\\PhysicalDrive{drive_number}"
#     try:
#         handle = win32file.CreateFile(
#             path,
#             win32con.GENERIC_READ,
#             win32con.FILE_SHARE_READ | win32con.FILE_SHARE_WRITE,
#             None,
#             win32con.OPEN_EXISTING,
#             0,
#             None,
#         )
#         win32file.SetFilePointer(handle, sector * sector_size, win32con.FILE_BEGIN)
#         result, data = win32file.ReadFile(handle, count * sector_size)
#         handle.close()
#         return data
#     except Exception as e:
#         return str(e).encode()

# def analyze_sample(data):
#     patterns = {
#         "zeros": data.count(b"\x00"),
#         "ones": data.count(b"\xFF")
#     }
#     total = len(data)
#     analysis = {}
#     for k, v in patterns.items():
#         if v > total * 0.95:
#             analysis["pattern"] = k
#     if b"NTFS" in data or b"PDF" in data or b"PK" in data:
#         analysis["found_signature"] = True
#     return analysis or {"pattern": "random_or_data"}

# def verify_json_signature(cert_path, pubkey_path):
#     with open(cert_path, 'r') as f:
#         data = json.load(f)
#     signature = base64.b64decode(data.pop("signature"))
#     payload = json.dumps(data, sort_keys=True, separators=(',', ':')).encode()
#     with open(pubkey_path, 'rb') as f:
#         pubkey = serialization.load_pem_public_key(f.read())
#     try:
#         if isinstance(pubkey, ec.EllipticCurvePublicKey):
#             pubkey.verify(signature, payload, ec.ECDSA(hashes.SHA256()))
#         else:
#             pubkey.verify(signature, payload, padding.PKCS1v15(), hashes.SHA256())
#         return {"ok": True}
#     except InvalidSignature:
#         return {"ok": False, "error": "invalid_signature"}

# class VerifyResult(BaseModel):
#     drive: int
#     sample: str
#     analysis: dict
#     cert_check: Optional[dict]
#     final: str

# @app.get("/verify", response_model=VerifyResult)
# def verify(drive: int = 0, cert: Optional[str] = None, pub: Optional[str] = None):
#     data = read_sector(drive, sector=0)
#     analysis = analyze_sample(data)
#     cert_check = verify_json_signature(cert, pub) if cert and pub else None
#     final = "CLEAN " if analysis.get("pattern") in ["zeros", "ones"] and not analysis.get("found_signature") else "NOT CLEAN ❌"
#     return {
#         "drive": drive,
#         "sample": data[:64].hex(),
#         "analysis": analysis,
#         "cert_check": cert_check,
#         "final": final
#     }
