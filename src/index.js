import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

const app = new Hono();

// ============================================================
// SHARED STYLES
// ============================================================
const CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');
  :root {
    --bg:#0b0e14; --surface:#12161f; --surface2:#1a1f2e; --border:#242938;
    --accent:#3b82f6; --accent2:#60a5fa; --text:#e8eaf0; --muted:#8892a4;
    --heading:'Syne',sans-serif; --body:'DM Sans',sans-serif;
    --radius:14px; --transition:0.25s cubic-bezier(.4,0,.2,1);
  }
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  html{scroll-behavior:smooth}
  body{font-family:var(--body);background:var(--bg);color:var(--text);line-height:1.65;min-height:100vh}
  a{color:var(--accent2);text-decoration:none;transition:color var(--transition)}
  a:hover{color:#fff}

  /* NAV */
  nav{position:fixed;top:0;left:0;right:0;z-index:100;background:rgba(11,14,20,.92);
    backdrop-filter:blur(12px);border-bottom:1px solid var(--border);
    padding:0 2rem;height:64px;display:flex;align-items:center;justify-content:space-between;gap:1rem}
  .nav-logo{font-family:var(--heading);font-weight:800;font-size:1.15rem;
    letter-spacing:-0.02em;color:#fff;display:flex;align-items:center;gap:.55rem}
  .nav-logo .dot{width:8px;height:8px;border-radius:50%;background:var(--accent);
    display:inline-block;animation:pulse 2s infinite}
  @keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.5;transform:scale(1.4)}}
  .nav-links{display:flex;gap:1.6rem;list-style:none}
  .nav-links a{font-size:.88rem;font-weight:500;color:var(--muted);transition:color var(--transition)}
  .nav-links a:hover,.nav-links a.active{color:var(--text)}
  .hamburger{display:none;flex-direction:column;gap:5px;cursor:pointer;background:none;border:none;padding:4px}
  .hamburger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px}

  /* HERO */
  .hero{min-height:100vh;display:flex;flex-direction:column;align-items:center;
    justify-content:center;text-align:center;padding:8rem 2rem 4rem;position:relative;overflow:hidden}
  .hero::before{content:'';position:absolute;inset:0;
    background-image:linear-gradient(var(--border) 1px,transparent 1px),
    linear-gradient(90deg,var(--border) 1px,transparent 1px);
    background-size:48px 48px;
    mask-image:radial-gradient(ellipse 80% 60% at 50% 50%,black 30%,transparent 100%);opacity:.45}
  .hero::after{content:'';position:absolute;top:20%;left:50%;transform:translate(-50%,-50%);
    width:600px;height:600px;
    background:radial-gradient(circle,rgba(59,130,246,.18) 0%,transparent 70%);pointer-events:none}
  .hero-badge{display:inline-flex;align-items:center;gap:.4rem;
    background:rgba(59,130,246,.12);border:1px solid rgba(59,130,246,.3);
    border-radius:100px;padding:.3rem .85rem;font-size:.78rem;font-weight:500;
    color:var(--accent2);letter-spacing:.04em;margin-bottom:1.6rem;position:relative;
    animation:fadeUp .6s .1s both}
  .hero h1{font-family:var(--heading);font-size:clamp(2.6rem,6vw,5rem);font-weight:800;
    letter-spacing:-0.03em;line-height:1.05;color:#fff;position:relative;animation:fadeUp .6s .2s both}
  .hero h1 span{color:var(--accent2)}
  .hero>p{max-width:520px;color:var(--muted);font-size:1.05rem;margin:1.4rem auto 0;
    position:relative;animation:fadeUp .6s .35s both}
  .hero-ctas{display:flex;gap:1rem;margin-top:2.4rem;flex-wrap:wrap;justify-content:center;
    position:relative;animation:fadeUp .6s .45s both}
  @keyframes fadeUp{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}

  /* BUTTONS */
  .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.7rem 1.5rem;
    border-radius:10px;font-size:.9rem;font-weight:500;cursor:pointer;
    transition:all var(--transition);border:none;font-family:var(--body);text-decoration:none}
  .btn-primary{background:var(--accent);color:#fff}
  .btn-primary:hover{background:var(--accent2);color:#fff;transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(59,130,246,.35)}
  .btn-ghost{background:var(--surface2);color:var(--text);border:1px solid var(--border)}
  .btn-ghost:hover{border-color:var(--accent);color:var(--accent2);transform:translateY(-2px)}

  /* SECTIONS */
  .page-section{padding:5rem 2rem;max-width:1100px;margin:0 auto}
  .page-section.top{padding-top:8rem}
  .section-label{font-size:.78rem;font-weight:600;letter-spacing:.1em;color:var(--accent);
    text-transform:uppercase;margin-bottom:.7rem}
  .section-title{font-family:var(--heading);font-size:clamp(1.7rem,3vw,2.5rem);font-weight:700;
    letter-spacing:-0.02em;color:#fff;margin-bottom:1rem}
  .section-sub{color:var(--muted);max-width:560px;font-size:.97rem}
  .section-header{margin-bottom:3rem}

  /* CARDS */
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.2rem}
  .card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
    padding:2rem;transition:all var(--transition);position:relative;overflow:hidden}
  .card::before{content:'';position:absolute;inset:0;
    background:linear-gradient(135deg,rgba(59,130,246,.06),transparent 60%);
    opacity:0;transition:opacity var(--transition)}
  .card:hover{border-color:rgba(59,130,246,.4);transform:translateY(-4px)}
  .card:hover::before{opacity:1}
  .card-icon{width:44px;height:44px;border-radius:10px;background:rgba(59,130,246,.12);
    display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:1.2rem}
  .card h3{font-family:var(--heading);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:.5rem}
  .card p{color:var(--muted);font-size:.9rem;line-height:1.6}
  .card a{display:inline-block;margin-top:1rem;font-size:.85rem;font-weight:500}

  /* ABOUT */
  .about-grid{display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center}
  .about-text p{color:var(--muted);margin-top:1rem;font-size:.97rem}
  .about-placeholder{background:var(--surface2);height:280px;display:flex;align-items:center;
    justify-content:center;font-size:4rem;border-radius:var(--radius);border:1px solid var(--border)}
  .resume-box{margin-top:2rem;background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius);padding:1.5rem 2rem;display:flex;align-items:center;
    justify-content:space-between;gap:1rem;flex-wrap:wrap}
  .resume-box p{color:var(--muted);font-size:.9rem}
  .resume-box strong{color:var(--text);display:block;font-size:1rem;margin-bottom:.25rem}

  /* CONTACT */
  .contact-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1rem}
  .contact-item{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
    padding:1.4rem 1.6rem;display:flex;align-items:center;gap:1rem;transition:border-color var(--transition)}
  .contact-item:hover{border-color:rgba(59,130,246,.4)}
  .contact-item-icon{width:40px;height:40px;flex-shrink:0;border-radius:8px;
    background:rgba(59,130,246,.12);display:flex;align-items:center;justify-content:center;font-size:1.2rem}
  .contact-item span{font-size:.78rem;color:var(--muted);display:block}
  .contact-item strong{font-size:.92rem;color:var(--text)}

  /* TOS */
  .tos-body{max-width:760px}
  .tos-intro{color:var(--muted);font-size:.97rem;margin-bottom:2.5rem;padding-bottom:2rem;
    border-bottom:1px solid var(--border)}
  .tos-clause{margin-bottom:2rem}
  .tos-clause h3{font-family:var(--heading);font-size:1rem;font-weight:700;color:#fff;
    margin-bottom:.6rem;display:flex;align-items:center;gap:.75rem}
  .tos-clause-num{display:inline-flex;align-items:center;justify-content:center;
    width:26px;height:26px;border-radius:6px;background:rgba(59,130,246,.12);
    border:1px solid rgba(59,130,246,.2);font-size:.75rem;font-weight:700;
    color:var(--accent2);flex-shrink:0}
  .tos-clause p{color:var(--muted);font-size:.92rem;line-height:1.75}
  .tos-note{margin-top:.5rem;padding:.6rem .9rem;background:rgba(59,130,246,.07);
    border-left:2px solid var(--accent);border-radius:0 6px 6px 0;font-size:.85rem;color:var(--muted)}
  .tos-updated{display:inline-flex;align-items:center;gap:.5rem;background:var(--surface2);
    border:1px solid var(--border);border-radius:8px;padding:.5rem 1rem;
    font-size:.8rem;color:var(--muted);margin-bottom:2rem}

  /* LOGIN GATE */
  .login-page{min-height:100vh;display:flex;align-items:center;justify-content:center;padding:2rem}
  .login-box{background:var(--surface);border:1px solid var(--border);border-radius:20px;
    padding:2.8rem 2.5rem;max-width:420px;width:100%;text-align:center;animation:fadeUp .4s both}
  .lock-icon{width:56px;height:56px;border-radius:14px;background:rgba(59,130,246,.12);
    border:1px solid rgba(59,130,246,.25);display:flex;align-items:center;
    justify-content:center;font-size:1.6rem;margin:0 auto 1.5rem}
  .login-box h2{font-family:var(--heading);font-size:1.4rem;font-weight:700;color:#fff;margin-bottom:.5rem}
  .login-box>p{color:var(--muted);font-size:.9rem;margin-bottom:1.8rem;line-height:1.6}
  .ms-login-btn{display:flex;align-items:center;justify-content:center;gap:.75rem;
    width:100%;padding:.85rem 1.5rem;background:#fff;color:#1a1a1a;
    border:none;border-radius:10px;font-size:.95rem;font-weight:500;
    font-family:var(--body);cursor:pointer;transition:all var(--transition);text-decoration:none}
  .ms-login-btn:hover{background:#f0f0f0;color:#1a1a1a;transform:translateY(-2px);
    box-shadow:0 8px 24px rgba(0,0,0,.3)}
  .ms-login-btn svg{width:20px;height:20px;flex-shrink:0}
  .login-note{margin-top:1.2rem;font-size:.78rem;color:var(--muted)}
  .error-box{margin-top:1rem;padding:.75rem 1rem;background:rgba(239,68,68,.1);
    border:1px solid rgba(239,68,68,.25);border-radius:8px;color:#f87171;font-size:.85rem}

  /* USER BAR */
  .user-bar{display:flex;align-items:center;justify-content:space-between;
    background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
    padding:1rem 1.5rem;margin-bottom:2rem;flex-wrap:wrap;gap:1rem}
  .user-bar-info{display:flex;align-items:center;gap:.75rem}
  .user-avatar{width:36px;height:36px;border-radius:50%;background:rgba(59,130,246,.15);
    border:1px solid rgba(59,130,246,.3);display:flex;align-items:center;justify-content:center;font-size:1rem}
  .user-name{font-size:.85rem;color:var(--text);font-weight:500}
  .user-email{font-size:.78rem;color:var(--muted)}

  /* ID CALLBACK PLACEHOLDER */
  .placeholder-box{background:var(--surface);border:1px solid var(--border);
    border-radius:var(--radius);padding:3rem 2rem;text-align:center;max-width:560px;margin:0 auto}
  .placeholder-box .big-icon{font-size:3rem;margin-bottom:1rem}
  .placeholder-box h3{font-family:var(--heading);font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:.5rem}
  .placeholder-box p{color:var(--muted);font-size:.9rem}

  /* DIVIDER & FOOTER */
  .divider{max-width:1100px;margin:0 auto;border:none;border-top:1px solid var(--border)}
  footer{max-width:1100px;margin:0 auto;padding:2rem 2rem 3rem;display:flex;
    align-items:center;justify-content:space-between;flex-wrap:wrap;gap:1rem}
  footer p{color:var(--muted);font-size:.85rem}
  .footer-links{display:flex;gap:1.5rem;flex-wrap:wrap}
  .footer-links a{color:var(--muted);font-size:.85rem;transition:color var(--transition)}
  .footer-links a:hover{color:var(--text)}
  .back-row{margin-top:3rem;padding-top:2rem;border-top:1px solid var(--border)}

  @media(max-width:720px){
    .nav-links{display:none}
    .hamburger{display:flex}
    .about-grid{grid-template-columns:1fr}
    .resume-box{flex-direction:column;align-items:flex-start}
    .login-box{padding:2rem 1.5rem}
  }
`;

// ============================================================
// HTML SHELL — wraps every page
// ============================================================
function shell(title, body, activePage = '') {
  const navItem = (href, label, page) =>
    `<li><a href="${href}"${activePage === page ? ' class="active"' : ''}>${label}</a></li>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>${title} – TMTCo</title>
  <style>${CSS}</style>
</head>
<body>
<nav>
  <a href="/" class="nav-logo"><span class="dot"></span>TheMrTechGuy</a>
  <ul class="nav-links" id="navLinks">
    ${navItem('/', 'Home', 'home')}
    ${navItem('/tech', 'Tech Things', 'tech')}
    ${navItem('/passreset', 'Cloud Password Reset', 'passreset')}
    ${navItem('/idcallback', 'ID Callback', 'idcallback')}
    ${navItem('/tos', 'Terms of Service', 'tos')}
    ${navItem('/contact', 'Contact', 'contact')}
  </ul>
  <button class="hamburger" onclick="this.nextElementSibling;document.getElementById('navLinks').classList.toggle('open')" aria-label="Menu">
    <span></span><span></span><span></span>
  </button>
</nav>

${body}

<hr class="divider">
<footer>
  <p>© 2025 TMTCo — All rights reserved.</p>
  <div class="footer-links">
    <a href="/tos">Terms of Service</a>
    <a href="/contact">Contact</a>
    <a href="/idcallback">ID Callback</a>
  </div>
</footer>
</body>
</html>`;
}

// Microsoft logo SVG for login button
const MS_LOGO = `<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
  <rect x="1"  y="1"  width="9" height="9" fill="#f25022"/>
  <rect x="11" y="1"  width="9" height="9" fill="#7fba00"/>
  <rect x="1"  y="11" width="9" height="9" fill="#00a4ef"/>
  <rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
</svg>`;

// ============================================================
// SESSION HELPERS
// ============================================================
const SESSION_TTL = 60 * 20; // 20 minutes

async function getSession(c) {
  const sid = getCookie(c, 'tmtco_sid');
  if (!sid) return null;
  try {
    const data = await c.env.SESSIONS.get(`session:${sid}`);
    return data ? JSON.parse(data) : null;
  } catch { return null; }
}

async function createSession(c, userData) {
  const sid = crypto.randomUUID();
  await c.env.SESSIONS.put(
    `session:${sid}`,
    JSON.stringify(userData),
    { expirationTtl: SESSION_TTL }
  );
  setCookie(c, 'tmtco_sid', sid, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: SESSION_TTL,
  });
  return sid;
}

async function destroySession(c) {
  const sid = getCookie(c, 'tmtco_sid');
  if (sid) {
    try { await c.env.SESSIONS.delete(`session:${sid}`); } catch {}
  }
  deleteCookie(c, 'tmtco_sid', { path: '/' });
}

// ============================================================
// ROUTES — HOME
// ============================================================
app.get('/', (c) => {
  const body = `
<div class="hero">
  <div class="hero-badge">⚡ Tech Solutions &amp; IT Support</div>
  <h1>Welcome to<br><span>TheMrTechGuy.com</span></h1>
  <p>Your go-to hub for IT services, tech resources, and all things technology — backed by TMTCo.</p>
  <div class="hero-ctas">
    <a href="/tech" class="btn btn-primary">Explore Services</a>
    <a href="/contact" class="btn btn-ghost">Get in Touch</a>
  </div>
</div>

<div class="page-section">
  <div class="section-header">
    <div class="section-label">What we offer</div>
    <h2 class="section-title">Available Services</h2>
    <p class="section-sub">A collection of tools, resources, and services available through TheMrTechGuy.com.</p>
  </div>
  <div class="cards">

    <div class="card">
      <div class="card-icon">💻</div>
      <h3>Tech Things</h3>
      <p>Resources and downloads curated for tech enthusiasts — including tools like Tiny11 and more.</p>
      <a href="/tech">Explore →</a>
    </div>

    <div class="card">
      <div class="card-icon">🆔</div>
      <h3>ID Callback</h3>
      <p>Quick access to identity callback tools and services provided by TMTCo.</p>
      <a href="/idcallback">Access →</a>
    </div>

    <div class="card">
      <div class="card-icon">☁️</div>
      <h3>Cloud Account Password Reset</h3>
      <p>Locked out? Use our cloud account password recovery portal to regain access. Authorised users only.</p>
      <a href="/passreset">Go to portal →</a>
    </div>

    <!-- 🔧 Add more service cards here -->

  </div>
</div>

<hr class="divider">

<div class="page-section">
  <div class="about-grid">
    <div class="about-text">
      <div class="section-label">About</div>
      <h2 class="section-title">For Hiring &amp; Interviewers</h2>
      <p>I'm Logan Yeomans, the person behind TheMrTechGuy.com and TMTCo. I'm passionate about technology, IT infrastructure, and building practical solutions.</p>
      <p>If you're a hiring manager or recruiter, you can grab a copy of my resume below.</p>
      <div class="resume-box">
        <div>
          <strong>Logan Yeomans — Resume</strong>
          <!-- 🔧 Update date when you upload a new resume -->
          <p>PDF download · Last updated 2025</p>
        </div>
        <!-- 🔧 Update resume URL if it changes -->
        <a class="btn btn-primary" href="https://themrtechguy.com/Logan%20Yeomans%20Resume.pdf" target="_blank">⬇ Download PDF</a>
      </div>
    </div>
    <div class="about-placeholder">👨‍💻</div>
  </div>
</div>`;

  return c.html(shell('TheMrTechGuy.com', body, 'home'));
});

// ============================================================
// ROUTES — TECH THINGS
// 🔧 Add more cards in the .cards grid below
// ============================================================
app.get('/tech', (c) => {
  const body = `
<div class="page-section top">
  <div class="section-header">
    <div class="section-label">Resources</div>
    <h2 class="section-title">Tech Things</h2>
    <p class="section-sub">A curated collection of useful software and resources for tech enthusiasts.</p>
  </div>
  <div class="cards">

    <div class="card">
      <div class="card-icon">🪟</div>
      <h3>Tiny11</h3>
      <p>A lightweight build of Windows 11 that runs smoothly on older or lower-spec hardware. Stripped of bloat, designed to just work.</p>
      <a href="https://archive.org/details/tiny-11-NTDEV/Screenshot_20230203-100010_YouTube.jpg" target="_blank">Download from Archive.org →</a>
    </div>

    <!-- 🔧 Add more tech resource cards here -->

  </div>
  <div class="back-row"><a href="/" class="btn btn-ghost">← Back to Home</a></div>
</div>`;

  return c.html(shell('Tech Things', body, 'tech'));
});

// ============================================================
// ROUTES — CLOUD PASSWORD RESET (auth protected)
// ============================================================

// Show login page
app.get('/passreset', async (c) => {
  const session = await getSession(c);

  // Already authenticated — show portal
  if (session) {
    const body = `
<div class="page-section top">
  <div class="user-bar">
    <div class="user-bar-info">
      <div class="user-avatar">👤</div>
      <div>
        <div class="user-name">${session.name || session.email}</div>
        <div class="user-email">${session.email}</div>
      </div>
    </div>
    <a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
  </div>

  <div class="section-header">
    <div class="section-label">Authorised Portal</div>
    <h2 class="section-title">Cloud Account Password Reset</h2>
    <p class="section-sub">Use the options below to reset or recover a cloud account password.</p>
  </div>
  <div class="cards">

    <div class="card">
      <div class="card-icon">🔑</div>
      <h3>Self-Service Password Reset</h3>
      <p>Reset your Microsoft 365 / Entra ID account password via the Microsoft SSPR portal.</p>
      <a href="https://aka.ms/sspr" target="_blank">Open Microsoft SSPR →</a>
    </div>

    <div class="card">
      <div class="card-icon">🛡️</div>
      <h3>Contact IT Admin</h3>
      <p>If self-service isn't working, reach out to the TMTCo admin directly for a manual reset.</p>
      <a href="mailto:admin@themrtechguy.com">Email admin →</a>
    </div>

    <!-- 🔧 Add more password reset tools here -->

  </div>
  <div class="back-row"><a href="/" class="btn btn-ghost">← Back to Home</a></div>
</div>`;

    return c.html(shell('Cloud Password Reset', body, 'passreset'));
  }

  // Not authenticated — show login wall
  const error = c.req.query('error');
  const body = `
<div class="login-page">
  <div class="login-box">
    <div class="lock-icon">🔐</div>
    <h2>Authorised Access Only</h2>
    <p>This portal is restricted to TMTCo staff and authorised users.<br>Sign in with your organisational account to continue.</p>
    <a href="/auth/login" class="ms-login-btn">
      ${MS_LOGO}
      Sign in with Microsoft
    </a>
    ${error ? `<div class="error-box">Sign-in failed or access denied. Contact admin@themrtechguy.com for help.</div>` : ''}
    <p class="login-note">🔒 Secured via Microsoft Entra ID · TMTCo internal use only</p>
  </div>
</div>`;

  return c.html(shell('Sign In', body, 'passreset'));
});

// ============================================================
// ROUTES — AUTH (OAuth2 server-side flow)
// ============================================================

// Step 1: redirect to Microsoft
app.get('/auth/login', (c) => {
  const { TENANT_ID, CLIENT_ID, BASE_URL } = c.env;
  const redirectUri = `${BASE_URL}/auth/callback`;
  const state = crypto.randomUUID();

  const params = new URLSearchParams({
    client_id:     CLIENT_ID,
    response_type: 'code',
    redirect_uri:  redirectUri,
    response_mode: 'query',
    scope:         'openid profile email User.Read',
    state,
  });

  // Store state in a short-lived cookie to validate on callback
  setCookie(c, 'oauth_state', state, {
    httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: 300,
  });

  return c.redirect(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?${params}`
  );
});

// Step 2: Microsoft redirects back here with a code
app.get('/auth/callback', async (c) => {
  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET, BASE_URL } = c.env;
  const { code, state, error } = c.req.query();

  // Validate state
  const savedState = getCookie(c, 'oauth_state');
  deleteCookie(c, 'oauth_state', { path: '/' });

  if (error || !code || state !== savedState) {
    return c.redirect('/passreset?error=1');
  }

  try {
    // Exchange code for tokens
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id:     CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri:  `${BASE_URL}/auth/callback`,
          grant_type:    'authorization_code',
        }),
      }
    );

    if (!tokenRes.ok) return c.redirect('/passreset?error=1');
    const tokens = await tokenRes.json();

    // Get user profile from Graph
    const graphRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!graphRes.ok) return c.redirect('/passreset?error=1');
    const user = await graphRes.json();

    // Create session
    await createSession(c, {
      name:  user.displayName || user.givenName || '',
      email: user.mail || user.userPrincipalName || '',
    });

    return c.redirect('/passreset');
  } catch (err) {
    console.error('Auth callback error:', err);
    return c.redirect('/passreset?error=1');
  }
});

// Step 3: logout
app.get('/auth/logout', async (c) => {
  const { TENANT_ID, BASE_URL } = c.env;
  await destroySession(c);
  return c.redirect(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${BASE_URL}`
  );
});

// ============================================================
// ROUTES — ID CALLBACK
// 🔧 Replace the placeholder content below with your actual tools
// ============================================================
app.get('/idcallback', (c) => {
  const body = `
<div class="page-section top">
  <div class="section-header">
    <div class="section-label">Identity Services</div>
    <h2 class="section-title">ID Callback</h2>
    <p class="section-sub">TMTCo identity callback services. Contact admin if you need access or assistance.</p>
  </div>
  <div class="placeholder-box">
    <div class="big-icon">🆔</div>
    <h3>Coming Soon</h3>
    <p>This page is being set up. In the meantime reach out to <a href="mailto:admin@themrtechguy.com">admin@themrtechguy.com</a> for identity callback assistance.</p>
  </div>
  <div class="back-row"><a href="/" class="btn btn-ghost">← Back to Home</a></div>
</div>`;

  return c.html(shell('ID Callback', body, 'idcallback'));
});

// ============================================================
// ROUTES — TERMS OF SERVICE
// 🔧 Edit clauses below — update the date when you revise
// ============================================================
app.get('/tos', (c) => {
  const body = `
<div class="page-section top">
  <div class="section-header">
    <div class="section-label">Legal</div>
    <h2 class="section-title">Terms of Service</h2>
    <p class="section-sub">Terms of use for all services hosted on themrtechguy.com and operated by TMTCo.</p>
  </div>
  <div class="tos-body">

    <!-- 🔧 Update this date whenever you revise the TOS -->
    <div class="tos-updated">📅 Last reviewed: 2025</div>

    <p class="tos-intro">Welcome to themrtechguy.com. These Terms of Service govern your use of all services provided through this website and associated platforms operated by TMTCo. By accessing or using our services, you agree to be bound by these terms. If you do not agree, please discontinue use of our services immediately.</p>

    <div class="tos-clause">
      <h3><span class="tos-clause-num">1</span> Acceptance of Terms</h3>
      <p>By using themrtechguy.com or any associated service, you confirm your acceptance of these Terms and agree to comply with all applicable laws and regulations. These Terms apply to all visitors, users, and anyone else who accesses our services.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">2</span> User Accounts and Data</h3>
      <p>Certain services may require you to create an account or have data associated with you. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate and complete information at all times.</p>
      <div class="tos-note">⚠️ This clause applies only to services that require a user account or store your data — it does not apply to this website itself.</div>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">3</span> Data Ownership and Responsibility</h3>
      <p>You retain ownership of all data, files, and content you upload or submit to any TMTCo service. We do not claim ownership of your data. By using our services, you grant us the right to store and process your data only as necessary to deliver the service.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">4</span> Prohibited Activities</h3>
      <p>You agree not to use any TMTCo service for illegal or unauthorised purposes. Prohibited activities include but are not limited to: infringing intellectual property rights, distributing malware or malicious content, attempting unauthorised access to systems or data, harassment of other users, and any activity that violates applicable law.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">5</span> Account Termination</h3>
      <p>Violation of these Terms may result in the suspension or termination of your access at our sole discretion. In cases involving stored data, termination may result in loss of access to that data. We recommend maintaining your own backups of any critical data held within TMTCo services.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">6</span> Service Availability and Changes</h3>
      <p>While we strive to provide reliable and continuous service, we cannot guarantee uninterrupted availability. TMTCo reserves the right to modify, suspend, or discontinue any service at any time.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">7</span> Security</h3>
      <p>We implement reasonable security measures to protect data handled by TMTCo services. However, no system is entirely immune to risk. You acknowledge the inherent risks associated with transmitting data over the internet and accept that we cannot guarantee absolute security.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">8</span> Intellectual Property</h3>
      <p>All content provided by TMTCo — including but not limited to software, graphics, logos, and design — is the property of TMTCo or is used under licence. You may not reproduce, distribute, or use any TMTCo content without explicit written permission.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">9</span> Changes to These Terms</h3>
      <p>These Terms may be updated periodically. Changes take effect immediately upon being posted to this page. Continued use of our services after any changes constitutes your acceptance of the revised Terms.</p>
    </div>
    <div class="tos-clause">
      <h3><span class="tos-clause-num">10</span> Contact</h3>
      <p>If you have any questions or feedback regarding these Terms, please get in touch:</p>
      <div class="tos-note">📧 <a href="mailto:admin@themrtechguy.com">admin@themrtechguy.com</a> &nbsp;·&nbsp; 📞 02 7229 1918</div>
    </div>

  </div>
  <div class="back-row"><a href="/" class="btn btn-ghost">← Back to Home</a></div>
</div>`;

  return c.html(shell('Terms of Service', body, 'tos'));
});

// ============================================================
// ROUTES — CONTACT
// 🔧 Edit phone, email and details here
// ============================================================
app.get('/contact', (c) => {
  const body = `
<div class="page-section top">
  <div class="section-header">
    <div class="section-label">Get in touch</div>
    <h2 class="section-title">Contact Us</h2>
    <p class="section-sub">Reach out any time — we're happy to help with any questions or tech needs.</p>
  </div>
  <div class="contact-cards">

    <div class="contact-item">
      <div class="contact-item-icon">📞</div>
      <div>
        <span>Phone</span>
        <!-- 🔧 Update phone number -->
        <strong>02 7229 1918</strong>
      </div>
    </div>

    <div class="contact-item">
      <div class="contact-item-icon">✉️</div>
      <div>
        <span>Email</span>
        <strong><a href="mailto:admin@themrtechguy.com" style="color:var(--text)">admin@themrtechguy.com</a></strong>
      </div>
    </div>

    <div class="contact-item">
      <div class="contact-item-icon">🌐</div>
      <div>
        <span>Website</span>
        <strong>themrtechguy.com</strong>
      </div>
    </div>

    <!-- 🔧 Add more contact items here -->

  </div>
  <div class="back-row"><a href="/" class="btn btn-ghost">← Back to Home</a></div>
</div>`;

  return c.html(shell('Contact', body, 'contact'));
});

export default app;
