"use client";

import { useState } from "react";

export default function DialerPage() {
  const [phone, setPhone] = useState("");
  const [calling, setCalling] = useState(false);
  const [message, setMessage] = useState("");

  const placeCall = async () => {
    setCalling(true);
    setMessage("Calling...");

    try {
      const res = await fetch("/api/call", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone }),
      });

      const data = await res.json();
      if (data.success) setMessage("✅ Call placed successfully!");
      else setMessage("❌ Failed to place call");
    } catch (err) {
      setMessage("❌ Error placing call");
    }

    setCalling(false);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>📞 AMD Dialer</h2>

      <input
        type="tel"
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        style={{ padding: 10, marginRight: 10 }}
      />

      <button disabled={calling} onClick={placeCall}
        style={{ padding: "10px 20px" }}
      >
        {calling ? "Calling..." : "Call"}
      </button>

      <p style={{ marginTop: 10 }}>{message}</p>
    </div>
  );
}
