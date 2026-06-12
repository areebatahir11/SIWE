#routes.py
from fastapi import APIRouter, HTTPException, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
import secrets
import jwt

from store import save_nonce, get_nonce, delete_nonce
from crypto import recover_address
from auth import create_token, decode_token

router = APIRouter()
security = HTTPBearer()

class VerifyRequest(BaseModel):
    address: str
    message: str
    signature: str

@router.get("/nonce/{address}")
def get_nonce_endpoint(address: str):
    nonce = secrets.token_hex(16)
    save_nonce(address, nonce)
    return {"nonce": nonce}

@router.post("/verify")
def verify(body: VerifyRequest):
    address = body.address.lower()
    stored = get_nonce(address)

    if not stored:
        raise HTTPException(400, "No nonce found.")

    import time
    if time.time() > stored["expires"]:
        delete_nonce(address)
        raise HTTPException(400, "Nonce expired.")

    recovered = recover_address(body.message, body.signature)
    if recovered != address:
        raise HTTPException(401, "Signature invalid.")

    delete_nonce(address)
    token = create_token(body.address)
    return {"token": token}

@router.get("/profile")
def profile(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = decode_token(credentials.credentials)
        return {"wallet": payload["wallet"], "message": "Authenticated!"}
    except jwt.ExpiredSignatureError:
        raise HTTPException(401, "Token expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(401, "Invalid token.")