#auth.py
import jwt
import time
import os
from dotenv import load_dotenv

load_dotenv()

SECRET_KEY = os.getenv("SECRET_KEY")

def create_token(wallet_address: str) -> str:
    return jwt.encode(
        {"wallet": wallet_address, "exp": time.time() + 86400},
        SECRET_KEY,
        algorithm="HS256"
    )

def decode_token(token: str) -> dict:
    return jwt.decode(token, SECRET_KEY, algorithms=["HS256"])