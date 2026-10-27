import { Hono } from 'hono';
import { getCookie, setCookie, deleteCookie } from 'hono/cookie';

const app = new Hono();

// ============================================================
// SHARED STYLES - const
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

/* Hamburger - always visible, opens the nav drawer */
.hamburger{display:flex;flex-direction:column;gap:5px;cursor:pointer;background:none;
border:none;padding:8px;z-index:210;position:relative}
.hamburger span{display:block;width:22px;height:2px;background:var(--text);border-radius:2px;
transition:transform .25s ease,opacity .25s ease}
.hamburger.active span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.active span:nth-child(2){opacity:0}
.hamburger.active span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}

/* Overlay behind the drawer */
.nav-overlay{position:fixed;inset:0;background:rgba(0,0,0,.55);backdrop-filter:blur(2px);
opacity:0;visibility:hidden;transition:opacity .3s ease,visibility .3s ease;z-index:190}
.nav-overlay.open{opacity:1;visibility:visible}

/* Drawer - full screen on narrow viewports, right-side panel on wider ones.
   Uses a plain CSS width media query, so it also responds correctly to
   browser zoom (zooming in effectively narrows the CSS viewport). */
.nav-drawer{position:fixed;top:0;right:0;height:100vh;width:360px;max-width:100vw;
background:var(--surface);border-left:1px solid var(--border);
transform:translateX(100%);transition:transform .3s cubic-bezier(.4,0,.2,1);
z-index:200;display:flex;flex-direction:column;padding:1.5rem;overflow-y:auto}
.nav-drawer.open{transform:translateX(0)}
.nav-drawer-header{display:flex;align-items:center;justify-content:space-between;
margin-bottom:2rem;padding-bottom:1rem;border-bottom:1px solid var(--border)}
.nav-drawer-title{font-family:var(--heading);font-weight:700;color:#fff;font-size:1.05rem}
.nav-drawer-close{background:none;border:none;color:var(--muted);font-size:1.7rem;
line-height:1;cursor:pointer;padding:2px 8px;transition:color var(--transition)}
.nav-drawer-close:hover{color:#fff}
.nav-drawer-links{list-style:none;display:flex;flex-direction:column;gap:.3rem}
.nav-drawer-links a{display:block;padding:.9rem 1.1rem;border-radius:10px;
font-size:.98rem;font-weight:500;color:var(--muted);transition:all var(--transition)}
.nav-drawer-links a:hover,.nav-drawer-links a.active{background:var(--surface2);color:#fff}

@media(max-width:600px){
  .nav-drawer{width:100vw;border-left:none}
}

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

/* CARDS - the whole card is a link (href on the outer <a>) */
.cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.2rem}
.card{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:2rem;transition:all var(--transition);position:relative;overflow:hidden;
display:block;color:inherit;cursor:pointer}
.card::before{content:'';position:absolute;inset:0;
background:linear-gradient(135deg,rgba(59,130,246,.06),transparent 60%);
opacity:0;transition:opacity var(--transition);pointer-events:none}
.card:hover{border-color:rgba(59,130,246,.4);transform:translateY(-4px)}
.card:hover::before{opacity:1}
.card:hover h3{color:var(--accent2)}
.card:hover .card-link{color:#fff}
.card-icon{width:44px;height:44px;border-radius:10px;background:rgba(59,130,246,.12);
display:flex;align-items:center;justify-content:center;font-size:1.4rem;margin-bottom:1.2rem}
.card h3{font-family:var(--heading);font-size:1.1rem;font-weight:700;color:#fff;
margin-bottom:.5rem;transition:color var(--transition)}
.card p{color:var(--muted);font-size:.9rem;line-height:1.6}
.card-link{display:inline-block;margin-top:1rem;font-size:.85rem;font-weight:500;
color:var(--accent2);transition:color var(--transition)}

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

/* TOS / PRIVACY STATEMENT */
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
.vc-login-btn{display:flex;align-items:center;justify-content:center;gap:.75rem;width:100%;box-sizing:border-box;margin-top:.75rem;padding:.8rem 1rem;border:1px solid #d0d0d0;border-radius:8px;background:#fff;color:#1a1a1a;font-weight:600;text-decoration:none;cursor:pointer;transition:all .15s ease}
.vc-login-btn:hover{background:#f0f0f0;transform:translateY(-2px)}
.login-divider{display:flex;align-items:center;gap:.75rem;margin:.9rem 0;color:#777;font-size:.8rem}
.login-divider::before,.login-divider::after{content:"";height:1px;background:#ddd;flex:1}
.vc-login-icon{font-size:1.1rem}

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

/* ADMIN CENTRE SECTION (dashboard) */
.admin-section{margin-top:3rem;padding-top:2.5rem;border-top:1px solid var(--border)}
.admin-header{display:flex;align-items:flex-start;gap:1rem;margin-bottom:1.5rem}
.admin-icon{width:44px;height:44px;flex-shrink:0;border-radius:10px;background:rgba(239,68,68,.1);
border:1px solid rgba(239,68,68,.25);display:flex;align-items:center;justify-content:center;font-size:1.3rem}
.admin-header h3{font-family:var(--heading);font-size:1.1rem;font-weight:700;color:#fff;margin-bottom:.35rem}
.admin-header p{color:var(--muted);font-size:.85rem;max-width:560px}
.admin-links{display:flex;flex-wrap:wrap;gap:.6rem}
.admin-link{display:inline-block;padding:.55rem 1rem;background:var(--surface);
border:1px solid var(--border);border-radius:8px;font-size:.82rem;font-weight:500;
color:var(--muted);transition:all var(--transition)}
.admin-link:hover{border-color:rgba(59,130,246,.4);color:var(--accent2);transform:translateY(-2px)}

/* ADMIN PANEL (user management) */
.admin-search{display:flex;gap:.6rem;margin-bottom:1.5rem;flex-wrap:wrap}
.admin-search input{flex:1;min-width:220px;padding:.7rem 1rem;border-radius:10px;
border:1px solid var(--border);background:var(--surface2);color:var(--text);font-family:var(--body);font-size:.9rem}
.admin-search input:focus{outline:none;border-color:var(--accent)}
.user-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:1.1rem 1.4rem;display:flex;align-items:center;justify-content:space-between;
flex-wrap:wrap;gap:.9rem;margin-bottom:.8rem}
.user-row-name{font-size:.92rem;color:var(--text);font-weight:500}
.user-row-email{font-size:.8rem;color:var(--muted);margin-top:.15rem}
.status-pill{display:inline-flex;align-items:center;gap:.35rem;font-size:.76rem;
font-weight:500;padding:.2rem .6rem;border-radius:100px;margin-left:.6rem}
.status-pill.enabled{background:rgba(74,222,128,.12);color:#4ade80}
.status-pill.disabled{background:rgba(248,113,113,.12);color:#f87171}
.user-row-actions{display:flex;gap:.5rem;flex-wrap:wrap}
.user-row-actions .btn{padding:.45rem .9rem;font-size:.8rem}
.reset-form{display:flex;gap:.4rem;align-items:center;flex-wrap:wrap}
.reset-form input[type="text"]{width:170px;padding:.45rem .7rem;border-radius:8px;
border:1px solid var(--border);background:var(--surface2);color:var(--text);
font-family:var(--body);font-size:.8rem}
.reset-form input[type="text"]:focus{outline:none;border-color:var(--accent)}
.reset-form input[type="text"]::placeholder{color:var(--muted)}
.btn-danger{background:rgba(239,68,68,.12);color:#f87171;border:1px solid rgba(239,68,68,.3)}
.btn-danger:hover{background:rgba(239,68,68,.2);color:#fca5a5;transform:translateY(-2px)}
.flash-banner{margin-bottom:1.5rem;padding:.9rem 1.1rem;background:rgba(59,130,246,.08);
border-left:3px solid var(--accent);border-radius:0 8px 8px 0;font-size:.88rem;color:var(--text);
word-break:break-word}
.flash-banner.err{background:rgba(239,68,68,.08);border-left-color:#ef4444;color:#fca5a5}
.no-results{color:var(--muted);font-size:.9rem;padding:1rem 0}

/* ADMIN TABS (Users / Devices / Groups) */
.admin-tabs{display:flex;gap:.4rem;margin-bottom:2rem;border-bottom:1px solid var(--border);flex-wrap:wrap}
.admin-tab{padding:.7rem 1.1rem;font-size:.88rem;font-weight:500;color:var(--muted);
border-bottom:2px solid transparent;margin-bottom:-1px;transition:all var(--transition)}
.admin-tab:hover{color:var(--text)}
.admin-tab.active{color:var(--accent2);border-bottom-color:var(--accent)}

/* BULK TOOLBAR */
.bulk-toolbar{display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;
background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:.9rem 1.2rem;margin-bottom:1.2rem}
.bulk-toolbar.hidden{display:none}
.bulk-count{font-size:.85rem;color:var(--text);font-weight:500;margin-right:auto}
.bulk-toolbar .btn{padding:.45rem .9rem;font-size:.8rem}
.user-row-check{display:flex;align-items:center;gap:.9rem}
.user-row-check input[type="checkbox"]{width:17px;height:17px;accent-color:var(--accent);cursor:pointer;flex-shrink:0}
.select-all-row{display:flex;align-items:center;gap:.6rem;padding:.4rem 0 1rem;color:var(--muted);font-size:.85rem}
.select-all-row input[type="checkbox"]{width:16px;height:16px;accent-color:var(--accent);cursor:pointer}

/* DEVICES TABLE */
.device-table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius)}
.device-table{width:100%;border-collapse:collapse;font-size:.85rem}
.device-table th{text-align:left;padding:.8rem 1rem;background:var(--surface2);
color:var(--muted);font-weight:600;font-size:.75rem;text-transform:uppercase;letter-spacing:.04em;
border-bottom:1px solid var(--border);white-space:nowrap}
.device-table td{padding:.8rem 1rem;border-bottom:1px solid var(--border);color:var(--text);white-space:nowrap}
.device-table tr:last-child td{border-bottom:none}
.device-table tr:hover td{background:rgba(59,130,246,.04)}
.compliance-pill{display:inline-flex;align-items:center;gap:.3rem;font-size:.74rem;
font-weight:500;padding:.15rem .55rem;border-radius:100px}
.compliance-pill.compliant{background:rgba(74,222,128,.12);color:#4ade80}
.compliance-pill.noncompliant{background:rgba(248,113,113,.12);color:#f87171}
.compliance-pill.other{background:rgba(148,163,184,.12);color:#94a3b8}

/* GROUPS LIST */
.group-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:1.1rem 1.4rem;display:flex;align-items:center;justify-content:space-between;
flex-wrap:wrap;gap:.9rem;margin-bottom:.8rem}
.group-row-name{font-size:.92rem;color:var(--text);font-weight:500}
.group-row-meta{font-size:.8rem;color:var(--muted);margin-top:.15rem}
.group-type-pill{display:inline-block;font-size:.72rem;font-weight:500;padding:.15rem .5rem;
border-radius:100px;background:rgba(96,165,250,.12);color:var(--accent2);margin-left:.5rem}

/* EMAIL COMPOSE */
.compose-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:1.6rem;max-width:640px}
.compose-box label{display:block;font-size:.8rem;color:var(--muted);margin-bottom:.4rem;margin-top:1rem}
.compose-box label:first-child{margin-top:0}
.compose-box input[type="text"],.compose-box textarea{width:100%;padding:.7rem 1rem;
border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);
font-family:var(--body);font-size:.9rem}
.compose-box textarea{min-height:160px;resize:vertical;font-family:var(--body)}
.compose-box input:focus,.compose-box textarea:focus{outline:none;border-color:var(--accent)}
.compose-actions{margin-top:1.4rem;display:flex;gap:.75rem}

/* USER DETAIL PANEL */
.user-detail-panel{background:var(--surface2);border:1px solid var(--border);border-radius:10px;
padding:1.2rem 1.4rem;margin:-.4rem 0 .8rem;font-size:.85rem}
.detail-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:.9rem 1.4rem;margin-bottom:1.2rem}
.detail-field span{display:block;color:var(--muted);font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;margin-bottom:.2rem}
.detail-field strong{color:var(--text);font-size:.88rem;font-weight:500}
.detail-subhead{font-size:.78rem;font-weight:600;color:var(--muted);text-transform:uppercase;
letter-spacing:.04em;margin:1.1rem 0 .5rem;padding-top:.9rem;border-top:1px solid var(--border)}
.detail-subhead:first-of-type{border-top:none;padding-top:0}
.chip-row{display:flex;flex-wrap:wrap;gap:.4rem}
.chip{display:inline-flex;align-items:center;gap:.4rem;background:var(--surface);border:1px solid var(--border);
border-radius:100px;padding:.3rem .5rem .3rem .8rem;font-size:.78rem;color:var(--text)}
.chip form{display:inline-flex;margin:0}
.chip-remove{background:none;border:none;color:var(--muted);cursor:pointer;font-size:.95rem;
line-height:1;padding:0 .15rem;transition:color var(--transition)}
.chip-remove:hover{color:#f87171}
.add-group-row{display:flex;gap:.5rem;margin-top:.6rem;flex-wrap:wrap}
.add-group-row select{flex:1;min-width:180px;padding:.5rem .8rem;border-radius:8px;
border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:var(--body);font-size:.82rem}
.signin-row{display:flex;justify-content:space-between;gap:1rem;padding:.4rem 0;
border-bottom:1px solid var(--border);font-size:.8rem;flex-wrap:wrap}
.signin-row:last-child{border-bottom:none}
.detail-actions{display:flex;gap:.5rem;flex-wrap:wrap;margin-top:1.1rem;padding-top:1rem;border-top:1px solid var(--border)}
.detail-actions .btn{padding:.4rem .85rem;font-size:.78rem}

/* PAGE-LEVEL LINKS (Create user, Deleted users, etc.) */
.page-links-row{display:flex;gap:.6rem;margin-bottom:1.2rem;flex-wrap:wrap}

/* AUDIT LOG TABLE */
.audit-table-wrap{overflow-x:auto;border:1px solid var(--border);border-radius:var(--radius)}
.audit-table{width:100%;border-collapse:collapse;font-size:.83rem}
.audit-table th{text-align:left;padding:.75rem 1rem;background:var(--surface2);color:var(--muted);
font-weight:600;font-size:.72rem;text-transform:uppercase;letter-spacing:.04em;
border-bottom:1px solid var(--border);white-space:nowrap}
.audit-table td{padding:.75rem 1rem;border-bottom:1px solid var(--border);color:var(--text)}
.audit-table tr:last-child td{border-bottom:none}
.result-pill{display:inline-block;font-size:.72rem;font-weight:500;padding:.15rem .55rem;border-radius:100px}
.result-pill.success{background:rgba(74,222,128,.12);color:#4ade80}
.result-pill.failure{background:rgba(248,113,113,.12);color:#f87171}

/* LICENSES */
.license-row{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:1.1rem 1.4rem;margin-bottom:.8rem}
.license-row-top{display:flex;justify-content:space-between;align-items:baseline;margin-bottom:.6rem;flex-wrap:wrap;gap:.5rem}
.license-row-name{font-size:.92rem;color:var(--text);font-weight:500}
.license-row-count{font-size:.8rem;color:var(--muted)}
.license-bar-track{height:8px;border-radius:100px;background:var(--surface2);overflow:hidden}
.license-bar-fill{height:100%;background:var(--accent);border-radius:100px}
.license-bar-fill.high{background:#f87171}

/* CREATE USER / CREATE GROUP FORMS */
.form-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:1.6rem;max-width:640px}
.form-box label{display:block;font-size:.8rem;color:var(--muted);margin-bottom:.4rem;margin-top:1rem}
.form-box label:first-child{margin-top:0}
.form-box input[type="text"],.form-box select{width:100%;padding:.7rem 1rem;
border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);
font-family:var(--body);font-size:.9rem}
.form-box input:focus,.form-box select:focus{outline:none;border-color:var(--accent)}
.form-hint{font-size:.76rem;color:var(--muted);margin-top:.3rem}
.form-actions{margin-top:1.4rem;display:flex;gap:.75rem}

/* DEVICE ACTIONS */
.device-actions-cell{display:flex;gap:.4rem;flex-wrap:wrap}
.device-actions-cell .btn{padding:.35rem .7rem;font-size:.75rem}

/* VERIFIED ID */
.vc-box{background:var(--surface);border:1px solid var(--border);border-radius:var(--radius);
padding:2.2rem;max-width:420px;margin:0 auto;text-align:center}
.vc-qr-wrap{background:#fff;border-radius:10px;padding:1rem;display:inline-flex;
align-items:center;justify-content:center;min-height:216px;min-width:216px;margin:1.2rem 0}
.vc-status{font-size:.88rem;color:var(--muted);margin-top:1rem}
.vc-status.ok{color:#4ade80;font-weight:500}
.vc-status.err{color:#f87171;font-weight:500}
.vc-deeplink{margin-top:.8rem}

/* ID CALLBACK / SERVICES PLACEHOLDER */
.placeholder-box{background:var(--surface);border:1px solid var(--border);
border-radius:var(--radius);padding:3rem 2rem;text-align:center;max-width:560px;margin:0 auto}
.placeholder-box .big-icon{font-size:3rem;margin-bottom:1rem}
.placeholder-box h3{font-family:var(--heading);font-size:1.2rem;font-weight:700;color:#fff;margin-bottom:.5rem}
.placeholder-box p{color:var(--muted);font-size:.9rem}

/* DASHBOARD SUB-MENU */
.sub-nav{display:flex;gap:.5rem;flex-wrap:wrap;margin:0 0 2.5rem}
.sub-nav-link{padding:.5rem 1rem;border-radius:100px;border:1px solid var(--border);background:var(--surface);color:var(--muted);font-size:.88rem;font-weight:500;transition:all var(--transition)}
.sub-nav-link:hover,.sub-nav-link.active{border-color:rgba(59,130,246,.4);color:#fff;background:var(--surface2)}

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
  .about-grid{grid-template-columns:1fr}
  .resume-box{flex-direction:column;align-items:flex-start}
  .login-box{padding:2rem 1.5rem}
}
`;

// ============================================================
// HTML SHELL -- wraps every page
// ============================================================
function shell(title, body, activePage = '') {
  const navItem = (href, label, page) =>
    `<li><a href="${href}"${activePage === page ? ' class="active"' : ''}>${label}</a></li>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<title>${title} - TMTCo</title>
<style>${CSS}</style>

<link rel="icon" type="image/png" href="https://tmtcoau.com/favicon/favicon-96x96.png?v=20260916" sizes="96x96" />
<link rel="icon" type="image/svg+xml" href="https://tmtcoau.com/favicon/favicon.svg?v=20260916" />
<link rel="shortcut icon" href="https://tmtcoau.com/favicon/favicon.ico?v=20260916" />
<link rel="apple-touch-icon" sizes="180x180" href="https://tmtcoau.com/favicon/apple-touch-icon.png?v=20260916" />
<meta name="apple-mobile-web-app-title" content="TMTCo" />
<link rel="manifest" href="https://tmtcoau.com/favicon/site.webmanifest?v=20260916" />
</head>
<body>
<nav>
<a href="/" class="nav-logo"><span class="dot"></span>TMTCo</a>
<button class="hamburger" id="hamburgerBtn" aria-label="Open menu" aria-expanded="false">
<span></span><span></span><span></span>
</button>
</nav>

<div class="nav-overlay" id="navOverlay"></div>
<aside class="nav-drawer" id="navDrawer" aria-hidden="true">
<div class="nav-drawer-header">
<span class="nav-drawer-title">Menu</span>
<button class="nav-drawer-close" id="navCloseBtn" aria-label="Close menu">&times;</button>
</div>
<ul class="nav-drawer-links">
${navItem('/', 'Home', 'home')}
${navItem('/tech', 'Tech Things', 'tech')}
${navItem('/admin', 'Admin Panel', 'admin')}
${navItem('/dashboard', 'Dashboard', 'dashboard')}
${navItem('/tos', 'Terms of Service', 'tos')}
${navItem('/contact', 'Contact', 'contact')}
${navItem('/privacy', 'Privacy', 'privacy')}
${navItem('/services', 'Services', 'services')}
${navItem('/other', 'Other', 'other')}
${navItem('/.wellknown', 'Wellknown', 'wellknown')}
</ul>
</aside>

<script>
(function(){
  var btn = document.getElementById('hamburgerBtn');
  var closeBtn = document.getElementById('navCloseBtn');
  var drawer = document.getElementById('navDrawer');
  var overlay = document.getElementById('navOverlay');
  function openMenu(){
    drawer.classList.add('open');
    overlay.classList.add('open');
    btn.classList.add('active');
    btn.setAttribute('aria-expanded','true');
    drawer.setAttribute('aria-hidden','false');
    document.body.style.overflow='hidden';
  }
  function closeMenu(){
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    btn.classList.remove('active');
    btn.setAttribute('aria-expanded','false');
    drawer.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
  }
  btn.addEventListener('click', function(){
    drawer.classList.contains('open') ? closeMenu() : openMenu();
  });
  closeBtn.addEventListener('click', closeMenu);
  overlay.addEventListener('click', closeMenu);
  document.addEventListener('keydown', function(e){
    if (e.key === 'Escape') closeMenu();
  });
})();
</script>

${body}
<hr class="divider">
<footer>
<p>&copy; 2026 TMTCo &mdash; All rights reserved.</p>
<p>ABN: 37 546 247 840 </p>
<div class="footer-links">
<a href="/tos">Terms of Service</a>
<a href="/contact">Contact</a>
<a href="/privacy">Privacy</a>
</div>
</footer>

<!-- Microsoft Teams Chat Bot - appears on every page -->

</body>
</html>`;

  return new Response(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html; charset=UTF-8',
      'X-Content-Type-Options': 'nosniff',
      'Cache-Control': 'no-transform',
    },
  });
}

// Microsoft logo SVG for login button
const MS_LOGO = `<svg viewBox="0 0 21 21" xmlns="http://www.w3.org/2000/svg">
<rect x="1" y="1" width="9" height="9" fill="#f25022"/>
<rect x="11" y="1" width="9" height="9" fill="#7fba00"/>
<rect x="1" y="11" width="9" height="9" fill="#00a4ef"/>
<rect x="11" y="11" width="9" height="9" fill="#ffb900"/>
</svg>`;

// Small helper to keep raw user/query text out of the HTML as literal markup
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

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

// Persist an updated session object (e.g. after a token refresh) under the
// same session id / cookie, without resetting the user's idle timer twice.
async function saveSession(c, session) {
  const sid = getCookie(c, 'tmtco_sid');
  if (!sid) return;
  await c.env.SESSIONS.put(
    `session:${sid}`,
    JSON.stringify(session),
    { expirationTtl: SESSION_TTL }
  );
}

async function destroySession(c) {
  const sid = getCookie(c, 'tmtco_sid');
  if (sid) {
    try { await c.env.SESSIONS.delete(`session:${sid}`); } catch {}
  }
  deleteCookie(c, 'tmtco_sid', { path: '/' });
}

// ============================================================
// MULTI-DOMAIN HELPERS
// Both redirect URIs are registered in the Entra ID App Registration:
//   https://www.tmtcoau.com/auth/callback
// so the redirect_uri sent to Microsoft is derived from whichever domain
// the user is actually on - no cross-domain bridging needed.
// ============================================================
const ALLOWED_HOSTS = [
  'www.tmtcoau.com',
  'tmtcoau.com',
  'tmtco.com.au',
  'www.tmtco.com.au',
];

function getBaseUrl(c) {
  const url = new URL(c.req.url);
  if (ALLOWED_HOSTS.includes(url.hostname)) {
    return `${url.protocol}//${url.host}`;
  }
  // Fallback for anything not in the allowlist (e.g. workers.dev preview URL)
  return c.env.BASE_URL;
}

// Pages the login flow is allowed to return to after auth.
// Keeps /auth/login?next=... from being usable as an open redirect.
const ALLOWED_NEXT_PATHS = ['/admin', '/dashboard'];
function sanitizeNext(path) {
  return ALLOWED_NEXT_PATHS.includes(path) ? path : '/admin';
}

// Shared login options. Verified ID is a credential-presentation flow: the
// browser stays on this site while the user approves the request in
// Microsoft Authenticator, then the browser is resumed by polling the
// short-lived transaction created by /auth/verifiedid.
function verifiedIdLoginMarkup(next, label = 'Sign in with Verified ID') {
  const safeNext = sanitizeNext(next);
  return `
<div class="login-divider"><span>or</span></div>
<a href="/auth/verifiedid?next=${encodeURIComponent(safeNext)}" class="vc-login-btn">
<span class="vc-login-icon">&#x1F4F1;</span>
${escapeHtml(label)}
</a>`;
}

// The Graph scopes the app requests. offline_access gets us a refresh
// token so an admin's session can renew its Graph access token without
// forcing a re-login every ~60-90 minutes. User.ReadWrite.All and
// Directory.Read.All cover search and accountEnabled enable/disable.
//
// User-PasswordProfile.ReadWrite.All is required SEPARATELY for password
// resets - as of 2026 Microsoft has been splitting sensitive user fields
// (password, phone, otherMails) into their own resource-specific
// permissions, and User.ReadWrite.All alone no longer covers writing
// passwordProfile even for a Global Administrator. Without this scope,
// enable/disable will work fine but password reset will fail with a
// generic Authorization_RequestDenied 403.
//
// DeviceManagementManagedDevices.Read.All - list Intune managed devices.
// Group.Read.All - list directory groups.
// Mail.Send - send an email (as the signed-in admin) to a group's mail address.
//
// Added for the expanded admin feature set:
// AuditLog.Read.All - directory audit log + per-user sign-in history.
// GroupMember.ReadWrite.All - add/remove a user from a group.
// Organization.Read.All - list subscribed licenses/SKUs.
// DeviceManagementManagedDevices.PrivilegedOperations.All - sync/retire/wipe a device.
const GRAPH_SCOPES =
  'openid profile email offline_access User.Read User.ReadWrite.All Directory.Read.All ' +
  'User-PasswordProfile.ReadWrite.All DeviceManagementManagedDevices.Read.All Group.Read.All Mail.Send ' +
  'AuditLog.Read.All GroupMember.ReadWrite.All Organization.Read.All DeviceManagementManagedDevices.PrivilegedOperations.All';

// ============================================================
// GRAPH / TOKEN HELPERS
// ============================================================

// Returns a valid access token for this session, refreshing it via the
// stored refresh_token if it has expired. Returns null if refresh fails
// (caller should treat that as "session no longer valid for Graph calls").
// Raw app-only (client credentials) Graph token fetch - no caching here,
// callers that need caching handle it themselves (see getValidAccessToken
// below). Returns {token, expiresIn} or null on failure.
async function fetchGraphAppOnlyToken(c) {
  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = c.env;
  try {
    const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials',
        scope: 'https://graph.microsoft.com/.default',
      }),
    });
    if (!res.ok) {
      console.error('Graph app-only token request failed:', res.status, await res.text().catch(() => ''));
      return null;
    }
    const data = await res.json();
    if (!data.access_token) return null;
    return { token: data.access_token, expiresIn: data.expires_in || 3600 };
  } catch (e) {
    console.error('Graph app-only token request threw:', e);
    return null;
  }
}

async function getValidAccessToken(c, session) {
  // Verified ID (Scenario C) sessions have no delegated token at all -
  // every Graph call for them runs on the app's own identity instead.
  // Cached on the session (same pattern as delegated refresh below) so
  // every admin action doesn't re-fetch a fresh app-only token.
  //
  // KNOWN TRADE-OFF: actions taken through a VC-Scenario-C session hit
  // Graph as the app itself, not as the specific signed-in person -
  // Entra/Graph audit logs will show the app as the actor, not the
  // individual admin. Accepted deliberately per the one-step VC sign-in
  // requirement; the alternative (Scenario B / chain_oauth) preserves
  // per-admin audit attribution at the cost of an extra sign-in step.
  if (session.auth_method === 'verified_id') {
    if (session.appOnlyAccessToken && session.appOnlyExpiresAt && Date.now() < session.appOnlyExpiresAt) {
      return session.appOnlyAccessToken;
    }
    const result = await fetchGraphAppOnlyToken(c);
    if (!result) return null;
    session.appOnlyAccessToken = result.token;
    session.appOnlyExpiresAt = Date.now() + (result.expiresIn - 60) * 1000;
    await saveSession(c, session);
    return session.appOnlyAccessToken;
  }

  if (session.access_token && session.expires_at && Date.now() < session.expires_at) {
    return session.access_token;
  }
  if (!session.refresh_token) return null;

  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = c.env;
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      refresh_token: session.refresh_token,
      grant_type: 'refresh_token',
      scope: GRAPH_SCOPES,
    }),
  });
  if (!res.ok) return null;

  const tokens = await res.json();
  session.access_token = tokens.access_token;
  session.refresh_token = tokens.refresh_token || session.refresh_token;
  session.expires_at = Date.now() + (tokens.expires_in - 60) * 1000;
  await saveSession(c, session);

  return session.access_token;
}

// True if the signed-in user's ID token carried the "PortalAdmin" app
// role. This role is assigned in Entra ID under Enterprise Applications
// -> your app -> Users and groups (see walkthrough notes). Graph itself
// will still separately enforce the signed-in admin's real directory
// role (User Administrator etc.) on every write call below - this check
// is just what decides whether the UI is shown at all.
//
// Gate is based on holding the Global Administrator directory role,
// checked once at sign-in via Graph and cached on the session (see
// GLOBAL_ADMIN_ROLE_TEMPLATE_ID / checkIsGlobalAdmin below). This
// replaces the earlier PortalAdmin app-role check - the app role can be
// left in place in Entra ID (harmless if unused) or removed, since
// nothing in this code reads it anymore.
//
// Trade-off worth knowing: tying portal access to Global Admin means
// every Global Admin automatically gets in, and there's no way to grant
// someone narrower "portal only" access without making them a Global
// Admin too - the previous app-role model allowed that separation.
//
// Known gap: sessions created via the Verified ID sign-in flow (see
// auth_method: 'verified_id') carry no Graph access token at all, so
// there is no way to check their directory roles - those sessions are
// deliberately given isGlobalAdmin: false at creation and can never
// pass this gate as written. See that createSession call for the
// reasoning; extending VC-based logins to also qualify would need a
// separate app-only Graph lookup, not built here.
function isPortalAdmin(session) {
  return session.isGlobalAdmin === true;
}

// Fixed, tenant-independent template ID for the Global Administrator
// directory role - safe to check against directly rather than matching
// on displayName, which could in principle be renamed/localized.
const GLOBAL_ADMIN_ROLE_TEMPLATE_ID = '62e90394-69f5-4237-9190-012177145e10';

// Checks whether the user who owns this delegated access token holds
// the Global Administrator directory role, via their own memberOf list.
// Uses Directory.Read.All (already in GRAPH_SCOPES) - no new permission
// needed. Only checks direct/active role assignment (not PIM-eligible,
// not-yet-activated assignments) - matching the "must be actually active
// right now" behavior this project settled on earlier.
async function checkIsGlobalAdmin(accessToken) {
  try {
    const res = await fetch(
      'https://graph.microsoft.com/v1.0/me/memberOf?$select=displayName,roleTemplateId',
      { headers: { Authorization: `Bearer ${accessToken}` } }
    );
    if (!res.ok) {
      console.error('Global Admin role check failed:', res.status, await res.text().catch(() => ''));
      return false;
    }
    const data = await res.json();
    const roles = Array.isArray(data.value) ? data.value : [];
    return roles.some((r) => r.roleTemplateId === GLOBAL_ADMIN_ROLE_TEMPLATE_ID);
  } catch (e) {
    console.error('Global Admin role check threw:', e);
    return false;
  }
}

// ---- Scenario C: app-only Global Admin lookup for Verified ID logins ----
// A VC-only sign-in has no delegated token for that person, so instead
// the SERVER's own app identity (client credentials) looks up that
// specific user's roles by the email already present in their verified
// credential. Needs Directory.Read.All as an APPLICATION permission -
// a separate consent from the Delegated Directory.Read.All already used
// elsewhere in this file, even though it's the same permission name.
async function getGraphAppOnlyToken(c) {
  // Thin wrapper over the shared, cache-free fetch - kept as its own
  // named function since checkIsGlobalAdminByEmailAppOnly (a one-time,
  // low-frequency call at VC login) doesn't need the session-caching
  // getValidAccessToken does for the much more frequent per-action calls.
  const result = await fetchGraphAppOnlyToken(c);
  return result ? result.token : null;
}

async function checkIsGlobalAdminByEmailAppOnly(c, email) {
  if (!email) return false;
  const token = await getGraphAppOnlyToken(c);
  if (!token) return false;
  try {
    const res = await fetch(
      `https://graph.microsoft.com/v1.0/users/${encodeURIComponent(email)}/memberOf?$select=roleTemplateId`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    if (!res.ok) {
      // Not fatal - this just means the VC session falls back to
      // isGlobalAdmin: false, same as if this lookup were never
      // attempted. Commonly a 404 if the verified email doesn't match
      // an actual directory user, or a 403 if the Application
      // permission hasn't been consented yet.
      console.error('App-only Global Admin lookup failed:', res.status, await res.text().catch(() => ''));
      return false;
    }
    const data = await res.json();
    const roles = Array.isArray(data.value) ? data.value : [];
    return roles.some((r) => r.roleTemplateId === GLOBAL_ADMIN_ROLE_TEMPLATE_ID);
  } catch (e) {
    console.error('App-only Global Admin lookup threw:', e);
    return false;
  }
}

function getVerifiedIdIdentity(c, verifiedCredentialsData) {
  if (!Array.isArray(verifiedCredentialsData) || !verifiedCredentialsData.length) return null;

  const expectedType = c.env.VC_TYPE || VC_TYPE_DEFAULT;
  const expectedIssuer = c.env.VC_ISSUER || c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT;
  const expectedClaim = c.env.VC_LOGIN_CLAIM || 'mail';

  const credential = verifiedCredentialsData.find(vc => {
    const types = Array.isArray(vc.type) ? vc.type : [];
    const issuerOk = !expectedIssuer || vc.issuer === expectedIssuer;
    const typeOk = types.includes(expectedType);
    const revocationOk = !vc.credentialState || vc.credentialState.revocationStatus === 'VALID';
    return issuerOk && typeOk && revocationOk;
  });
  if (!credential) return null;

  const claims = credential.claims && typeof credential.claims === 'object' ? credential.claims : {};
  const claimValue = claims[expectedClaim] || claims.mail || claims.revocationId;
  if (!claimValue) return null;

  const email = String(claimValue).trim();
  return {
    email,
    name: claims.displayName || [claims.givenName, claims.surname].filter(Boolean).join(' ') || email,
    claims,
    issuer: credential.issuer,
    type: expectedType,
  };
}

// Thin wrapper around a Graph v1.0 call using this session's (possibly
// just-refreshed) access token.
async function graphFetch(c, session, path, options = {}) {
  const token = await getValidAccessToken(c, session);
  if (!token) return { ok: false, status: 401, body: null };

  const res = await fetch(`https://graph.microsoft.com/v1.0${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  let body = null;
  if (res.status !== 204) {
    try { body = await res.json(); } catch { body = null; }
  }
  return { ok: res.ok, status: res.status, body };
}

// Generates a temporary password that satisfies Entra ID's default
// complexity policy (upper, lower, number, symbol, 12+ chars).
function generateTempPassword() {
  const raw = crypto.randomUUID().replace(/-/g, '').slice(0, 14);
  return `${raw}Aa1!`;
}

// ============================================================
// VERIFIED ID (Microsoft Entra Verified ID issuance)
// ------------------------------------------------------------
// This is a SEPARATE API from Microsoft Graph, and uses APP-ONLY auth
// (client credentials grant), not the delegated user token the rest of
// this file uses. It needs its own Application permission consented on
// the app registration: "VerifiableCredential.Create.All" against the
// "Verifiable Credentials Service Request" API (added via API
// permissions -> Add a permission -> APIs my organization uses).
//
// authority/manifest/type are read from env vars (VC_AUTHORITY,
// VC_MANIFEST, VC_TYPE in wrangler.jsonc "vars" - not secrets, just
// config) rather than hardcoded, since the credential definition is
// still being iterated on. The values below are fallback defaults from
// the original "VerifiedEmployee" first-party credential, used only if
// the env vars aren't set. Once the new "VerifiedCredentialExpert"
// custom credential is created in the Verified ID admin center, set
// VC_MANIFEST to its generated manifest URL and VC_TYPE to
// "VerifiedCredentialExpert" - no code change needed.
const VC_AUTHORITY_DEFAULT =
  'did:web:verifiedid.entra.microsoft.com:f1011f75-0d96-4d08-b8d4-6c79c851f9ba:f5674475-f43e-b35b-dcc6-5d3c3efe6441';
const VC_MANIFEST_DEFAULT =
  'https://verifiedid.did.msidentity.com/v1.0/tenants/f1011f75-0d96-4d08-b8d4-6c79c851f9ba/verifiableCredentials/contracts/4b569048-2a51-8d41-8d64-a27249369c86/manifest';
const VC_TYPE_DEFAULT = 'VerifiedEmployee';
const VC_RESOURCE_SCOPE = '3db474b9-6a0c-4840-96ac-1fceb342124f/.default';

// App-only token for the Verified ID Request Service - fetched fresh
// each time rather than cached, since issuance requests are infrequent
// and this keeps the logic simple (no isolate-lifetime caching concerns).
async function getVerifiedIdAppToken(c) {
  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = c.env;
  const res = await fetch(`https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials',
      scope: VC_RESOURCE_SCOPE,
    }),
  });
  if (!res.ok) {
    console.error('Verified ID app-only token request failed:', res.status, await res.text().catch(() => ''));
    return null;
  }
  const data = await res.json();
  return data.access_token || null;
}

// Shared Graph directory search used by both the no-JS page search and
// the live type-ahead API below. Matches on the start of display name,
// UPN, or mail. Note: this intentionally does NOT use $orderby - Graph
// rejects $filter + $orderby together unless you opt into "advanced
// query" mode (ConsistencyLevel: eventual + $count=true), which isn't
// needed here since results are sorted client-side instead.
async function searchDirectoryUsers(c, session, q) {
  const safe = q.replace(/'/g, "''"); // basic OData single-quote escaping
  const filter =
    `startswith(displayName,'${safe}') or startswith(userPrincipalName,'${safe}') or startswith(mail,'${safe}')`;
  const r = await graphFetch(
    c,
    session,
    `/users?$filter=${encodeURIComponent(filter)}&$select=id,displayName,userPrincipalName,mail,accountEnabled&$top=15`
  );
  if (!r.ok || !r.body) {
    return { ok: false, status: r.status, body: r.body };
  }
  const results = (r.body.value || []).sort((a, b) =>
    (a.displayName || '').localeCompare(b.displayName || '')
  );
  return { ok: true, results };
}

// ============================================================
// ROUTES - HOME
// ============================================================
app.get('/', (c) => {
  const body = `
<div class="hero">
<div class="hero-badge">&#x26A1; Tech Solutions &amp; IT Support</div>
<h1>TMTCo<br><span>Empowering I.T.</span></h1>
<p>Your go-to hub for IT services, tech resources, and all things technology &mdash; backed by TMTCo.</p>
<div class="hero-ctas">
<a href="/services" class="btn btn-primary">Explore Services</a>
<a href="/contact" class="btn btn-ghost">Get in Touch</a>
</div>
</div>

<div class="page-section">
<div class="section-header">
<div class="section-label">What we offer</div>
<h2 class="section-title">Available Services</h2>
<p class="section-sub">A collection of tools, resources, and services available through www.tmtcoau.com.</p>
</div>
<div class="cards">
<a href="/services" class="card">
<div class="card-icon">&#x1F4BC;</div>
<h3>Services</h3>
<p>IT helpdesk support for businesses and individuals, plus remote support sessions.</p>
<span class="card-link">View services &rarr;</span>
</a>
<a href="/about" class="card">
<div class="card-icon">&#x1F464;</div>
<h3>About</h3>
<p>Who TMTCo is and the person behind it, with a resume for hiring managers.</p>
<span class="card-link">Read more &rarr;</span>
</a>
<a href="/other" class="card">
<div class="card-icon">&#x1F9F0;</div>
<h3>Other</h3>
<p>Command reference, IT tools and general-purpose tools, all in one place.</p>
<span class="card-link">Open other &rarr;</span>
</a>
</div>
</div>

<hr class="divider">

<div class="page-section">
<div class="about-grid">
<div class="about-text">
<div class="section-label">About</div>
<h2 class="section-title">For Hiring &amp; Interviewers</h2>
<p>I'm Logan Yeomans, the person behind tmtcoau.com and TMTCo. I'm passionate about technology, IT infrastructure, and building practical solutions.</p>
<p>If you're a hiring manager or recruiter, you can grab a copy of my resume below.</p>
<div class="resume-box">
<div>
<strong>Logan Yeomans &mdash; Resume</strong>
<!-- Update date when you upload a new resume -->
<p>PDF download &middot; Last updated 26/10/26</p>
</div>
<!-- Update resume URL if it changes -->
<a class="btn btn-primary" href="https://cp-int.tmtcoau.com/pdf-docs/Logan.Yeomans%20Resume-26.10.26.pdf" target="_blank">&#x2B07; Download PDF</a>
</div>
</div>
<div class="about-placeholder">&#x1F468;&#x200D;&#x1F4BB;</div>
</div>
</div>`;
  return shell('TMTCo', body, 'home');
});

// ============================================================
// ROUTES - well known - discord verify
// little hidden page on the site to verify ownership for discird
// ============================================================
app.get('/.wellknown/discord', (c) => {
  const body = `
  <div class="page-section top>
  <div class="section-header">
  </div>
  <h1>dh=77ac9a6e8e54fc39e51c2fb1fadf6fb667140eb0</h1>`;
    return shell ('Wellknown', body, 'wellknown');
});

app.get('/.wellknown', (c) => {
  const body = `
    <div class="page-section top">
    <div class="section-header">
    <div class="section-footer">
    </div>
    <h2>Huh, You shouldn't belong here... </h2>
    <h3> Please return to home and try another page </h3>
  </div>
    <div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
  </div>`;
  return shell('Wellknown', body, 'wellknown');
});

// ============================================================
// ROUTES - TECH THINGS
      


// ============================================================
// ROUTES - TECH THINGS
// Add more cards in the .cards grid below
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
<a href="https://archive.org/details/tiny-11-NTDEV/Screenshot_20230203-100010_YouTube.jpg" target="_blank" class="card">
<div class="card-icon">&#x1FA9F;</div>
<h3>Tiny11</h3>
<p>A lightweight build of Windows 11 that runs smoothly on older or lower-spec hardware. Stripped of bloat, designed to just work.</p>
<span class="card-link">Download from Archive.org &rarr;</span>
</a>
<!-- Add more tech resource cards here -->
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Tech Things', body, 'tech');
});

// ============================================================
// ROUTES - ADMIN PANEL (auth + role protected)
// Replaces the old "Cloud Password Reset" page. Lets a signed-in,
// role-assigned admin search Entra ID users via Graph and enable,
// disable, or reset the password on an account.
//
// /passreset is kept as a redirect so any old bookmarks/links still work.
// ============================================================
app.get('/passreset', (c) => c.redirect('/admin', 301));

app.get('/admin', async (c) => {
  const session = await getSession(c);
  const error = c.req.query('error');

  // Not signed in at all - show the Microsoft login wall
  if (!session) {
    const body = `
<div class="login-page">
<div class="login-box">
<div class="lock-icon">&#x1F510;</div>
<h2>Authorised Access Only</h2>
<p>This portal is restricted to TMTCo administrators.<br>Sign in with your organisational account to continue.</p>
<a href="/auth/login?next=/admin" class="ms-login-btn">
${MS_LOGO}
Sign in with Microsoft
</a>
${verifiedIdLoginMarkup('/admin')}
${error ? `<div class="error-box">Sign-in failed or access denied. Contact logan.kelly@tmtcoau.com for help.</div>` : ''}
<p class="login-note">&#x1F512; Secured via Microsoft Entra ID &middot; TMTCo internal use only</p>
</div>
</div>`;
    return shell('Sign In', body, 'admin');
  }

  // Signed in, but doesn't hold the PortalAdmin app role in Entra ID
  if (!isPortalAdmin(session)) {
    const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>
<div class="placeholder-box">
<div class="big-icon">&#x26D4;</div>
<h3>Not Authorised</h3>
<p>Your account is signed in but doesn't hold the admin role required for this panel. Contact <a href="mailto:logan.kelly@tmtcoau.com">logan.kelly@tmtcoau.com</a> if you believe this is a mistake.</p>
${session && session.auth_method === 'verified_id' ? '<p>Verified ID proves your verified employee identity, but this admin panel also requires the Microsoft sign-in session because its actions use your delegated Microsoft Graph permissions.</p>' : ''}
</div>
</div>`;
    return shell('Admin Panel', body, 'admin');
  }

  // Authorised - run a search if one was submitted
  const search = c.req.query('q') || '';
  const flashMsg = c.req.query('flash') || '';
  const flashErr = c.req.query('flasherr') || '';

  let results = [];
  let searchFailed = false;

  if (search) {
    const r = await searchDirectoryUsers(c, session, search);
    if (r.ok) {
      results = r.results;
    } else {
      searchFailed = true;
      console.error('Graph user search failed:', r.status, JSON.stringify(r.body));
    }
  }

  const rows = results.map((u) => {
    const enabled = !!u.accountEnabled;
    const upn = u.userPrincipalName || u.mail || '';
    return `
<div class="user-row" data-userid="${escapeHtml(u.id)}">
  <div class="user-row-check">
    <input type="checkbox" class="bulk-check" value="${escapeHtml(u.id)}" data-name="${escapeHtml(u.displayName || upn)}">
    <div>
    <div class="user-row-name">${escapeHtml(u.displayName || '(no name)')}
      <span class="status-pill ${enabled ? 'enabled' : 'disabled'}">
        ${enabled ? '&#9679; Enabled' : '&#9679; Disabled'}
      </span>
    </div>
    <div class="user-row-email">${escapeHtml(upn)}</div>
    </div>
  </div>
  <div class="user-row-actions">
    <button type="button" class="btn btn-ghost details-btn" data-userid="${escapeHtml(u.id)}" data-name="${escapeHtml(u.displayName || upn)}">Details</button>
    <form method="POST" action="/admin/action">
      <input type="hidden" name="userId" value="${escapeHtml(u.id)}">
      <input type="hidden" name="q" value="${escapeHtml(search)}">
      <input type="hidden" name="action" value="${enabled ? 'disable' : 'enable'}">
      <button type="submit" class="btn ${enabled ? 'btn-danger' : 'btn-ghost'}">
        ${enabled ? 'Disable account' : 'Enable account'}
      </button>
    </form>
    <form method="POST" action="/admin/action" class="reset-form"
      onsubmit="return confirm('Reset the password for ${escapeHtml((u.displayName || upn).replace(/'/g, "\\'"))}? This will immediately replace their current password.');">
      <input type="hidden" name="userId" value="${escapeHtml(u.id)}">
      <input type="hidden" name="q" value="${escapeHtml(search)}">
      <input type="hidden" name="action" value="reset">
      <input type="text" name="password" class="pw-field" placeholder="Leave blank to auto-generate" autocomplete="off" spellcheck="false">
      <button type="button" class="btn btn-ghost gen-btn">Generate</button>
      <button type="submit" class="btn btn-ghost">Reset password</button>
    </form>
  </div>
</div>`;
  }).join('');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Admin Panel</h2>
<p class="section-sub">Search for a user by name or email to enable, disable, or reset their Entra ID account. Actions are performed with your own admin permissions via Microsoft Graph.</p>
</div>

<div class="admin-tabs">
<a href="/admin" class="admin-tab active">Users</a>
<a href="/admin/devices" class="admin-tab">Devices</a>
<a href="/admin/groups" class="admin-tab">Groups</a>
<a href="/admin/audit" class="admin-tab">Audit Log</a>
<a href="/admin/licenses" class="admin-tab">Licenses</a>
</div>

${flashMsg ? `<div class="flash-banner">${flashMsg}</div>` : ''}
${flashErr ? `<div class="flash-banner err">${flashErr}</div>` : ''}

<div class="page-links-row">
<a href="/admin/users/new" class="btn btn-ghost">+ Create user</a>
<a href="/admin/deleted-users" class="btn btn-ghost">Deleted users</a>
</div>

<form method="GET" action="/admin" class="admin-search" id="adminSearchForm">
<input type="text" name="q" id="adminSearchInput" value="${escapeHtml(search)}" placeholder="Start typing a name or email&hellip;" autocomplete="off">
<button type="submit" class="btn btn-primary">Search</button>
</form>
<p class="no-results" id="searchStatus" style="display:none"></p>

<div class="bulk-toolbar hidden" id="bulkToolbar">
<span class="bulk-count" id="bulkCount">0 selected</span>
<button type="button" class="btn btn-ghost" id="bulkEnableBtn">Enable selected</button>
<button type="button" class="btn btn-danger" id="bulkDisableBtn">Disable selected</button>
<button type="button" class="btn btn-ghost" id="bulkResetBtn">Reset passwords (auto-generate)</button>
</div>
<p class="no-results" id="bulkStatus" style="display:none"></p>

${results.length > 0 ? `<div class="select-all-row"><input type="checkbox" id="selectAllCheckbox"> <label for="selectAllCheckbox">Select all shown</label></div>` : ''}

<div id="resultsContainer">
${searchFailed ? `<p class="no-results">Search failed &mdash; your session may need refreshing, or you may be missing the required Graph permission. Try signing out and back in.</p>` : ''}
${!searchFailed && search && results.length === 0 ? `<p class="no-results">No users found matching "${escapeHtml(search)}".</p>` : ''}
${rows}
</div>

<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>

<script>
(function(){
  var bulkToolbar = document.getElementById('bulkToolbar');
  var bulkCount = document.getElementById('bulkCount');
  var bulkStatus = document.getElementById('bulkStatus');
  var selectAll = document.getElementById('selectAllCheckbox');
  var container = document.getElementById('resultsContainer');
  if (!container) return;

  function checkedBoxes() {
    return Array.prototype.slice.call(container.querySelectorAll('.bulk-check:checked'));
  }

  function refreshToolbar() {
    var n = checkedBoxes().length;
    bulkCount.textContent = n + ' selected';
    bulkToolbar.classList.toggle('hidden', n === 0);
  }

  container.addEventListener('change', function(e){
    if (e.target.classList.contains('bulk-check')) refreshToolbar();
  });

  if (selectAll) {
    selectAll.addEventListener('change', function(){
      container.querySelectorAll('.bulk-check').forEach(function(cb){ cb.checked = selectAll.checked; });
      refreshToolbar();
    });
  }

  function runBulk(action) {
    var ids = checkedBoxes().map(function(cb){ return cb.value; });
    var names = checkedBoxes().map(function(cb){ return cb.getAttribute('data-name') || cb.value; });
    if (!ids.length) return;

    var confirmMsg = action === 'reset'
      ? 'Reset passwords for ' + ids.length + ' selected user(s)? Each will get a new auto-generated password.'
      : (action === 'disable' ? 'Disable ' : 'Enable ') + ids.length + ' selected user(s)?';
    if (!confirm(confirmMsg)) return;

    bulkStatus.style.display = 'block';
    bulkStatus.textContent = 'Working\\u2026';

    fetch('/admin/bulk-action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userIds: ids, action: action })
    })
      .then(function(res){ return res.json(); })
      .then(function(data){
        bulkStatus.style.display = 'none';
        if (data.error) {
          alert('Bulk action failed: ' + data.error);
          return;
        }
        var lines = data.results.map(function(r, i){
          var label = names[ids.indexOf(r.userId)] || r.userId;
          if (!r.ok) return label + ': failed (' + (r.error || 'unknown error') + ')';
          if (action === 'reset') return label + ': ' + r.password;
          return label + ': ' + action + 'd successfully';
        });
        alert((action === 'reset' ? 'Passwords set (save these now, shown once):\\n\\n' : 'Done:\\n\\n') + lines.join('\\n'));
        location.reload();
      })
      .catch(function(){
        bulkStatus.style.display = 'none';
        alert('Bulk action failed \\u2014 please try again.');
      });
  }

  var enableBtn = document.getElementById('bulkEnableBtn');
  var disableBtn = document.getElementById('bulkDisableBtn');
  var resetBtn = document.getElementById('bulkResetBtn');
  if (enableBtn) enableBtn.addEventListener('click', function(){ runBulk('enable'); });
  if (disableBtn) disableBtn.addEventListener('click', function(){ runBulk('disable'); });
  if (resetBtn) resetBtn.addEventListener('click', function(){ runBulk('reset'); });


  // ---- User Details panel (expand/collapse, group management) ----
  var groupsCache = null; // lazy-loaded list of {id, displayName}, fetched once

  function loadGroupsList() {
    if (groupsCache) return Promise.resolve(groupsCache);
    return fetch('/admin/api/groups-list')
      .then(function(res){ return res.json(); })
      .then(function(data){
        groupsCache = data.groups || [];
        return groupsCache;
      })
      .catch(function(){ return []; });
  }

  function fieldEl(label, value) {
    var wrap = document.createElement('div');
    wrap.className = 'detail-field';
    var span = document.createElement('span');
    span.textContent = label;
    var strong = document.createElement('strong');
    strong.textContent = value || '\u2014';
    wrap.appendChild(span);
    wrap.appendChild(strong);
    return wrap;
  }

  function subhead(text) {
    var h = document.createElement('div');
    h.className = 'detail-subhead';
    h.textContent = text;
    return h;
  }

  function miniActionForm(userId, actionValue, label, btnClass, confirmMsg, extraFields) {
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = '/admin/action';
    f.style.display = 'inline';
    if (confirmMsg) {
      f.addEventListener('submit', function(e){
        if (!confirm(confirmMsg)) e.preventDefault();
      });
    }
    var fields = [['userId', userId], ['action', actionValue]].concat(extraFields || []);
    fields.forEach(function(pair){
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = pair[0];
      inp.value = pair[1];
      f.appendChild(inp);
    });
    var btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = btnClass;
    btn.textContent = label;
    f.appendChild(btn);
    return f;
  }

  function renderDetailPanel(userId, userName, data) {
    var p = data.profile || {};
    var panel = document.createElement('div');
    panel.className = 'user-detail-panel';

    var grid = document.createElement('div');
    grid.className = 'detail-grid';
    grid.appendChild(fieldEl('Job title', p.jobTitle));
    grid.appendChild(fieldEl('Department', p.department));
    grid.appendChild(fieldEl('Office', p.officeLocation));
    grid.appendChild(fieldEl('Manager', data.manager));
    grid.appendChild(fieldEl('Phone', p.mobilePhone));
    grid.appendChild(fieldEl('Created', p.createdDateTime ? p.createdDateTime.slice(0, 10) : ''));
    panel.appendChild(grid);

    panel.appendChild(subhead('Group memberships'));
    var groupChips = document.createElement('div');
    groupChips.className = 'chip-row';
    var groups = data.groups || [];
    if (!groups.length) {
      var noGroups = document.createElement('span');
      noGroups.style.color = 'var(--muted)';
      noGroups.style.fontSize = '.82rem';
      noGroups.textContent = 'No group memberships.';
      groupChips.appendChild(noGroups);
    } else {
      groups.forEach(function(g){
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.appendChild(document.createTextNode(g.displayName));
        var removeForm = miniActionForm(
          userId, 'removegroup', '\u00d7', 'chip-remove',
          'Remove ' + userName + ' from ' + g.displayName + '?',
          [['groupId', g.id]]
        );
        chip.appendChild(removeForm);
        groupChips.appendChild(chip);
      });
    }
    panel.appendChild(groupChips);

    var addRow = document.createElement('div');
    addRow.className = 'add-group-row';
    var select = document.createElement('select');
    select.className = 'group-select';
    var loadingOpt = document.createElement('option');
    loadingOpt.value = '';
    loadingOpt.textContent = 'Loading groups\u2026';
    select.appendChild(loadingOpt);
    var addForm = document.createElement('form');
    addForm.method = 'POST';
    addForm.action = '/admin/action';
    addForm.style.display = 'inline-flex';
    addForm.style.gap = '.5rem';
    [['userId', userId], ['action', 'addgroup']].forEach(function(pair){
      var inp = document.createElement('input');
      inp.type = 'hidden'; inp.name = pair[0]; inp.value = pair[1];
      addForm.appendChild(inp);
    });
    var hiddenGroupId = document.createElement('input');
    hiddenGroupId.type = 'hidden';
    hiddenGroupId.name = 'groupId';
    addForm.appendChild(hiddenGroupId);
    var addBtn = document.createElement('button');
    addBtn.type = 'submit';
    addBtn.className = 'btn btn-ghost';
    addBtn.textContent = 'Add to group';
    addForm.appendChild(addBtn);
    addRow.appendChild(select);
    addRow.appendChild(addForm);
    panel.appendChild(addRow);

    loadGroupsList().then(function(allGroups){
      select.innerHTML = '';
      var placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Select a group\u2026';
      select.appendChild(placeholder);
      allGroups.forEach(function(g){
        var opt = document.createElement('option');
        opt.value = g.id;
        opt.textContent = g.displayName;
        select.appendChild(opt);
      });
      select.addEventListener('change', function(){ hiddenGroupId.value = select.value; });
    });

    panel.appendChild(subhead('Licenses'));
    var licenses = data.licenses || [];
    if (!licenses.length) {
      var noLic = document.createElement('span');
      noLic.style.color = 'var(--muted)';
      noLic.style.fontSize = '.82rem';
      noLic.textContent = 'No licenses assigned.';
      panel.appendChild(noLic);
    } else {
      var licRow = document.createElement('div');
      licRow.className = 'chip-row';
      licenses.forEach(function(l){
        var chip = document.createElement('span');
        chip.className = 'chip';
        chip.textContent = l;
        licRow.appendChild(chip);
      });
      panel.appendChild(licRow);
    }

    panel.appendChild(subhead('Recent sign-ins'));
    var signIns = data.signIns || [];
    if (!signIns.length) {
      var noSignIns = document.createElement('span');
      noSignIns.style.color = 'var(--muted)';
      noSignIns.style.fontSize = '.82rem';
      noSignIns.textContent = 'No recent sign-in activity available.';
      panel.appendChild(noSignIns);
    } else {
      signIns.forEach(function(s){
        var row = document.createElement('div');
        row.className = 'signin-row';
        var left = document.createElement('span');
        left.textContent = (s.createdDateTime || '').replace('T', ' ').slice(0, 16) + ' UTC \u2014 ' + (s.appDisplayName || 'Unknown app');
        var right = document.createElement('span');
        var ok = s.status && s.status.errorCode === 0;
        right.className = ok ? '' : 'status-pill disabled';
        right.textContent = (ok ? 'Success' : 'Failed') + (s.ipAddress ? ' \u00b7 ' + s.ipAddress : '');
        row.appendChild(left);
        row.appendChild(right);
        panel.appendChild(row);
      });
    }

    var actionsRow = document.createElement('div');
    actionsRow.className = 'detail-actions';
    actionsRow.appendChild(miniActionForm(
      userId, 'revoke', 'Revoke all sessions', 'btn btn-ghost',
      'Revoke all active sessions for ' + userName + '? They will be signed out everywhere immediately.'
    ));
    actionsRow.appendChild(miniActionForm(
      userId, 'delete', 'Delete user', 'btn btn-danger',
      'Delete ' + userName + '? This can be restored from Deleted Users within 30 days.'
    ));
    panel.appendChild(actionsRow);

    return panel;
  }

  container.addEventListener('click', function(e){
    var btn = e.target.closest('.details-btn');
    if (!btn) return;
    var userId = btn.getAttribute('data-userid');
    var userName = btn.getAttribute('data-name');
    var row = btn.closest('.user-row');
    var existing = row.nextElementSibling;

    if (existing && existing.classList && existing.classList.contains('user-detail-panel')) {
      existing.remove();
      btn.textContent = 'Details';
      return;
    }
    // Close any other open panel first, one at a time keeps it simple.
    container.querySelectorAll('.user-detail-panel').forEach(function(p){ p.remove(); });
    container.querySelectorAll('.details-btn').forEach(function(b){ b.textContent = 'Details'; });

    btn.textContent = 'Loading\u2026';
    fetch('/admin/api/user-detail?userId=' + encodeURIComponent(userId))
      .then(function(res){ return res.json(); })
      .then(function(data){
        btn.textContent = 'Hide details';
        if (data.error) {
          var errP = document.createElement('p');
          errP.className = 'no-results';
          errP.textContent = 'Could not load details for this user.';
          row.parentNode.insertBefore(errP, row.nextSibling);
          return;
        }
        var panel = renderDetailPanel(userId, userName, data);
        row.parentNode.insertBefore(panel, row.nextSibling);
      })
      .catch(function(){
        btn.textContent = 'Details';
      });
  });
})();
</script>

<script>
(function(){
  var input = document.getElementById('adminSearchInput');
  var container = document.getElementById('resultsContainer');
  var statusEl = document.getElementById('searchStatus');
  var form = document.getElementById('adminSearchForm');
  if (!input || !container) return;

  // Type-ahead is progressive enhancement - the form above still works
  // as a normal GET submit (full page reload) if JS is unavailable.
  form.addEventListener('submit', function(e){ e.preventDefault(); });

  var debounceTimer = null;
  var activeController = null;

  function generateClientPassword() {
    var raw = (crypto.randomUUID ? crypto.randomUUID() : String(Math.random())).replace(/-/g, '').slice(0, 14);
    return raw + 'Aa1!';
  }

  function buildResetForm(u, currentQuery) {
    var displayLabel = u.displayName || u.userPrincipalName || u.mail || '';
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = '/admin/action';
    f.className = 'reset-form';
    f.addEventListener('submit', function(e){
      if (!confirm('Reset the password for ' + displayLabel + '? This will immediately replace their current password.')) {
        e.preventDefault();
      }
    });
    [['userId', u.id], ['q', currentQuery], ['action', 'reset']].forEach(function(pair){
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = pair[0];
      inp.value = pair[1];
      f.appendChild(inp);
    });
    var pwInput = document.createElement('input');
    pwInput.type = 'text';
    pwInput.name = 'password';
    pwInput.className = 'pw-field';
    pwInput.placeholder = 'Leave blank to auto-generate';
    pwInput.autocomplete = 'off';
    pwInput.spellcheck = false;
    f.appendChild(pwInput);

    var genBtn = document.createElement('button');
    genBtn.type = 'button';
    genBtn.className = 'btn btn-ghost gen-btn';
    genBtn.textContent = 'Generate';
    f.appendChild(genBtn);

    var submitBtn = document.createElement('button');
    submitBtn.type = 'submit';
    submitBtn.className = 'btn btn-ghost';
    submitBtn.textContent = 'Reset password';
    f.appendChild(submitBtn);

    return f;
  }

  // Event delegation for "Generate" buttons - covers both the initial
  // server-rendered rows and any rows the live search swaps in later.
  container.addEventListener('click', function(e){
    var btn = e.target.closest('.gen-btn');
    if (!btn) return;
    var pwField = btn.closest('form').querySelector('.pw-field, input[name="password"]');
    if (pwField) pwField.value = generateClientPassword();
  });

  function buildActionForm(u, actionValue, label, btnClass, confirmMsg, currentQuery) {
    var f = document.createElement('form');
    f.method = 'POST';
    f.action = '/admin/action';
    if (confirmMsg) {
      f.addEventListener('submit', function(e){
        if (!confirm(confirmMsg)) e.preventDefault();
      });
    }
    [['userId', u.id], ['q', currentQuery], ['action', actionValue]].forEach(function(pair){
      var inp = document.createElement('input');
      inp.type = 'hidden';
      inp.name = pair[0];
      inp.value = pair[1];
      f.appendChild(inp);
    });
    var btn = document.createElement('button');
    btn.type = 'submit';
    btn.className = 'btn ' + btnClass;
    btn.textContent = label;
    f.appendChild(btn);
    return f;
  }

  function renderResults(users, q) {
    container.innerHTML = '';
    if (!users.length) {
      var p = document.createElement('p');
      p.className = 'no-results';
      p.textContent = 'No users found matching "' + q + '".';
      container.appendChild(p);
      return;
    }
    users.forEach(function(u){
      var enabled = !!u.accountEnabled;
      var upn = u.userPrincipalName || u.mail || '';
      var displayLabel = u.displayName || upn;

      var row = document.createElement('div');
      row.className = 'user-row';
      row.setAttribute('data-userid', u.id);

      var checkWrap = document.createElement('div');
      checkWrap.className = 'user-row-check';
      var checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'bulk-check';
      checkbox.value = u.id;
      checkbox.setAttribute('data-name', displayLabel);
      checkWrap.appendChild(checkbox);

      var left = document.createElement('div');
      var nameDiv = document.createElement('div');
      nameDiv.className = 'user-row-name';
      nameDiv.appendChild(document.createTextNode((u.displayName || '(no name)') + ' '));
      var pill = document.createElement('span');
      pill.className = 'status-pill ' + (enabled ? 'enabled' : 'disabled');
      pill.textContent = enabled ? '\\u25CF Enabled' : '\\u25CF Disabled';
      nameDiv.appendChild(pill);
      var emailDiv = document.createElement('div');
      emailDiv.className = 'user-row-email';
      emailDiv.textContent = upn;
      left.appendChild(nameDiv);
      left.appendChild(emailDiv);
      checkWrap.appendChild(left);

      var actions = document.createElement('div');
      actions.className = 'user-row-actions';
      var detailsBtn = document.createElement('button');
      detailsBtn.type = 'button';
      detailsBtn.className = 'btn btn-ghost details-btn';
      detailsBtn.setAttribute('data-userid', u.id);
      detailsBtn.setAttribute('data-name', displayLabel);
      detailsBtn.textContent = 'Details';
      actions.appendChild(detailsBtn);
      actions.appendChild(buildActionForm(
        u, enabled ? 'disable' : 'enable', enabled ? 'Disable account' : 'Enable account',
        enabled ? 'btn-danger' : 'btn-ghost', null, q
      ));
      actions.appendChild(buildResetForm(u, q));

      row.appendChild(checkWrap);
      row.appendChild(actions);
      container.appendChild(row);
    });
  }

  input.addEventListener('input', function(){
    var q = input.value;
    clearTimeout(debounceTimer);

    if (q.trim().length < 2) {
      statusEl.style.display = 'none';
      container.innerHTML = '';
      return;
    }

    statusEl.style.display = 'block';
    statusEl.textContent = 'Searching\\u2026';

    debounceTimer = setTimeout(function(){
      if (activeController) activeController.abort();
      activeController = new AbortController();

      fetch('/admin/api/search?q=' + encodeURIComponent(q), { signal: activeController.signal })
        .then(function(res){ return res.json(); })
        .then(function(data){
          statusEl.style.display = 'none';
          if (data.error) {
            container.innerHTML = '<p class="no-results">Search failed &mdash; try signing out and back in.</p>';
            return;
          }
          renderResults(data.results || [], q);
        })
        .catch(function(err){
          if (err.name === 'AbortError') return;
          statusEl.style.display = 'none';
          container.innerHTML = '<p class="no-results">Search failed &mdash; please try again.</p>';
        });
    }, 300);
  });
})();
</script>`;
  return shell('Admin Panel', body, 'admin');
});

// Handles the enable / disable / reset actions from the Admin Panel.
// Every write is made via Graph using the signed-in admin's own
// delegated token, so Graph enforces their real Entra ID role on top
// of the PortalAdmin app-role gate below.
// Live type-ahead search used by the Admin Panel's JS as the person
// types (see the inline <script> in the /admin page below). Same
// auth + role checks as the page itself, just returns JSON instead
// of HTML. Requires at least 2 characters to avoid firing a Graph
// query on every single keystroke of a 1-character prefix.
app.get('/admin/api/search', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) {
    return c.json({ error: 'unauthorized' }, 401);
  }

  const q = (c.req.query('q') || '').trim();
  if (q.length < 2) return c.json({ results: [] });

  const r = await searchDirectoryUsers(c, session, q);
  if (!r.ok) {
    console.error('Graph live search failed:', r.status, JSON.stringify(r.body));
    return c.json({ error: 'graph_error', status: r.status }, 502);
  }

  return c.json({ results: r.results });
});

// Powers the "Details" panel on the Users tab: profile fields, manager,
// group memberships, assigned licenses, and recent sign-in activity for
// one user. Secondary calls (manager/groups/licenses/signIns) are allowed
// to fail individually without failing the whole panel - a user with no
// manager set, for instance, shouldn't break the rest of the detail view.
app.get('/admin/api/user-detail', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) {
    return c.json({ error: 'unauthorized' }, 401);
  }

  const userId = c.req.query('userId') || '';
  if (!userId) return c.json({ error: 'missing_userId' }, 400);

  const profileRes = await graphFetch(
    c,
    session,
    `/users/${encodeURIComponent(userId)}?$select=id,displayName,userPrincipalName,mail,jobTitle,department,officeLocation,mobilePhone,accountEnabled,createdDateTime`
  );
  if (!profileRes.ok || !profileRes.body) {
    console.error('User detail profile fetch failed:', profileRes.status, JSON.stringify(profileRes.body));
    return c.json({ error: 'graph_error' }, 502);
  }

  const [managerRes, groupsRes, licensesRes, signInsRes] = await Promise.all([
    graphFetch(c, session, `/users/${encodeURIComponent(userId)}/manager?$select=displayName`),
    graphFetch(c, session, `/users/${encodeURIComponent(userId)}/memberOf?$select=id,displayName`),
    graphFetch(c, session, `/users/${encodeURIComponent(userId)}/licenseDetails?$select=skuPartNumber`),
    // No $orderby here deliberately - signIns is subject to the same
    // $filter + $orderby "advanced query" restriction seen on /users
    // earlier in this project. Results are typically already recent-first.
    graphFetch(c, session, `/auditLogs/signIns?$filter=userId eq '${userId.replace(/'/g, "''")}'&$top=5`),
  ]);

  const manager = managerRes.ok && managerRes.body ? managerRes.body.displayName : null;

  // memberOf can include directory roles alongside actual groups -
  // only keep entries that are genuinely groups.
  const groups = (groupsRes.ok && groupsRes.body ? groupsRes.body.value || [] : [])
    .filter((g) => g['@odata.type'] === '#microsoft.graph.group' || !g['@odata.type'])
    .map((g) => ({ id: g.id, displayName: g.displayName }));

  const licenses = (licensesRes.ok && licensesRes.body ? licensesRes.body.value || [] : [])
    .map((l) => l.skuPartNumber)
    .filter(Boolean);

  const signIns = signInsRes.ok && signInsRes.body ? signInsRes.body.value || [] : [];
  if (!signInsRes.ok) {
    console.error('Sign-in history fetch failed (non-fatal):', signInsRes.status, JSON.stringify(signInsRes.body));
  }

  return c.json({
    profile: profileRes.body,
    manager,
    groups,
    licenses,
    signIns,
  });
});

// Powers the "Add to group" dropdown in the Details panel - a lightweight
// id+name list rather than the full Groups tab payload.
app.get('/admin/api/groups-list', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) {
    return c.json({ error: 'unauthorized' }, 401);
  }

  const r = await graphFetch(c, session, `/groups?$select=id,displayName&$top=200`);
  if (!r.ok || !r.body) {
    console.error('Groups list (for dropdown) failed:', r.status, JSON.stringify(r.body));
    return c.json({ error: 'graph_error', groups: [] }, 502);
  }

  const groups = (r.body.value || []).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
  return c.json({ groups });
});

app.post('/admin/action', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) {
    return c.redirect('/admin?error=1');
  }

  const form = await c.req.parseBody();
  const userId = form.userId;
  const action = form.action;
  const q = typeof form.q === 'string' ? form.q : '';
  const groupId = typeof form.groupId === 'string' ? form.groupId : '';

  const validActions = ['enable', 'disable', 'reset', 'revoke', 'delete', 'addgroup', 'removegroup', 'restore'];
  if (!userId || !validActions.includes(action)) {
    return c.redirect(`/admin?q=${encodeURIComponent(q)}&flasherr=${encodeURIComponent('Invalid request.')}`);
  }
  if ((action === 'addgroup' || action === 'removegroup') && !groupId) {
    return c.redirect(`/admin?q=${encodeURIComponent(q)}&flasherr=${encodeURIComponent('Missing group.')}`);
  }

  let flash = '';
  let flasherr = '';

  if (action === 'enable' || action === 'disable') {
    const r = await graphFetch(c, session, `/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({ accountEnabled: action === 'enable' }),
    });
    if (r.ok) {
      flash = `Account ${action === 'enable' ? 'enabled' : 'disabled'} successfully.`;
    } else {
      console.error('Graph enable/disable failed:', r.status, JSON.stringify(r.body));
      flasherr = `Failed to ${action} account (Graph returned status ${r.status}). This usually means your Entra ID role doesn't permit this change for that user.`;
    }
  }

  if (action === 'reset') {
    const customPassword = typeof form.password === 'string' ? form.password.trim() : '';

    // Entra ID's default password policy requires 8-256 chars with at
    // least 3 of: uppercase, lowercase, digit, symbol. We only do a
    // basic length check here - Graph itself will reject anything that
    // doesn't meet the tenant's actual policy, and that error is
    // surfaced below rather than duplicating Microsoft's full ruleset.
    if (customPassword && customPassword.length < 8) {
      return c.redirect(
        `/admin?q=${encodeURIComponent(q)}&flasherr=${encodeURIComponent('Password must be at least 8 characters.')}`
      );
    }

    const passwordToSet = customPassword || generateTempPassword();
    const r = await graphFetch(c, session, `/users/${encodeURIComponent(userId)}`, {
      method: 'PATCH',
      body: JSON.stringify({
        passwordProfile: {
          forceChangePasswordNextSignIn: true,
          password: passwordToSet,
        },
      }),
    });
    if (r.ok) {
      flash = customPassword
        ? `Password set successfully.`
        : `Password reset. Temporary password (share securely &mdash; shown once only): <strong>${escapeHtml(passwordToSet)}</strong>`;
    } else {
      console.error('Graph password reset failed:', r.status, JSON.stringify(r.body));
      const graphMsg = r.body && r.body.error ? r.body.error.message : null;
      flasherr = `Failed to reset password (Graph returned status ${r.status}: ${escapeHtml(r.body && r.body.error ? r.body.error.code : 'unknown')})${graphMsg ? ' &mdash; ' + escapeHtml(graphMsg) : ''}.`;
    }
  }

  if (action === 'revoke') {
    const r = await graphFetch(c, session, `/users/${encodeURIComponent(userId)}/revokeSignInSessions`, {
      method: 'POST',
    });
    if (r.ok) {
      flash = 'All active sessions revoked &mdash; the user has been signed out everywhere.';
    } else {
      console.error('Graph revokeSignInSessions failed:', r.status, JSON.stringify(r.body));
      flasherr = `Failed to revoke sessions (Graph returned status ${r.status}).`;
    }
  }

  if (action === 'delete') {
    const r = await graphFetch(c, session, `/users/${encodeURIComponent(userId)}`, { method: 'DELETE' });
    if (r.ok) {
      flash = 'User deleted. It can be restored from Deleted Users within 30 days.';
    } else {
      console.error('Graph user delete failed:', r.status, JSON.stringify(r.body));
      flasherr = `Failed to delete user (Graph returned status ${r.status}).`;
    }
  }

  if (action === 'addgroup' || action === 'removegroup') {
    const r =
      action === 'addgroup'
        ? await graphFetch(c, session, `/groups/${encodeURIComponent(groupId)}/members/$ref`, {
            method: 'POST',
            body: JSON.stringify({ '@odata.id': `https://graph.microsoft.com/v1.0/directoryObjects/${userId}` }),
          })
        : await graphFetch(c, session, `/groups/${encodeURIComponent(groupId)}/members/${encodeURIComponent(userId)}/$ref`, {
            method: 'DELETE',
          });
    if (r.ok) {
      flash = action === 'addgroup' ? 'Added to group.' : 'Removed from group.';
    } else {
      console.error(`Graph ${action} failed:`, r.status, JSON.stringify(r.body));
      flasherr = `Failed to update group membership (Graph returned status ${r.status}).`;
    }
  }

  if (action === 'restore') {
    const r = await graphFetch(c, session, `/directory/deletedItems/${encodeURIComponent(userId)}/restore`, {
      method: 'POST',
    });
    if (r.ok) {
      return c.redirect(`/admin/deleted-users?flash=${encodeURIComponent('User restored successfully.')}`);
    }
    console.error('Graph restore failed:', r.status, JSON.stringify(r.body));
    return c.redirect(`/admin/deleted-users?flasherr=${encodeURIComponent('Failed to restore user (status ' + r.status + ').')}`);
  }

  const params = new URLSearchParams({ q });
  if (flash) params.set('flash', flash);
  if (flasherr) params.set('flasherr', flasherr);
  return c.redirect(`/admin?${params.toString()}`);
});

// Bulk enable / disable / reset. Takes a JSON body of userIds and runs
// the same Graph call as the single-user action for each one, in
// parallel. Returns a per-user result so the frontend can show exactly
// which succeeded, which failed, and (for resets) each generated
// password - since a bulk reset issues a different password per user,
// there's no single value to show, unlike the single-user flash banner.
app.post('/admin/bulk-action', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) {
    return c.json({ error: 'unauthorized' }, 401);
  }

  let payload;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const userIds = Array.isArray(payload.userIds) ? payload.userIds.slice(0, 50) : [];
  const action = payload.action;
  if (!userIds.length || !['enable', 'disable', 'reset'].includes(action)) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const results = await Promise.all(
    userIds.map(async (userId) => {
      if (action === 'reset') {
        const tempPassword = generateTempPassword();
        const r = await graphFetch(c, session, `/users/${encodeURIComponent(userId)}`, {
          method: 'PATCH',
          body: JSON.stringify({
            passwordProfile: { forceChangePasswordNextSignIn: true, password: tempPassword },
          }),
        });
        if (!r.ok) console.error('Bulk reset failed for', userId, r.status, JSON.stringify(r.body));
        return {
          userId,
          ok: r.ok,
          password: r.ok ? tempPassword : undefined,
          error: r.ok ? undefined : (r.body && r.body.error ? r.body.error.code : `status ${r.status}`),
        };
      }

      const r = await graphFetch(c, session, `/users/${encodeURIComponent(userId)}`, {
        method: 'PATCH',
        body: JSON.stringify({ accountEnabled: action === 'enable' }),
      });
      if (!r.ok) console.error('Bulk', action, 'failed for', userId, r.status, JSON.stringify(r.body));
      return {
        userId,
        ok: r.ok,
        error: r.ok ? undefined : (r.body && r.body.error ? r.body.error.code : `status ${r.status}`),
      };
    })
  );

  return c.json({ results });
});

// Small date formatter shared across admin pages - avoids relying on
// locale/ICU behavior differing across runtimes, just trims the ISO
// timestamp Graph returns down to something readable.
function fmtDate(iso) {
  if (!iso) return '&mdash;';
  return iso.replace('T', ' ').slice(0, 16) + ' UTC';
}

// Shared tab bar for every /admin/* page, so adding a new tab only
// means editing this list once instead of five near-duplicate blocks.
function adminTabs(active) {
  const tabs = [
    ['Users', '/admin', 'users'],
    ['Devices', '/admin/devices', 'devices'],
    ['Groups', '/admin/groups', 'groups'],
    ['Audit Log', '/admin/audit', 'audit'],
    ['Licenses', '/admin/licenses', 'licenses'],
  ];
  return `<div class="admin-tabs">${tabs
    .map(([label, href, key]) => `<a href="${href}" class="admin-tab${key === active ? ' active' : ''}">${label}</a>`)
    .join('')}</div>`;
}

// Shared "not signed in" / "not authorised" gate for every /admin/* page.
// Returns a Response to send back immediately, or null if the session is
// fine and the caller should keep rendering its own page.
function adminGate(c, session, pageTitle) {
  const error = c.req.query('error');
  if (!session) {
    const body = `
<div class="login-page">
<div class="login-box">
<div class="lock-icon">&#x1F510;</div>
<h2>Authorised Access Only</h2>
<p>This portal is restricted to TMTCo administrators.<br>Sign in with your organisational account to continue.</p>
<a href="/auth/login?next=/admin" class="ms-login-btn">${MS_LOGO}Sign in with Microsoft</a>
${verifiedIdLoginMarkup('/admin')}
${error ? `<div class="error-box">Sign-in failed or access denied. Contact logan.kelly@tmtcoau.com for help.</div>` : ''}
<p class="login-note">&#x1F512; Secured via Microsoft Entra ID &middot; TMTCo internal use only</p>
</div>
</div>`;
    return shell('Sign In', body, 'admin');
  }
  if (!isPortalAdmin(session)) {
    const body = `
<div class="page-section top">
<div class="placeholder-box">
<div class="big-icon">&#x26D4;</div>
<h3>Not Authorised</h3>
<p>Your account is signed in but doesn't hold the admin role required for this panel.</p>
${session && session.auth_method === 'verified_id' ? '<p>Verified ID proves your verified employee identity, but this admin panel also requires the Microsoft sign-in session because its actions use your delegated Microsoft Graph permissions.</p>' : ''}
</div>
</div>`;
    return shell(pageTitle, body, 'admin');
  }
  return null;
}

// ============================================================
// ROUTES - ADMIN / DELETED USERS
// Recently soft-deleted user accounts, recoverable within Entra ID's
// 30-day window. Restoring uses the same /admin/action route with
// action=restore (see that handler for the redirect-target branching).
// ============================================================
app.get('/admin/deleted-users', async (c) => {
  const session = await getSession(c);
  const gate = adminGate(c, session, 'Deleted Users');
  if (gate) return gate;

  const flashMsg = c.req.query('flash') || '';
  const flashErr = c.req.query('flasherr') || '';

  const r = await graphFetch(
    c,
    session,
    `/directory/deletedItems/microsoft.graph.user?$select=id,displayName,userPrincipalName,deletedDateTime&$top=100`
  );

  let items = [];
  let loadFailed = false;
  if (r.ok && r.body) {
    items = r.body.value || [];
  } else {
    loadFailed = true;
    console.error('Graph deleted users list failed:', r.status, JSON.stringify(r.body));
  }

  const rows = items.map((u) => `
<div class="user-row">
  <div>
    <div class="user-row-name">${escapeHtml(u.displayName || '(no name)')}</div>
    <div class="user-row-email">${escapeHtml(u.userPrincipalName || '')} &middot; deleted ${fmtDate(u.deletedDateTime)}</div>
  </div>
  <div class="user-row-actions">
    <form method="POST" action="/admin/action" onsubmit="return confirm('Restore ${escapeHtml((u.displayName || u.userPrincipalName || '').replace(/'/g, "\\'"))}?');">
      <input type="hidden" name="userId" value="${escapeHtml(u.id)}">
      <input type="hidden" name="action" value="restore">
      <button type="submit" class="btn btn-ghost">Restore</button>
    </form>
  </div>
</div>`).join('');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Deleted Users</h2>
<p class="section-sub">Soft-deleted accounts, recoverable within Entra ID's 30-day retention window.</p>
</div>

${adminTabs('users')}

${flashMsg ? `<div class="flash-banner">${flashMsg}</div>` : ''}
${flashErr ? `<div class="flash-banner err">${flashErr}</div>` : ''}
${loadFailed ? `<p class="no-results">Couldn't load deleted users. Check the Worker logs for the full Graph error.</p>` : ''}
${!loadFailed && items.length === 0 ? `<p class="no-results">No deleted users found.</p>` : ''}
${rows}

<div class="back-row"><a href="/admin" class="btn btn-ghost">&larr; Back to Users</a></div>
</div>`;
  return shell('Deleted Users', body, 'admin');
});

// ============================================================
// ROUTES - ADMIN / CREATE USER
// ============================================================
app.get('/admin/users/new', async (c) => {
  const session = await getSession(c);
  const gate = adminGate(c, session, 'Create User');
  if (gate) return gate;

  const formErr = c.req.query('err') || '';

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Create User</h2>
<p class="section-sub">Creates a new Entra ID account. A temporary password is generated and shown once after creation, unless you set one below.</p>
</div>

${adminTabs('users')}

${formErr ? `<div class="flash-banner err">${escapeHtml(formErr)}</div>` : ''}

<div class="form-box">
<form method="POST" action="/admin/users/new">
<label for="displayNameInput">Display name</label>
<input type="text" id="displayNameInput" name="displayName" required placeholder="Jane Smith">

<label for="upnInput">User principal name (email)</label>
<input type="text" id="upnInput" name="userPrincipalName" required placeholder="jane.smith@tmtcoau.com">

<label for="passwordInput">Initial password</label>
<input type="text" id="passwordInput" name="password" placeholder="Leave blank to auto-generate" autocomplete="off" spellcheck="false">
<p class="form-hint">Minimum 8 characters if set. Leave blank to auto-generate one.</p>

<label for="jobTitleInput">Job title (optional)</label>
<input type="text" id="jobTitleInput" name="jobTitle">

<label for="departmentInput">Department (optional)</label>
<input type="text" id="departmentInput" name="department">

<div class="form-actions">
<button type="submit" class="btn btn-primary">Create user</button>
<a href="/admin" class="btn btn-ghost">Cancel</a>
</div>
</form>
</div>

<div class="back-row"><a href="/admin" class="btn btn-ghost">&larr; Back to Users</a></div>
</div>`;
  return shell('Create User', body, 'admin');
});

app.post('/admin/users/new', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) return c.redirect('/admin?error=1');

  const form = await c.req.parseBody();
  const displayName = typeof form.displayName === 'string' ? form.displayName.trim() : '';
  const upn = typeof form.userPrincipalName === 'string' ? form.userPrincipalName.trim() : '';
  const customPassword = typeof form.password === 'string' ? form.password.trim() : '';
  const jobTitle = typeof form.jobTitle === 'string' ? form.jobTitle.trim() : '';
  const department = typeof form.department === 'string' ? form.department.trim() : '';

  if (!displayName || !upn || !upn.includes('@')) {
    return c.redirect(`/admin/users/new?err=${encodeURIComponent('Display name and a valid user principal name are required.')}`);
  }
  if (customPassword && customPassword.length < 8) {
    return c.redirect(`/admin/users/new?err=${encodeURIComponent('Password must be at least 8 characters.')}`);
  }

  const passwordToSet = customPassword || generateTempPassword();
  // mailNickname is required by Graph and must be unique-ish/simple -
  // derive it from the UPN's local part, stripped to safe characters.
  const mailNickname = upn.split('@')[0].replace(/[^a-zA-Z0-9._-]/g, '').slice(0, 64) || 'user';

  const body = {
    accountEnabled: true,
    displayName,
    userPrincipalName: upn,
    mailNickname,
    passwordProfile: { forceChangePasswordNextSignIn: true, password: passwordToSet },
  };
  if (jobTitle) body.jobTitle = jobTitle;
  if (department) body.department = department;

  const r = await graphFetch(c, session, `/users`, { method: 'POST', body: JSON.stringify(body) });

  if (!r.ok) {
    console.error('Graph create user failed:', r.status, JSON.stringify(r.body));
    const graphMsg = r.body && r.body.error ? r.body.error.message : null;
    return c.redirect(`/admin/users/new?err=${encodeURIComponent('Failed to create user' + (graphMsg ? ': ' + graphMsg : '.'))}`);
  }

  const flash = customPassword
    ? `User created successfully.`
    : `User created. Temporary password (share securely &mdash; shown once only): <strong>${escapeHtml(passwordToSet)}</strong>`;
  return c.redirect(`/admin?flash=${encodeURIComponent(flash)}`);
});

// ============================================================
// ROUTES - ADMIN / DEVICES (Intune managed devices)
// Same auth + PortalAdmin role gate as the Users tab. Requires the
// DeviceManagementManagedDevices.Read.All delegated permission (see
// GRAPH_SCOPES) to be added + admin-consented in the app registration.
// ============================================================
app.get('/admin/devices', async (c) => {
  const session = await getSession(c);
  const error = c.req.query('error');

  if (!session) {
    const body = `
<div class="login-page">
<div class="login-box">
<div class="lock-icon">&#x1F510;</div>
<h2>Authorised Access Only</h2>
<p>This portal is restricted to TMTCo administrators.<br>Sign in with your organisational account to continue.</p>
<a href="/auth/login?next=/admin" class="ms-login-btn">${MS_LOGO}Sign in with Microsoft</a>
${verifiedIdLoginMarkup('/admin')}
${error ? `<div class="error-box">Sign-in failed or access denied. Contact logan.kelly@tmtcoau.com for help.</div>` : ''}
<p class="login-note">&#x1F512; Secured via Microsoft Entra ID &middot; TMTCo internal use only</p>
</div>
</div>`;
    return shell('Sign In', body, 'admin');
  }

  if (!isPortalAdmin(session)) {
    const body = `
<div class="page-section top">
<div class="placeholder-box">
<div class="big-icon">&#x26D4;</div>
<h3>Not Authorised</h3>
<p>Your account is signed in but doesn't hold the admin role required for this panel.</p>
${session && session.auth_method === 'verified_id' ? '<p>Verified ID proves your verified employee identity, but this admin panel also requires the Microsoft sign-in session because its actions use your delegated Microsoft Graph permissions.</p>' : ''}
</div>
</div>`;
    return shell('Devices', body, 'admin');
  }

  const r = await graphFetch(
    c,
    session,
    `/deviceManagement/managedDevices?$select=id,deviceName,operatingSystem,osVersion,complianceState,lastSyncDateTime,userDisplayName,userPrincipalName,manufacturer,model&$top=200`
  );

  let devices = [];
  let loadFailed = false;
  if (r.ok && r.body) {
    devices = (r.body.value || []).sort((a, b) => (a.deviceName || '').localeCompare(b.deviceName || ''));
  } else {
    loadFailed = true;
    console.error('Graph device list failed:', r.status, JSON.stringify(r.body));
  }

  const complianceClass = (state) => {
    if (state === 'compliant') return 'compliant';
    if (state === 'noncompliant') return 'noncompliant';
    return 'other';
  };

  const deviceRows = devices.map((d) => `
<tr>
  <td>${escapeHtml(d.deviceName || '(unnamed)')}</td>
  <td>${escapeHtml([d.operatingSystem, d.osVersion].filter(Boolean).join(' '))}</td>
  <td><span class="compliance-pill ${complianceClass(d.complianceState)}">${escapeHtml(d.complianceState || 'unknown')}</span></td>
  <td>${fmtDate(d.lastSyncDateTime)}</td>
  <td>${escapeHtml(d.userDisplayName || d.userPrincipalName || '&mdash;')}</td>
  <td>${escapeHtml([d.manufacturer, d.model].filter(Boolean).join(' ') || '&mdash;')}</td>
  <td>
    <div class="device-actions-cell">
      <button type="button" class="btn btn-ghost device-sync-btn" data-deviceid="${escapeHtml(d.id)}" data-devicename="${escapeHtml(d.deviceName || '')}">Sync</button>
      <button type="button" class="btn btn-ghost device-retire-btn" data-deviceid="${escapeHtml(d.id)}" data-devicename="${escapeHtml(d.deviceName || '')}">Retire</button>
      <button type="button" class="btn btn-danger device-wipe-btn" data-deviceid="${escapeHtml(d.id)}" data-devicename="${escapeHtml(d.deviceName || '')}">Wipe</button>
    </div>
  </td>
</tr>`).join('');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph &middot; Intune</div>
<h2 class="section-title">Devices</h2>
<p class="section-sub">Intune-managed devices in the directory, with compliance state and last check-in.</p>
</div>

<div class="admin-tabs">
<a href="/admin" class="admin-tab">Users</a>
<a href="/admin/devices" class="admin-tab active">Devices</a>
<a href="/admin/groups" class="admin-tab">Groups</a>
<a href="/admin/audit" class="admin-tab">Audit Log</a>
<a href="/admin/licenses" class="admin-tab">Licenses</a>
</div>

${loadFailed ? `<p class="no-results">Couldn't load devices &mdash; you may be missing the DeviceManagementManagedDevices.Read.All permission, or this tenant may not have Intune licensed. Check the Worker logs for the full Graph error.</p>` : ''}
${!loadFailed && devices.length === 0 ? `<p class="no-results">No managed devices found.</p>` : ''}

${devices.length > 0 ? `
<div class="device-table-wrap">
<table class="device-table">
<thead><tr>
<th>Device</th><th>OS</th><th>Compliance</th><th>Last check-in</th><th>Primary user</th><th>Model</th><th>Actions</th>
</tr></thead>
<tbody>${deviceRows}</tbody>
</table>
</div>` : ''}

<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>

<script>
(function(){
  var statusMsg = null;

  function showAlert(msg) { alert(msg); }

  function runDeviceAction(deviceId, deviceName, action, extra) {
    var payload = Object.assign({ deviceId: deviceId, action: action }, extra || {});
    return fetch('/admin/devices/action', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(function(res){ return res.json(); })
      .then(function(data){
        if (data.error) {
          showAlert('Failed: ' + data.error);
          return;
        }
        showAlert(deviceName + ': ' + action + ' completed.');
        if (action === 'retire' || action === 'wipe') location.reload();
      })
      .catch(function(){ showAlert('Request failed \\u2014 please try again.'); });
  }

  document.addEventListener('click', function(e){
    var syncBtn = e.target.closest('.device-sync-btn');
    if (syncBtn) {
      var dn = syncBtn.getAttribute('data-devicename');
      if (confirm('Trigger an Intune check-in sync for ' + dn + '?')) {
        runDeviceAction(syncBtn.getAttribute('data-deviceid'), dn, 'sync');
      }
      return;
    }

    var retireBtn = e.target.closest('.device-retire-btn');
    if (retireBtn) {
      var rn = retireBtn.getAttribute('data-devicename');
      if (confirm('Retire ' + rn + '? This removes company data and management from the device. This cannot be undone.')) {
        runDeviceAction(retireBtn.getAttribute('data-deviceid'), rn, 'retire');
      }
      return;
    }

    var wipeBtn = e.target.closest('.device-wipe-btn');
    if (wipeBtn) {
      var wn = wipeBtn.getAttribute('data-devicename');
      var typed = prompt('This will FACTORY RESET "' + wn + '" and erase all data on it. This cannot be undone.\\n\\nType the device name exactly to confirm:');
      if (typed === null) return;
      if (typed !== wn) {
        showAlert('Device name did not match \\u2014 wipe cancelled.');
        return;
      }
      runDeviceAction(wipeBtn.getAttribute('data-deviceid'), wn, 'wipe', { confirmName: typed });
    }
  });
})();
</script>`;
  return shell('Devices', body, 'admin');
});

// Sync / retire / wipe a single Intune device. Wipe requires the caller
// to re-send the device's exact name as confirmName - re-verified against
// Graph server-side (not just trusted from the client prompt) before the
// wipe call is made, since this is the single most destructive action
// exposed anywhere in this panel.
app.post('/admin/devices/action', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) {
    return c.json({ error: 'unauthorized' }, 401);
  }

  let payload;
  try {
    payload = await c.req.json();
  } catch {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const deviceId = payload.deviceId;
  const action = payload.action;
  if (!deviceId || !['sync', 'retire', 'wipe'].includes(action)) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  if (action === 'wipe') {
    const confirmName = typeof payload.confirmName === 'string' ? payload.confirmName : '';
    const deviceRes = await graphFetch(c, session, `/deviceManagement/managedDevices/${encodeURIComponent(deviceId)}?$select=deviceName`);
    if (!deviceRes.ok || !deviceRes.body) {
      console.error('Device lookup before wipe failed:', deviceRes.status, JSON.stringify(deviceRes.body));
      return c.json({ error: 'Could not verify device before wiping.' }, 502);
    }
    if (deviceRes.body.deviceName !== confirmName) {
      return c.json({ error: 'Device name confirmation did not match.' }, 400);
    }
  }

  const endpointByAction = {
    sync: `/deviceManagement/managedDevices/${encodeURIComponent(deviceId)}/syncDevice`,
    retire: `/deviceManagement/managedDevices/${encodeURIComponent(deviceId)}/retire`,
    wipe: `/deviceManagement/managedDevices/${encodeURIComponent(deviceId)}/wipe`,
  };

  const r = await graphFetch(c, session, endpointByAction[action], {
    method: 'POST',
    body: action === 'wipe' ? JSON.stringify({}) : undefined,
  });

  if (!r.ok) {
    console.error(`Graph device ${action} failed:`, r.status, JSON.stringify(r.body));
    return c.json({ error: `Graph returned status ${r.status}` }, 502);
  }

  return c.json({ ok: true });
});

// ============================================================
// ROUTES - ADMIN / GROUPS
// Lists directory groups and lets an admin send an email to any
// mail-enabled group's address. Requires Group.Read.All (list) and
// Mail.Send (compose/send) delegated permissions - see GRAPH_SCOPES.
// ============================================================
app.get('/admin/groups', async (c) => {
  const session = await getSession(c);
  const error = c.req.query('error');
  const sent = c.req.query('sent');

  if (!session) {
    const body = `
<div class="login-page">
<div class="login-box">
<div class="lock-icon">&#x1F510;</div>
<h2>Authorised Access Only</h2>
<p>This portal is restricted to TMTCo administrators.<br>Sign in with your organisational account to continue.</p>
<a href="/auth/login?next=/admin" class="ms-login-btn">${MS_LOGO}Sign in with Microsoft</a>
${verifiedIdLoginMarkup('/admin')}
${error ? `<div class="error-box">Sign-in failed or access denied. Contact logan.kelly@tmtcoau.com for help.</div>` : ''}
<p class="login-note">&#x1F512; Secured via Microsoft Entra ID &middot; TMTCo internal use only</p>
</div>
</div>`;
    return shell('Sign In', body, 'admin');
  }

  if (!isPortalAdmin(session)) {
    const body = `
<div class="page-section top">
<div class="placeholder-box">
<div class="big-icon">&#x26D4;</div>
<h3>Not Authorised</h3>
<p>Your account is signed in but doesn't hold the admin role required for this panel.</p>
${session && session.auth_method === 'verified_id' ? '<p>Verified ID proves your verified employee identity, but this admin panel also requires the Microsoft sign-in session because its actions use your delegated Microsoft Graph permissions.</p>' : ''}
</div>
</div>`;
    return shell('Groups', body, 'admin');
  }

  const r = await graphFetch(
    c,
    session,
    `/groups?$select=id,displayName,mail,mailEnabled,securityEnabled,groupTypes&$top=200`
  );

  let groups = [];
  let loadFailed = false;
  if (r.ok && r.body) {
    groups = (r.body.value || []).sort((a, b) => (a.displayName || '').localeCompare(b.displayName || ''));
  } else {
    loadFailed = true;
    console.error('Graph group list failed:', r.status, JSON.stringify(r.body));
  }

  const typeLabel = (g) => {
    if (Array.isArray(g.groupTypes) && g.groupTypes.includes('Unified')) return 'Microsoft 365';
    if (g.mailEnabled && g.securityEnabled) return 'Mail-enabled security';
    if (g.mailEnabled) return 'Distribution';
    if (g.securityEnabled) return 'Security';
    return 'Group';
  };

  const groupRows = groups.map((g) => `
<div class="group-row">
  <div>
    <div class="group-row-name">${escapeHtml(g.displayName || '(unnamed)')}<span class="group-type-pill">${escapeHtml(typeLabel(g))}</span></div>
    <div class="group-row-meta">${g.mail ? escapeHtml(g.mail) : 'No email address (security group only)'}</div>
  </div>
  ${g.mail ? `<a href="/admin/groups/email?groupId=${encodeURIComponent(g.id)}&groupName=${encodeURIComponent(g.displayName || '')}&groupMail=${encodeURIComponent(g.mail)}" class="btn btn-ghost">Email group</a>` : ''}
</div>`).join('');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Groups</h2>
<p class="section-sub">All directory groups. Mail-enabled groups can be emailed directly from here &mdash; sent from your own signed-in account via Microsoft Graph.</p>
</div>

<div class="admin-tabs">
<a href="/admin" class="admin-tab">Users</a>
<a href="/admin/devices" class="admin-tab">Devices</a>
<a href="/admin/groups" class="admin-tab active">Groups</a>
<a href="/admin/audit" class="admin-tab">Audit Log</a>
<a href="/admin/licenses" class="admin-tab">Licenses</a>
</div>

${sent ? `<div class="flash-banner">Email sent successfully.</div>` : ''}
${loadFailed ? `<p class="no-results">Couldn't load groups &mdash; you may be missing the Group.Read.All permission. Check the Worker logs for the full Graph error.</p>` : ''}
${!loadFailed && groups.length === 0 ? `<p class="no-results">No groups found.</p>` : ''}

${groupRows}

<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Groups', body, 'admin');
});

// Compose form for emailing a specific group. groupId/groupName/groupMail
// are passed through as query params from the Groups list - re-validated
// against Graph before sending (see POST handler below) so a tampered
// groupMail value can't be used to send somewhere unintended.
app.get('/admin/groups/email', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) return c.redirect('/admin/groups?error=1');

  const groupId = c.req.query('groupId') || '';
  const groupName = c.req.query('groupName') || '';
  const groupMail = c.req.query('groupMail') || '';
  const sendError = c.req.query('senderr') || '';

  if (!groupId || !groupMail) return c.redirect('/admin/groups');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Email ${escapeHtml(groupName || 'group')}</h2>
<p class="section-sub">Sending to <strong>${escapeHtml(groupMail)}</strong>, from your own account (${escapeHtml(session.email)}) via Microsoft Graph.</p>
</div>

${sendError ? `<div class="flash-banner err">${escapeHtml(sendError)}</div>` : ''}

<div class="compose-box">
<form method="POST" action="/admin/groups/email/send">
<input type="hidden" name="groupId" value="${escapeHtml(groupId)}">
<input type="hidden" name="groupMail" value="${escapeHtml(groupMail)}">
<label for="subjectInput">Subject</label>
<input type="text" id="subjectInput" name="subject" required>
<label for="bodyInput">Message</label>
<textarea id="bodyInput" name="body" required placeholder="Write your message&hellip;"></textarea>
<div class="compose-actions">
<button type="submit" class="btn btn-primary">Send email</button>
<a href="/admin/groups" class="btn btn-ghost">Cancel</a>
</div>
</form>
</div>

<div class="back-row"><a href="/admin/groups" class="btn btn-ghost">&larr; Back to Groups</a></div>
</div>`;
  return shell('Email Group', body, 'admin');
});

app.post('/admin/groups/email/send', async (c) => {
  const session = await getSession(c);
  if (!session || !isPortalAdmin(session)) return c.redirect('/admin/groups?error=1');

  const form = await c.req.parseBody();
  const groupId = form.groupId;
  const subject = typeof form.subject === 'string' ? form.subject.trim() : '';
  const messageBody = typeof form.body === 'string' ? form.body.trim() : '';

  if (!groupId || !subject || !messageBody) {
    return c.redirect('/admin/groups');
  }

  // Re-fetch the group's mail address from Graph rather than trusting the
  // groupMail form field - closes off any tampering with the hidden field
  // before we actually send anything.
  const groupRes = await graphFetch(c, session, `/groups/${encodeURIComponent(groupId)}?$select=mail,displayName`);
  if (!groupRes.ok || !groupRes.body || !groupRes.body.mail) {
    console.error('Group lookup before send failed:', groupRes.status, JSON.stringify(groupRes.body));
    return c.redirect(`/admin/groups/email?groupId=${encodeURIComponent(groupId)}&senderr=${encodeURIComponent("Couldn't verify the group's email address. Try again.")}`);
  }

  // /me has no meaning for an app-only token (Scenario C / Verified ID
  // sessions) - there's no signed-in user context on a client-credentials
  // token at all. Application-permission Mail.Send instead lets you send
  // as any specific mailbox by sending to /users/{mailbox}/sendMail, so
  // VC sessions send from their own verified email address explicitly.
  const sendMailPath =
    session.auth_method === 'verified_id'
      ? `/users/${encodeURIComponent(session.email)}/sendMail`
      : `/me/sendMail`;

  const r = await graphFetch(c, session, sendMailPath, {
    method: 'POST',
    body: JSON.stringify({
      message: {
        subject,
        body: { contentType: 'Text', content: messageBody },
        toRecipients: [{ emailAddress: { address: groupRes.body.mail } }],
      },
      saveToSentItems: true,
    }),
  });

  if (!r.ok) {
    console.error('Graph sendMail failed:', r.status, JSON.stringify(r.body));
    const graphMsg = r.body && r.body.error ? r.body.error.message : null;
    return c.redirect(`/admin/groups/email?groupId=${encodeURIComponent(groupId)}&groupName=${encodeURIComponent(groupRes.body.displayName || '')}&groupMail=${encodeURIComponent(groupRes.body.mail)}&senderr=${encodeURIComponent('Failed to send' + (graphMsg ? ': ' + graphMsg : '.'))}`);
  }

  return c.redirect('/admin/groups?sent=1');
});

// ============================================================
// ROUTES - ADMIN / AUDIT LOG
// Tenant-wide directory audit feed - every directory change, not just
// ones made through this panel. Requires AuditLog.Read.All (see
// GRAPH_SCOPES). No $orderby is used - directoryAudits already returns
// most-recent-first by default, and adding $orderby risks the same
// "advanced query" 400 seen earlier on /users with $filter+$orderby.
// ============================================================
app.get('/admin/audit', async (c) => {
  const session = await getSession(c);
  const gate = adminGate(c, session, 'Audit Log');
  if (gate) return gate;

  const r = await graphFetch(c, session, `/auditLogs/directoryAudits?$top=50`);

  let entries = [];
  let loadFailed = false;
  if (r.ok && r.body) {
    entries = r.body.value || [];
  } else {
    loadFailed = true;
    console.error('Graph audit log fetch failed:', r.status, JSON.stringify(r.body));
  }

  const initiatorLabel = (e) => {
    if (e.initiatedBy && e.initiatedBy.user) {
      return e.initiatedBy.user.userPrincipalName || e.initiatedBy.user.displayName || 'Unknown user';
    }
    if (e.initiatedBy && e.initiatedBy.app) {
      return (e.initiatedBy.app.displayName || 'App') + ' (app)';
    }
    return 'Unknown';
  };

  const targetLabel = (e) => {
    const t = Array.isArray(e.targetResources) && e.targetResources.length ? e.targetResources[0] : null;
    if (!t) return '&mdash;';
    return t.userPrincipalName || t.displayName || t.type || '&mdash;';
  };

  const auditRows = entries.map((e) => `
<tr>
  <td>${fmtDate(e.activityDateTime)}</td>
  <td>${escapeHtml(e.activityDisplayName || '&mdash;')}</td>
  <td>${escapeHtml(initiatorLabel(e))}</td>
  <td>${escapeHtml(targetLabel(e))}</td>
  <td><span class="result-pill ${e.result === 'success' ? 'success' : 'failure'}">${escapeHtml(e.result || 'unknown')}</span></td>
</tr>`).join('');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Audit Log</h2>
<p class="section-sub">The 50 most recent directory changes across the tenant &mdash; not limited to actions taken through this panel.</p>
</div>

${adminTabs('audit')}

${loadFailed ? `<p class="no-results">Couldn't load the audit log &mdash; you may be missing the AuditLog.Read.All permission. Check the Worker logs for the full Graph error.</p>` : ''}
${!loadFailed && entries.length === 0 ? `<p class="no-results">No recent audit entries found.</p>` : ''}

${entries.length > 0 ? `
<div class="audit-table-wrap">
<table class="audit-table">
<thead><tr><th>Time</th><th>Activity</th><th>Initiated by</th><th>Target</th><th>Result</th></tr></thead>
<tbody>${auditRows}</tbody>
</table>
</div>` : ''}

<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Audit Log', body, 'admin');
});

// ============================================================
// ROUTES - ADMIN / LICENSES
// Tenant-wide license/SKU overview: assigned vs. available seats.
// Requires Organization.Read.All (see GRAPH_SCOPES).
// ============================================================
app.get('/admin/licenses', async (c) => {
  const session = await getSession(c);
  const gate = adminGate(c, session, 'Licenses');
  if (gate) return gate;

  const r = await graphFetch(c, session, `/subscribedSkus?$select=skuPartNumber,consumedUnits,prepaidUnits`);

  let skus = [];
  let loadFailed = false;
  if (r.ok && r.body) {
    skus = (r.body.value || []).sort((a, b) => (a.skuPartNumber || '').localeCompare(b.skuPartNumber || ''));
  } else {
    loadFailed = true;
    console.error('Graph subscribedSkus fetch failed:', r.status, JSON.stringify(r.body));
  }

  const licenseRows = skus.map((s) => {
    const total = (s.prepaidUnits && s.prepaidUnits.enabled) || 0;
    const used = s.consumedUnits || 0;
    const pct = total > 0 ? Math.min(100, Math.round((used / total) * 100)) : 0;
    const highUsage = total > 0 && used >= total;
    return `
<div class="license-row">
  <div class="license-row-top">
    <span class="license-row-name">${escapeHtml(s.skuPartNumber || 'Unknown SKU')}</span>
    <span class="license-row-count">${used} / ${total} assigned</span>
  </div>
  <div class="license-bar-track"><div class="license-bar-fill${highUsage ? ' high' : ''}" style="width:${pct}%"></div></div>
</div>`;
  }).join('');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">Authorised Portal &middot; Microsoft Graph</div>
<h2 class="section-title">Licenses</h2>
<p class="section-sub">Assigned vs. available seats for every subscribed SKU in the tenant.</p>
</div>

${adminTabs('licenses')}

${loadFailed ? `<p class="no-results">Couldn't load licenses &mdash; you may be missing the Organization.Read.All permission. Check the Worker logs for the full Graph error.</p>` : ''}
${!loadFailed && skus.length === 0 ? `<p class="no-results">No subscribed licenses found.</p>` : ''}

${licenseRows}

<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Licenses', body, 'admin');
});

// ============================================================
// ROUTES - DASHBOARD (auth protected - same login flow as /admin)
// Quick access to Microsoft 365 apps, plus an Admin Centre section at
// the bottom linking to the Microsoft admin portals. Access to each
// admin portal is still gated by the signed-in user's actual admin
// role assignments in Entra ID - these are just direct links, not a
// bypass of that role check.
// ============================================================
const DASH_SUBNAV = [
  { key: 'm365', label: 'Microsoft 365', href: '/dashboard' },
  { key: 'spotify', label: 'Spotify', href: '/dashboard/spotify' },
  { key: 'admin', label: 'Admin Links', href: '/dashboard/admin-links', adminOnly: true },
];

function dashSubNav(active, isAdmin) {
  const items = DASH_SUBNAV.filter((i) => !i.adminOnly || isAdmin);
  return `<div class="sub-nav" role="navigation" aria-label="Dashboard sections">${items.map((i) =>
    `<a href="${i.href}" class="sub-nav-link${i.key === active ? ' active' : ''}">${i.label}</a>`
  ).join('')}</div>`;
}

// Shown to any signed-in account that does not hold the Global Administrator role
function dashboardNotAuthorised(session) {
  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>
<div class="placeholder-box">
<div class="big-icon">&#x26D4;</div>
<h3>Not Authorised</h3>
<p>The dashboard is restricted to accounts holding the Global Administrator role. Contact <a href="mailto:logan.kelly@tmtcoau.com">logan.kelly@tmtcoau.com</a> if you believe this is a mistake.</p>
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Not Authorised', body, 'dashboard');
}

app.get('/dashboard', async (c) => {
  const session = await getSession(c);

  if (session) {
    const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">TMTCo</div>
<h2 class="section-title">Dashboard</h2>
<p class="section-sub">Quick access to your Microsoft 365 apps and files.</p>
</div>
${dashSubNav('m365', isPortalAdmin(session))}
<div class="cards">
<a href="https://outlook.office.com/mail/" target="_blank" class="card">
<div class="card-icon">&#x1F4E7;</div>
<h3>Outlook</h3>
<p>Check email, calendar, and contacts.</p>
<span class="card-link">Open Outlook &rarr;</span>
</a>
<a href="https://tmtcoau-my.sharepoint.com" target="_blank" class="card">
<div class="card-icon">&#x1F4C1;</div>
<h3>OneDrive</h3>
<p>Access your TMTCo OneDrive files and folders.</p>
<span class="card-link">Open OneDrive &rarr;</span>
</a>
<a href="https://www.office.com/launch/word" target="_blank" class="card">
<div class="card-icon">&#x1F4DD;</div>
<h3>Word</h3>
<p>Create and edit documents online.</p>
<span class="card-link">Open Word &rarr;</span>
</a>
<a href="https://www.office.com/launch/excel" target="_blank" class="card">
<div class="card-icon">&#x1F4CA;</div>
<h3>Excel</h3>
<p>Create and edit spreadsheets online.</p>
<span class="card-link">Open Excel &rarr;</span>
</a>
<a href="https://www.office.com/launch/powerpoint" target="_blank" class="card">
<div class="card-icon">&#x1F4FD;&#xFE0F;</div>
<h3>PowerPoint</h3>
<p>Create and edit presentations online.</p>
<span class="card-link">Open PowerPoint &rarr;</span>
</a>
<a href="https://teams.microsoft.com" target="_blank" class="card">
<div class="card-icon">&#x1F4AC;</div>
<h3>Teams</h3>
<p>Chat, meet, and collaborate with the team.</p>
<span class="card-link">Open Teams &rarr;</span>
</a>
<a href="https://tmtcoau.sharepoint.com" target="_blank" class="card">
<div class="card-icon">&#x1F5C2;&#xFE0F;</div>
<h3>SharePoint</h3>
<p>Browse TMTCo team sites and shared document libraries.</p>
<span class="card-link">Open SharePoint &rarr;</span>
</a>
<a href="https://www.office.com" target="_blank" class="card">
<div class="card-icon">&#x1F5C3;&#xFE0F;</div>
<h3>All Apps</h3>
<p>Browse the full Microsoft 365 app launcher.</p>
<span class="card-link">Open Microsoft 365 &rarr;</span>
</a>
<a href="/verifiedid" class="card">
<div class="card-icon">&#x1F6C2;</div>
<h3>Verified ID</h3>
<p>Get your TMTCo Verified Employee credential in Microsoft Authenticator.</p>
<span class="card-link">Get my Verified ID &rarr;</span>
</a>
</div>

<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
    return shell('Dashboard', body, 'dashboard');
  }

  // Not authenticated - show login wall (same flow as /admin)
  const error = c.req.query('error');
  const body = `
<div class="login-page">
<div class="login-box">
<div class="lock-icon">&#x1F510;</div>
<h2>Authorised Access Only</h2>
<p>Sign in with your TMTCo Microsoft account to access your dashboard.</p>
<a href="/auth/login?next=/dashboard" class="ms-login-btn">
${MS_LOGO}
Sign in with Microsoft
</a>
${verifiedIdLoginMarkup('/dashboard')}
${error ? `<div class="error-box">Sign-in failed or access denied. Contact logan.kelly@tmtcoau.com for help.</div>` : ''}
<p class="login-note">&#x1F512; Secured via Microsoft Entra ID &middot; TMTCo internal use only</p>
</div>
</div>`;
  return shell('Sign In', body, 'dashboard');
});

// ============================================================
// ROUTES - DASHBOARD / ADMIN LINKS (Global Administrator only)
// ============================================================
app.get('/dashboard/admin-links', async (c) => {
  const session = await getSession(c);
  if (!session) return c.redirect('/dashboard');
  if (!isPortalAdmin(session)) return dashboardNotAuthorised(session);

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">TMTCo</div>
<h2 class="section-title">Dashboard</h2>
<p class="section-sub">Admin links for Global Administrators.</p>
</div>
${dashSubNav('admin', true)}
<div class="admin-section">
<div class="admin-header">
<span class="admin-icon">&#x1F6E1;&#xFE0F;</span>
<div>
<h3>Admin Centre</h3>
<p>Direct links to Microsoft's admin portals. Access to each one still depends on your account's assigned admin role in Entra ID.</p>
</div>
</div>
<div class="admin-links">
<a href="https://admin.microsoft.com" target="_blank" class="admin-link">Microsoft 365 admin center</a>
<a href="https://entra.microsoft.com" target="_blank" class="admin-link">Entra admin center</a>
<a href="https://admin.exchange.microsoft.com" target="_blank" class="admin-link">Exchange admin center</a>
<a href="https://tmtcoau-admin.sharepoint.com" target="_blank" class="admin-link">SharePoint admin center</a>
<a href="https://admin.teams.microsoft.com" target="_blank" class="admin-link">Teams admin center</a>
<a href="https://security.microsoft.com" target="_blank" class="admin-link">Security admin center</a>
<a href="https://compliance.microsoft.com" target="_blank" class="admin-link">Purview compliance portal</a>
<a href="https://intune.microsoft.com" target="_blank" class="admin-link">Intune admin center</a>
<a href="https://portal.azure.com" target="_blank" class="admin-link">Azure portal</a>
<a href="https://admin.powerplatform.microsoft.com" target="_blank" class="admin-link">Power Platform admin center</a>
</div>
</div>
<div class="back-row"><a href="/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a></div>
</div>`;
  return shell('Admin Links', body, 'dashboard');
});

// ============================================================
// ROUTES - DASHBOARD / SPOTIFY
// ============================================================
app.get('/dashboard/spotify', async (c) => {
  const session = await getSession(c);
  if (!session) return c.redirect('/dashboard');

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">TMTCo</div>
<h2 class="section-title">Dashboard</h2>
<p class="section-sub">Media links for TMTCo.</p>
</div>
${dashSubNav('spotify', isPortalAdmin(session))}
<div class="cards">
<a href="https://www.tmtcoau.com/spo" target="_blank" class="card">
<div class="card-icon">&#127925;</div>
<h3>Spotify</h3>
<p>Access the TMTCo Spotify page.</p>
<span class="card-link">Open Spotify &rarr;</span>
</a>
</div>
<div class="back-row"><a href="/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a></div>
</div>`;
  return shell('Spotify', body, 'dashboard');
});

// ============================================================
// ROUTES - VERIFIED ID
// ------------------------------------------------------------
// There are two distinct Verified ID flows:
//   1) /verifiedid/* - existing issuance flow for a signed-in user.
//   2) /auth/verifiedid/* - presentation flow used as an alternative
//      website login method.
//
// The login flow never trusts a callback by itself. The callback only
// records the verified result against a short-lived transaction. The
// browser must present the same transaction state from its login cookie
// to /auth/verifiedid/complete before a normal TMTCo session is created.
// ============================================================
app.get('/verifiedid', async (c) => {
  const session = await getSession(c);
  const error = c.req.query('error');

  if (!session) {
    const body = `
<div class="login-page">
<div class="login-box">
<div class="lock-icon">&#x1F510;</div>
<h2>Sign In Required</h2>
<p>Sign in with your TMTCo Microsoft account to get your Verified ID.</p>
<a href="/auth/login?next=/dashboard" class="ms-login-btn">${MS_LOGO}Sign in with Microsoft</a>
${verifiedIdLoginMarkup('/dashboard')}
${error ? `<div class="error-box">Sign-in failed or access denied.</div>` : ''}
<p class="login-note">&#x1F512; Secured via Microsoft Entra ID</p>
</div>
</div>`;
    return shell('Sign In', body, 'dashboard');
  }

  const body = `
<div class="page-section top">
<div class="user-bar">
<div class="user-bar-info">
<div class="user-avatar">&#x1F464;</div>
<div>
<div class="user-name">${escapeHtml(session.name || session.email)}</div>
<div class="user-email">${escapeHtml(session.email)}</div>
</div>
</div>
<a href="/auth/logout" class="btn btn-ghost" style="font-size:.85rem;padding:.5rem 1rem;">Sign out</a>
</div>

<div class="section-header">
<div class="section-label">TMTCo &middot; Microsoft Entra Verified ID</div>
<h2 class="section-title">Get your Verified ID</h2>
<p class="section-sub">Scan the QR code with Microsoft Authenticator to add your TMTCo Verified Employee credential.</p>
</div>

<div class="vc-box">
<div id="vcIdle">
<button type="button" class="btn btn-primary" id="vcStartBtn">Generate QR code</button>
</div>
<div id="vcLoading" style="display:none">
<p class="vc-status">Generating your request&hellip;</p>
</div>
<div id="vcActive" style="display:none">
<div class="vc-qr-wrap" id="vcQrWrap"></div>
<p class="vc-status" id="vcStatusText">Scan with Microsoft Authenticator, or tap below on this device.</p>
<a href="#" id="vcDeepLink" class="btn btn-ghost vc-deeplink">Open in Authenticator</a>
</div>
</div>

<div class="back-row"><a href="/dashboard" class="btn btn-ghost">&larr; Back to Dashboard</a></div>
</div>

<script>
(function(){
  var idleEl = document.getElementById('vcIdle');
  var loadingEl = document.getElementById('vcLoading');
  var activeEl = document.getElementById('vcActive');
  var qrWrap = document.getElementById('vcQrWrap');
  var statusText = document.getElementById('vcStatusText');
  var deepLink = document.getElementById('vcDeepLink');
  var startBtn = document.getElementById('vcStartBtn');
  var pollTimer = null;
  var pollDeadline = null;

  function stopPolling() {
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = null;
  }

  function poll(state) {
    pollDeadline = Date.now() + 2 * 60 * 1000;
    pollTimer = setInterval(function(){
      if (Date.now() > pollDeadline) {
        stopPolling();
        statusText.textContent = 'This request has expired. Generate a new QR code to try again.';
        statusText.className = 'vc-status err';
        return;
      }
      fetch('/verifiedid/status?state=' + encodeURIComponent(state))
        .then(function(res){ return res.json(); })
        .then(function(data){
          if (data.status === 'issuance_successful') {
            stopPolling();
            statusText.textContent = '\u2705 Verified ID issued successfully! Check Microsoft Authenticator.';
            statusText.className = 'vc-status ok';
          } else if (data.status === 'issuance_error') {
            stopPolling();
            statusText.textContent = 'Issuance failed: ' + (data.errorMessage || 'please try again.');
            statusText.className = 'vc-status err';
          } else if (data.status === 'request_retrieved') {
            statusText.textContent = 'QR code scanned \u2014 finishing up in Authenticator\u2026';
            statusText.className = 'vc-status';
          }
        })
        .catch(function(){ });
    }, 3000);
  }

  startBtn.addEventListener('click', function(){
    idleEl.style.display = 'none';
    loadingEl.style.display = 'block';

    fetch('/verifiedid/start', { method: 'POST' })
      .then(function(res){ return res.json(); })
      .then(function(data){
        loadingEl.style.display = 'none';
        if (data.error) {
          idleEl.style.display = 'block';
          alert('Could not start the request: ' + data.error);
          return;
        }
        activeEl.style.display = 'block';
        qrWrap.innerHTML = data.qrCode
          ? '<img src="' + data.qrCode + '" alt="Scan with Microsoft Authenticator" style="width:200px;height:200px;display:block;margin:auto;">'
          : '<p class="vc-status err">QR code was not returned by Verified ID.</p>';
        deepLink.href = data.url;
        poll(data.state);
      })
      .catch(function(){
        loadingEl.style.display = 'none';
        idleEl.style.display = 'block';
        alert('Request failed \u2014 please try again.');
      });
  });
})();
</script>`;
  return shell('Verified ID', body, 'dashboard');
});

// Creates a Verified ID issuance request via Microsoft's app-only API.
app.post('/verifiedid/start', async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: 'unauthorized' }, 401);

  const token = await getVerifiedIdAppToken(c);
  if (!token) return c.json({ error: 'Could not authenticate to the Verified ID service.' }, 502);

  const baseUrl = getBaseUrl(c);
  const state = crypto.randomUUID();

  const requestBody = {
    includeQRCode: true,
    callback: {
      url: `${baseUrl}/verifiedid/callback`,
      state,
      headers: { 'api-key': c.env.VC_CALLBACK_KEY },
    },
    authority: c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT,
    registration: { clientName: 'TMTCo Admin Portal' },
    type: c.env.VC_TYPE || VC_TYPE_DEFAULT,
    manifest: c.env.VC_MANIFEST || VC_MANIFEST_DEFAULT,
  };

  const res = await fetch('https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });

  const resBody = await res.json().catch(() => null);
  if (!res.ok) {
    console.error('Verified ID createIssuanceRequest failed:', res.status, JSON.stringify(resBody));
    return c.json({ error: `Verified ID service returned status ${res.status}` }, 502);
  }

  await c.env.SESSIONS.put(`vc:${state}`, JSON.stringify({ status: 'pending', createdAt: Date.now() }), {
    expirationTtl: 600,
  });

  return c.json({ url: resBody.url, qrCode: resBody.qrCode || '', state });
});

// Existing issuance callback.
app.post('/verifiedid/callback', async (c) => {
  const apiKey = c.req.header('api-key');
  if (!apiKey || apiKey !== c.env.VC_CALLBACK_KEY) return c.json({ error: 'unauthorized' }, 401);

  const payload = await c.req.json().catch(() => null);
  if (!payload || !payload.state) return c.json({ error: 'invalid_payload' }, 400);

  const key = `vc:${payload.state}`;
  const existing = await c.env.SESSIONS.get(key);
  if (!existing) return c.json({ ok: true });

  const record = {
    status: payload.requestStatus || 'unknown',
    errorMessage: payload.error && payload.error.message ? payload.error.message : null,
    updatedAt: Date.now(),
  };
  await c.env.SESSIONS.put(key, JSON.stringify(record), { expirationTtl: 600 });
  return c.json({ ok: true });
});

app.get('/verifiedid/status', async (c) => {
  const session = await getSession(c);
  if (!session) return c.json({ error: 'unauthorized' }, 401);

  const state = c.req.query('state') || '';
  if (!state) return c.json({ error: 'missing_state' }, 400);

  const raw = await c.env.SESSIONS.get(`vc:${state}`);
  if (!raw) return c.json({ status: 'pending' });
  const record = JSON.parse(raw);
  return c.json({ status: record.status, errorMessage: record.errorMessage || null });
});

// ------------------------------------------------------------
// Verified ID login / presentation flow.
// ------------------------------------------------------------
app.get('/auth/verifiedid', async (c) => {
  const existingSession = await getSession(c);
  if (existingSession) return c.redirect(sanitizeNext(c.req.query('next') || '/dashboard'));

  const token = await getVerifiedIdAppToken(c);
  if (!token) return c.html('<h1>Verified ID login is not configured</h1><p>The site could not authenticate to the Verified ID Request Service.</p>', 502);

  const baseUrl = getBaseUrl(c);
  const state = crypto.randomUUID();
  const next = sanitizeNext(c.req.query('next') || '/dashboard');
  const verifierAuthority = c.env.VC_VERIFIER_AUTHORITY || c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT;
  const acceptedIssuer = c.env.VC_ISSUER || c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT;
  const credentialType = c.env.VC_TYPE || VC_TYPE_DEFAULT;

  const requestBody = {
    authority: verifierAuthority,
    includeQRCode: true,
    includeReceipt: false,
    registration: {
      clientName: c.env.VC_VERIFIER_CLIENT_NAME || 'TMTCo Portal',
      purpose: 'Sign in to TMTCo using your verified employee credential',
    },
    callback: {
      url: `${baseUrl}/auth/verifiedid/callback`,
      state,
      headers: { 'api-key': c.env.VC_CALLBACK_KEY },
    },
    requestedCredentials: [
      {
        type: credentialType,
        purpose: 'Prove that you are a verified TMTCo employee',
        acceptedIssuers: [acceptedIssuer],
        configuration: {
          validation: {
            allowRevoked: false,
            validateLinkedDomain: true,
          },
        },
      },
    ],
  };

  const res = await fetch('https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createPresentationRequest', {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(requestBody),
  });
  const resBody = await res.json().catch(() => null);
  if (!res.ok) {
    console.error('Verified ID createPresentationRequest failed:', res.status, JSON.stringify(resBody));
    return c.html(`<h1>Could not start Verified ID login</h1><p>Verified ID returned status ${res.status}.</p>`, 502);
  }

  await c.env.SESSIONS.put(`vclogin:${state}`, JSON.stringify({
    status: 'pending',
    next,
    createdAt: Date.now(),
  }), { expirationTtl: 600 });

  setCookie(c, 'vc_login_state', state, {
    httpOnly: true,
    secure: true,
    sameSite: 'Lax',
    path: '/',
    maxAge: 600,
  });

  const qrUrl = resBody.url || '';
  const qrCode = resBody.qrCode || '';
  const safeQrUrl = escapeHtml(qrUrl);
  const safeQrCode = typeof qrCode === 'string' && qrCode.startsWith('data:image/') ? qrCode : '';
  const body = `
<div class="login-page">
<div class="login-box" style="max-width:520px">
<div class="lock-icon">&#x1F4F1;</div>
<h2>Sign in with Verified ID</h2>
<p>Open Microsoft Authenticator and approve the request, or scan this QR code from another device.</p>
<div class="vc-qr-wrap" id="vcLoginQr" style="margin:1rem auto">${safeQrCode ? `<img src="${safeQrCode}" alt="Scan with Microsoft Authenticator" style="width:240px;height:240px;display:block;margin:auto;image-rendering:auto;">` : `<p class="vc-status err">QR code was not returned by Verified ID.</p>`}</div>
<a href="${safeQrUrl}" class="btn btn-primary" style="display:block;text-align:center">Open in Microsoft Authenticator</a>
<p id="vcLoginStatus" class="vc-status" style="margin-top:1rem">Waiting for your Verified ID&hellip;</p>
<p class="login-note">Your browser will return to TMTCo automatically after the credential is verified.</p>
<p><a href="/auth/login?next=${encodeURIComponent(next)}">Use Microsoft sign-in instead</a></p>
</div>
</div>
<script>
(function(){
  var state = ${JSON.stringify(state)};
  var status = document.getElementById('vcLoginStatus');
  var deadline = Date.now() + 2 * 60 * 1000;

  function poll(){
    if (Date.now() > deadline) {
      status.textContent = 'This sign-in request expired. Please start again.';
      status.className = 'vc-status err';
      return;
    }
    fetch('/auth/verifiedid/status?state=' + encodeURIComponent(state), { credentials: 'same-origin' })
      .then(function(r){ return r.json(); })
      .then(function(data){
        if (data.status === 'request_retrieved') {
          status.textContent = 'Authenticator opened. Approve the credential-sharing request on your phone…';
        } else if (data.status === 'presentation_verified') {
          status.textContent = 'Verified ID confirmed. Signing you in…';
          return fetch('/auth/verifiedid/complete?state=' + encodeURIComponent(state), { credentials: 'same-origin' });
        } else if (data.status === 'presentation_error') {
          status.textContent = 'Verified ID verification failed: ' + (data.errorMessage || 'please try again.');
          status.className = 'vc-status err';
          return null;
        }
        setTimeout(poll, 2000);
        return null;
      })
      .then(function(r){
        if (r && r.redirected) window.location.href = r.url;
        else if (r && r.ok) return r.text().then(function(url){ if (url) window.location.href = url; });
      })
      .catch(function(){ setTimeout(poll, 3000); });
  }
  poll();
})();
</script>`;
  // BUG FIX: shell() builds and returns a brand-new Response object
  // directly, completely independent of Hono's context (c). The
  // setCookie(c, 'vc_login_state', ...) call above only attaches its
  // Set-Cookie header onto c's own internally tracked response - it
  // never reaches a separately-constructed Response like shell()
  // returns. Every other cookie-setting route in this file returns via
  // c.redirect(...), which DOES flow through c and picks the header up
  // correctly; this route is the first to set a cookie and then return
  // a shell() page instead, which is why only this one broke. Fix:
  // manually copy whatever Set-Cookie header(s) Hono queued on c.res
  // onto the actual Response we're about to return.
  const vcLoginResponse = shell('Sign in with Verified ID', body, 'dashboard');
  const queuedCookies = c.res.headers.getSetCookie
    ? c.res.headers.getSetCookie()
    : [c.res.headers.get('set-cookie')].filter(Boolean);
  queuedCookies.forEach((cookieStr) => vcLoginResponse.headers.append('set-cookie', cookieStr));
  return vcLoginResponse;
});

// Verified ID callback: authenticate the callback using the API key, then
// store only the verified presentation result against the exact transaction.
// The browser must still call /complete with the matching transaction cookie.
app.post('/auth/verifiedid/callback', async (c) => {
  const apiKey = c.req.header('api-key');
  if (!apiKey || apiKey !== c.env.VC_CALLBACK_KEY) return c.json({ error: 'unauthorized' }, 401);

  const payload = await c.req.json().catch(() => null);
  if (!payload || !payload.state) return c.json({ error: 'invalid_payload' }, 400);

  // Native iOS sign-in: forward "nvc_" callbacks to the Durable Object transaction.
  if (String(payload.state).startsWith('nvc_') && c.env.NATIVE_VC_TXNS) {
    const nativeTransaction = c.env.NATIVE_VC_TXNS.get(c.env.NATIVE_VC_TXNS.idFromName(payload.state));
    const callbackStatus = payload.requestStatus;
    const identity = callbackStatus === 'presentation_verified'
      ? getVerifiedIdIdentity(c, payload.verifiedCredentialsData)
      : null;
    const nativeResult = await nativeTransaction.fetch('https://native-vc/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        status: ['request_retrieved', 'presentation_verified'].includes(callbackStatus) ? callbackStatus : 'presentation_error',
        identity: identity ? { email: identity.email, name: identity.name } : null,
      }),
    });
    const nativeResultBody = await nativeResult.json().catch(() => null);
    if (nativeResultBody && nativeResultBody.handled) return c.json({ ok: true });
  }

  const key = `vclogin:${payload.state}`;
  const existingRaw = await c.env.SESSIONS.get(key);
  if (!existingRaw) return c.json({ ok: true });

  let existing;
  try { existing = JSON.parse(existingRaw); } catch { return c.json({ ok: true }); }

  const record = {
    ...existing,
    status: payload.requestStatus || 'unknown',
    errorMessage: payload.error && payload.error.message ? payload.error.message : null,
    verifiedCredentialsData: payload.requestStatus === 'presentation_verified' ? (payload.verifiedCredentialsData || []) : null,
    subject: payload.subject || null,
    updatedAt: Date.now(),
  };

  await c.env.SESSIONS.put(key, JSON.stringify(record), { expirationTtl: 600 });
  return c.json({ ok: true });
});

app.get('/auth/verifiedid/status', async (c) => {
  const state = c.req.query('state') || '';
  const cookieState = getCookie(c, 'vc_login_state');
  if (!state || !cookieState || state !== cookieState) return c.json({ error: 'invalid_transaction' }, 403);

  const raw = await c.env.SESSIONS.get(`vclogin:${state}`);
  if (!raw) return c.json({ error: 'expired' }, 410);
  const record = JSON.parse(raw);
  return c.json({ status: record.status, errorMessage: record.errorMessage || null });
});

app.get('/auth/verifiedid/complete', async (c) => {
  const state = c.req.query('state') || '';
  const cookieState = getCookie(c, 'vc_login_state');
  if (!state || !cookieState || state !== cookieState) return c.json({ error: 'invalid_transaction' }, 403);

  const key = `vclogin:${state}`;
  const raw = await c.env.SESSIONS.get(key);
  if (!raw) return c.json({ error: 'expired' }, 410);

  const record = JSON.parse(raw);
  if (record.status !== 'presentation_verified') return c.json({ error: 'not_verified' }, 409);

  const identity = getVerifiedIdIdentity(c, record.verifiedCredentialsData);
  if (!identity) {
    deleteCookie(c, 'vc_login_state', { path: '/' });
    await c.env.SESSIONS.delete(key);
    return c.json({ error: 'The presented credential was not an accepted TMTCo Verified ID credential.' }, 403);
  }

  const next = record.next || '/dashboard';

  // VC_LOGIN_MODE controls which of two approaches handles Global Admin
  // access for Verified ID sign-ins - see isPortalAdmin's comment and
  // the two helper blocks above for the full trade-off explanation:
  //
  // "chain_oauth" (Scenario B): don't create a session from the VC
  // claims at all - hand off to a real Microsoft sign-in instead (with
  // login_hint pre-filled from the verified email), which yields a
  // genuine delegated token and the normal, fully-accurate Global Admin
  // check. Costs an extra interactive sign-in step unless the browser
  // already has an active Microsoft session.
  //
  // Anything else (default, Scenario C): create the session directly
  // from the VC claims as before, but now also attempt an app-only
  // Graph lookup (by the verified email) to populate isGlobalAdmin
  // instead of hardcoding it false. One-step UX preserved; needs
  // Directory.Read.All as an Application permission consented
  // separately from the Delegated version already in use.
  if (c.env.VC_LOGIN_MODE === 'chain_oauth') {
    await c.env.SESSIONS.delete(key);
    deleteCookie(c, 'vc_login_state', { path: '/' });
    const redirectTarget = `/auth/login?next=${encodeURIComponent(next)}&login_hint=${encodeURIComponent(identity.email)}`;
    // Plain text, not an HTTP redirect - the frontend's fetch() would
    // otherwise silently follow a server-side redirect toward
    // Microsoft's cross-origin login page in the background instead of
    // actually navigating the browser there. See the frontend poll
    // handler a little above, which already knows how to read this.
    return c.text(redirectTarget);
  }

  const roles = [];
  const isGlobalAdmin = await checkIsGlobalAdminByEmailAppOnly(c, identity.email);

  await createSession(c, {
    name: identity.name,
    email: identity.email,
    roles,
    isGlobalAdmin,
    auth_method: 'verified_id',
    verified_id: {
      issuer: identity.issuer,
      type: identity.type,
      claims: identity.claims,
      subject: record.subject || null,
    },
    access_token: null,
    refresh_token: null,
    expires_at: 0,
  });

  await c.env.SESSIONS.delete(key);
  deleteCookie(c, 'vc_login_state', { path: '/' });
  return c.text(next);
});

// ============================================================
// ROUTES - AUTH (OAuth2 server-side flow)
// Supports multiple domains via ALLOWED_HOSTS / getBaseUrl() above.
// Supports returning to whichever page started the login (admin
// or dashboard) via a ?next= param stored in a short-lived cookie.
// ============================================================

// Step 1: redirect to Microsoft
app.get('/auth/login', (c) => {
  const { TENANT_ID, CLIENT_ID } = c.env;
  const baseUrl = getBaseUrl(c);
  const redirectUri = `${baseUrl}/auth/callback`;
  const state = crypto.randomUUID();
  const next = sanitizeNext(c.req.query('next') || '/admin');

  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    response_type: 'code',
    redirect_uri: redirectUri,
    response_mode: 'query',
    scope: GRAPH_SCOPES,
    state,
  });

  // Optional pre-fill for the Microsoft sign-in page - used by the
  // Verified ID "chain_oauth" login mode (see /auth/verifiedid/complete)
  // to skip the user having to retype their email after already proving
  // their identity via credential. Harmless/no-op for the normal
  // "Sign in with Microsoft" button, which never sends this param.
  const loginHint = c.req.query('login_hint');
  if (loginHint) params.set('login_hint', loginHint);

  setCookie(c, 'oauth_state', state, {
    httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: 300,
  });
  setCookie(c, 'oauth_next', next, {
    httpOnly: true, secure: true, sameSite: 'Lax', path: '/', maxAge: 300,
  });

  return c.redirect(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/authorize?${params}`
  );
});

// Step 2: Microsoft redirects back here with a code
app.get('/auth/callback', async (c) => {
  const { TENANT_ID, CLIENT_ID, CLIENT_SECRET } = c.env;
  const baseUrl = getBaseUrl(c);
  const { code, state, error } = c.req.query();
  const savedState = getCookie(c, 'oauth_state');
  const next = sanitizeNext(getCookie(c, 'oauth_next') || '/admin');
  deleteCookie(c, 'oauth_state', { path: '/' });
  deleteCookie(c, 'oauth_next', { path: '/' });

  if (error || !code || state !== savedState) {
    return c.redirect(`${next}?error=1`);
  }

  try {
    const tokenRes = await fetch(
      `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/token`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({
          client_id: CLIENT_ID,
          client_secret: CLIENT_SECRET,
          code,
          redirect_uri: `${baseUrl}/auth/callback`,
          grant_type: 'authorization_code',
        }),
      }
    );

    if (!tokenRes.ok) return c.redirect(`${next}?error=1`);
    const tokens = await tokenRes.json();
    // Temporary debug logging - shows exactly which scopes Microsoft
    // actually granted for this token. Compare against GRAPH_SCOPES above;
    // if User.ReadWrite.All is missing here, that's the write-permission
    // gap causing 403s on enable/disable/reset even though search works.
    console.log('Graph token scopes granted:', tokens.scope);

    const graphRes = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: { Authorization: `Bearer ${tokens.access_token}` },
    });

    if (!graphRes.ok) return c.redirect(`${next}?error=1`);
    const user = await graphRes.json();

    // Pull the "roles" claim out of the ID token so we know whether this
    // user holds the PortalAdmin app role (assigned in Entra ID under
    // Enterprise Applications -> your app -> Users and groups). This ID
    // token came from the server-to-server call above, not the browser
    // redirect, so it's trustworthy for this purpose without needing a
    // separate signature check.
    let roles = [];
    try {
      let payloadB64 = tokens.id_token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/');
      // base64url has no padding, but atob() requires the string length
      // to be a multiple of 4 - pad it back out before decoding, or this
      // throws and the catch below silently leaves roles as [].
      while (payloadB64.length % 4 !== 0) payloadB64 += '=';
      const payload = JSON.parse(atob(payloadB64));
      roles = Array.isArray(payload.roles) ? payload.roles : [];
      console.log('ID token roles claim:', JSON.stringify(roles), '| aud:', payload.aud, '| appid matches CLIENT_ID:', payload.aud === CLIENT_ID);
    } catch (e) {
      console.error('Failed to decode ID token for roles claim:', e);
    }

    // Checked once here, cached for the life of the session (same 20-min
    // TTL as everything else) - a Global Admin role revoked mid-session
    // won't immediately lock the portal, same staleness trade-off the
    // app role claim had before it.
    const isGlobalAdmin = await checkIsGlobalAdmin(tokens.access_token);

    await createSession(c, {
      name: user.displayName || user.givenName || '',
      email: user.mail || user.userPrincipalName || '',
      roles,
      isGlobalAdmin,
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token || null,
      expires_at: Date.now() + ((tokens.expires_in || 3600) - 60) * 1000,
    });

    return c.redirect(next);
  } catch (err) {
    console.error('Auth callback error:', err);
    return c.redirect(`${next}?error=1`);
  }
});

// Step 3: logout
app.get('/auth/logout', async (c) => {
  const { TENANT_ID } = c.env;
  const baseUrl = getBaseUrl(c);
  await destroySession(c);
  return c.redirect(
    `https://login.microsoftonline.com/${TENANT_ID}/oauth2/v2.0/logout?post_logout_redirect_uri=${baseUrl}`
  );
});

// ============================================================
// ROUTES - ID CALLBACK
// Kept live (not linked from nav or the home cards) - replace
// placeholder content with real tools later
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
<div class="big-icon">&#x1F194;</div>
<h3>Coming Soon</h3>
<p>This page is being set up. In the meantime reach out to <a href="mailto:logan.kelly@tmtcoau.com">logan.kelly@tmtcoau.com</a> for identity callback assistance.</p>
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('ID Callback', body, 'idcallback');
});

// ============================================================
// ROUTES - SERVICES
// Placeholder so the nav link doesn't 404 - replace with real content
// ============================================================
app.get('/services', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">TMTCo</div>
<h2 class="section-title">Services</h2>
<p class="section-sub">An overview of services offered by TMTCo.</p>
</div>
<div class="placeholder-box">
<div class="big-icon">&#x1F3AB;</div>
<h3>General IT Helpdesk</h3>
<p>Helpdesk support for businesses and individuals, covering everyday IT problems, setup and advice.</p>
<p style="margin-top:.8rem">Details coming soon. Reach out to <a href="mailto:logan.kelly@tmtcoau.com">logan.kelly@tmtcoau.com</a> in the meantime.</p>
</div>
<div class="placeholder-box" style="margin-top:1.2rem">
<div class="big-icon">&#x1F5A5;&#xFE0F;</div>
<h3>Remote Support</h3>
<p>Remote support sessions are run through Helpwire. If your technician has given you a Helpwire session code or link, use it to connect.</p>
<!-- Add Helpwire session or download link here -->
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Services', body, 'services');
});

// ============================================================
// ROUTES - ABOUT
// ============================================================
app.get('/about', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">About</div>
<h2 class="section-title">About TMTCo</h2>
<p class="section-sub">The person behind tmtcoau.com and TMTCo.</p>
</div>
<div class="about-grid">
<div class="about-text">
<div class="section-label">About</div>
<h2 class="section-title">For Hiring &amp; Interviewers</h2>
<p>I'm Logan Yeomans, the person behind tmtcoau.com and TMTCo. I'm passionate about technology, IT infrastructure, and building practical solutions.</p>
<p>If you're a hiring manager or recruiter, you can grab a copy of my resume below.</p>
<div class="resume-box">
<div>
<strong>Logan Yeomans &mdash; Resume</strong>
<!-- Update date when you upload a new resume -->
<p>PDF download &middot; Last updated 26/10/26</p>
</div>
<!-- Update resume URL if it changes -->
<a class="btn btn-primary" href="https://cp-int.tmtcoau.com/pdf-docs/Logan.Yeomans%20Resume-26.10.26.pdf" target="_blank">&#x2B07; Download PDF</a>
</div>
</div>
<div class="about-placeholder">&#x1F468;&#x200D;&#x1F4BB;</div>
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('About', body, 'about');
});

// ============================================================
// ROUTES - OTHER (command reference, IT tools, general tools)
// ============================================================
app.get('/other', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">Resources</div>
<h2 class="section-title">Other</h2>
<p class="section-sub">Command reference, IT tools and general-purpose tools, all in one place.</p>
</div>
<div class="cards">
<a href="/commands" class="card">
<div class="card-icon">&#x2328;&#xFE0F;</div>
<h3>Command Reference</h3>
<p>Useful commands for Windows (CMD and PowerShell), Linux and macOS, with a quick reference for each.</p>
<span class="card-link">View commands &rarr;</span>
</a>
<a href="/it-tools" class="card">
<div class="card-icon">&#x1F6E0;&#xFE0F;</div>
<h3>IT Tools</h3>
<p>Browser-based tools for everyday IT work: encoding, hashing, JWT and DNS lookups, subnet calculations, password generation and more.</p>
<span class="card-link">Explore tools &rarr;</span>
</a>
<a href="/gen-tools" class="card">
<div class="card-icon">&#x1F9EE;</div>
<h3>General Tools</h3>
<p>Everyday calculators and converters: unit conversion, percentages, tip splitting, dates, dice, colours and a stopwatch.</p>
<span class="card-link">Open tools &rarr;</span>
</a>
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Other', body, 'other');
});

// ============================================================
// ROUTES - TERMS OF SERVICE
// Edit clauses below - update the date when you revise
// ============================================================
app.get('/tos', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">Legal</div>
<h2 class="section-title">Terms of Service</h2>
<p class="section-sub">Terms of use for all services hosted on tmtcoau.com and operated by TMTCo.</p>
</div>
<div class="tos-body">

<!-- Update this date whenever you revise the TOS -->
<div class="tos-updated">&#x1F4C5; Last reviewed: 2025</div>

<p class="tos-intro">Welcome to tmtcoau.com. These Terms of Service govern your use of all services provided through this website and associated platforms operated by TMTCo. By accessing or using our services, you agree to be bound by these terms. If you do not agree, please discontinue use of our services immediately.</p>

<div class="tos-clause">
<h3><span class="tos-clause-num">1</span> Acceptance of Terms</h3>
<p>By using tmtcoau.com or any associated service, you confirm your acceptance of these Terms and agree to comply with all applicable laws and regulations. These Terms apply to all visitors, users, and anyone else who accesses our services.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">2</span> User Accounts and Data</h3>
<p>Certain services may require you to create an account or have data associated with you. You are responsible for maintaining the confidentiality of your account credentials and for all activity that occurs under your account. You agree to provide accurate and complete information at all times.</p>
<div class="tos-note">&#x26A0;&#xFE0F; This clause applies only to services that require a user account or store your data &mdash; it does not apply to this website itself.</div>
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
<p>All content provided by TMTCo &mdash; including but not limited to software, graphics, logos, and design &mdash; is the property of TMTCo or is used under licence. You may not reproduce, distribute, or use any TMTCo content without explicit written permission.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">9</span> Changes to These Terms</h3>
<p>These Terms may be updated periodically. Changes take effect immediately upon being posted to this page. Continued use of our services after any changes constitutes your acceptance of the revised Terms.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">10</span> Contact</h3>
<p>If you have any questions or feedback regarding these Terms, please get in touch:</p>
<div class="tos-note">&#x1F4E7; <a href="mailto:logan.kelly@tmtcoau.com">logan.kelly@tmtcoau.com</a> &nbsp;&middot;&nbsp; &#x1F4DE; +61 0493 715 746</div>
</div>

</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Terms of Service', body, 'tos');
});

// ============================================================
// ROUTES - PRIVACY POLICY
// Edit clauses below - update the date when you revise
// ============================================================
app.get('/privacy', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">Legal</div>
<h2 class="section-title">Privacy Policy</h2>
<p class="section-sub">How we collect, use, and protect your information across all services hosted on tmtcoau.com and operated by TMTCo.</p>
</div>
<div class="tos-body">

<!-- Update this date whenever you revise the Privacy Policy -->
<div class="tos-updated">&#x1F4C5; Last reviewed: 2025</div>

<p class="tos-intro">This Privacy Policy explains how TMTCo collects, uses, discloses, and safeguards your information when you use tmtcoau.com or any associated service. By using our services, you consent to the practices described in this policy. If you do not agree with this policy, please discontinue use of our services immediately.</p>

<div class="tos-clause">
<h3><span class="tos-clause-num">1</span> Information We Collect</h3>
<p>We may collect information you provide directly, such as your name, email address, and any content or files you submit to a TMTCo service. We may also automatically collect technical information such as your IP address, browser type, device information, and usage data when you interact with our services.</p>
<div class="tos-note">&#x26A0;&#xFE0F; Account-related data collection applies only to services that require a user account &mdash; it does not apply to this website itself.</div>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">2</span> How We Use Your Information</h3>
<p>We use collected information to operate, maintain, and improve our services, to respond to your inquiries, to monitor and prevent misuse, and to comply with legal obligations. We do not sell your personal information to third parties.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">3</span> Cookies and Tracking</h3>
<p>We may use cookies or similar technologies to support basic site functionality and to understand how our services are used. You can control or disable cookies through your browser settings, though some features may not function correctly without them.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">4</span> Data Sharing and Disclosure</h3>
<p>We do not share your personal information with third parties except: where necessary to provide a service you have requested, where required to comply with applicable law or legal process, to protect the rights, property, or safety of TMTCo or others, or with your explicit consent.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">5</span> Microsoft Entra ID and Company Accounts</h3>
<p>Some TMTCo services are accessed using Microsoft Entra ID (formerly Azure Active Directory) for identity and access management. Where this applies, we may process account information provided by Entra ID, such as your name, organisational email address, user ID, and assigned roles or group memberships, in order to authenticate you and control access to the relevant service.</p>
<p>This includes guest accounts provisioned through Entra ID B2B collaboration for external users invited to access TMTCo services on behalf of a partner organisation or client. Guest account information is used solely to manage access and is subject to the access policies of both TMTCo and the guest's home organisation.</p>
<p>We do not control, and are not responsible for, the identity or directory data managed within a third-party organisation's own Entra ID tenant. Access to TMTCo services via Entra ID can be revoked at any time by TMTCo or by the account's home organisation.</p>
<div class="tos-note">&#x26A0;&#xFE0F; This clause applies only to services that use Entra ID for sign-in &mdash; it does not apply to this website itself.</div>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">6</span> Data Retention</h3>
<p>We retain your information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. When information is no longer needed, we take reasonable steps to delete or anonymise it.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">7</span> Data Security</h3>
<p>We implement reasonable security measures to protect information handled by TMTCo services. However, no system is entirely immune to risk. You acknowledge the inherent risks associated with transmitting data over the internet and accept that we cannot guarantee absolute security.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">8</span> Your Rights and Choices</h3>
<p>Depending on your location, you may have rights to access, correct, or request deletion of your personal information, or to object to or restrict certain processing. To exercise any of these rights, please contact us using the details below.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">9</span> Third-Party Links and Services</h3>
<p>Our services may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of those third parties, and we encourage you to review their respective privacy policies.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">10</span> Children's Privacy</h3>
<p>Our services are not directed to children, and we do not knowingly collect personal information from children. If you believe a child has provided us with personal information, please contact us so we can take appropriate action.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">11</span> Changes to This Policy</h3>
<p>This Privacy Policy may be updated periodically. Changes take effect immediately upon being posted to this page. Continued use of our services after any changes constitutes your acceptance of the revised policy.</p>
</div>
<div class="tos-clause">
<h3><span class="tos-clause-num">12</span> Contact</h3>
<p>If you have any questions or concerns regarding this Privacy Policy or your personal information, please get in touch:</p>
<div class="tos-note">&#x1F4E7; <a href="mailto:logan.kelly@tmtcoau.com">logan.kelly@tmtcoau.com</a> &nbsp;&middot;&nbsp; &#x1F4DE; +61 0493 715 746</div>
</div>

</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Privacy Policy', body, 'privacy');
});

// ============================================================
// ROUTES - CONTACT
// Edit phone, email and details here
// ============================================================
app.get('/contact', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">Get in touch</div>
<h2 class="section-title">Contact Us</h2>
<p class="section-sub">Reach out any time &mdash; we're happy to help with any questions or tech needs.</p>
</div>
<div class="contact-cards">
<div class="contact-item">
<div class="contact-item-icon">&#x1F4DE;</div>
<div>
<span>Phone</span>
<!-- Update phone number -->
<strong>+61 0493 715 746</strong>
</div>
</div>
<div class="contact-item">
<div class="contact-item-icon">&#x2709;&#xFE0F;</div>
<div>
<span>Email</span>
<strong><a href="mailto:logan.kelly@tmtcoau.com" style="color:var(--text)">logan.kelly@tmtcoau.com</a></strong>
</div>
</div>
<div class="contact-item">
<div class="contact-item-icon">&#x1F310;</div>
<div>
<span>Website</span>
<strong>tmtcoau.com</strong>
</div>
</div>
<!-- Add more contact items here -->
</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Contact', body, 'contact');
});

// ============================================================
// IT TOOLS - implemented in-site (client-side or via public APIs
// called from the visitor's browser). Hard-to-build tools are
// listed as external links further down /tools.
// Paste this block above `export default app;` in index.js.
// ============================================================
const TOOL_CSS = String.raw`
.tool-box{max-width:760px}
.tool-box label{display:block;font-size:.8rem;color:var(--muted);margin-top:1.1rem;margin-bottom:.3rem}
.tool-box textarea,.tool-box input[type=text],.tool-box input[type=number],.tool-box input[type=date],.tool-box select{width:100%;padding:.7rem 1rem;border-radius:10px;border:1px solid var(--border);background:var(--surface2);color:var(--text);font-family:var(--body);font-size:.9rem}
.tool-box select{width:auto}
.tool-box input[type=color]{width:70px;height:46px;padding:3px;border:1px solid var(--border);border-radius:10px;background:var(--surface2)}
.tool-box textarea{min-height:120px;resize:vertical;font-family:ui-monospace,SFMono-Regular,Consolas,monospace}
.tool-box input:focus,.tool-box select:focus,.tool-box textarea:focus{outline:none;border-color:var(--accent)}
.tool-row{display:flex;gap:.6rem;flex-wrap:wrap;margin-top:1rem;align-items:center}
.tool-out{white-space:pre-wrap;word-break:break-all;font-family:ui-monospace,SFMono-Regular,Consolas,monospace;font-size:.85rem;background:var(--surface2);border:1px solid var(--border);border-radius:10px;padding:1rem;margin-top:1rem;min-height:3rem;color:var(--text)}
.tool-check{display:inline-flex;align-items:center;gap:.4rem;color:var(--text);font-size:.88rem}
.tool-check input{width:auto}
`;

const TOOL_OUT = '<div class="tool-out" id="out"></div>';
const TOOL_GO = '<button type="button" class="btn btn-primary" id="go">Run</button>';

const INTERNAL_TOOLS = [
  {
    slug: 'base64', category: 'it', name: 'Base64 Encoder', icon: '&#x1F4DD;',
    desc: 'Encode or decode Base64 text (UTF-8 safe). Runs entirely in your browser.',
    inner: `
<label for="in">Input</label>
<textarea id="in" spellcheck="false"></textarea>
<div class="tool-row">
<select id="mode"><option value="encode">Encode</option><option value="decode">Decode</option></select>
${TOOL_GO}
</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function enc(s) {
  var b = new TextEncoder().encode(s), bin = '';
  b.forEach(function (x) { bin += String.fromCharCode(x); });
  return btoa(bin);
}
function dec(s) {
  var bin = atob(s.trim()), a = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(a);
}
el('go').onclick = function () {
  try {
    el('out').textContent = el('mode').value === 'encode' ? enc(el('in').value) : dec(el('in').value);
  } catch (e) { el('out').textContent = 'Error: ' + e.message; }
};`,
  },
  {
    slug: 'hash', category: 'it', name: 'Hash Generator', icon: '&#x1F512;',
    desc: 'Generate SHA-1, SHA-256, SHA-384 or SHA-512 hashes of text. Computed locally in your browser.',
    inner: `
<label for="in">Text to hash</label>
<textarea id="in" spellcheck="false"></textarea>
<div class="tool-row">
<select id="algo"><option value="SHA-256">SHA-256</option><option value="SHA-512">SHA-512</option><option value="SHA-384">SHA-384</option><option value="SHA-1">SHA-1</option></select>
${TOOL_GO}
</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function run() {
  crypto.subtle.digest(el('algo').value, new TextEncoder().encode(el('in').value)).then(function (d) {
    el('out').textContent = Array.prototype.map.call(new Uint8Array(d), function (b) {
      return ('0' + b.toString(16)).slice(-2);
    }).join('');
  }).catch(function (e) { el('out').textContent = 'Error: ' + e.message; });
}
el('go').onclick = run;
el('in').oninput = run;
el('algo').onchange = run;`,
  },
  {
    slug: 'uuid', category: 'it', name: 'UUID Generator', icon: '&#x1F194;',
    desc: 'Generate random version 4 UUIDs, one or many at a time.',
    inner: `
<label for="n">How many (1-50)</label>
<input type="number" id="n" value="5" min="1" max="50">
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function gen() {
  var n = Math.min(50, Math.max(1, parseInt(el('n').value, 10) || 1)), a = [];
  for (var i = 0; i < n; i++) a.push(crypto.randomUUID());
  el('out').textContent = a.join('\n');
}
el('go').onclick = gen;
gen();`,
  },
  {
    slug: 'epoch', category: 'it', name: 'Epoch Converter', icon: '&#x23F1;&#xFE0F;',
    desc: 'Convert Unix timestamps (seconds or milliseconds) to dates, or a date to a timestamp. Leave blank for now.',
    inner: `
<label for="in">Unix timestamp or date string</label>
<input type="text" id="in" placeholder="e.g. 1767225600, 1767225600000, or 2026-01-01T00:00:00Z">
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function show() {
  var v = el('in').value.trim(), d;
  if (v === '') d = new Date();
  else if (/^-?\d+(\.\d+)?$/.test(v)) { var n = Number(v); d = new Date(Math.abs(n) > 1e11 ? n : n * 1000); }
  else d = new Date(v);
  if (isNaN(d.getTime())) { el('out').textContent = 'Could not parse that value.'; return; }
  el('out').textContent =
    'Unix seconds: ' + Math.floor(d.getTime() / 1000) + '\n' +
    'Unix ms:      ' + d.getTime() + '\n' +
    'ISO 8601 UTC: ' + d.toISOString() + '\n' +
    'Local:        ' + d.toString();
}
el('go').onclick = show;
el('in').onkeydown = function (e) { if (e.key === 'Enter') show(); };
show();`,
  },
  {
    slug: 'jwt', category: 'it', name: 'JWT Decoder', icon: '&#x1F3AB;',
    desc: 'Decode a JSON Web Token to see its header and payload, and whether it has expired. The signature is not verified. Avoid pasting live production tokens into any online tool.',
    inner: `
<label for="in">JWT</label>
<textarea id="in" spellcheck="false" placeholder="eyJhbGciOi..."></textarea>
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function b64u(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  var bin = atob(s), a = new Uint8Array(bin.length);
  for (var i = 0; i < bin.length; i++) a[i] = bin.charCodeAt(i);
  return new TextDecoder().decode(a);
}
el('go').onclick = function () {
  try {
    var p = el('in').value.trim().split('.');
    if (p.length < 2) throw new Error('Expected a JWT with three dot-separated parts');
    var h = JSON.parse(b64u(p[0])), pl = JSON.parse(b64u(p[1]));
    var out = 'HEADER\n' + JSON.stringify(h, null, 2) + '\n\nPAYLOAD\n' + JSON.stringify(pl, null, 2);
    if (pl.exp) out += '\n\nExpires: ' + new Date(pl.exp * 1000).toString() + (pl.exp * 1000 < Date.now() ? '  (EXPIRED)' : '');
    out += '\n\nSignature NOT verified.';
    el('out').textContent = out;
  } catch (e) { el('out').textContent = 'Error: ' + e.message; }
};`,
  },
  {
    slug: 'subnet', category: 'it', name: 'Subnet Calculator', icon: '&#x1F310;',
    desc: 'IPv4 subnet calculator: network, broadcast, mask, wildcard and usable host range from CIDR notation.',
    inner: `
<label for="in">IPv4 address with prefix</label>
<input type="text" id="in" value="192.168.1.0/24">
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function ip2n(s) {
  var p = s.split('.');
  if (p.length !== 4) throw new Error('Bad IPv4 address');
  return p.reduce(function (a, x) {
    var n = Number(x);
    if (!/^\d{1,3}$/.test(x) || n > 255) throw new Error('Bad octet: ' + x);
    return a * 256 + n;
  }, 0);
}
function n2ip(n) { return [(n >>> 24) & 255, (n >>> 16) & 255, (n >>> 8) & 255, n & 255].join('.'); }
el('go').onclick = function () {
  try {
    var m = el('in').value.trim().split('/');
    var bits = Number(m[1]);
    if (!(bits >= 0 && bits <= 32)) throw new Error('Prefix must be 0-32');
    var ip = ip2n(m[0]);
    var mask = bits === 0 ? 0 : (0xFFFFFFFF << (32 - bits)) >>> 0;
    var net = (ip & mask) >>> 0;
    var bc = (net | (~mask >>> 0)) >>> 0;
    var hosts = bits >= 31 ? (bits === 32 ? 1 : 2) : Math.pow(2, 32 - bits) - 2;
    var first = bits >= 31 ? net : net + 1;
    var last = bits >= 31 ? bc : bc - 1;
    el('out').textContent =
      'Network:    ' + n2ip(net) + '/' + bits + '\n' +
      'Netmask:    ' + n2ip(mask) + '\n' +
      'Wildcard:   ' + n2ip((~mask) >>> 0) + '\n' +
      'Broadcast:  ' + n2ip(bc) + '\n' +
      'First host: ' + n2ip(first) + '\n' +
      'Last host:  ' + n2ip(last) + '\n' +
      'Usable:     ' + hosts;
  } catch (e) { el('out').textContent = 'Error: ' + e.message; }
};
el('in').onkeydown = function (e) { if (e.key === 'Enter') el('go').onclick(); };
el('go').onclick();`,
  },
  {
    slug: 'json', category: 'it', name: 'JSON Formatter', icon: '&#x1F9FE;',
    desc: 'Validate, pretty-print or minify JSON.',
    inner: `
<label for="in">JSON</label>
<textarea id="in" spellcheck="false" style="min-height:180px"></textarea>
<div class="tool-row">
<button type="button" class="btn btn-primary" id="fmt">Format</button>
<button type="button" class="btn btn-ghost" id="min">Minify</button>
</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function run(ind) {
  try { el('out').textContent = JSON.stringify(JSON.parse(el('in').value), null, ind); }
  catch (e) { el('out').textContent = 'Invalid JSON: ' + e.message; }
}
el('fmt').onclick = function () { run(2); };
el('min').onclick = function () { run(0); };`,
  },
  {
    slug: 'password', category: 'it', name: 'Password Generator', icon: '&#x1F511;',
    desc: "Generate strong random passwords or passphrases using the browser's cryptographic random number generator. Nothing is sent anywhere.",
    inner: `
<label for="mode">Type</label>
<select id="mode"><option value="password">Password</option><option value="passphrase">Passphrase</option></select>
<div id="pw-opts">
<label for="len">Length (4-128)</label>
<input type="number" id="len" value="20" min="4" max="128">
<div class="tool-row">
<label class="tool-check"><input type="checkbox" id="up" checked> Uppercase</label>
<label class="tool-check"><input type="checkbox" id="lo" checked> Lowercase</label>
<label class="tool-check"><input type="checkbox" id="di" checked> Digits</label>
<label class="tool-check"><input type="checkbox" id="sy" checked> Symbols</label>
</div>
</div>
<div id="pp-opts" style="display:none">
<label for="words">Number of words (3-12)</label>
<input type="number" id="words" value="6" min="3" max="12">
<label for="sep">Separator</label>
<select id="sep"><option value="-">Hyphen (-)</option><option value=" ">Space</option><option value=".">Period (.)</option><option value="">None</option></select>
<div class="tool-row">
<label class="tool-check"><input type="checkbox" id="cap" checked> Capitalise words</label>
<label class="tool-check"><input type="checkbox" id="num"> Add a digit</label>
</div>
</div>
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
var WORDS = ["apple","arrow","autumn","bagel","baker","banjo","barley","beacon","beetle","berry","bingo","blanket","bloom","bottle","breeze","bridge",
"brook","buffalo","bunny","butter","cabin","cactus","camel","candle","canyon","carrot","castle","cedar","cello","chapel","cherry","cider",
"cinema","circle","clover","cobalt","comet","copper","coral","cosmic","cotton","cradle","crayon","cricket","crystal","cupcake","dagger","dahlia",
"daisy","dancer","dapple","desert","dingo","dolphin","donkey","dragon","drum","dune","eagle","earth","easel","ember","emerald","engine",
"falcon","fern","fiddle","flame","flannel","fleet","forest","fossil","fox","frost","galaxy","garden","geyser","ginger","glacier","goblet",
"granite","grape","gravel","guitar","hammer","harbor","hazel","helium","hedge","heron","honey","horizon","hyena","iceberg","indigo","island",
"ivory","jacket","jasmine","jelly","jigsaw","jungle","kayak","kettle","kiwi","lagoon","lantern","laser","lemon","lilac","lizard","lobster",
"locket","lotus","lunar","magnet","mammoth","mango","maple","marble","meadow","melon","meteor","mirror","mitten","moose","mosaic","muffin",
"nectar","nickel","nimbus","noodle","nougat","oasis","olive","onyx","orbit","orchid","otter","oyster","paddle","panda","parrot","pebble",
"pepper","piano","pickle","pillow","pine","planet","plume","pocket","polar","pony","prairie","pretzel","puppy","quartz","quill","rabbit",
"radish","raisin","rapids","raven","reef","rhythm","ribbon","river","rocket","saddle","salmon","sapphire","satchel","scarf","sequoia","shadow",
"sierra","silver","sparrow","spiral","spruce","squid","stable","stream","sunset","tango","tartan","temple","thistle","thunder","tiger","timber",
"toffee","topaz","tornado","tulip","tundra","turkey","velvet","violet","walnut","walrus","whistle","willow","winter","yacht","zebra","zephyr",
"anchor","aurora","badger","bamboo","beaver","biscuit","blossom","bronze","caramel","carbon","cascade","cloud","coyote","crater","dynamo","feather",
"harvest","hornet","iguana","impala","jaguar","kernel","kingfish","ladder","lemur","liberty","meridian","mocha","nebula","orange","osprey","pagoda",
"parsley","peanut","pelican","picnic","pilgrim","pinwheel","poplar","quiver","raccoon","rattle","redwood","sailor","saturn","signal","sorbet","spark"];

// Uniform random integer in [0, n) using rejection sampling (avoids modulo bias)
function randInt(n) {
  var r = new Uint32Array(1), lim = 4294967296 - (4294967296 % n);
  do { crypto.getRandomValues(r); } while (r[0] >= lim);
  return r[0] % n;
}

function genPassword() {
  var L = Math.min(128, Math.max(4, parseInt(el('len').value, 10) || 20)), sets = [];
  if (el('up').checked) sets.push('ABCDEFGHIJKLMNOPQRSTUVWXYZ');
  if (el('lo').checked) sets.push('abcdefghijklmnopqrstuvwxyz');
  if (el('di').checked) sets.push('0123456789');
  if (el('sy').checked) sets.push('!@#%^&*()-_=+[]{};:,.<>?');
  if (!sets.length) return 'Select at least one character set.';
  var all = sets.join(''), pw = '';
  for (var i = 0; i < L; i++) pw += all[randInt(all.length)];
  return pw + '\n\nApprox. entropy: ' + Math.round(L * Math.log2(all.length)) + ' bits';
}

function genPassphrase() {
  var n = Math.min(12, Math.max(3, parseInt(el('words').value, 10) || 6)), sep = el('sep').value, parts = [];
  for (var i = 0; i < n; i++) {
    var w = WORDS[randInt(WORDS.length)];
    if (el('cap').checked) w = w.charAt(0).toUpperCase() + w.slice(1);
    parts.push(w);
  }
  var out = parts.join(sep), bits = n * Math.log2(WORDS.length);
  if (el('num').checked) { out += (sep === '' ? '' : sep) + randInt(10); bits += Math.log2(10); }
  return out + '\n\nApprox. entropy: ' + Math.round(bits) + ' bits (' + WORDS.length + '-word list)';
}

function gen() {
  el('out').textContent = el('mode').value === 'passphrase' ? genPassphrase() : genPassword();
}

el('mode').onchange = function () {
  var pp = el('mode').value === 'passphrase';
  el('pw-opts').style.display = pp ? 'none' : 'block';
  el('pp-opts').style.display = pp ? 'block' : 'none';
  gen();
};
el('go').onclick = gen;
gen();`,
  },
  {
    slug: 'regex', category: 'it', name: 'Regex Tester', icon: '&#x1F9EE;',
    desc: 'Test a regular expression against sample text and list every match with its position and capture groups.',
    inner: `
<label for="pat">Pattern</label>
<input type="text" id="pat" value="\\b\\w+@\\w+\\.\\w+\\b" spellcheck="false">
<label for="flg">Flags (any of i, m, s)</label>
<input type="text" id="flg" value="i" spellcheck="false">
<label for="txt">Test text</label>
<textarea id="txt" spellcheck="false">Contact logan@example.com or support@tmtcoau.com</textarea>
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
el('go').onclick = function () {
  try {
    var flags = el('flg').value.replace(/[^imsu]/g, '') + 'g';
    var re = new RegExp(el('pat').value, flags), s = el('txt').value, out = [], m, c = 0;
    while ((m = re.exec(s)) !== null && c < 500) {
      c++;
      out.push('#' + c + ' at ' + m.index + ': "' + m[0] + '"' + (m.length > 1 ? '  groups: ' + JSON.stringify(m.slice(1)) : ''));
      if (m[0] === '') re.lastIndex++;
    }
    el('out').textContent = out.length ? out.join('\n') : 'No matches';
  } catch (e) { el('out').textContent = 'Error: ' + e.message; }
};`,
  },
  {
    slug: 'urlcode', category: 'it', name: 'URL Encoder', icon: '&#x1F517;',
    desc: 'Percent-encode or decode URL components.',
    inner: `
<label for="in">Input</label>
<textarea id="in" spellcheck="false"></textarea>
<div class="tool-row">
<select id="mode"><option value="encode">Encode</option><option value="decode">Decode</option></select>
${TOOL_GO}
</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
el('go').onclick = function () {
  try {
    var v = el('in').value;
    el('out').textContent = el('mode').value === 'encode' ? encodeURIComponent(v) : decodeURIComponent(v);
  } catch (e) { el('out').textContent = 'Error: ' + e.message; }
};`,
  },
  {
    slug: 'dns', category: 'it', name: 'DNS Lookup', icon: '&#x1F50E;',
    desc: "Look up DNS records for a domain using Cloudflare's public DNS-over-HTTPS resolver, queried directly from your browser.",
    inner: `
<label for="dom">Domain</label>
<input type="text" id="dom" value="example.com" spellcheck="false">
<div class="tool-row">
<select id="typ"><option>A</option><option>AAAA</option><option>MX</option><option>TXT</option><option>NS</option><option>CNAME</option><option>SOA</option></select>
${TOOL_GO}
</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
el('go').onclick = function () {
  var n = el('dom').value.trim(), t = el('typ').value;
  if (!n) { el('out').textContent = 'Enter a domain.'; return; }
  el('out').textContent = 'Looking up...';
  fetch('https://cloudflare-dns.com/dns-query?name=' + encodeURIComponent(n) + '&type=' + t,
        { headers: { 'Accept': 'application/dns-json' } })
    .then(function (r) { return r.json(); })
    .then(function (j) {
      var a = j.Answer || [];
      if (!a.length) { el('out').textContent = 'No records found (status ' + j.Status + ').'; return; }
      el('out').textContent = a.map(function (x) {
        return x.name + '  TTL ' + x.TTL + '  type ' + x.type + '  ' + x.data;
      }).join('\n');
    })
    .catch(function (e) { el('out').textContent = 'Lookup failed: ' + e.message; });
};
el('dom').onkeydown = function (e) { if (e.key === 'Enter') el('go').onclick(); };`,
  },
  {
    slug: 'myip', category: 'it', name: 'My IP Address', icon: '&#x1F4E1;',
    desc: 'Shows the public IP address your browser connects from, using the ipify API.',
    inner: `
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function run() {
  el('out').textContent = 'Checking...';
  fetch('https://api.ipify.org?format=json')
    .then(function (r) { return r.json(); })
    .then(function (j) { el('out').textContent = 'Public IP: ' + j.ip; })
    .catch(function (e) { el('out').textContent = 'Lookup failed: ' + e.message; });
}
el('go').onclick = run;
run();`,
  },
  {
    slug: 'wordcount', category: 'general', name: 'Word & Character Counter', icon: '&#x1F4CA;',
    desc: 'Count words, characters, sentences and paragraphs, with an estimated reading and speaking time.',
    inner: `
<label for="in">Your text</label>
<textarea id="in" style="min-height:180px" placeholder="Paste or type your text here"></textarea>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function run() {
  var s = el('in').value;
  var words = s.trim() === '' ? 0 : s.trim().split(/\s+/).length;
  var chars = s.length;
  var noSpaces = s.replace(/\s/g, '').length;
  var sentences = s.split(/[.!?]+/).filter(function (x) { return x.trim() !== ''; }).length;
  var paras = s.trim() === '' ? 0 : s.trim().split(/\n\s*\n/).length;
  var readMin = Math.max(1, Math.round(words / 238));
  var speakMin = Math.max(1, Math.round(words / 130));
  el('out').textContent =
    'Words:          ' + words + '\n' +
    'Characters:     ' + chars + '\n' +
    'No spaces:      ' + noSpaces + '\n' +
    'Sentences:      ' + sentences + '\n' +
    'Paragraphs:     ' + paras + '\n' +
    'Reading time:   about ' + (words ? readMin : 0) + ' min\n' +
    'Speaking time:  about ' + (words ? speakMin : 0) + ' min';
}
el('in').oninput = run;
run();`,
  },
  {
    slug: 'casecon', category: 'general', name: 'Case Converter', icon: '&#x1F520;',
    desc: 'Convert text between UPPERCASE, lowercase, Title Case, Sentence case and programming styles like camelCase and snake_case.',
    inner: `
<label for="in">Input</label>
<textarea id="in" spellcheck="false">the quick brown fox jumps over the lazy dog</textarea>
<label for="mode">Convert to</label>
<select id="mode">
<option value="upper">UPPERCASE</option>
<option value="lower">lowercase</option>
<option value="title">Title Case</option>
<option value="sentence">Sentence case</option>
<option value="camel">camelCase</option>
<option value="pascal">PascalCase</option>
<option value="snake">snake_case</option>
<option value="kebab">kebab-case</option>
<option value="constant">CONSTANT_CASE</option>
</select>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function words(s) { return s.replace(/([a-z0-9])([A-Z])/g, '$1 $2').split(/[^A-Za-z0-9]+/).filter(Boolean); }
function cap(w) { return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase(); }
function run() {
  var s = el('in').value, m = el('mode').value, r;
  switch (m) {
    case 'upper': r = s.toUpperCase(); break;
    case 'lower': r = s.toLowerCase(); break;
    case 'title': r = s.toLowerCase().replace(/\b[a-z]/g, function (c) { return c.toUpperCase(); }); break;
    case 'sentence': r = s.toLowerCase().replace(/(^\s*|[.!?]\s+)([a-z])/g, function (x, a, b) { return a + b.toUpperCase(); }); break;
    case 'camel': r = words(s).map(function (w, i) { return i ? cap(w) : w.toLowerCase(); }).join(''); break;
    case 'pascal': r = words(s).map(cap).join(''); break;
    case 'snake': r = words(s).map(function (w) { return w.toLowerCase(); }).join('_'); break;
    case 'kebab': r = words(s).map(function (w) { return w.toLowerCase(); }).join('-'); break;
    case 'constant': r = words(s).map(function (w) { return w.toUpperCase(); }).join('_'); break;
  }
  el('out').textContent = r;
}
el('in').oninput = run;
el('mode').onchange = run;
run();`,
  },
  {
    slug: 'units', category: 'general', name: 'Unit Converter', icon: '&#x2696;&#xFE0F;',
    desc: 'Convert length, weight, volume and temperature between common units.',
    inner: `
<label for="cat">Category</label>
<select id="cat"><option value="length">Length</option><option value="mass">Weight / mass</option><option value="volume">Volume</option><option value="temp">Temperature</option></select>
<label for="val">Value</label>
<input type="number" id="val" value="1" step="any">
<div class="tool-row">
<select id="from"></select>
<span style="color:var(--muted)">to</span>
<select id="to"></select>
</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
var U = {
  length: { m: ['Metres', 1], km: ['Kilometres', 1000], cm: ['Centimetres', 0.01], mm: ['Millimetres', 0.001], mi: ['Miles', 1609.344], yd: ['Yards', 0.9144], ft: ['Feet', 0.3048], in: ['Inches', 0.0254] },
  mass: { kg: ['Kilograms', 1], g: ['Grams', 0.001], lb: ['Pounds', 0.45359237], oz: ['Ounces', 0.028349523125], st: ['Stone', 6.35029318] },
  volume: { l: ['Litres', 1], ml: ['Millilitres', 0.001], gal: ['US gallons', 3.785411784], qt: ['US quarts', 0.946352946], cup: ['US cups', 0.2365882365], floz: ['US fl oz', 0.0295735296] },
  temp: { C: ['Celsius', 0], F: ['Fahrenheit', 0], K: ['Kelvin', 0] }
};
function fill() {
  var units = U[el('cat').value], html = '';
  Object.keys(units).forEach(function (k) { html += '<option value="' + k + '">' + units[k][0] + '</option>'; });
  el('from').innerHTML = html; el('to').innerHTML = html;
  el('to').selectedIndex = Math.min(1, Object.keys(units).length - 1);
  run();
}
function toC(v, u) { return u === 'F' ? (v - 32) * 5 / 9 : u === 'K' ? v - 273.15 : v; }
function fromC(c, u) { return u === 'F' ? c * 9 / 5 + 32 : u === 'K' ? c + 273.15 : c; }
function run() {
  var v = parseFloat(el('val').value), f = el('from').value, t = el('to').value;
  if (isNaN(v)) { el('out').textContent = 'Enter a number.'; return; }
  var r;
  if (el('cat').value === 'temp') r = fromC(toC(v, f), t);
  else r = v * U[el('cat').value][f][1] / U[el('cat').value][t][1];
  r = Math.round(r * 1e8) / 1e8;
  el('out').textContent = v + ' ' + f + ' = ' + r + ' ' + t;
}
el('cat').onchange = fill;
el('val').oninput = run;
el('from').onchange = run;
el('to').onchange = run;
fill();`,
  },
  {
    slug: 'percent', category: 'general', name: 'Percentage Calculator', icon: '&#x0025;',
    desc: 'Work out percentages: a share of a number, what percent one number is of another, or the percentage change between two numbers.',
    inner: `
<label for="mode">What do you want to find?</label>
<select id="mode">
<option value="of">X% of a number</option>
<option value="what">What % is A of B?</option>
<option value="change">Percentage change from A to B</option>
</select>
<label for="a">First number (A or X)</label>
<input type="number" id="a" value="15" step="any">
<label for="b">Second number (B)</label>
<input type="number" id="b" value="200" step="any">
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function r2(x) { return Math.round(x * 100) / 100; }
function run() {
  var m = el('mode').value, a = parseFloat(el('a').value), b = parseFloat(el('b').value), t;
  if (isNaN(a) || isNaN(b)) { el('out').textContent = 'Enter two numbers.'; return; }
  if (m === 'of') t = a + '% of ' + b + ' = ' + r2(a / 100 * b);
  else if (m === 'what') {
    if (b === 0) { el('out').textContent = 'B cannot be zero.'; return; }
    t = a + ' is ' + r2(a / b * 100) + '% of ' + b;
  } else {
    if (a === 0) { el('out').textContent = 'A cannot be zero.'; return; }
    t = 'Change from ' + a + ' to ' + b + ': ' + r2((b - a) / a * 100) + '%';
  }
  el('out').textContent = t;
}
el('mode').onchange = run;
el('a').oninput = run;
el('b').oninput = run;
run();`,
  },
  {
    slug: 'tips', category: 'general', name: 'Tip & Bill Splitter', icon: '&#x1F9FE;',
    desc: 'Work out the tip, the total, and how much each person pays when splitting a bill.',
    inner: `
<label for="bill">Bill amount</label>
<input type="number" id="bill" value="85.50" min="0" step="0.01">
<label for="tip">Tip percentage</label>
<input type="number" id="tip" value="15" min="0" step="0.5">
<label for="ppl">Number of people</label>
<input type="number" id="ppl" value="3" min="1" step="1">
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function money(x) { return x.toFixed(2); }
function run() {
  var bill = parseFloat(el('bill').value), tip = parseFloat(el('tip').value), n = parseInt(el('ppl').value, 10);
  if (isNaN(bill) || isNaN(tip) || !(n >= 1)) { el('out').textContent = 'Fill in all three fields.'; return; }
  var tipAmt = bill * tip / 100, total = bill + tipAmt;
  el('out').textContent =
    'Tip:              ' + money(tipAmt) + '\n' +
    'Total:            ' + money(total) + '\n' +
    'Each person pays: ' + money(total / n) + '\n' +
    '(amounts are shown to the cent and may not divide exactly)';
}
['bill', 'tip', 'ppl'].forEach(function (id) { el(id).oninput = run; });
run();`,
  },
  {
    slug: 'datecalc', category: 'general', name: 'Date Calculator', icon: '&#x1F4C5;',
    desc: 'Find the number of days between two dates, or work out an age from a date of birth.',
    inner: `
<label for="d1">From</label>
<input type="date" id="d1">
<label for="d2">To (leave blank for today)</label>
<input type="date" id="d2">
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function parse(v) { return v ? new Date(v + 'T00:00:00') : null; }
function ymd(a, b) {
  var y = b.getFullYear() - a.getFullYear(), m = b.getMonth() - a.getMonth(), d = b.getDate() - a.getDate();
  if (d < 0) { m--; d += new Date(b.getFullYear(), b.getMonth(), 0).getDate(); }
  if (m < 0) { y--; m += 12; }
  return [y, m, d];
}
function run() {
  var a = parse(el('d1').value), b = parse(el('d2').value) || new Date(new Date().toDateString());
  if (!a) { el('out').textContent = 'Pick a start date.'; return; }
  var from = a < b ? a : b, to = a < b ? b : a;
  var days = Math.round((to - from) / 86400000);
  var p = ymd(from, to);
  el('out').textContent =
    'Days:             ' + days + '\n' +
    'Weeks:            ' + Math.floor(days / 7) + ' weeks, ' + (days % 7) + ' days\n' +
    'Years/months/days: ' + p[0] + ' years, ' + p[1] + ' months, ' + p[2] + ' days';
}
el('d1').onchange = run;
el('d2').onchange = run;
run();`,
  },
  {
    slug: 'dice', category: 'general', name: 'Dice Roller', icon: '&#x1F3B2;',
    desc: 'Roll any number of dice with any number of sides, for board games, tabletop RPGs or quick decisions.',
    inner: `
<label for="cnt">Number of dice (1-20)</label>
<input type="number" id="cnt" value="2" min="1" max="20">
<label for="sides">Sides per die (2-100)</label>
<input type="number" id="sides" value="6" min="2" max="100">
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function randInt(n) {
  var r = new Uint32Array(1), lim = 4294967296 - (4294967296 % n);
  do { crypto.getRandomValues(r); } while (r[0] >= lim);
  return r[0] % n;
}
function roll() {
  var c = Math.min(20, Math.max(1, parseInt(el('cnt').value, 10) || 1));
  var s = Math.min(100, Math.max(2, parseInt(el('sides').value, 10) || 6));
  var rolls = [], total = 0;
  for (var i = 0; i < c; i++) { var v = randInt(s) + 1; rolls.push(v); total += v; }
  el('out').textContent = 'Rolls: ' + rolls.join(', ') + '\nTotal: ' + total;
}
el('go').onclick = roll;
roll();`,
  },
  {
    slug: 'picker', category: 'general', name: 'Random Picker', icon: '&#x1F3AF;',
    desc: 'Enter a list of options, one per line, and let the tool pick one at random. Useful for decisions, raffles and fair turn-taking.',
    inner: `
<label for="in">Options (one per line)</label>
<textarea id="in" spellcheck="false">Pizza
Tacos
Sushi
Burgers</textarea>
<div class="tool-row">${TOOL_GO}</div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function randInt(n) {
  var r = new Uint32Array(1), lim = 4294967296 - (4294967296 % n);
  do { crypto.getRandomValues(r); } while (r[0] >= lim);
  return r[0] % n;
}
el('go').onclick = function () {
  var items = el('in').value.split('\n').map(function (x) { return x.trim(); }).filter(Boolean);
  if (!items.length) { el('out').textContent = 'Add at least one option.'; return; }
  el('out').textContent = 'Picked: ' + items[randInt(items.length)];
};`,
  },
  {
    slug: 'colour', category: 'general', name: 'Colour Converter', icon: '&#x1F3A8;',
    desc: 'Convert colours between HEX, RGB and HSL, with a live preview. Pick a colour or type a HEX code.',
    inner: `
<div class="tool-row">
<input type="color" id="pick" value="#3b82f6" aria-label="Colour picker">
<input type="text" id="hex" value="#3b82f6" spellcheck="false" style="width:auto;flex:1">
</div>
<div id="sw" style="height:90px;border-radius:10px;border:1px solid var(--border);margin-top:1rem"></div>
${TOOL_OUT}`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
function parseHex(h) {
  h = h.replace('#', '').trim();
  if (/^[0-9a-f]{3}$/i.test(h)) h = h.split('').map(function (c) { return c + c; }).join('');
  if (!/^[0-9a-f]{6}$/i.test(h)) return null;
  return [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
}
function toHex(r, g, b) { return '#' + [r, g, b].map(function (x) { return ('0' + x.toString(16)).slice(-2); }).join(''); }
function toHsl(r, g, b) {
  r /= 255; g /= 255; b /= 255;
  var mx = Math.max(r, g, b), mn = Math.min(r, g, b), h = 0, s = 0, l = (mx + mn) / 2;
  if (mx !== mn) {
    var d = mx - mn;
    s = l > 0.5 ? d / (2 - mx - mn) : d / (mx + mn);
    if (mx === r) h = (g - b) / d + (g < b ? 6 : 0);
    else if (mx === g) h = (b - r) / d + 2;
    else h = (r - g) / d + 4;
    h *= 60;
  }
  return [Math.round(h), Math.round(s * 100), Math.round(l * 100)];
}
function show(rgb) {
  var hex = toHex(rgb[0], rgb[1], rgb[2]), hsl = toHsl(rgb[0], rgb[1], rgb[2]);
  el('sw').style.background = hex;
  el('out').textContent =
    'HEX: ' + hex.toUpperCase() + '\n' +
    'RGB: rgb(' + rgb.join(', ') + ')\n' +
    'HSL: hsl(' + hsl[0] + ', ' + hsl[1] + '%, ' + hsl[2] + '%)';
}
el('pick').oninput = function () {
  el('hex').value = el('pick').value;
  show(parseHex(el('pick').value));
};
el('hex').oninput = function () {
  var rgb = parseHex(el('hex').value);
  if (!rgb) { el('out').textContent = 'Enter a HEX colour such as #3b82f6 or #fff.'; return; }
  el('pick').value = toHex(rgb[0], rgb[1], rgb[2]);
  show(rgb);
};
show(parseHex('#3b82f6'));`,
  },
  {
    slug: 'stopwatch', category: 'general', name: 'Stopwatch', icon: '&#x23F1;&#xFE0F;',
    desc: 'A simple stopwatch with start, stop and reset. Good for timing tasks, workouts and cooking.',
    inner: `
<div class="tool-row">
<button type="button" class="btn btn-primary" id="start">Start</button>
<button type="button" class="btn btn-ghost" id="stop">Stop</button>
<button type="button" class="btn btn-ghost" id="reset">Reset</button>
</div>
<div class="tool-out" id="out" style="font-size:2rem;text-align:center;letter-spacing:.05em"></div>`,
    script: String.raw`
var el = function (i) { return document.getElementById(i); };
var t0 = 0, elapsed = 0, timer = null;
function p2(n) { return ('0' + n).slice(-2); }
function fmt(ms) {
  var s = Math.floor(ms / 1000), cs = Math.floor((ms % 1000) / 10);
  return Math.floor(s / 3600) + ':' + p2(Math.floor((s % 3600) / 60)) + ':' + p2(s % 60) + '.' + p2(cs);
}
function tick() { el('out').textContent = fmt(elapsed + (timer ? Date.now() - t0 : 0)); }
el('start').onclick = function () { if (timer) return; t0 = Date.now(); timer = setInterval(tick, 50); };
el('stop').onclick = function () {
  if (!timer) return;
  elapsed += Date.now() - t0; clearInterval(timer); timer = null; tick();
};
el('reset').onclick = function () { clearInterval(timer); timer = null; elapsed = 0; tick(); };
tick();`,
  },
];

function toolShell(t) {
  const body = `
<style>${TOOL_CSS}</style>
<div class="page-section top">
<div class="section-header">
<div class="section-label">IT Tool</div>
<h2 class="section-title">${t.name}</h2>
<p class="section-sub">${t.desc}</p>
</div>
<div class="tool-box">
${t.inner}
</div>
<div class="back-row"><a href="${t.category === 'general' ? '/gen-tools' : '/it-tools'}" class="btn btn-ghost">&larr; Back to ${t.category === 'general' ? 'General Tools' : 'IT Tools'}</a></div>
</div>
<script>
${t.script}
</script>`;
  return shell(t.name, body, t.category === 'general' ? 'general' : 'tools');
}

INTERNAL_TOOLS.forEach(function (t) {
  app.get((t.category === 'general' ? '/gen-tools/' : '/it-tools/') + t.slug, (c) => toolShell(t));
});

// External tools - kept as links because they need large datasets,
// scanning infrastructure, or server-side work that isn't practical in-site.
const EXTERNAL_TOOL_GROUPS = [
  {
    title: 'Network & email (external)',
    tools: [
      { name: 'MXToolbox', url: 'https://mxtoolbox.com/', desc: 'DNS, MX, SMTP, blacklist and DMARC checks.' },
      { name: 'DNSChecker', url: 'https://dnschecker.org/', desc: 'DNS propagation across many global resolvers.' },
      { name: 'Hurricane Electric BGP Toolkit', url: 'https://bgp.he.net/', desc: 'IP, ASN and routing lookups.' },
      { name: 'Google Admin Toolbox', url: 'https://toolbox.googleapps.com/apps/main/', desc: 'Dig, MX checks and email header analysis.' },
      { name: 'Microsoft Remote Connectivity Analyzer', url: 'https://testconnectivity.microsoft.com/', desc: 'Test Exchange, Outlook and Microsoft 365 connectivity.' },
    ],
  },
  {
    title: 'Website & security checks (external)',
    tools: [
      { name: 'SSL Labs Server Test', url: 'https://www.ssllabs.com/ssltest/', desc: "Grades a site's TLS configuration." },
      { name: 'Security Headers', url: 'https://securityheaders.com/', desc: 'Checks which HTTP security headers a website sends.' },
      { name: 'Mozilla Observatory', url: 'https://observatory.mozilla.org/', desc: 'Broader website security scan with a graded report.' },
      { name: 'Have I Been Pwned', url: 'https://haveibeenpwned.com/', desc: 'Check whether an email address appears in known data breaches.' },
    ],
  },
  {
    title: 'Microsoft, cloud & other (external)',
    tools: [
      { name: 'Graph Explorer', url: 'https://developer.microsoft.com/graph/graph-explorer', desc: 'Run Microsoft Graph calls against your own tenant.' },
      { name: 'Cloudflare Radar', url: 'https://radar.cloudflare.com/', desc: 'Internet traffic, trends and outage data.' },
      { name: 'Crontab Guru', url: 'https://crontab.guru/', desc: 'Explains cron schedules in plain English.' },
      { name: 'Speedtest by Ookla', url: 'https://www.speedtest.net/', desc: 'Measure download, upload and latency.' },
      { name: 'Fast.com', url: 'https://fast.com/', desc: 'Quick, minimal download speed test.' },
    ],
  },
];

function renderExternalGroups(groups) {
  return groups.map(function (g) {
    const cards = g.tools.map(function (t) {
      return '<a href="' + escapeHtml(t.url) + '" target="_blank" rel="noopener noreferrer" class="card">' +
        '<div class="card-icon">&#x1F517;</div>' +
        '<h3>' + escapeHtml(t.name) + '</h3>' +
        '<p>' + escapeHtml(t.desc) + '</p>' +
        '<span class="card-link">Open &rarr;</span>' +
        '</a>';
    }).join('');
    return '<div class="section-header" style="margin-top:3.5rem"><div class="section-label">' +
      escapeHtml(g.title) + '</div></div><div class="cards">' + cards + '</div>';
  }).join('');
}

function toolCardsHtml(cat) {
  const base = cat === 'general' ? '/gen-tools/' : '/it-tools/';
  return INTERNAL_TOOLS.filter((t) => t.category === cat).map((t) => `
<a href="${base}${t.slug}" class="card">
<div class="card-icon">${t.icon}</div>
<h3>${t.name}</h3>
<p>${t.desc}</p>
<span class="card-link">Open tool &rarr;</span>
</a>`).join('');
}

app.get('/it-tools', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">Resources</div>
<h2 class="section-title">IT Tools</h2>
<p class="section-sub">Tools for troubleshooting, networking, encoding and developer work. They run on this site. Further down, a few larger services are linked externally because they need their own infrastructure.</p>
</div>
<div class="cards">${toolCardsHtml('it')}</div>
${renderExternalGroups(EXTERNAL_TOOL_GROUPS)}
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('IT Tools', body, 'tools');
});

app.get('/gen-tools', (c) => {
  const body = `
<div class="page-section top">
<div class="section-header">
<div class="section-label">Resources</div>
<h2 class="section-title">General Purpose Tools</h2>
<p class="section-sub">Everyday tools for anyone: counting words, converting units, working out percentages and dates, picking colours, and more. Everything runs in your browser.</p>
</div>
<div class="cards">${toolCardsHtml('general')}</div>
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('General Purpose Tools', body, 'general');
});

// ============================================================
// COMMAND REFERENCE (Windows CMD, PowerShell, Linux, macOS)
// ============================================================
const COMMAND_GROUPS = [
  {
    id: 'cmd',
    title: 'Windows Command Prompt (CMD)',
    rows: [
      ['ipconfig /all', 'Full network configuration for every adapter.'],
      ['ipconfig /flushdns', 'Clear the DNS resolver cache.'],
      ['ipconfig /release  then  ipconfig /renew', 'Drop and request a new DHCP lease.'],
      ['ping -n 4 example.com', 'Send four echo requests to test connectivity.'],
      ['tracert example.com', 'Show each hop on the route to a host.'],
      ['nslookup example.com', 'Query DNS for a hostname.'],
      ['netstat -ano', 'List active connections and listening ports with owning PIDs.'],
      ['tasklist', 'List running processes.'],
      ['taskkill /PID 1234 /F', 'Force-stop a process by its PID.'],
      ['systeminfo', 'OS version, hardware, install date and uptime.'],
      ['whoami /all', 'Current user, groups and privileges.'],
      ['net user', 'List local user accounts.'],
      ['net localgroup administrators', 'List members of the local Administrators group.'],
      ['sfc /scannow', 'Scan and repair protected system files (run as Administrator).'],
      ['DISM /Online /Cleanup-Image /RestoreHealth', 'Repair the Windows component store (run as Administrator).'],
      ['chkdsk C: /f', 'Check the C: drive for errors and fix them (may require a reboot).'],
      ['gpupdate /force', 'Reapply Group Policy immediately.'],
      ['where notepad', 'Find the location of an executable on the PATH.'],
      ['dir /s /b *.log', 'Recursively list every .log file under the current folder.'],
      ['shutdown /r /t 0', 'Restart the computer immediately.'],
    ],
  },
  {
    id: 'powershell',
    title: 'Windows PowerShell',
    rows: [
      ['Get-ComputerInfo', 'Detailed system, OS and hardware information.'],
      ['Get-NetIPConfiguration', 'IP, gateway and DNS settings per adapter.'],
      ['Test-NetConnection example.com -Port 443', 'Test TCP reachability to a host and port.'],
      ['Resolve-DnsName example.com', 'DNS lookup with record type support.'],
      ['Clear-DnsClientCache', 'Clear the DNS client cache.'],
      ['Get-Process | Sort-Object CPU -Descending | Select-Object -First 10', 'Top 10 processes by CPU time.'],
      ['Get-Service | Where-Object Status -eq Stopped', 'List all stopped services.'],
      ['Restart-Service -Name Spooler', 'Restart a service by name (run as Administrator).'],
      ['Get-WinEvent -LogName System -MaxEvents 20', 'Show the 20 most recent System event log entries.'],
      ['Get-LocalUser', 'List local user accounts and their status.'],
      ['Get-LocalGroupMember -Group Administrators', 'List members of the local Administrators group.'],
      ['Get-ChildItem -Recurse -Filter *.log', 'Search the current folder tree for .log files.'],
      ['Get-Content C:\\path\\app.log -Wait -Tail 20', 'Follow the end of a log file in real time (like tail -f).'],
      ['Get-FileHash C:\\file.iso -Algorithm SHA256', 'Verify a file hash, for example after a download.'],
      ['Get-Disk', 'List physical disks and their health.'],
      ['Invoke-WebRequest https://example.com -Method Head', 'Fetch only the HTTP headers of a URL.'],
      ['Get-Date -Format o', 'Current date and time in ISO 8601 format.'],
      ['Get-ExecutionPolicy -List', 'Show the script execution policy at each scope.'],
    ],
  },
  {
    id: 'linux',
    title: 'Linux',
    rows: [
      ['df -h', 'Disk space used and free on each filesystem.'],
      ['du -sh * | sort -h', 'Size of each item in the current folder, sorted.'],
      ['free -h', 'Memory and swap usage.'],
      ['uptime', 'System uptime and load averages.'],
      ['top  /  htop', 'Live view of processes and resource use.'],
      ['ps aux | grep nginx', 'Find running processes matching a name.'],
      ['ss -tulpn', 'Listening TCP and UDP ports with owning processes.'],
      ['ip a  and  ip r', 'Network interfaces with addresses, and the routing table.'],
      ['dig example.com +short', 'Concise DNS lookup.'],
      ['curl -I https://example.com', 'Fetch only the HTTP response headers.'],
      ['sudo systemctl status nginx', 'Check the status of a service.'],
      ['sudo systemctl restart nginx', 'Restart a service.'],
      ['journalctl -u nginx -f', 'Follow the logs for a specific service.'],
      ['sudo apt update && sudo apt upgrade', 'Update package lists and upgrade installed packages (Debian/Ubuntu).'],
      ['grep -R "error" /var/log', 'Recursively search files for a string.'],
      ['find / -name "*.conf" 2>/dev/null', 'Find files by name, hiding permission errors.'],
      ['lsof -i :80', 'Show which process is using a port.'],
      ['tar -czf backup.tar.gz folder/', 'Create a compressed archive.'],
      ['chmod 640 file  /  chown user:group file', 'Change file permissions or ownership.'],
      ['last -n 10', 'Show the last 10 logins.'],
    ],
  },
  {
    id: 'macos',
    title: 'macOS',
    rows: [
      ['sw_vers', 'macOS version and build number.'],
      ['system_profiler SPHardwareDataType', 'Hardware model, chip, memory and serial.'],
      ['df -h', 'Disk space used and free.'],
      ['diskutil list', 'List disks and partitions.'],
      ['ipconfig getifaddr en0', 'IP address of the Wi-Fi interface (en0).'],
      ['networksetup -listallhardwareports', 'List network services and their device names.'],
      ['scutil --dns', 'Show the DNS resolver configuration.'],
      ['sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder', 'Flush the DNS cache.'],
      ['lsof -iTCP -sTCP:LISTEN -n -P', 'List listening TCP ports and their processes.'],
      ['pmset -g batt', 'Battery status and charge level.'],
      ['caffeinate -d', 'Keep the display awake until stopped with Ctrl+C.'],
      ['softwareupdate -l', 'List available macOS updates.'],
      ['launchctl list', 'List loaded launchd services.'],
      ['log show --last 1h --info', 'Show unified log entries from the last hour.'],
      ['brew update && brew upgrade', 'Update Homebrew and upgrade installed packages.'],
      ['open -a "Activity Monitor"', 'Open an application from the terminal.'],
    ],
  },
];

function renderCommandGroups(groups) {
  const jump = groups.map(function (g) {
    return '<a href="#' + escapeHtml(g.id) + '" class="admin-link">' + escapeHtml(g.title) + '</a>';
  }).join('');

  const sections = groups.map(function (g) {
    const rows = g.rows.map(function (r) {
      return '<tr><td><code>' + escapeHtml(r[0]) + '</code></td><td>' + escapeHtml(r[1]) + '</td></tr>';
    }).join('');
    return '<div id="' + escapeHtml(g.id) + '" style="scroll-margin-top:90px;margin-top:3rem">' +
      '<h3 class="section-title" style="font-size:1.4rem">' + escapeHtml(g.title) + '</h3>' +
      '<div class="device-table-wrap"><table class="cmd-table"><tbody>' + rows + '</tbody></table></div>' +
      '</div>';
  }).join('');

  return '<div class="admin-links" style="margin-bottom:1rem">' + jump + '</div>' + sections;
}

app.get('/commands', (c) => {
  const body = `
<style>
.cmd-table{width:100%;border-collapse:collapse;font-size:.88rem}
.cmd-table td{padding:.7rem .9rem;border-bottom:1px solid var(--border);vertical-align:top;color:var(--muted)}
.cmd-table tr:last-child td{border-bottom:none}
.cmd-table td:first-child{width:45%;color:var(--text)}
.cmd-table code{font-family:ui-monospace,SFMono-Regular,Consolas,monospace;color:var(--accent2);word-break:break-word;font-size:.85rem}
</style>
<div class="page-section top">
<div class="section-header">
<div class="section-label">Reference</div>
<h2 class="section-title">Command Reference</h2>
<p class="section-sub">Useful commands for Windows (CMD and PowerShell), Linux and macOS. Commands marked as needing Administrator or sudo will fail without it.</p>
</div>
${renderCommandGroups(COMMAND_GROUPS)}
<div class="back-row"><a href="/" class="btn btn-ghost">&larr; Back to Home</a></div>
</div>`;
  return shell('Command Reference', body, 'commands');
});


// ============================================================
// NATIVE (iOS app) VERIFIED ID
// Durable Object-backed transactions. Binding: NATIVE_VC_TXNS
// (wrangler.jsonc durable_objects + migrations "native-vc-v1").
// ============================================================
const NATIVE_VC_TTL_MS = 10 * 60 * 1000;
const NATIVE_VI_STATE = /^nvi_[0-9a-f-]{36}$/i;
const NATIVE_VI_TTL_SECONDS = 600;
const NATIVE_VC_STATE = /^nvc_[0-9a-f-]{36}$/i;
const POLL_VERIFIER = /^[A-Za-z0-9_-]{43,128}$/;

function constantTimeStringEqual(left, right) {
  if (typeof left !== 'string' || typeof right !== 'string' || left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) {
    difference |= left.charCodeAt(index) ^ right.charCodeAt(index);
  }
  return difference === 0;
}

async function sha256Hex(value) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(value));
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

// Per-IP limit: 8 transaction starts per minute (KV counter).
async function nativeVerifiedIdRateLimited(c) {
  const address = c.req.header('CF-Connecting-IP');
  if (!address || !c.env.SESSIONS) return false;
  const key = `native-vc-rate:${await sha256Hex(address)}`;
  const count = Number(await c.env.SESSIONS.get(key) || 0);
  if (count >= 8) return true;
  await c.env.SESSIONS.put(key, String(count + 1), { expirationTtl: 60 });
  return false;
}

function bearerOf(c) {
  const authorization = c.req.header('Authorization') || '';
  return authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
}

export class NativeVerifiedIDTransaction {
  constructor(state) {
    this.state = state;
  }

  async fetch(request) {
    const action = new URL(request.url).pathname;

    if (action === '/initialize' && request.method === 'POST') {
      const record = await request.json().catch(() => null);
      if (!record || !record.pollVerifierHash || !record.expiresAt) {
        return Response.json({ error: 'invalid_request' }, { status: 400 });
      }
      await this.state.storage.put('record', record);
      await this.state.storage.setAlarm(record.expiresAt);
      return Response.json({ ok: true });
    }

    if (action === '/request' && request.method === 'POST') {
      const update = await request.json().catch(() => null);
      await this.state.storage.transaction(async (txn) => {
        const record = await txn.get('record');
        if (!record || Date.now() >= record.expiresAt || record.status !== 'pending') return;
        record.requestUrl = update?.url || null;
        record.qrCode = update?.qrCode || null;
        await txn.put('record', record);
      });
      return Response.json({ ok: true });
    }

    if (action === '/callback' && request.method === 'POST') {
      const update = await request.json().catch(() => null);
      const known = ['request_retrieved', 'presentation_verified', 'presentation_error', 'issuance_successful', 'issuance_error'];
      if (!update || !known.includes(update.status)) {
        return Response.json({ handled: false });
      }
      let handled = false;
      await this.state.storage.transaction(async (txn) => {
        const record = await txn.get('record');
        if (!record || Date.now() >= record.expiresAt || record.consumed || record.cancelled) return;
        handled = true;

        if (record.kind === 'issue') {
          if (record.status === 'issued' || record.status === 'error') return;
          if (update.status === 'request_retrieved' && record.status === 'pending') {
            record.status = 'request_retrieved';
          } else if (update.status === 'issuance_successful') {
            record.status = 'issued';
          } else if (update.status === 'issuance_error') {
            record.status = 'error';
          } else {
            return;
          }
          await txn.put('record', record);
          return;
        }

        if (record.status === 'presentation_verified' || record.status === 'presentation_error') return;
        if (update.status === 'request_retrieved' && record.status === 'pending') {
          record.status = 'request_retrieved';
        } else if (update.status === 'presentation_verified') {
          record.status = update.identity ? 'presentation_verified' : 'presentation_error';
          record.identity = update.identity || null;
        } else if (update.status === 'presentation_error') {
          record.status = 'presentation_error';
        }
        await txn.put('record', record);
      });
      return Response.json({ handled });
    }

    if (action === '/status' && request.method === 'POST') {
      const pollVerifierHash = request.headers.get('x-poll-verifier-hash') || '';
      let result = { status: 'expired' };
      await this.state.storage.transaction(async (txn) => {
        const record = await txn.get('record');
        if (!record || Date.now() >= record.expiresAt) return;
        if (!constantTimeStringEqual(record.pollVerifierHash, pollVerifierHash)) {
          result = { status: 'unauthorized' };
          return;
        }
        if (record.cancelled) {
          result = { status: 'cancelled' };
        } else if (record.consumed) {
          result = { status: 'consumed' };
        } else if (record.kind !== 'issue' && record.status === 'presentation_verified' && record.identity) {
          record.consumed = true;
          result = { status: 'presentation_verified', identity: record.identity };
          record.identity = null;
          await txn.put('record', record);
        } else if (record.kind !== 'issue' && record.status === 'presentation_error') {
          record.consumed = true;
          result = { status: 'presentation_error' };
          await txn.put('record', record);
        } else {
          result = { status: record.status || 'pending' };
        }
      });
      return Response.json(result, { status: result.status === 'unauthorized' ? 403 : 200 });
    }

    if (action === '/cancel' && request.method === 'POST') {
      const pollVerifierHash = request.headers.get('x-poll-verifier-hash') || '';
      let status = 204;
      await this.state.storage.transaction(async (txn) => {
        const record = await txn.get('record');
        if (!record) return;
        if (!constantTimeStringEqual(record.pollVerifierHash, pollVerifierHash)) {
          status = 403;
          return;
        }
        record.cancelled = true;
        record.identity = null;
        await txn.put('record', record);
      });
      return new Response(null, { status });
    }

    return new Response(null, { status: 404 });
  }

  async alarm() {
    await this.state.storage.deleteAll();
  }
}

// ---- Sign-in (presentation) ----

app.post('/auth/native/verifiedid/start', async (c) => {
  const transactions = c.env.NATIVE_VC_TXNS;
  if (!transactions || !c.env.VC_CALLBACK_KEY) {
    return c.json({ error: 'verified_id_not_configured' }, 503);
  }
  if (await nativeVerifiedIdRateLimited(c)) {
    return c.json({ error: 'rate_limited' }, 429);
  }

  const body = await c.req.json().catch(() => null);
  const pollVerifier = body?.pollVerifier;
  if (typeof pollVerifier !== 'string' || !POLL_VERIFIER.test(pollVerifier)) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const state = `nvc_${crypto.randomUUID()}`;
  const transaction = transactions.get(transactions.idFromName(state));
  const createdAt = Date.now();
  const initialized = await transaction.fetch('https://native-vc/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      pollVerifierHash: await sha256Hex(pollVerifier),
      createdAt,
      expiresAt: createdAt + NATIVE_VC_TTL_MS,
      status: 'pending',
    }),
  });
  if (!initialized.ok) return c.json({ error: 'transaction_unavailable' }, 503);

  const failTransaction = async () => {
    await transaction.fetch('https://native-vc/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'presentation_error' }),
    });
  };

  const token = await getVerifiedIdAppToken(c);
  if (!token) {
    await failTransaction();
    return c.json({ error: 'verified_id_unavailable' }, 502);
  }

  const verifierAuthority = c.env.VC_VERIFIER_AUTHORITY || c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT;
  const acceptedIssuer = c.env.VC_ISSUER || c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT;
  const credentialType = c.env.VC_TYPE || VC_TYPE_DEFAULT;
  const requestBody = {
    authority: verifierAuthority,
    includeQRCode: true,
    includeReceipt: false,
    registration: {
      clientName: c.env.VC_VERIFIER_CLIENT_NAME || 'TMTCo App',
      purpose: 'Sign in to TMTCo using your verified employee credential',
    },
    callback: {
      url: `${getBaseUrl(c)}/auth/verifiedid/callback`,
      state,
      headers: { 'api-key': c.env.VC_CALLBACK_KEY },
    },
    requestedCredentials: [{
      type: credentialType,
      purpose: 'Prove that you are a verified TMTCo employee',
      acceptedIssuers: [acceptedIssuer],
      configuration: { validation: { allowRevoked: false, validateLinkedDomain: true } },
    }],
  };

  let offerURL = '';
  try {
    const response = await fetch('https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createPresentationRequest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify(requestBody),
    });
    const responseBody = await response.json().catch(() => null);
    const url = typeof responseBody?.url === 'string' && responseBody.url.length <= 8192 ? responseBody.url : '';
    let scheme = '';
    try { scheme = url ? new URL(url).protocol : ''; } catch { scheme = ''; }
    if (!response.ok || !['https:', 'openid-vc:', 'openid-credential-offer:'].includes(scheme)) {
      console.error('Native createPresentationRequest failed:', response.status, JSON.stringify(responseBody));
      await failTransaction();
      return c.json({ error: 'verified_id_request_failed' }, 502);
    }
    offerURL = url;
  } catch {
    await failTransaction();
    return c.json({ error: 'verified_id_request_failed' }, 502);
  }

  await transaction.fetch('https://native-vc/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: offerURL }),
  });

  return c.json({
    state,
    url: offerURL,
    expiresIn: Math.floor(NATIVE_VC_TTL_MS / 1000),
  }, 201);
});

app.get('/auth/native/verifiedid/status', async (c) => {
  const transactions = c.env.NATIVE_VC_TXNS;
  const state = c.req.query('state') || '';
  const pollVerifier = bearerOf(c);
  if (!transactions || !NATIVE_VC_STATE.test(state) || !POLL_VERIFIER.test(pollVerifier)) {
    return c.json({ error: 'invalid_transaction' }, 403);
  }

  const transaction = transactions.get(transactions.idFromName(state));
  const response = await transaction.fetch('https://native-vc/status', {
    method: 'POST',
    headers: { 'x-poll-verifier-hash': await sha256Hex(pollVerifier) },
  });
  if (response.status === 403) return c.json({ error: 'invalid_transaction' }, 403);

  const result = await response.json().catch(() => ({ status: 'expired' }));
  if (result.status === 'presentation_error') {
    return c.json({ status: 'presentation_error', errorMessage: 'Verified ID could not verify this presentation.' });
  }
  if (result.status === 'presentation_verified') {
    return c.json({ status: result.status, identity: result.identity });
  }
  return c.json({ status: result.status || 'pending' });
});

app.post('/auth/native/verifiedid/cancel', async (c) => {
  const transactions = c.env.NATIVE_VC_TXNS;
  const body = await c.req.json().catch(() => null);
  const state = body?.state;
  const pollVerifier = bearerOf(c);
  if (!transactions || typeof state !== 'string' || !NATIVE_VC_STATE.test(state) || !POLL_VERIFIER.test(pollVerifier)) {
    return c.json({ error: 'invalid_transaction' }, 403);
  }

  const transaction = transactions.get(transactions.idFromName(state));
  const response = await transaction.fetch('https://native-vc/cancel', {
    method: 'POST',
    headers: { 'x-poll-verifier-hash': await sha256Hex(pollVerifier) },
  });
  return response.status === 403 ? c.json({ error: 'invalid_transaction' }, 403) : c.body(null, 204);
});

// ---- Issuance (Dashboard "Get my Verified ID" card in the iOS app) ----

app.post('/auth/native/verifiedid/issue/start', async (c) => {
  const transactions = c.env.NATIVE_VC_TXNS;
  if (!transactions || !c.env.VC_CALLBACK_KEY) {
    return c.json({ error: 'verified_id_not_configured' }, 503);
  }
  if (await nativeVerifiedIdRateLimited(c)) {
    return c.json({ error: 'rate_limited' }, 429);
  }

  // The app's Graph token identifies the caller. Only a signed-in TMTCo member may get an offer.
  const accessToken = bearerOf(c);
  if (!accessToken) {
    console.error('Native issue/start: no bearer token was sent');
    return c.json({ error: 'unauthorized', reason: 'missing_token', tokenLength: 0 }, 401);
  }
  // Graph validates the token itself below, so this is only a sanity cap.
  // Admin tokens with many directory roles can be well over 4 KB.
  if (accessToken.length > 16384) {
    console.error('Native issue/start: bearer token too large (length', accessToken.length, ')');
    return c.json({ error: 'unauthorized', reason: 'token_too_large', tokenLength: accessToken.length }, 401);
  }
  const meRes = await fetch('https://graph.microsoft.com/v1.0/me?$select=mail,userPrincipalName,userType', {
    headers: { Authorization: `Bearer ${accessToken}` },
  });
  if (meRes.status === 401) {
    const graphBody = await meRes.text().catch(() => '');
    console.error('Native issue/start: Graph rejected the token (401):', graphBody.slice(0, 300));
    return c.json({ error: 'session_expired', reason: 'graph_rejected_token', graphStatus: 401 }, 401);
  }
  if (!meRes.ok) {
    const graphBody = await meRes.text().catch(() => '');
    console.error('Native issue/start: Graph /me failed:', meRes.status, graphBody.slice(0, 300));
    return c.json({ error: 'verified_id_unavailable', reason: 'graph_me_failed', graphStatus: meRes.status }, 502);
  }
  const me = await meRes.json().catch(() => null);
  if (!me || !(me.mail || me.userPrincipalName) || me.userType !== 'Member') {
    return c.json({ error: 'not_eligible' }, 403);
  }

  const body = await c.req.json().catch(() => null);
  const pollVerifier = body?.pollVerifier;
  if (typeof pollVerifier !== 'string' || !POLL_VERIFIER.test(pollVerifier)) {
    return c.json({ error: 'invalid_request' }, 400);
  }

  const token = await getVerifiedIdAppToken(c);
  if (!token) return c.json({ error: 'verified_id_unavailable' }, 502);

  const state = `nvi_${crypto.randomUUID()}`;
  const transaction = transactions.get(transactions.idFromName(state));
  const createdAt = Date.now();
  const initialized = await transaction.fetch('https://native-vc/initialize', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      kind: 'issue',
      pollVerifierHash: await sha256Hex(pollVerifier),
      createdAt,
      expiresAt: createdAt + NATIVE_VI_TTL_SECONDS * 1000,
      status: 'pending',
    }),
  });
  if (!initialized.ok) return c.json({ error: 'transaction_unavailable' }, 503);

  let offerURL = '';
  try {
    const res = await fetch('https://verifiedid.did.msidentity.com/v1.0/verifiableCredentials/createIssuanceRequest', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        includeQRCode: true,
        callback: {
          url: `${getBaseUrl(c)}/auth/native/verifiedid/issue/callback`,
          state,
          headers: { 'api-key': c.env.VC_CALLBACK_KEY },
        },
        authority: c.env.VC_AUTHORITY || VC_AUTHORITY_DEFAULT,
        registration: { clientName: 'TMTCo App' },
        type: c.env.VC_TYPE || VC_TYPE_DEFAULT,
        manifest: c.env.VC_MANIFEST || VC_MANIFEST_DEFAULT,
      }),
    });
    const resBody = await res.json().catch(() => null);
    offerURL = typeof resBody?.url === 'string' && resBody.url.length <= 8192 ? resBody.url : '';
    if (!res.ok || !offerURL) {
      console.error('Native createIssuanceRequest failed:', res.status, JSON.stringify(resBody));
      throw new Error(`status ${res.status}`);
    }
  } catch {
    await transaction.fetch('https://native-vc/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'issuance_error' }),
    });
    return c.json({ error: 'verified_id_request_failed' }, 502);
  }

  await transaction.fetch('https://native-vc/request', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ url: offerURL }),
  });
  return c.json({ state, url: offerURL, expiresIn: NATIVE_VI_TTL_SECONDS }, 201);
});

app.get('/auth/native/verifiedid/issue/status', async (c) => {
  const transactions = c.env.NATIVE_VC_TXNS;
  const state = c.req.query('state') || '';
  const pollVerifier = bearerOf(c);
  if (!transactions || !NATIVE_VI_STATE.test(state) || !POLL_VERIFIER.test(pollVerifier)) {
    return c.json({ error: 'invalid_transaction' }, 403);
  }

  const transaction = transactions.get(transactions.idFromName(state));
  const response = await transaction.fetch('https://native-vc/status', {
    method: 'POST',
    headers: { 'x-poll-verifier-hash': await sha256Hex(pollVerifier) },
  });
  if (response.status === 403) return c.json({ error: 'invalid_transaction' }, 403);
  const result = await response.json().catch(() => ({ status: 'expired' }));
  return c.json({ status: result.status || 'pending' });
});

app.post('/auth/native/verifiedid/issue/cancel', async (c) => {
  const transactions = c.env.NATIVE_VC_TXNS;
  const body = await c.req.json().catch(() => null);
  const state = body?.state;
  const pollVerifier = bearerOf(c);
  if (!transactions || typeof state !== 'string' || !NATIVE_VI_STATE.test(state) || !POLL_VERIFIER.test(pollVerifier)) {
    return c.json({ error: 'invalid_transaction' }, 403);
  }

  const transaction = transactions.get(transactions.idFromName(state));
  const response = await transaction.fetch('https://native-vc/cancel', {
    method: 'POST',
    headers: { 'x-poll-verifier-hash': await sha256Hex(pollVerifier) },
  });
  return response.status === 403 ? c.json({ error: 'invalid_transaction' }, 403) : c.body(null, 204);
});

// Microsoft calls this with the api-key header. Only the state is trusted to route the update.
app.post('/auth/native/verifiedid/issue/callback', async (c) => {
  const apiKey = c.req.header('api-key');
  if (!apiKey || apiKey !== c.env.VC_CALLBACK_KEY || !c.env.NATIVE_VC_TXNS) {
    return c.json({ error: 'unauthorized' }, 401);
  }
  const payload = await c.req.json().catch(() => null);
  if (!payload || typeof payload.state !== 'string' || !NATIVE_VI_STATE.test(payload.state)) {
    return c.json({ error: 'invalid_payload' }, 400);
  }

  const allowed = ['request_retrieved', 'issuance_successful', 'issuance_error'];
  if (allowed.includes(payload.requestStatus)) {
    const transaction = c.env.NATIVE_VC_TXNS.get(c.env.NATIVE_VC_TXNS.idFromName(payload.state));
    await transaction.fetch('https://native-vc/callback', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: payload.requestStatus }),
    });
  }
  return c.json({ ok: true });
});

export default app;
