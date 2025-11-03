import Image from "next/image";

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>Welcome to AMD Dialer ✅</h1>

      <a href="/dialer" style={{ fontSize: 20, color: "blue" }}>
        Go to Dialer
      </a>
    </main>
  );
}
