import { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";
import styles from "./WalletAuth.module.css";

const API = "http://localhost:8000";

export default function WalletAuth() {
  const [address, setAddress] = useState(null);
  const [token, setToken]     = useState(null);
  const [profile, setProfile] = useState(null);
  const [status, setStatus]   = useState("Click below to get started.");
  const [loading, setLoading] = useState(false);

  // ── STEP 1: Connect MetaMask ──────────────────────
  async function connectWallet() {
    if (!window.ethereum) {
      alert("MetaMask not found! Please install it.");
      return;
    }
    try {
      setLoading(true);
      setStatus("Connecting wallet...");

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const addr = await signer.getAddress();

      setAddress(addr);
      setStatus("Wallet connected! Now sign in to prove ownership.");
    } catch (err) {
      setStatus("Connection cancelled.");
    } finally {
      setLoading(false);
    }
  }

  // ── STEPS 2-6: Get nonce → Sign → Verify → JWT ───
  async function signIn() {
    try {
      setLoading(true);

      // Step 2: Ask backend for a nonce
      setStatus("Fetching challenge from backend...");
      const { data: { nonce } } = await axios.get(`${API}/nonce/${address}`);

      // Step 3: Build the message the user will sign
      const message = `Sign in to MyApp\n\nNonce: ${nonce}\nAddress: ${address}`;

      // Step 4: Ask MetaMask to sign it
      setStatus("Check MetaMask — please sign the message...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const signer = await provider.getSigner();
      const signature = await signer.signMessage(message);

      // Step 5: Send to backend for verification
      setStatus("Verifying signature with backend...");
      const { data: { token } } = await axios.post(`${API}/verify`, {
        address,
        message,
        signature,
      });

      // Step 6: Store JWT and update UI
      setToken(token);
      setStatus("Authenticated successfully!");
    } catch (err) {
      if (err.code === 4001) {
        setStatus("You rejected the signature request.");
      } else {
        setStatus(`Error: ${err.response?.data?.detail || err.message}`);
      }
    } finally {
      setLoading(false);
    }
  }

  // ── STEP 7: Access protected route ───────────────
  async function fetchProfile() {
    try {
      setLoading(true);
      setStatus("Fetching protected profile...");
      const { data } = await axios.get(`${API}/profile`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(data);
      setStatus("Profile loaded from protected endpoint!");
    } catch (err) {
      setStatus("Failed to fetch profile.");
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setAddress(null);
    setToken(null);
    setProfile(null);
    setStatus("Logged out. Click below to get started.");
  }

  return (
    <div className={styles.card}>
      <h1 className={styles.title}>Web3 Login</h1>
      <p className={styles.subtitle}>Sign In With Ethereum (SIWE)</p>

      {/* Status bar */}
      <div className={styles.statusBar}>
        <span>{status}</span>
      </div>

      {/* Step indicators */}
      <div className={styles.steps}>
        <div className={`${styles.step} ${address ? styles.done : styles.active}`}>
          1. Connect
        </div>
        <div className={`${styles.step} ${token ? styles.done : address ? styles.active : ""}`}>
          2. Sign
        </div>
        <div className={`${styles.step} ${profile ? styles.done : token ? styles.active : ""}`}>
          3. Profile
        </div>
      </div>

      {/* Wallet address display */}
      {address && (
        <div className={styles.addressBox}>
          <span className={styles.label}>Wallet</span>
          <span className={styles.address}>{address}</span>
        </div>
      )}

      {/* Action buttons */}
      <div className={styles.actions}>
        {!address && (
          <button className={styles.btn} onClick={connectWallet} disabled={loading}>
            {loading ? "Connecting..." : "Connect Wallet"}
          </button>
        )}

        {address && !token && (
          <button className={styles.btnGreen} onClick={signIn} disabled={loading}>
            {loading ? "Waiting..." : "Sign In"}
          </button>
        )}

        {token && !profile && (
          <button className={styles.btnBlue} onClick={fetchProfile} disabled={loading}>
            {loading ? "Loading..." : "Fetch Profile"}
          </button>
        )}

        {address && (
          <button className={styles.btnGray} onClick={logout}>
            Logout
          </button>
        )}
      </div>

      {/* JWT display */}
      {token && (
        <div className={styles.tokenBox}>
          <span className={styles.label}>JWT Token</span>
          <span className={styles.token}>{token.slice(0, 40)}...</span>
        </div>
      )}

      {/* Profile result */}
      {profile && (
        <div className={styles.profileBox}>
          <span className={styles.label}>Protected endpoint response</span>
          <pre className={styles.json}>{JSON.stringify(profile, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}