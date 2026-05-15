import { useEffect, useRef, useState } from "react";

const PIXEL =
  "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///ywAAAAAAQABAAACAUwAOw==";

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Archivo+Black&family=Space+Grotesk:wght@400;500;600;700&display=swap');

*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --bg:#1a1a19;
  --ink:#fff0df;
  --muted:rgba(255,240,223,.60);
  --dim:rgba(255,240,223,.36);
  --acid:#ff8a1f;
  --ember:#ff5a24;
  --blood:#ff2a52;
  --gold:#ffbd3d;
  --glass:rgba(255,255,255,.07);
  --line:rgba(255,240,223,.13);
  --line2:rgba(255,138,31,.34);
  --side:clamp(9px,2vw,29px);
}
html{scroll-behavior:smooth}
body{
  background:var(--bg);
  color:var(--ink);
  font-family:"Space Grotesk",system-ui,sans-serif;
  line-height:1.55;
  overflow-x:hidden;
  cursor:none;
}
.page *{cursor:none!important}
button,a,input,textarea{font:inherit}
button{cursor:none}
h1,h2,h3,.brand,.kicker{font-family:"Archivo Black",Impact,sans-serif;letter-spacing:-.035em}

@keyframes grainFloat{0%,100%{transform:translate3d(0,0,0)}50%{transform:translate3d(-2%,1%,0)}}
@keyframes edgeGlow{
  0%,100%{box-shadow:inset 0 1px 0 rgba(255,255,255,.22),inset 0 -1px 0 rgba(255,138,31,.18),inset 1px 0 0 rgba(255,42,82,.1),inset -1px 0 0 rgba(255,189,61,.09),0 18px 60px rgba(0,0,0,.46),0 0 0 1px rgba(255,255,255,.07)}
  50%{box-shadow:inset 0 1px 0 rgba(255,255,255,.32),inset 0 -1px 0 rgba(255,138,31,.32),inset 1px 0 0 rgba(255,42,82,.2),inset -1px 0 0 rgba(255,189,61,.18),0 22px 80px rgba(255,42,82,.14),0 0 0 1px rgba(255,138,31,.18)}
}
@keyframes specular{0%,100%{opacity:.62}50%{opacity:1}}
@keyframes floatSoft{
  0%,100%{transform:translate3d(0,0,0) rotate(var(--r,0deg))}
  50%{transform:translate3d(var(--dx,12px),var(--dy,-18px),0) rotate(calc(var(--r,0deg) + 3deg))}
}
@keyframes blob1{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(80px,-110px) scale(1.2)}66%{transform:translate(-60px,70px) scale(.85)}}
@keyframes blob2{0%,100%{transform:translate(0,0) scale(1)}33%{transform:translate(-80px,90px) scale(.9)}66%{transform:translate(90px,-60px) scale(1.14)}}
@keyframes blob3{0%,100%{transform:translate(0,0) scale(1)}50%{transform:translate(-50px,-90px) scale(1.22)}}
@keyframes blob4{0%,100%{transform:translate(0,0) scale(1)}40%{transform:translate(100px,55px) scale(.88)}80%{transform:translate(-35px,-80px) scale(1.1)}}
@keyframes riverLeft{from{transform:translateX(0)}to{transform:translateX(-50%)}}
@keyframes riverRight{from{transform:translateX(-50%)}to{transform:translateX(0)}}
@keyframes scan{0%,100%{transform:translateY(-80%);opacity:.14}50%{transform:translateY(170%);opacity:.32}}
@keyframes sweep{0%{transform:translateX(-130%) skewX(-18deg);opacity:0}30%{opacity:.85}100%{transform:translateX(160%) skewX(-18deg);opacity:0}}
@keyframes bitePulse{0%,100%{opacity:.35;transform:scaleX(.72)}50%{opacity:1;transform:scaleX(1)}}
@keyframes modalIn{from{opacity:0;transform:translateY(18px) scale(.98)}to{opacity:1;transform:translateY(0) scale(1)}}
@keyframes drawerIn{from{opacity:0;transform:translateY(-12px)}to{opacity:1;transform:translateY(0)}}
@keyframes introMark{0%{opacity:0;transform:scale(.74) rotate(-5deg);filter:blur(10px)}60%{opacity:1;transform:scale(1.06) rotate(1deg);filter:blur(0)}100%{opacity:1;transform:scale(1) rotate(0);filter:blur(0)}}
@keyframes introSweep{0%{transform:translateX(-100%) skewX(-20deg)}100%{transform:translateX(100%) skewX(-20deg)}}

.page{
  min-height:100vh;
  position:relative;
  isolation:isolate;
  background:
    radial-gradient(circle at 50% 0%,rgba(255,138,31,.18),transparent 34%),
    radial-gradient(circle at 10% 20%,rgba(255,42,82,.12),transparent 28%),
    radial-gradient(circle at 92% 72%,rgba(255,95,28,.16),transparent 34%),
    #1a1a19;
}
.page::before{
  content:"";
  position:fixed;inset:0;z-index:-2;pointer-events:none;
  background:
    linear-gradient(90deg,rgba(255,138,31,.034) 1px,transparent 1px),
    linear-gradient(rgba(255,42,82,.026) 1px,transparent 1px);
  background-size:54px 54px;
  mask-image:radial-gradient(circle at 50% 20%,black,transparent 72%);
  -webkit-mask-image:radial-gradient(circle at 50% 20%,black,transparent 72%);
}
.page::after{
  content:"";
  position:fixed;inset:0;pointer-events:none;z-index:-1;
  opacity:.18;mix-blend-mode:soft-light;animation:grainFloat 12s ease-in-out infinite;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 220 220' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.82' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='220' height='220' filter='url(%23n)' opacity='.55'/%3E%3C/svg%3E");
}
.blob-layer{position:fixed;inset:0;z-index:0;overflow:hidden;pointer-events:none}
.blob{position:absolute;border-radius:50%;filter:blur(70px)}

.side-icons{
  position:fixed;
  inset:112px 0 64px;
  z-index:1;
  pointer-events:none;
  /* Pushed further out from the main body */
  --mc: calc(20vw - 272px); 
}
.side-tool{
  position:absolute;
  width:62px;
  height:62px;
  display:grid;
  place-items:center;
  border-radius:20px;
  padding:6px;
  background:linear-gradient(135deg,rgba(255,255,255,.105),rgba(255,255,255,.035));
  border:1px solid rgba(255,240,223,.13);
  backdrop-filter:blur(20px) saturate(1.45);
  -webkit-backdrop-filter:blur(20px) saturate(1.45);
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 18px 42px rgba(0,0,0,.28),0 0 18px rgba(255,138,31,.08);
  animation:floatSoft var(--t,9s) ease-in-out infinite;
}

/* Left side items (Odds) */
.side-tool:nth-child(1){left:calc(var(--mc) + 8px); top:8%; --dx:14px; --dy:-18px; --t:8s}
.side-tool:nth-child(3){left:calc(var(--mc) - 16px); top:34%; --dx:10px; --dy:18px; --t:11s}
.side-tool:nth-child(5){left:calc(var(--mc) + 18px); top:62%; --dx:12px; --dy:-12px; --t:10.5s}
.side-tool:nth-child(7){left:calc(var(--mc) - 10px); top:88%; --dx:15px; --dy:15px; --t:12s}

/* Right side items (Evens) */
.side-tool:nth-child(2){right:calc(var(--mc) - 12px); top:14%; --dx:-12px; --dy:16px; --t:9.5s}
.side-tool:nth-child(4){right:calc(var(--mc) + 14px); top:42%; --dx:-14px; --dy:-15px; --t:8.2s}
.side-tool:nth-child(6){right:calc(var(--mc) - 8px); top:70%; --dx:-10px; --dy:14px; --t:9s}
.side-tool:nth-child(8){right:calc(var(--mc) + 6px); top:94%; --dx:-15px; --dy:-18px; --t:8.8s}

.tool-icon{
  width:42px;
  height:42px;
  border-radius:13px;
  display:block;
  object-fit:cover;
  background:
    linear-gradient(135deg,rgba(255,138,31,.34),rgba(255,42,82,.24)),
    radial-gradient(circle at 35% 28%,rgba(255,255,255,.28),transparent 42%);
  border:1px solid rgba(255,138,31,.28);
}

.glass{
  position:relative;
  overflow:hidden;
  background:linear-gradient(135deg,rgba(255,255,255,.11),rgba(255,255,255,.04));
  border:1px solid transparent;
  background-clip:padding-box;
  backdrop-filter:blur(32px) saturate(1.55) brightness(1.09);
  -webkit-backdrop-filter:blur(32px) saturate(1.55) brightness(1.09);
  animation:edgeGlow 7s ease-in-out infinite;
}
.glass::before{
  content:"";
  position:absolute;inset:0;pointer-events:none;z-index:0;
  background:
    linear-gradient(180deg,rgba(255,255,255,.2) 0%,transparent 38%),
    linear-gradient(115deg,rgba(255,138,31,.18),transparent 34%,transparent 68%,rgba(255,42,82,.12));
  animation:specular 7s ease-in-out infinite;
}
.glass::after{
  content:"";
  position:absolute;inset:0;pointer-events:none;z-index:0;
  background:linear-gradient(135deg,rgba(255,189,61,.08) 0%,transparent 38%,transparent 62%,rgba(255,42,82,.07) 100%);
  mix-blend-mode:screen;
}
.glass > *{position:relative;z-index:1}
.acid{color:var(--acid)}
.shell{width:calc(100% - var(--side) - var(--side));max-width:1360px;margin:0 auto;position:relative;z-index:2}

#cur-dot{
  position:fixed;pointer-events:none;z-index:99999;
  width:12px;height:12px;background-color:var(--acid);border-radius:50%;
  transform:translate(-50%,-50%);
  box-shadow:0 0 16px 4px rgba(255,138,31,.6);
  mix-blend-mode:screen;
  transition:width .2s,height .2s,background-color .2s,box-shadow .2s;
}
#cur-ring{
  position:fixed;pointer-events:none;z-index:99998;
  width:44px;height:44px;transform:translate(-50%,-50%);
  mix-blend-mode:screen;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='22' cy='22' r='16' fill='none' stroke='rgba(255,138,31,0.45)' stroke-width='1.5' stroke-dasharray='6 3'/%3E%3Cpath d='M22 0v6M22 38v6M0 22h6M38 22h6' stroke='rgba(255,138,31,0.7)' stroke-width='2' stroke-linecap='square'/%3E%3C/svg%3E");
  background-size:contain;background-repeat:no-repeat;background-position:center;
  transition:width .3s,height .3s,transform .3s,filter .2s;
}
body.chov #cur-ring{
  width:56px;height:56px;
  background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 44 44' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='22' cy='22' r='18' fill='none' stroke='rgba(255,42,82,0.6)' stroke-width='1.5'/%3E%3Cpath d='M22 2v8M22 34v8M2 22h8M34 22h8' stroke='rgba(255,42,82,0.9)' stroke-width='2.5' stroke-linecap='square'/%3E%3C/svg%3E");
  filter:drop-shadow(0 0 8px rgba(255,42,82,0.5));
}
body.chov #cur-dot{width:6px;height:6px;background-color:var(--blood);box-shadow:0 0 10px 2px rgba(255,42,82,.8)}
body.cfocus #cur-ring{
  width:68px;
  height:68px;
  filter:drop-shadow(0 0 10px rgba(255,138,31,.32));
}
body.cfocus #cur-dot{
  width:5px;
  height:5px;
  background-color:var(--gold);
  box-shadow:0 0 12px 3px rgba(255,189,61,.55);
}
body.cclick #cur-dot{width:16px;height:16px;background-color:#fff;box-shadow:0 0 24px 8px rgba(255,42,82,.9)}
body.cclick #cur-ring{width:32px;height:32px;transform:translate(-50%,-50%) rotate(45deg)}

.intro-screen{
  position:fixed;
  inset:0;
  z-index:200;
  display:grid;
  place-items:center;
  background:
    radial-gradient(circle at 50% 45%,rgba(255,138,31,.20),transparent 30%),
    radial-gradient(circle at 50% 52%,rgba(255,42,82,.16),transparent 42%),
    #11100f;
  overflow:hidden;
}
.intro-screen::before{
  content:"";
  position:absolute;
  top:-50%;bottom:-50%;left:-50%;right:-50%;
  background:linear-gradient(90deg,transparent 35%,rgba(255,138,31,.18) 45%,rgba(255,42,82,.18) 55%,transparent 65%);
  filter:blur(40px);
  animation:introSweep 2.2s ease-in-out both;
}
.intro-screen::after{
  content:"";
  position:absolute;
  inset:0;
  background:radial-gradient(circle at 50% 50%,transparent 0 26%,rgba(17,16,15,.72) 58%,#11100f 100%);
}
.intro-core{
  width:100%;
  height:100%;
  display:grid;
  place-items:center;
  position:relative;
  z-index:1;
}
.intro-core .logo-mark{
  width:clamp(220px,34vw,430px);
  height:clamp(220px,34vw,430px);
  animation:introMark 1.05s ease both;
  filter:drop-shadow(0 0 22px rgba(255,42,82,.52)) drop-shadow(0 0 42px rgba(255,138,31,.34));
}
.intro-core .logo-mark .logo-line{stroke-width:4.5}
.intro-core .logo-mark svg{animation:introMark 1.9s .38s ease both}

.nav{position:fixed;top:16px;left:var(--side);right:var(--side);z-index:50}
.nav-inner{
  max-width:1360px;margin:0 auto;min-height:66px;border-radius:18px;
  display:flex;align-items:center;justify-content:space-between;gap:14px;
  padding:10px 12px 10px 22px;
}
.brand{display:flex;align-items:center;gap:12px;font-size:24px}
.logo-mark{
  width:46px;height:46px;display:grid;place-items:center;
  filter:drop-shadow(0 0 10px rgba(255,42,82,.45)) drop-shadow(0 0 16px rgba(255,138,31,.30));
  flex-shrink:0;
}
.logo-mark svg{width:100%;height:100%;display:block}
.logo-mark .logo-line{fill:none;stroke:#ffb13d;stroke-width:6;stroke-linecap:round;stroke-linejoin:round}
.logo-mark .logo-hot{fill:#ffb13d}
.nav-links{display:flex;gap:30px;align-items:center}
.nav-links button{
  border:0;background:transparent;color:var(--muted);
  text-transform:uppercase;font-size:11px;font-weight:800;
}
.nav-links button:hover{color:var(--ink)}
.hamburger{
  display:none;flex-direction:column;gap:5px;
  border:0;background:transparent;padding:7px;
}
.hamburger span{
  display:block;width:24px;height:2px;background:var(--muted);border-radius:2px;
  transition:all .25s ease;
}
.hamburger.open span:nth-child(1){transform:translateY(7px) rotate(45deg)}
.hamburger.open span:nth-child(2){opacity:0}
.hamburger.open span:nth-child(3){transform:translateY(-7px) rotate(-45deg)}
.mobile-drawer{
  position:fixed;top:90px;left:var(--side);right:var(--side);
  z-index:49;border-radius:18px;padding:22px;
  display:flex;flex-direction:column;gap:4px;
  animation:drawerIn .22s ease both;
}
.mobile-drawer button{
  border:0;background:transparent;color:var(--muted);text-transform:uppercase;
  font-size:13px;font-weight:800;text-align:left;padding:12px 4px;
  border-bottom:1px solid var(--line);
}
.mobile-drawer button:last-child{border-bottom:none}
.mobile-drawer button:hover{color:var(--ink)}

.btn{
  position:relative;overflow:hidden;border:1px solid rgba(255,138,31,.46);
  color:#190b08;background:var(--acid);border-radius:14px;padding:13px 20px;
  font-weight:900;text-transform:uppercase;font-size:12px;
  transition:transform .25s ease,box-shadow .25s ease,border-color .25s ease;
}
.btn::after{
  content:"";position:absolute;top:-40%;bottom:-40%;left:0;width:42%;
  background:linear-gradient(90deg,transparent,rgba(255,255,255,.72),transparent);
  transform:translateX(-130%) skewX(-18deg);
}
.btn:hover{transform:translateY(-2px);box-shadow:0 16px 46px rgba(255,42,82,.18),0 0 26px rgba(255,138,31,.18)}
.btn:hover::after{animation:sweep .72s ease}
.btn.ghost{color:var(--ink);border-color:var(--line);background:rgba(255,255,255,.045);box-shadow:none}
.btn.ghost:hover{border-color:rgba(255,138,31,.44);box-shadow:0 16px 46px rgba(255,42,82,.10)}

.hero{
  min-height:100vh;
  display:grid;grid-template-columns:minmax(0,1fr) minmax(360px,520px);
  gap:56px;align-items:center;padding:150px 0 76px;
}
.availability{
  display:inline-flex;align-items:center;gap:10px;border-radius:999px;padding:9px 14px;
  color:var(--acid);font-size:11px;font-weight:900;text-transform:uppercase;margin-bottom:26px;
}
.dot{width:8px;height:8px;border-radius:50%;background:var(--acid);box-shadow:0 0 18px var(--acid)}
.hero h1{
  max-width:760px;font-size:clamp(54px,8vw,118px);line-height:.88;text-transform:uppercase;
  padding-bottom:.14em;
}
.hero-lede{max-width:610px;margin-top:26px;color:var(--muted);font-size:20px}
.hero-proof{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:34px 0;max-width:660px}
.proof{border-left:2px solid var(--acid);padding:8px 14px;background:rgba(255,255,255,.035)}
.proof strong{display:block;font-family:"Archivo Black";font-size:25px;color:var(--ink)}
.proof span{display:block;color:var(--dim);font-size:12px;text-transform:uppercase;font-weight:900}
.actions{display:flex;gap:12px;flex-wrap:wrap}

.console-wrap{position:relative}
.console{border-radius:28px;padding:16px;transform:rotate(1.5deg);animation:floatSoft 8s ease-in-out infinite;--dx:-10px;--dy:-18px}
.console-top{display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;color:var(--dim);font-size:11px;text-transform:uppercase;font-weight:900}
.lights{display:flex;gap:7px}
.lights span{width:10px;height:10px;border-radius:50%;background:var(--line)}
.lights span:first-child{background:var(--blood)}
.lights span:nth-child(2){background:#ffbd3d}
.lights span:nth-child(3){background:var(--acid)}
.viewer{
  min-height:610px;border-radius:22px;
  background:
    linear-gradient(to top,rgba(0,0,0,.86),transparent 48%),
    radial-gradient(circle at 32% 18%,rgba(255,138,31,.28),transparent 30%),
    radial-gradient(circle at 78% 20%,rgba(255,42,82,.16),transparent 34%),
    linear-gradient(135deg,#1b1411,#4b1718 45%,#120f0e);
  border:1px solid rgba(255,255,255,.12);position:relative;overflow:hidden;
}
.viewer::before{
  content:"DROP REAL REEL HERE";
  position:absolute;inset:18px;display:grid;place-items:center;
  border:1px dashed rgba(255,138,31,.38);color:rgba(255,138,31,.42);
  font-family:"Archivo Black";font-size:clamp(34px,5vw,62px);line-height:.9;text-align:center;padding:20px;
}
.viewer::after{content:"";position:absolute;left:0;right:0;top:0;height:38%;background:linear-gradient(180deg,rgba(255,255,255,.14),transparent);animation:scan 7s ease-in-out infinite}
.caption{
  position:absolute;left:22px;right:22px;bottom:148px;color:#071007;background:var(--acid);
  padding:10px 12px;border-radius:10px;text-align:center;font-family:"Archivo Black";text-transform:uppercase;font-size:19px;
}
.timeline{position:absolute;left:18px;right:18px;bottom:18px;display:grid;gap:8px}
.track{height:16px;border-radius:6px;background:rgba(255,255,255,.12);overflow:hidden}
.track span{display:block;height:100%;background:linear-gradient(90deg,var(--acid),#ff2a52)}
.track:nth-child(3) span{background:linear-gradient(90deg,#ff3d2e,#ffbd3d)}
.track:nth-child(4) span{background:linear-gradient(90deg,#d8d8d8,var(--acid))}
.beat-row{display:grid;grid-template-columns:repeat(9,1fr);gap:5px}
.beat-row span{height:22px;border-radius:5px;background:rgba(255,138,31,.16);border:1px solid rgba(255,138,31,.22)}

.action-strip{margin:-26px 0 56px;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:10px;position:relative;z-index:3}
.action-cell{min-height:118px;border-radius:22px;padding:18px;border:1px solid rgba(255,138,31,.18);background:linear-gradient(135deg,rgba(255,255,255,.075),rgba(255,255,255,.025));position:relative;overflow:hidden}
.action-cell::before{content:"";position:absolute;left:18px;right:18px;top:16px;height:2px;background:linear-gradient(90deg,var(--acid),var(--blood));transform-origin:left center;animation:bitePulse 2.8s ease-in-out infinite}
.action-cell::after{content:"";position:absolute;width:76px;height:160%;right:-34px;top:-30%;background:linear-gradient(90deg,transparent,rgba(255,138,31,.16),transparent);transform:rotate(24deg)}
.action-cell strong{display:block;margin-top:26px;font-family:"Archivo Black";font-size:22px;text-transform:uppercase}
.action-cell span{display:block;margin-top:8px;color:var(--muted);font-size:13px}

.section{position:relative;padding:82px 0}
.section::before{content:"";position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--acid),transparent);opacity:.58}
.kicker{display:block;color:var(--acid);font-size:12px;text-transform:uppercase;margin-bottom:14px}
.section-head{display:flex;align-items:end;justify-content:space-between;gap:28px;margin-bottom:34px}
.section h2{font-size:clamp(34px,5vw,68px);line-height:.95;text-transform:uppercase;max-width:760px;padding-bottom:.08em}
.section-head p{max-width:420px;color:var(--muted)}
.section-band{border-radius:30px;padding:30px;background:linear-gradient(180deg,rgba(255,255,255,.04),rgba(255,255,255,.016));border:1px solid rgba(255,255,255,.08)}

.portfolio-wrap{position:relative;overflow:hidden;border-radius:28px;padding:12px 0}
.portfolio-wrap::before,.portfolio-wrap::after{content:"";position:absolute;top:0;bottom:0;width:100px;z-index:4;pointer-events:none}
.portfolio-wrap::before{left:0;background:linear-gradient(90deg,#1a1a19,transparent)}
.portfolio-wrap::after{right:0;background:linear-gradient(270deg,#1a1a19,transparent)}
.river{display:flex;gap:16px;width:max-content;padding:8px 0;animation:riverLeft 42s linear infinite}
.river.reverse{animation:riverRight 48s linear infinite}
.portfolio-wrap:hover .river{animation-play-state:paused}
.reel{
  width:198px;height:352px;flex:0 0 auto;border-radius:22px;overflow:hidden;position:relative;
  border:1px solid rgba(255,255,255,.14);
  background:linear-gradient(to top,rgba(4,4,8,.92),transparent 54%),var(--poster);
  box-shadow:0 20px 60px rgba(0,0,0,.42);
  transition:transform .25s ease,border-color .25s ease;
}
.reel::after{content:"";position:absolute;inset:0;background:linear-gradient(125deg,rgba(255,138,31,.16),transparent 42%,rgba(255,42,82,.14))}
.reel:hover{transform:translateY(-10px);border-color:rgba(255,138,31,.46)}
.play{
  position:absolute;top:14px;right:14px;width:44px;height:44px;border-radius:50%;
  display:grid;place-items:center;z-index:2;color:#071007;background:var(--acid);
  font-size:10px;font-weight:900;text-transform:uppercase;
}
.reel-meta{position:absolute;left:18px;right:18px;bottom:18px;z-index:2}
.reel-meta small{color:var(--acid);text-transform:uppercase;font-size:10px;font-weight:900}
.reel-meta strong{display:block;margin-top:6px;font-family:"Archivo Black";font-size:18px;line-height:1.03;text-transform:uppercase;padding-bottom:.08em}

.grid3{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.grid4{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:16px}
.card{border-radius:24px;padding:26px;min-height:220px}
.card h3{font-size:24px;line-height:1;margin-bottom:14px;text-transform:uppercase;padding-bottom:.06em}
.card p{color:var(--muted)}
.tags{display:flex;flex-wrap:wrap;gap:8px;margin-top:24px}
.tags span{border:1px solid rgba(255,138,31,.30);color:rgba(255,157,64,.92);border-radius:999px;padding:5px 10px;font-size:11px;text-transform:uppercase;font-weight:900}

.about-grid{display:grid;grid-template-columns:.9fr .72fr 1.05fr;gap:18px}
.about-main{border-radius:26px;padding:34px}
.about-main h3{font-size:clamp(32px,4vw,56px);line-height:.96;text-transform:uppercase;margin-bottom:18px;padding-bottom:.1em}
.about-main p{color:var(--muted);font-size:17px}
.about-photo{
  min-height:360px;border-radius:26px;display:grid;place-items:start center;
  position:relative;overflow:hidden;padding:34px 24px 24px;
  background:radial-gradient(circle at 50% 18%,rgba(255,138,31,.18),transparent 34%),linear-gradient(145deg,rgba(255,255,255,.09),rgba(255,255,255,.025));
}
.about-photo::before{
  content:"";width:132px;height:132px;border-radius:50%;
  background:linear-gradient(135deg,rgba(255,138,31,.60),rgba(255,42,82,.40));
  box-shadow:0 0 42px rgba(255,42,82,.30);margin-top:14px;
}
.about-photo::after{
  content:"YOUR IMAGE HERE";position:absolute;left:24px;right:24px;bottom:24px;
  padding:12px 14px;border:1px dashed rgba(255,138,31,.42);color:rgba(255,240,223,.58);
  border-radius:14px;text-align:center;font-family:"Archivo Black";font-size:12px;
}
.about-list{display:grid;gap:12px}
.about-item{padding:20px;border:1px solid var(--line);background:rgba(255,255,255,.035);border-radius:20px}
.about-item strong{display:block;color:var(--acid);margin-bottom:6px;text-transform:uppercase}
.about-item span{color:var(--muted)}

.process-card{border-top:2px solid var(--acid);padding:22px 0 0}
.process-card strong{color:var(--acid);font-family:"Archivo Black";font-size:18px}
.process-card h3{margin:12px 0 8px;font-size:22px;text-transform:uppercase;padding-bottom:.06em}
.process-card p{color:var(--muted);font-size:14px}

.faq{max-width:none;margin-left:0;margin-right:0}
.faq-row{border-bottom:1px solid var(--line)}
.faq-q{
  width:100%;border:0;background:transparent;color:var(--ink);
  display:flex;justify-content:space-between;gap:18px;
  padding:24px 0;text-align:left;font-weight:900;font-size:18px;
}
.faq-a{max-height:0;overflow:hidden;color:var(--muted);transition:max-height .32s ease}
.faq-a.open{max-height:180px}
.faq-a p{padding:0 46px 24px 0}

.review-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:18px}
.review-card{border-radius:24px;padding:28px;min-height:238px}
.review-card .quote{color:var(--ink);font-size:17px;line-height:1.7;margin-bottom:26px}
.review-card .who{display:flex;align-items:center;gap:12px}
.avatar{
  width:48px;height:48px;border-radius:50%;display:block;flex-shrink:0;position:relative;overflow:hidden;
  border:1px solid rgba(255,138,31,.36);
  background:radial-gradient(circle at 50% 34%,rgba(255,240,223,.72) 0 15%,transparent 16%),radial-gradient(ellipse at 50% 82%,rgba(255,138,31,.55) 0 34%,transparent 35%),linear-gradient(135deg,rgba(255,138,31,.40),rgba(255,42,82,.28));
  box-shadow:0 0 22px rgba(255,42,82,.16);
}
.who strong{display:block;font-family:"Archivo Black";font-size:13px;text-transform:uppercase}
.who span{display:block;color:var(--muted);font-size:12px;margin-top:2px}

.booking-layer{
  position:fixed;inset:0;z-index:120;display:grid;place-items:center;padding:24px;
  background:rgba(10,8,8,.62);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px);
}
.booking-modal{
  width:min(760px,100%);
  max-height:calc(100vh - 48px);
  overflow:auto;
  border-radius:28px;padding:28px;animation:modalIn .28s ease both;
}
.booking-top{display:flex;justify-content:space-between;align-items:flex-start;gap:18px;margin-bottom:22px}
.booking-top h3{font-size:clamp(32px,5vw,58px);line-height:.92;text-transform:uppercase;padding-bottom:.1em}
.booking-top p{margin-top:10px;color:var(--muted);max-width:430px}
.modal-close{
  width:42px;height:42px;border-radius:50%;border:1px solid rgba(255,255,255,.16);
  background:rgba(255,255,255,.06);color:var(--ink);font-size:22px;line-height:1;flex-shrink:0;
}
.booking-form{display:grid;grid-template-columns:1fr 1fr;gap:10px}
.booking-form input,.booking-form textarea{
  width:100%;border:1px solid rgba(255,255,255,.14);border-radius:16px;
  padding:14px 15px;color:var(--ink);background:rgba(255,255,255,.055);font:inherit;outline:none;
}
.booking-form .wide-field{grid-column:1/-1}
.booking-form textarea{grid-column:1/-1;min-height:110px;resize:vertical}
.booking-form input:focus,.booking-form textarea:focus{border-color:rgba(255,138,31,.48);box-shadow:0 0 0 3px rgba(255,138,31,.10)}
.booking-actions{grid-column:1/-1;display:flex;justify-content:space-between;align-items:center;gap:14px;flex-wrap:wrap;margin-top:6px}
.booking-actions small{color:var(--dim)}

.footer-cta{margin-top:40px;border-radius:32px;padding:48px;display:grid;grid-template-columns:1fr auto;gap:28px;align-items:center}
.footer-cta h2{font-size:clamp(38px,6vw,82px);padding-bottom:.08em}
.footer-cta p{color:var(--muted);max-width:520px;margin-top:14px}
.site-footer{padding:34px 0 52px;color:var(--dim)}
.footer-inner{display:grid;grid-template-columns:1fr auto 1fr;gap:18px;align-items:center;border-top:1px solid rgba(255,255,255,.12);padding-top:22px}
.footer-links{display:flex;gap:18px;justify-content:center;flex-wrap:wrap}
.footer-links button{border:0;background:transparent;color:var(--muted);font-size:12px;font-weight:900;text-transform:uppercase}
.footer-note{text-align:right;font-size:13px}

@media(prefers-reduced-motion:reduce){
  *,*::before,*::after{animation:none!important;transition:none!important;scroll-behavior:auto!important}
}

/* HIDDEN FLOATING ICONS TO PREVENT OVERLAP */
@media(max-width:1540px){
  .side-icons{display:none} 
}

@media(max-width:980px){
  .hero{grid-template-columns:1fr;padding-top:130px}
  .console{transform:none}
  .viewer{min-height:520px}
  .grid3,.grid4,.about-grid,.review-grid,.action-strip{grid-template-columns:1fr}
  .section-head,.footer-cta{display:block}
  .section-head p,.footer-cta .btn{margin-top:14px}
  .footer-inner{grid-template-columns:1fr;text-align:left}
  .footer-links{justify-content:flex-start}
  .footer-note{text-align:left}
  .nav-links{display:none}
  .hamburger{display:flex;order:-1}
  .brand{flex:1}
  .nav-inner{justify-content:flex-start}
  .nav-inner > .btn{margin-left:auto}
  .hero-proof{grid-template-columns:1fr}
  .booking-form{grid-template-columns:1fr}
  .booking-form textarea,.booking-form .wide-field,.booking-actions{grid-column:auto}
}
@media(max-width:560px){
  :root{--side:8px}
  .nav{top:10px}
  .brand{font-size:19px}
  .logo-mark{width:34px;height:34px}
  .nav-inner{padding-left:10px;padding-right:10px}
  .nav .btn{padding:11px 12px;font-size:10px}
  .hero{padding-top:116px}
  .hero h1{font-size:46px}
  .hero-lede{font-size:17px}
  .viewer{min-height:470px}
  .caption{font-size:15px;bottom:132px}
  .section{padding:64px 0}
  .section-band{padding:20px}
  .action-strip{margin:0 0 36px}
  .about-photo{min-height:300px;padding-top:42px}
  .portfolio-wrap::before,.portfolio-wrap::after{width:42px}
  .reel{width:176px;height:314px}
  .footer-cta{padding:28px}
  .booking-layer{padding:10px;align-items:start;overflow:auto}
  .booking-modal{width:100%;max-height:none;margin:10px 0;padding:18px;border-radius:22px}
  .booking-top{align-items:flex-start}
  .booking-top h3{font-size:34px}
  .modal-close{width:38px;height:38px}
  .booking-actions{display:grid;grid-template-columns:1fr}
}
`;

const services = [
  { title: "UGC that bites", body: "Raw creator footage shaped into direct-response edits with stronger hooks, tighter pacing, captions, and product clarity.", tags: ["Hooks", "Captions", "Product proof"] },
  { title: "Shorts with teeth", body: "YouTube Shorts and TikTok cuts built around rhythm, retention, and a first second that does not waste attention.", tags: ["Retention", "Pacing", "Sound"] },
  { title: "Thumbnail pressure", body: "Frames, titles, and visual hierarchy designed to make the click feel obvious before the viewer starts thinking.", tags: ["CTR", "Title frames", "Still exports"] },
];

const process = [
  ["01", "Brief", "You send footage, references, audience notes, and what the video needs to make people do."],
  ["02", "Cut", "I build the hook, pacing, captions, sound, and visual emphasis around the strongest moments."],
  ["03", "Sharpen", "We review the first pass and tighten the edit instead of wandering through vague revisions."],
  ["04", "Ship", "Final files are exported for the platform, format, and campaign you are actually using."],
];

const portfolio = [
  ["UGC", "Skincare Hook", "linear-gradient(145deg,#211412,#6b1b20 48%,#ff8a1f)"],
  ["TikTok", "Streetwear Drop", "linear-gradient(145deg,#1d1614,#7a2432 48%,#ffb13d)"],
  ["Short", "Talking Head", "linear-gradient(145deg,#201212,#86243b 48%,#ff5c2a)"],
  ["UGC", "Unboxing Cut", "linear-gradient(145deg,#1c1111,#5d1c24 46%,#ff2a52)"],
  ["Reel", "Fitness Proof", "linear-gradient(145deg,#211611,#7b3518 48%,#ffbd3d)"],
  ["Ad", "Product Demo", "linear-gradient(145deg,#20100f,#721b24 48%,#ff8a1f)"],
  ["Short", "Podcast Clip", "linear-gradient(145deg,#191414,#6c2430 48%,#ff6a32)"],
  ["UGC", "Lifestyle Test", "linear-gradient(145deg,#21130f,#7d3218 48%,#ffb13d)"],
  ["Reel", "Cafe Launch", "linear-gradient(145deg,#191112,#78202d 48%,#ff2a52)"],
  ["Ad", "App Walkthrough", "linear-gradient(145deg,#1d1210,#6f2a16 48%,#ff8a1f)"],
];

// Added transparent engagement model to the FAQ
const faqs = [
  ["What is your pricing and engagement model?", "I work primarily on monthly retainers for brands scaling their organic reach, or batch-projects (minimum 5 videos) for creators. Custom quotes depend on footage complexity and volume."],
  ["What type of videos do you edit?", "UGC, Reels, TikToks, YouTube Shorts, talking-head clips, product demos, and thumbnail frames."],
  ["What's your turnaround time?", "Most short-form edits are ready in 24 to 48 hours, depending on footage and scope."],
  ["How do I send footage?", "Google Drive, Dropbox, or WeTransfer works. Keep the files organized and I can start faster."],
  ["How many revisions are included?", "Two focused revision rounds are included so the edit gets sharper without dragging."],
];

// Added metric-driven testimonials with handle/brand context
const testimonials = [
  ["Sarah K.", "Founder @ SkincareCo", "Jeric turned messy product clips into ads we could actually run. Our ROAS jumped 20% within a week because the pacing felt cleaner immediately."],
  ["Marcus T.", "YouTube Creator (1.2M Subs)", "Fast drafts, sharp hooks, and no wasted back-and-forth. OGRE made the edit feel intentional. The retention graph stayed flat for the first 30 seconds."],
  ["Aisha R.", "UGC Strategist", "The captions, sound, and frame choices made my videos feel more premium without overdoing it. Exactly what the algorithm wants right now."],
];

const programBadges = [
  ["Pr", PIXEL],
  ["Ae", PIXEL],
  ["Resolve", PIXEL],
  ["FCP", PIXEL],
  ["CapCut", PIXEL],
  ["Canva", PIXEL],
  ["Ps", PIXEL], 
  ["Au", PIXEL], 
];

const editActions = [
  ["Hook", "Open hard"],
  ["Cut", "Kill dead air"],
  ["Caption", "Make it readable"],
  ["Grade", "Heat the frame"],
  ["Export", "Platform-ready"],
];

function OgreMark({ id }) {
  const gId = `ogreHeat-${id}`;
  return (
    <span className="logo-mark" aria-hidden="true">
      <svg viewBox="0 0 120 120" role="img">
        <defs>
          <linearGradient id={gId} x1="18" y1="10" x2="102" y2="110" gradientUnits="userSpaceOnUse">
            <stop stopColor="#ffb13d" />
            <stop offset=".52" stopColor="#ff5a24" />
            <stop offset="1" stopColor="#ff2a52" />
          </linearGradient>
        </defs>
        <path className="logo-line" d="M26 30C41 14 79 14 94 30" />
        <path className="logo-line" d="M18 73H7M102 73h11M23 88h-9M97 88h9" />
        <path className="logo-line" d="M29 81 18 92M91 81l11 11" />
        <path fill={`url(#${gId})`} d="M23 48C18 29 27 16 43 10c-6 14-3 29 9 38-10 4-20 4-29 0Z" />
        <path fill={`url(#${gId})`} d="M97 48c5-19-4-32-20-38 6 14 3 29-9 38 10 4 20 4 29 0Z" />
        <path fill={`url(#${gId})`} d="M60 27c22 0 36 17 32 38-3 18-17 31-32 38-15-7-29-20-32-38-4-21 10-38 32-38Z" />
        <path fill="#1a1a19" d="M45 58c6-5 12-5 18 0-7 2-12 2-18 0ZM75 58c-6-5-12-5-18 0 7 2 12 2 18 0Z" opacity=".72" />
        <path fill="#1a1a19" d="M55 70h10l-5 9-5-9Z" opacity=".72" />
        <path className="logo-hot" d="M41 84h8l-4 12-4-12ZM55 87h10l-5 14-5-14ZM71 84h8l-4 12-4-12Z" />
      </svg>
    </span>
  );
}

export default function OgrePortfolio() {
  const [open, setOpen] = useState(null);
  const [booking, setBooking] = useState(false);
  const [navOpen, setNavOpen] = useState(false);
  const [intro, setIntro] = useState(true);
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const mouse = useRef({ x: -999, y: -999 });
  const ring = useRef({ x: -999, y: -999 });
  const raf = useRef(null);

  useEffect(() => {
    const lerp = (a, b, t) => a + (b - a) * t;
    const dot = dotRef.current;
    const rng = ringRef.current;

    const tick = () => {
      if (dot) {
        dot.style.left = `${mouse.current.x}px`;
        dot.style.top = `${mouse.current.y}px`;
      }
      if (rng) {
        ring.current.x = lerp(ring.current.x, mouse.current.x, 0.6);
        ring.current.y = lerp(ring.current.y, mouse.current.y, 0.6);
        rng.style.left = `${ring.current.x}px`;
        rng.style.top = `${ring.current.y}px`;
      }
      raf.current = requestAnimationFrame(tick);
    };

    const onMove = (event) => {
      mouse.current = { x: event.clientX, y: event.clientY };
      const target = event.target;
      const onButton = target instanceof Element && Boolean(target.closest("button"));
      const onFocusBlock = target instanceof Element && Boolean(target.closest(".card,.process-card,.review-card,.about-main,.about-item,.action-cell,.reel,.footer-cta,.section-band,.console,.about-photo"));
      document.body.classList.toggle("chov", onButton);
      document.body.classList.toggle("cfocus", !onButton && onFocusBlock);
    };
    const onLeave = () => document.body.classList.remove("chov", "cfocus");
    const onDown = () => document.body.classList.add("cclick");
    const onUp = () => document.body.classList.remove("cclick");

    raf.current = requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    window.addEventListener("mouseleave", onLeave);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseup", onUp);

    return () => {
      cancelAnimationFrame(raf.current);
      window.removeEventListener("mousemove", onMove);
      window.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseup", onUp);
      document.body.classList.remove("chov", "cfocus", "cclick");
    };
  }, []);

  useEffect(() => {
    if (!intro) return undefined;
    const timer = window.setTimeout(() => setIntro(false), 2600);
    return () => window.clearTimeout(timer);
  }, [intro]);

  useEffect(() => {
    const locked = booking || intro || navOpen;
    const previous = document.body.style.overflow;
    if (locked) document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previous;
    };
  }, [booking, intro, navOpen]);

  const go = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const nav = document.querySelector(".nav-inner");
    const navRect = nav?.getBoundingClientRect();
    const anchor = navRect ? navRect.top + navRect.height / 2 : 90;
    const y = el.getBoundingClientRect().top + window.scrollY - anchor;
    window.scrollTo({ top: y, behavior: "smooth" });
    setNavOpen(false);
  };

  const river = [...portfolio, ...portfolio];
  const reverseRiver = [...portfolio.slice(5), ...portfolio.slice(0, 5), ...portfolio];

  return (
    <main className="page">
      <style>{CSS}</style>

      <div id="cur-dot" ref={dotRef} />
      <div id="cur-ring" ref={ringRef} />

      {intro && (
        <div className="intro-screen" aria-label="OGRE intro screen" onClick={() => setIntro(false)}>
          <div className="intro-core">
            <OgreMark id="intro" />
          </div>
        </div>
      )}

      <div className="side-icons" aria-hidden="true">
        {programBadges.map(([label, src]) => (
          <span className="side-tool" key={label}>
            <img className="tool-icon" src={src} alt="" />
          </span>
        ))}
      </div>

      <div className="blob-layer" aria-hidden="true">
        <div className="blob" style={{ top: "-16%", left: "-12%", width: 780, height: 780, background: "radial-gradient(circle,rgba(255,138,31,.13) 0%,transparent 68%)", animation: "blob1 22s ease-in-out infinite" }} />
        <div className="blob" style={{ top: "40%", right: "-16%", width: 820, height: 820, background: "radial-gradient(circle,rgba(255,42,82,.1) 0%,transparent 68%)", animation: "blob2 28s ease-in-out infinite" }} />
        <div className="blob" style={{ top: "22%", left: "36%", width: 560, height: 560, background: "radial-gradient(circle,rgba(255,189,61,.075) 0%,transparent 68%)", animation: "blob3 18s ease-in-out infinite" }} />
        <div className="blob" style={{ bottom: "-12%", left: "18%", width: 640, height: 640, background: "radial-gradient(circle,rgba(255,95,28,.08) 0%,transparent 68%)", animation: "blob4 24s ease-in-out infinite" }} />
        <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 62% at 50% 50%,transparent 0%,rgba(26,26,25,.55) 100%)" }} />
      </div>

      <header className="nav">
        <div className="nav-inner glass">
          <button
            className={`hamburger${navOpen ? " open" : ""}`}
            aria-label="Toggle navigation"
            aria-expanded={navOpen}
            onClick={() => setNavOpen((value) => !value)}
          >
            <span /><span /><span />
          </button>
          <div className="brand"><OgreMark id="nav" /><span>OGRE</span></div>
          <nav className="nav-links" aria-label="Primary navigation">
            {["work", "about", "services", "process", "reviews", "faq"].map((id) => (
              <button key={id} onClick={() => go(id)}>{id}</button>
            ))}
          </nav>
          <button className="btn" onClick={() => setBooking(true)}>Book Call</button>
        </div>
        {navOpen && (
          <div className="mobile-drawer glass" role="navigation">
            {["work", "about", "services", "process", "reviews", "faq"].map((id) => (
              <button key={id} onClick={() => go(id)}>{id}</button>
            ))}
          </div>
        )}
      </header>

      <div className="shell">
        <section className="hero">
          <div>
            <div className="availability glass"><span className="dot" />Jeric Lauresta / Video Editor</div>
            <h1>Raw in. <span className="acid">Roar out.</span></h1>
            <p className="hero-lede">
              Short-form edits with bite: sharper hooks, tighter pacing, cleaner captions, and videos that feel built instead of decorated.
            </p>
            {/* INJECTED HARD METRICS HERE */}
            <div className="hero-proof">
              <div className="proof"><strong>10M+</strong><span>Views Generated</span></div>
              <div className="proof"><strong>15+</strong><span>Brand Partners</span></div>
              <div className="proof"><strong>Top 5%</strong><span>Avg. Retention Rate</span></div>
            </div>
            <div className="actions">
              <button className="btn" onClick={() => setBooking(true)}>Start a Project</button>
              <button className="btn ghost" onClick={() => go("work")}>View Work</button>
            </div>
          </div>

          <div className="console-wrap">
            <aside className="console glass" aria-label="Featured reel placeholder">
              <div className="console-top">
                <span>OGRE_EDIT_001</span>
                <div className="lights"><span /><span /><span /></div>
              </div>
              <div className="viewer">
                <div className="caption">Hook lands before second two</div>
                <div className="timeline">
                  <div className="beat-row">{Array.from({ length: 9 }).map((_, i) => <span key={i} />)}</div>
                  <div className="track"><span style={{ width: "78%" }} /></div>
                  <div className="track"><span style={{ width: "64%" }} /></div>
                  <div className="track"><span style={{ width: "88%" }} /></div>
                </div>
              </div>
            </aside>
          </div>
        </section>

        <div className="action-strip" aria-label="OGRE editing system">
          {editActions.map(([label, detail]) => (
            <div className="action-cell glass" key={label}>
              <strong>{label}</strong><span>{detail}</span>
            </div>
          ))}
        </div>

        <section id="work" className="section">
          <span className="kicker">Portfolio</span>
          <div className="section-band">
            <div className="section-head">
              <h2>Cuts that bite.</h2>
              <p>Drop your real thumbnails or videos into these moving reel slots when the assets are ready.</p>
            </div>
            <div className="portfolio-wrap">
              <div className="river">
                {river.map(([type, title, poster], i) => (
                  <article className="reel" style={{ "--poster": poster }} key={`${title}-${i}`}>
                    <div className="play">Play</div>
                    <div className="reel-meta"><small>{type}</small><strong>{title}</strong></div>
                  </article>
                ))}
              </div>
              <div className="river reverse">
                {reverseRiver.map(([type, title, poster], i) => (
                  <article className="reel" style={{ "--poster": poster }} key={`${title}-r-${i}`}>
                    <div className="play">Play</div>
                    <div className="reel-meta"><small>{type}</small><strong>{title}</strong></div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="section">
          <span className="kicker">About</span>
          <div className="about-grid">
            {/* INJECTED AUTHORITY COPY HERE */}
            <article className="about-main glass">
              <h3>Engineered by Jeric.</h3>
              <p>I don't just cut footage; I engineer retention. Coming from a background in technical systems and visual strategy, I run OGRE as a specialized short-form desk. I reverse-engineer platform algorithms to build videos with tighter pacing, deliberate visual hierarchy, and hooks that mathematically stop the scroll. You send raw files. I ship high-converting assets.</p>
            </article>
            <div className="about-photo glass" aria-label="Image placeholder" />
            <div className="about-list">
              <div className="about-item"><strong>Style</strong><span>Clean cuts, sharp hooks, readable captions, and no filler.</span></div>
              <div className="about-item"><strong>Focus</strong><span>UGC, Reels, Shorts, product demos, and talking-head clips.</span></div>
              <div className="about-item"><strong>Promise</strong><span>Clear communication, fast delivery, and edits that match the brief.</span></div>
            </div>
          </div>
        </section>

        <section id="services" className="section">
          <span className="kicker">Services</span>
          <div className="section-head">
            <h2>Edit weapons.</h2>
            <p>Fast, direct, sharp, and built around the actual mechanics of short-form video.</p>
          </div>
          <div className="grid3">
            {services.map((service) => (
              <article className="card glass" key={service.title}>
                <h3>{service.title}</h3><p>{service.body}</p>
                <div className="tags">{service.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
              </article>
            ))}
          </div>
        </section>

        <section id="process" className="section">
          <span className="kicker">Process</span>
          <div className="section-band">
            <div className="section-head">
              <h2>Cut. Polish. Ship.</h2>
              <p>No mystical creator jargon. Just a clear path from raw files to a platform-ready export.</p>
            </div>
            <div className="grid4">
              {process.map(([num, title, body]) => (
                <article className="process-card" key={num}>
                  <strong>{num}</strong><h3>{title}</h3><p>{body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="reviews" className="section">
          <span className="kicker">Client Reviews</span>
          <div className="section-head">
            <h2>They felt the bite.</h2>
            <p>Short notes from clients and creators after the first cuts landed.</p>
          </div>
          <div className="review-grid">
            {testimonials.map(([name, role, quote]) => (
              <article className="review-card glass" key={name}>
                <p className="quote">"{quote}"</p>
                <div className="who">
                  <span className="avatar" aria-label={`${name} placeholder`} />
                  <div><strong>{name}</strong><span>{role}</span></div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section id="faq" className="section faq">
          <span className="kicker">FAQ</span>
          <h2>Ask before cut.</h2>
          <div style={{ marginTop: 26 }}>
            {faqs.map(([q, a], i) => (
              <div className="faq-row" key={q}>
                <button className="faq-q" onClick={() => setOpen(open === i ? null : i)}>
                  <span>{q}</span><span>{open === i ? "-" : "+"}</span>
                </button>
                <div className={`faq-a${open === i ? " open" : ""}`}><p>{a}</p></div>
              </div>
            ))}
          </div>
        </section>

        <section id="cta" className="section">
          <div className="footer-cta glass">
            <div>
              <span className="kicker">Ready</span>
              <h2>Ready to roar?</h2>
              <p>Keep the liquid glass, but let the brand feel like OGRE: sharp, dark, and built for editing.</p>
            </div>
            <button className="btn" onClick={() => setBooking(true)}>Book a Free Discovery Call</button>
          </div>
        </section>

        <footer className="site-footer">
          <div className="footer-inner">
            <div className="brand"><OgreMark id="footer" /><span>OGRE</span></div>
            <div className="footer-links">
              {["work", "about", "services", "process", "reviews", "faq"].map((id) => (
                <button key={id} onClick={() => go(id)}>{id}</button>
              ))}
            </div>
            <div className="footer-note">Jeric Lauresta / Video Editor / 2026</div>
          </div>
        </footer>
      </div>

      {booking && (
        <div className="booking-layer" role="dialog" aria-modal="true" aria-labelledby="booking-title" onClick={() => setBooking(false)}>
          <div className="booking-modal glass" onClick={(event) => event.stopPropagation()}>
            <div className="booking-top">
              <div>
                <span className="kicker">Book OGRE</span>
                <h3 id="booking-title">Feed the brief.</h3>
                <p>Only the essentials: who you are, where the footage lives, and what the edit needs to make happen.</p>
              </div>
              <button className="modal-close" aria-label="Close" onClick={() => setBooking(false)}>x</button>
            </div>
            <form className="booking-form" onSubmit={(event) => event.preventDefault()}>
              <input aria-label="Name or brand" placeholder="Name / Brand" />
              <input aria-label="Email" placeholder="Email" />
              <input aria-label="Footage or reference link" className="wide-field" placeholder="Footage / reference link" />
              <textarea aria-label="Brief" placeholder="What are we cutting, and what should it do?" />
              <div className="booking-actions">
                <small>Use Drive, Dropbox, WeTransfer, or a rough reference link.</small>
                <button className="btn" type="submit">Send Brief</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}