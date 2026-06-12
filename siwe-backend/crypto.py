#crypto.py
from eth_account.messages import encode_defunct
from eth_account import Account

def recover_address(message: str, signature: str) -> str:
    msg = encode_defunct(text=message)
    return Account.recover_message(msg, signature=signature).lower()