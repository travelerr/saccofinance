'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function DiscordJoinPage() {
  // ✅ Your invite
  const INVITE_URL = 'https://discord.gg/uX6Vqakbhk';

  const [showIabModal, setShowIabModal] = useState(false);
  const [toast, setToast] = useState('');

  const params = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    window.setTimeout(() => setToast(''), 1600);
  }

  function isTikTokInAppBrowser() {
    const ua = (navigator.userAgent || '').toLowerCase();
    return (
      ua.includes('tiktok') ||
      ua.includes('musical_ly') ||
      ua.includes('bytedancewebview') ||
      ua.includes('bytelocale')
    );
  }

  async function copy(text: string) {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
    }
  }

  useEffect(() => {
    // Show modal only when in TikTok IAB (or force for testing)
    const force = params.get('forceIab') === '1';
    if (force || isTikTokInAppBrowser()) setShowIabModal(true);
  }, [params]);

  return (
    <>
      {/* TikTok pop-up (only shows in TikTok in-app browser) */}
      <div className={`modalOverlay ${showIabModal ? 'show' : ''}`} role="dialog" aria-modal="true">
        <div className="modal">
          <div className="modalTop">
            <div>
              <div className="modalTitle">Quick fix</div>
              <div className="modalText">
                TikTok sometimes blocks Discord invites. Copy the link below, then open Safari/Chrome and paste it.
              </div>
            </div>
            <button className="modalClose" onClick={() => setShowIabModal(false)} type="button" aria-label="Close">
              ✕
            </button>
          </div>

          <button
            className="modalPrimary"
            type="button"
            onClick={async () => {
              await copy(INVITE_URL);
              showToast('Invite link copied ✅');
            }}
          >
            Copy Discord Invite Link
          </button>

          <div className="modalHint">
            In TikTok, tap <b>•••</b> (top-right) → <b>Open in browser</b>, then paste the link.
          </div>

          <button className="modalSecondary" onClick={() => setShowIabModal(false)} type="button">
            I opened Safari/Chrome
          </button>
        </div>
      </div>

      {/* Simple page */}
      <main className="page">
        <div className="card">
          <h1>Join the Campus Town Trading Discord</h1>
          <p className="sub">
            Tap the button below to join. If TikTok blocks it, you’ll get a quick pop-up with a one-tap copy link.
          </p>

          <a className="joinBtn" href={INVITE_URL} rel="nofollow noopener">
            Join Discord
          </a>

          {/* Optional always-visible copy (minimal + low friction) */}
          <button
            className="copyLink"
            type="button"
            onClick={async () => {
              await copy(INVITE_URL);
              showToast('Invite link copied ✅');
            }}
          >
            Copy Invite Link and Paste Browser
          </button>

          <p className="micro">If the join button doesn’t work, copy the invite link and open it in Safari/Chrome.</p>
        </div>

        <div className={`toast ${toast ? 'show' : ''}`} aria-live="polite">
          {toast}
        </div>
      </main>

      <style jsx global>{`
        :root{
          --bg:#0b1220;
          --text: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.72);
          --border: rgba(255,255,255,.14);
          --shadow: 0 18px 60px rgba(0,0,0,.45);
          --radius: 18px;
          --primary: #5b8cff;
          --primary2:#3d6cff;
        }

        *{ box-sizing:border-box; }
        html, body{ height:100%; }
        body{
          margin:0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial;
          color: var(--text);
          background:
            radial-gradient(1200px 600px at 20% 10%, rgba(91,140,255,.22), transparent 60%),
            radial-gradient(900px 500px at 85% 25%, rgba(74,222,128,.12), transparent 55%),
            radial-gradient(1100px 700px at 50% 100%, rgba(251,191,36,.10), transparent 60%),
            var(--bg);

          /* ✅ Mobile-safe sizing */
          min-height: 100svh;
          padding: 16px;
          padding-top: calc(env(safe-area-inset-top) + 16px);
        }

        .page{
          width:100%;
          max-width: 640px;
          margin: 0 auto;
        }

        .card{
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          background: linear-gradient(180deg, rgba(255,255,255,.08), rgba(255,255,255,.04));
          padding: 20px;
          backdrop-filter: blur(10px);
        }

        h1{
          margin: 0 0 10px;
          font-size: 26px;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }

        .sub{
          margin: 0 0 16px;
          color: var(--muted);
          line-height: 1.5;
          font-size: 15px;
        }

        .joinBtn{
          display:flex;
          align-items:center;
          justify-content:center;
          width: 100%;
          padding: 14px 16px;
          border-radius: 14px;
          font-size: 16px;
          font-weight: 900;
          text-decoration:none;
          color: #071024;
          background: linear-gradient(180deg, var(--primary), var(--primary2));
          box-shadow: 0 14px 28px rgba(91,140,255,.22);
          user-select:none;
          transition: filter .15s ease, transform .06s ease;
        }
        .joinBtn:active{ transform: translateY(1px); }
        .joinBtn:hover{ filter: brightness(1.05); }

        .copyLink{
          width: 100%;
          margin-top: 10px;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.92);
          font-weight: 900;
          font-size: 14px;
          cursor: pointer;
        }

        .micro{
          margin: 12px 0 0;
          color: rgba(255,255,255,.58);
          font-size: 12.5px;
          line-height: 1.4;
          text-align:center;
        }

        /* Toast */
        .toast{
          position: fixed;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          background: rgba(0,0,0,.72);
          border: 1px solid rgba(255,255,255,.18);
          padding: 10px 12px;
          border-radius: 999px;
          font-size: 13px;
          opacity: 0;
          pointer-events:none;
          transition: opacity .18s ease, transform .18s ease;
          z-index: 10002;
        }
        .toast.show{
          opacity: 1;
          transform: translateX(-50%) translateY(-6px);
        }

        /* Modal */
        .modalOverlay{
          position: fixed;
          inset: 0;
          background: rgba(0,0,0,.68);
          display: none;
          align-items: flex-end;
          justify-content: center;
          padding: 14px;
          z-index: 10001;
        }
        .modalOverlay.show{ display:flex; }

        .modal{
          width:100%;
          max-width: 640px;
          border-radius: 18px;
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(15, 23, 42, .96);
          box-shadow: 0 18px 60px rgba(0,0,0,.55);
          padding: 16px;
        }

        .modalTop{
          display:flex;
          justify-content:space-between;
          gap: 12px;
          align-items:flex-start;
          margin-bottom: 12px;
        }

        .modalTitle{
          font-weight: 900;
          font-size: 16px;
          letter-spacing: -0.01em;
        }

        .modalText{
          margin-top: 6px;
          color: rgba(255,255,255,.72);
          font-size: 13.5px;
          line-height: 1.35;
        }

        .modalClose{
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.88);
          border-radius: 12px;
          padding: 8px 10px;
          font-weight: 900;
          cursor: pointer;
        }

        .modalPrimary{
          width:100%;
          padding: 12px 14px;
          border-radius: 14px;
          border: 0;
          cursor: pointer;
          font-weight: 900;
          font-size: 15px;
          color: #071024;
          background: linear-gradient(180deg, #4ade80, #22c55e);
        }

        .modalHint{
          margin-top: 10px;
          color: rgba(255,255,255,.7);
          font-size: 12.5px;
          line-height: 1.35;
        }

        .modalSecondary{
          margin-top: 12px;
          width:100%;
          padding: 11px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.16);
          cursor: pointer;
          font-weight: 900;
          font-size: 14px;
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.92);
        }

        @media (min-width: 720px){
          .modalOverlay{ align-items:center; }
        }
      `}</style>
    </>
  );
}