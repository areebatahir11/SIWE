# 🔐 Sign In With Ethereum (SIWE)

A simple and secure implementation of **Sign In With Ethereum (SIWE)** using **Next.js**, **FastAPI**, **MetaMask**, and **JWT Authentication**.

Instead of traditional usernames and passwords, users authenticate by proving ownership of their Ethereum wallet through a cryptographic signature.

---

## 🚀 Features

* Connect Ethereum wallet using MetaMask
* Secure wallet authentication using signatures
* Nonce-based challenge system
* Replay attack protection
* JWT-based session management
* Protected API endpoints
* FastAPI backend
* Next.js frontend
* Clean and beginner-friendly code structure

---

## 🏗️ Architecture

```text
User
 │
 ▼
MetaMask Wallet
 │
 ▼
Next.js Frontend
 │
 ▼
FastAPI Backend
 │
 ├── Nonce Generation
 ├── Signature Verification
 └── JWT Authentication
```

---

## 🔄 Authentication Flow

### 1. Connect Wallet

The user connects their Ethereum wallet through MetaMask.

```text
User → MetaMask → Wallet Address
```

---

### 2. Request Nonce

The frontend requests a unique nonce from the backend.

```http
GET /nonce/{walletAddress}
```

The backend generates a secure random nonce and stores it temporarily.

---

### 3. Sign Message

The frontend creates a message containing the nonce and asks MetaMask to sign it.

Example:

```

Nonce: 8f3b91a7d2c4...
```

MetaMask signs the message using the user's private key.

> The private key never leaves MetaMask.

---

### 4. Verify Signature

The frontend sends:

* Wallet Address
* Message
* Signature

to the backend.

```http
POST /verify
```

The backend:

* Retrieves the stored nonce
* Checks expiration
* Recovers the signing address
* Verifies ownership

If verification succeeds, a JWT token is issued.

---

### 5. Access Protected Routes

The frontend includes the JWT token in future requests.

```http
Authorization: Bearer <JWT_TOKEN>
```

Protected endpoints validate the token before granting access.

---

## 📂 Project Structure

### Backend

```text
siwe-backend/
│
├── auth.py
├── crypto.py
├── routes.py
├── store.py
├── main.py
├── .env
└── requirement.txt
```

### Frontend

```text
siwe-frontend/
│
├── components/
│   └── WalletAuth.js
│
├── pages/
├── public/
└── package.json
```

---

## 📖 Backend Files

### auth.py

Handles JWT creation and verification.

Responsibilities:

* Generate JWT tokens
* Decode JWT tokens
* Manage authentication sessions

---

### crypto.py

Handles Ethereum signature verification.

Responsibilities:

* Convert messages into Ethereum format
* Recover wallet addresses from signatures
* Verify ownership without exposing private keys

---

### store.py

Stores nonces temporarily.

Responsibilities:

* Save nonces
* Retrieve nonces
* Delete used nonces
* Handle nonce expiration

---

### routes.py

Contains API endpoints.

Endpoints:

| Method | Endpoint           | Description      |
| ------ | ------------------ | ---------------- |
| GET    | `/nonce/{address}` | Generate nonce   |
| POST   | `/verify`          | Verify signature |
| GET    | `/profile`         | Protected route  |

---

### main.py

Application entry point.

Responsibilities:

* Create FastAPI application
* Configure CORS
* Register routes

---

## 🔒 Security Features

### Nonce Protection

Every login attempt receives a unique nonce.

Benefits:

* Prevents replay attacks
* Ensures every signature is unique

---

### Signature Verification

Authentication is based on cryptographic proof of wallet ownership.

Benefits:

* No passwords required
* No sensitive credentials stored

---

### JWT Authentication

After successful login, users receive a JWT token.

Benefits:

* Stateless authentication
* Reduced signing requests
* Secure session handling

---

## ⚙️ Environment Variables

Create a `.env` file inside the backend directory:

```env
SECRET_KEY=your_super_secret_key
```

---

## 🛠️ Installation

### Backend

```bash
cd siwe-backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend runs on:

```text
http://localhost:8000
```

---

### Frontend

```bash
cd siwe-frontend

npm install

npm run dev
```

Frontend runs on:

```text
http://localhost:3000
```

---

## 🧪 Example Authentication Response

```json
{
  "token": "eyJhbGciOiJIUzI1NiIs..."
}
```

---

## 🧪 Example Protected Route Response

```json
{
  "wallet": "0x1234567890abcdef...",
  "message": "Authenticated!"
}
```

---

## 🌟 Why Sign In With Ethereum?

Traditional authentication relies on:

* Usernames
* Passwords
* Password resets
* Credential storage

SIWE replaces all of that with wallet ownership verification.

Benefits:

✅ Passwordless Authentication

✅ Better User Experience

✅ Improved Security

✅ Web3 Native Identity

✅ Industry Standard Authentication Pattern

---

## 📚 Technologies Used

### Frontend

* Next.js
* React
* ethers.js
* MetaMask

### Backend

* FastAPI
* Python
* eth-account
* PyJWT
* python-dotenv

---

## 👨‍💻 Author

Built as a learning project to demonstrate the complete Sign In With Ethereum (SIWE) authentication flow using modern Web3 technologies.
