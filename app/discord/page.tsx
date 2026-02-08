"use client";

import { useEffect, useMemo, useState } from "react";

const DISCORD_INVITE = "https://discord.com/invite/uX6Vqakbhk";

function isTikTokInAppBrowser(ua: string) {
  return /TikTok/i.test(ua);
}

export default function DiscordBridgePage() {
  const [ua, setUa] = useState("");

  useEffect(() => {
    setUa(navigator.userAgent || "");
  }, []);

  const inTikTok = useMemo(() => isTikTokInAppBrowser(ua), [ua]);

  const handleContinue = () => {
    // Must be user-initiated for best chance to break out of TikTok webview
    window.open(DISCORD_INVITE, "_blank", "noopener,noreferrer");

    // Fallback if popups are blocked
    setTimeout(() => {
      window.location.href = DISCORD_INVITE;
    }, 250);
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DISCORD_INVITE);
      alert("Discord link copied. Paste it in Safari/Chrome.");
    } catch {
      prompt("Copy this Discord link:", DISCORD_INVITE);
    }
  };

  return (
    <main className="min-h-screen grid place-items-center p-6 bg-gray-50">
      <div className="max-w-xl w-full bg-white rounded-2xl p-6 shadow-xl text-center">
        <h1 className="text-2xl font-bold text-gray-900">
          Join the Trading Discord
        </h1>

        <p className="mt-3 text-sm text-gray-700 leading-relaxed">
          {inTikTok
            ? "TikTok opens links inside its in-app browser. Tap Continue to open the invite. If it doesn’t work, tap ••• and choose “Open in browser,” or copy the link."
            : "Tap Continue to open the Discord invite."}
        </p>

        <button
          onClick={handleContinue}
          className="mt-5 w-full rounded-xl bg-indigo-600 text-white font-bold py-3 shadow-md"
        >
          Continue to Discord
        </button>

        <button
          onClick={handleCopy}
          className="mt-3 w-full rounded-xl border border-gray-300 bg-white py-3 font-medium"
        >
          Copy link instead
        </button>

        <p className="mt-4 text-xs text-gray-500 break-all">
          {DISCORD_INVITE}
        </p>
      </div>
    </main>
  );
}