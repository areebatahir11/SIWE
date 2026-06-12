#store.py
import time

nonce_store = {}

def save_nonce(address: str, nonce: str):
    nonce_store[address.lower()] = {
        "nonce": nonce,
        "expires": time.time() + 300
    }

def get_nonce(address: str):
    return nonce_store.get(address.lower())

def delete_nonce(address: str):
    nonce_store.pop(address.lower(), None)