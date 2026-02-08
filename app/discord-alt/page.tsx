'use client';

import React, { useEffect, useMemo, useState } from 'react';

export default function DiscordBridgePage() {
  // ✅ Set these once
  const INVITE_CODE = 'uX6Vqakbhk';
  const INVITE_URL = `https://discord.com/invite/${INVITE_CODE}`;

  const [showOverlay, setShowOverlay] = useState(false);
  const [toast, setToast] = useState<string>('');

  const params = useMemo(() => {
    if (typeof window === 'undefined') return new URLSearchParams();
    return new URLSearchParams(window.location.search);
  }, []);

  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(''), 1800);
  }

  async function copyText(text: string) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      // fallback
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      document.body.removeChild(temp);
      return true;
    }
  }

  function isInAppBrowser() {
    const ua = (navigator.userAgent || '').toLowerCase();
    return (
      ua.includes('tiktok') ||
      ua.includes('musical_ly') ||
      ua.includes('bytedancewebview') ||
      ua.includes('bytelocale') ||
      ua.includes('instagram') ||
      ua.includes('fbav') ||
      ua.includes('fb_iab')
    );
  }

  useEffect(() => {
    const force = params.get('forceIab') === '1';
    const shouldShow = force || isInAppBrowser();
    if (shouldShow) setShowOverlay(true);
  }, [params]);

  const debug = typeof window !== 'undefined' && params.get('debug') === '1';

  return (
    <>
      {/* In-app overlay */}
      <div className={`iabOverlay ${showOverlay ? 'show' : ''}`} role="dialog" aria-modal="true" aria-label="In-app browser help">
        <div className="iabBox">
          <div className="iabHeader">
            <div>
              <p className="iabTitle">Quick fix: TikTok blocks Discord sometimes</p>
              <div className="iabText">
                Tap <strong>•••</strong> (top-right) → <strong>Open in browser</strong>, then come back and hit <strong>Join Discord</strong>.
              </div>
            </div>
            <button className="iabClose" type="button" onClick={() => setShowOverlay(false)}>
              Got it
            </button>
          </div>

          <div className="iabActions">
            <button
              className="iabBtnGood"
              type="button"
              onClick={async () => {
                await copyText(INVITE_CODE);
                showToast('Invite code copied ✅');
              }}
            >
              Copy Invite Code
            </button>

            <button
              className="iabBtnGhost"
              type="button"
              onClick={async () => {
                await copyText(INVITE_URL);
                showToast('Invite link copied ✅');
              }}
            >
              Copy Invite Link
            </button>

            <div className="iabFine">
              Manual join: Discord → <strong>+</strong> → <strong>Join a Server</strong> → paste code.
            </div>
          </div>

          {debug && (
            <div className="debugRow">
              <div className="pill">Overlay: {showOverlay ? 'ON' : 'OFF'}</div>
              <div className="pill">In-app detected: {typeof window !== 'undefined' && isInAppBrowser() ? 'YES' : 'NO'}</div>
              <div className="pill">UA: {(typeof window !== 'undefined' ? navigator.userAgent : '').slice(0, 90)}…</div>
            </div>
          )}
        </div>
      </div>

      <main className="wrap">
        <section className="card" role="region" aria-label="Discord Join Page">

          <h1>Join the Campus Town Trading Discord</h1>
          <p className="sub">
            Live trades, market breakdowns, and a real community. If TikTok blocks the join button, use the backup code below — it always works.
          </p>

          <div className="cta">
            <a className="btn btn-primary" id="joinBtn" href={INVITE_URL} rel="nofollow noopener">
              👉 Join Discord (Recommended)
            </a>
            <div className="helper">If that doesn’t open, use the backup option below 👇</div>
          </div>

          <div className="divider">or</div>

          <div className="panel">
            <h2>Manual Join (Always Works)</h2>

            <div className="codeLabel">Invite Code</div>
            <div className="codeRow">
              <div className="codeBox" aria-label="Invite code container">
                <code id="inviteCode">{INVITE_CODE}</code>
                <button
                  className="mini"
                  type="button"
                  onClick={async () => {
                    await copyText(INVITE_CODE);
                    showToast('Invite code copied ✅');
                  }}
                >
                  Copy
                </button>
              </div>

              <a className="btn btn-secondary" style={{ flex: '1 1 220px' }} href={`https://discord.gg/${INVITE_CODE}`} rel="nofollow noopener">
                Open Invite in Browser
              </a>
            </div>

            <ol>
              <li>
                Open the <strong>Discord</strong> app
              </li>
              <li>
                Tap the <strong>+</strong> icon on the left
              </li>
              <li>
                Tap <strong>Join a Server</strong>
              </li>
              <li>
                Paste the invite code and tap <strong>Join</strong>
              </li>
            </ol>

            <div className="tip" role="note">
              <strong>Coming from TikTok?</strong> TikTok sometimes blocks Discord invites. Tap the <strong>•••</strong> menu (top-right) →{' '}
              <strong>Open in browser</strong>, then try again.
            </div>
          </div>

          <div className="footer">
            No spam. Leave anytime.
            <br />
            If you still can’t join, update Discord or try from Safari/Chrome.
          </div>
        </section>
      </main>

      {/* Toast */}
      <div className={`toast ${toast ? 'show' : ''}`} aria-live="polite">
        {toast}
      </div>

      {/* CSS (single-page) */}
      <style jsx global>{`
        :root{
          --bg: #0b1220;
          --border: rgba(255,255,255,.12);
          --text: rgba(255,255,255,.92);
          --muted: rgba(255,255,255,.72);
          --muted2: rgba(255,255,255,.58);
          --shadow: 0 18px 60px rgba(0,0,0,.45);
          --radius: 18px;
          --primary: #5b8cff;
          --primary2: #3d6cff;
        }

        *{ box-sizing:border-box; }
        html, body{ height:100%; }
        body{
          margin:0;
          font-family: ui-sans-serif, system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Apple Color Emoji","Segoe UI Emoji";
          background:
            radial-gradient(1200px 600px at 20% 10%, rgba(91,140,255,.22), transparent 60%),
            radial-gradient(900px 500px at 85% 25%, rgba(74,222,128,.14), transparent 55%),
            radial-gradient(1100px 700px at 50% 100%, rgba(251,191,36,.14), transparent 60%),
            var(--bg);
          color: var(--text);
          display:flex;
          align-items:center;
          justify-content:center;
          padding: 22px;
        }

        .wrap{ width:100%; max-width: 680px; }

        .card{
          background: linear-gradient(180deg, rgba(255,255,255,.07), rgba(255,255,255,.04));
          border: 1px solid var(--border);
          border-radius: var(--radius);
          box-shadow: var(--shadow);
          padding: 22px;
          backdrop-filter: blur(10px);
        }

        .brand{
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 14px;
          margin-bottom: 10px;
          flex-wrap: wrap;
        }

        .badge{
          display:inline-flex;
          align-items:center;
          gap:8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(91,140,255,.14);
          border: 1px solid rgba(91,140,255,.25);
          font-size: 13px;
          color: rgba(255,255,255,.86);
          white-space: nowrap;
        }
        .badgeGreen{
          background:rgba(74,222,128,.12);
          border-color:rgba(74,222,128,.22);
        }

        h1{
          font-size: clamp(22px, 3.2vw, 30px);
          line-height: 1.15;
          margin: 10px 0 8px;
          letter-spacing: -0.02em;
        }

        .sub{
          margin: 0 0 16px;
          color: var(--muted);
          font-size: 15.5px;
          line-height: 1.5;
        }

        .cta{
          margin-top: 14px;
          display:flex;
          flex-direction:column;
          gap: 12px;
        }

        .btn{
          display:inline-flex;
          align-items:center;
          justify-content:center;
          gap: 10px;
          width: 100%;
          border: 0;
          border-radius: 14px;
          padding: 14px 16px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: .01em;
          cursor: pointer;
          text-decoration:none;
          user-select:none;
          transition: transform .06s ease, filter .15s ease, background .15s ease, border-color .15s ease;
        }
        .btn:active{ transform: translateY(1px); }

        .btn-primary{
          background: linear-gradient(180deg, var(--primary), var(--primary2));
          color: #071024;
          box-shadow: 0 14px 28px rgba(91,140,255,.22);
        }
        .btn-primary:hover{ filter: brightness(1.05); }

        .btn-secondary{
          background: rgba(255,255,255,.06);
          color: var(--text);
          border: 1px solid var(--border);
        }
        .btn-secondary:hover{ background: rgba(255,255,255,.08); }

        .helper{
          text-align:center;
          font-size: 13px;
          color: var(--muted2);
          margin-top: -6px;
        }

        .divider{
          display:flex;
          align-items:center;
          gap: 12px;
          margin: 14px 0;
          color: rgba(255,255,255,.52);
          font-weight: 700;
          letter-spacing: .06em;
          text-transform: uppercase;
          font-size: 12px;
        }
        .divider::before, .divider::after{
          content:"";
          height:1px;
          flex:1;
          background: rgba(255,255,255,.14);
        }

        .panel{
          background: rgba(0,0,0,.18);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 16px;
          padding: 16px;
        }

        .panel h2{
          font-size: 16px;
          margin: 0 0 10px;
          letter-spacing: -0.01em;
        }

        .codeRow{
          display:flex;
          gap: 10px;
          align-items: stretch;
          margin: 8px 0 12px;
          flex-wrap: wrap;
        }

        .codeBox{
          flex: 1 1 220px;
          background: rgba(255,255,255,.06);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 12px;
          padding: 12px 12px;
          display:flex;
          align-items:center;
          justify-content:space-between;
          gap: 12px;
          min-height: 48px;
        }

        .codeLabel{
          font-size: 12px;
          color: rgba(255,255,255,.62);
          margin-bottom: 6px;
          font-weight: 700;
          letter-spacing: .04em;
          text-transform: uppercase;
        }

        code{
          font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
          font-weight: 800;
          font-size: 15px;
          letter-spacing: .01em;
          color: rgba(255,255,255,.92);
          word-break: break-all;
        }

        .mini{
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 800;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.16);
          background: rgba(255,255,255,.06);
          color: var(--text);
          cursor:pointer;
        }

        ol{
          margin: 10px 0 0 18px;
          padding:0;
          color: var(--muted);
          line-height: 1.55;
          font-size: 14px;
        }
        li{ margin: 6px 0; }

        .tip{
          margin-top: 14px;
          border-radius: 14px;
          padding: 12px 12px;
          background: rgba(251,191,36,.10);
          border: 1px solid rgba(251,191,36,.22);
          color: rgba(255,255,255,.88);
          font-size: 13.5px;
          line-height: 1.45;
        }
        .tip strong{ color: #fff; }

        .footer{
          text-align:center;
          margin-top: 14px;
          color: rgba(255,255,255,.55);
          font-size: 12.5px;
          line-height: 1.45;
        }

        .toast{
          position: fixed;
          left: 50%;
          bottom: 18px;
          transform: translateX(-50%);
          background: rgba(0,0,0,.72);
          border: 1px solid rgba(255,255,255,.18);
          color: rgba(255,255,255,.92);
          padding: 10px 12px;
          border-radius: 999px;
          font-size: 13px;
          box-shadow: 0 16px 40px rgba(0,0,0,.35);
          opacity: 0;
          pointer-events:none;
          transition: opacity .18s ease, transform .18s ease;
          z-index: 10001;
        }
        .toast.show{
          opacity: 1;
          transform: translateX(-50%) translateY(-6px);
        }

        .iabOverlay{
          position: fixed;
          inset: 0;
          z-index: 10000;
          background: rgba(0,0,0,.72);
          display:none;
          align-items:center;
          justify-content:center;
          padding: 18px;
        }
        .iabOverlay.show{ display:flex; }

        .iabBox{
          width:100%;
          max-width: 640px;
          background: rgba(15, 23, 42, .96);
          border: 1px solid rgba(255,255,255,.14);
          border-radius: 18px;
          box-shadow: 0 18px 60px rgba(0,0,0,.55);
          padding: 18px;
        }

        .iabHeader{
          display:flex;
          justify-content:space-between;
          gap:12px;
          align-items:flex-start;
        }

        .iabTitle{
          font-weight: 900;
          font-size: 18px;
          letter-spacing: -0.01em;
          margin:0;
        }

        .iabText{
          margin-top: 6px;
          color: rgba(255,255,255,.72);
          line-height: 1.35;
          font-size: 14px;
        }

        .iabActions{
          margin-top: 14px;
          display:flex;
          flex-direction:column;
          gap: 10px;
        }

        .iabBtnGood{
          width:100%;
          padding: 12px 14px;
          border-radius: 14px;
          border: 0;
          cursor: pointer;
          font-weight: 900;
          font-size: 15px;
          background: linear-gradient(180deg, #4ade80, #22c55e);
          color: #071024;
        }

        .iabBtnGhost{
          width:100%;
          padding: 12px 14px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.16);
          cursor: pointer;
          font-weight: 900;
          font-size: 15px;
          background: rgba(255,255,255,.06);
          color: rgba(255,255,255,.92);
        }

        .iabClose{
          background: rgba(255,255,255,.08);
          border: 1px solid rgba(255,255,255,.14);
          color: rgba(255,255,255,.9);
          border-radius: 12px;
          padding: 8px 10px;
          font-weight: 800;
          cursor:pointer;
          white-space: nowrap;
        }

        .iabFine{
          margin-top: 8px;
          color: rgba(255,255,255,.68);
          font-size: 13px;
          line-height: 1.4;
        }

        .debugRow{
          margin-top: 12px;
          display:flex;
          gap:10px;
          flex-wrap: wrap;
        }

        .pill{
          font-size: 12px;
          color: rgba(255,255,255,.72);
          border: 1px solid rgba(255,255,255,.14);
          background: rgba(255,255,255,.06);
          padding: 6px 10px;
          border-radius: 999px;
        }

        @media (min-width: 640px){
          .card{ padding: 26px; }
          .cta{ gap: 10px; }
        }
      `}</style>
    </>
  );
}