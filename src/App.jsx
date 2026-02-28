import { useState, useEffect, useRef } from "react";
import React from 'react';
import emailjs from '@emailjs/browser';

// ── THEME TOKENS ──────────────────────────────────────────────
const themes = {
  light: {
    "--bg":           "#fff5f7",
    "--bg2":          "#ffe8ee",
    "--surface":      "#ffffff",
    "--surface2":     "#fdf0f3",
    "--border":       "#f5c6d3",
    "--text":         "#2d1f24",
    "--text2":        "#7a5260",
    "--accent":       "#e8608a",
    "--accent2":      "#f4a0bc",
    "--accent-glow":  "rgba(232,96,138,0.18)",
    "--nav-bg":       "rgba(255,245,247,0.85)",
  },
  dark: {
    "--bg":           "#150d10",
    "--bg2":          "#1f1318",
    "--surface":      "#241419",
    "--surface2":     "#2e1a20",
    "--border":       "#4a2535",
    "--text":         "#f7e8ed",
    "--text2":        "#c9909f",
    "--accent":       "#f07fa0",
    "--accent2":      "#e8608a",
    "--accent-glow":  "rgba(240,127,160,0.22)",
    "--nav-bg":       "rgba(21,13,16,0.88)",
  },
};

// ── EMAILJS — keys loaded from .env ──────────────────────────
const EMAILJS_SERVICE_ID  = import.meta.env.VITE_EMAILJS_SERVICE_ID;
const EMAILJS_TEMPLATE_ID = import.meta.env.VITE_EMAILJS_TEMPLATE_ID;
const EMAILJS_PUBLIC_KEY  = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

// ── TRANSLATIONS ──────────────────────────────────────────────
const LANG_DATA = {
  en: {
    flag: "🇬🇧", code: "EN", dir: "ltr",
    nav: ["About", "Skills", "Projects", "Contact"],
    navHrefs: ["#about", "#skills", "#projects", "#contact"],
    available: "✦ Available for work",
    greeting: "Hi, I'm",
    roles: ["Full-Stack Developer", "Creative Coder"],
    viewWork: "View My Work →",
    letsTalk: "Let's Talk",
    scroll: "scroll",
    s1label: "01 — Who I am",
    s1title: <>Ordinary by origin, Relentless by choice.<br /><em>Now building in code.</em></>,
    bio: [
      "I wasn't supposed to end up here. Coding wasn't the plan — until curiosity turned into obsession.",
      "It started with simple questions: How does this work? Why does it behave this way? Can it be better? Those questions turned into long nights, debugging sessions, failed attempts, breakthroughs — and the quiet satisfaction of making something complex finally work with precision.",
      "What began as curiosity evolved into discipline. What looked like lines of code became architecture, structure, and possibility.",
      "Today, I don't just write code. I design logic. I engineer solutions. I craft digital experiences that feel effortless on the surface but are meticulously structured underneath.",
      "I approach every project like a system waiting to be understood — then optimized. Clean code. Scalable structure. Intentional design. Because behind every great product is invisible logic. And that's where I operate.",
    ],
    statAge: "Years old", statProjects: "Projects",
    s2label: "02 — What I use",
    s2title: <>My <em>toolkit</em></>,
    s3label: "03 — What I've built",
    s3title: <>Selected <em>projects</em></>,
    liveDemo: "Live Demo ↗", github: "GitHub",
    projectDesc: "Full-stack Note website Built with Java, Spring Boot that uses dependencies such as Spring Data JPA, Lombok, H2 Database that allows users to create, read, update, and delete notes through a RESTful API.",
    s4label: "04 — Get in touch",
    s4title: <>Let's <em>work</em> together</>,
    contactDesc: "Have a project in mind? I'd love to hear about it. Send me a message and let's create something wonderful together.",
    labelName: "Name", labelEmail: "Email", labelSubject: "Subject", labelMessage: "Message",
    phName: "Your name", phEmail: "your@email.com", phSubject: "What's this about?", phMessage: "Tell me about your project...",
    sendBtn: "Send Message ✦",
    sendingBtn: "Sending...",
    sentMsg: "✦ Message sent! I'll get back to you soon 🌸",
    errorMsg: "⚠️ Something went wrong. Please try again.",
    footerBuilt: "© 2025 · Built with React & 🌸",
  },

  fr: {
    flag: "🇫🇷", code: "FR", dir: "ltr",
    nav: ["À propos", "Compétences", "Projets", "Contact"],
    navHrefs: ["#about", "#skills", "#projects", "#contact"],
    available: "✦ Disponible pour des missions",
    greeting: "Bonjour, je suis",
    roles: ["Développeuse Full-Stack", "Codeuse Créative"],
    viewWork: "Voir mes projets →",
    letsTalk: "Discutons",
    scroll: "défiler",
    s1label: "01 — Qui je suis",
    s1title: <>Ordinaire par origine, Acharnée par choix.<br /><em>Maintenant, je construis en code.</em></>,
    bio: [
      "Je n'étais pas censée me retrouver ici. Le code n'était pas le plan — jusqu'à ce que la curiosité devienne une obsession.",
      "Tout a commencé par des questions simples : Comment ça marche ? Pourquoi ça se comporte ainsi ? Est-ce qu'on peut faire mieux ? Ces questions se sont transformées en nuits blanches, sessions de débogage, échecs, percées — et la satisfaction silencieuse de faire fonctionner quelque chose de complexe avec précision.",
      "Ce qui a commencé par de la curiosité s'est transformé en discipline. Ce qui ressemblait à des lignes de code est devenu architecture, structure et possibilité.",
      "Aujourd'hui, je ne fais pas que du code. Je conçois de la logique. J'ingénierise des solutions. Je crée des expériences digitales qui paraissent simples en surface mais sont méticuleusement structurées en dessous.",
      "J'aborde chaque projet comme un système à comprendre — puis à optimiser. Code propre. Structure scalable. Design intentionnel. Car derrière chaque grand produit se cache une logique invisible. Et c'est là que j'opère.",
    ],
    statAge: "Ans", statProjects: "Projets",
    s2label: "02 — Ce que j'utilise",
    s2title: <>Mes <em>outils</em></>,
    s3label: "03 — Ce que j'ai créé",
    s3title: <>Projets <em>sélectionnés</em></>,
    liveDemo: "Démo en direct ↗", github: "GitHub",
    projectDesc: "Site de notes full-stack développé avec Java et Spring Boot, utilisant Spring Data JPA, Lombok et H2 Database. Permet aux utilisateurs de créer, lire, mettre à jour et supprimer des notes via une API RESTful.",
    s4label: "04 — Me contacter",
    s4title: <>Travaillons <em>ensemble</em></>,
    contactDesc: "Vous avez un projet en tête ? J'adorerais en entendre parler. Envoyez-moi un message et créons quelque chose de merveilleux ensemble.",
    labelName: "Nom", labelEmail: "Email", labelSubject: "Sujet", labelMessage: "Message",
    phName: "Votre nom", phEmail: "vous@email.com", phSubject: "De quoi s'agit-il ?", phMessage: "Parlez-moi de votre projet...",
    sendBtn: "Envoyer ✦",
    sendingBtn: "Envoi en cours...",
    sentMsg: "✦ Message envoyé ! Je vous répondrai bientôt 🌸",
    errorMsg: "⚠️ Une erreur s'est produite. Veuillez réessayer.",
    footerBuilt: "© 2025 · Créé avec React & 🌸",
  },

  ar: {
    flag: "🇩🇿", code: "AR", dir: "rtl",
    nav: ["عنّي", "المهارات", "المشاريع", "التواصل"],
    navHrefs: ["#about", "#skills", "#projects", "#contact"],
    available: "✦ متاحة للعمل",
    greeting: "مرحباً، أنا",
    roles: ["مطوّرة Full-Stack", "مبرمجة مبدعة"],
    viewWork: "← استعرض أعمالي",
    letsTalk: "تواصل معي",
    scroll: "تمرير",
    s1label: "٠١ — من أنا",
    s1title: <>عادية الأصل، لا تُقهر بالاختيار.<br /><em>أبني الآن بالكود.</em></>,
    bio: [
      "لم يكن من المفترض أن أصل إلى هنا. لم يكن البرمجة هو الخطة — حتى تحوّل الفضول إلى هوس.",
      "بدأ الأمر بأسئلة بسيطة: كيف يعمل هذا؟ لماذا يتصرف هكذا؟ هل يمكن أن يكون أفضل؟ تحوّلت تلك الأسئلة إلى ليالٍ طويلة، جلسات تصحيح أخطاء، محاولات فاشلة، اختراقات — والرضا الهادئ من جعل شيء معقد يعمل بدقة أخيراً.",
      "ما بدأ بالفضول تطوّر إلى انضباط. ما بدا كأسطر من الكود أصبح هندسة وبنية وإمكانية.",
      "اليوم، أنا لا أكتب الكود فحسب. أصمّم المنطق. أبتكر الحلول. أصنع تجارب رقمية تبدو سهلة على السطح لكنها مبنية بعناية فائقة من الداخل.",
      "أتعامل مع كل مشروع كنظام ينتظر أن يُفهم — ثم يُحسَّن. كود نظيف. بنية قابلة للتوسع. تصميم مقصود. لأن وراء كل منتج رائع منطقاً خفياً. وهذا هو مجالي.",
    ],
    statAge: "سنة", statProjects: "مشاريع",
    s2label: "٠٢ — ما أستخدمه",
    s2title: <>أدواتي <em>التقنية</em></>,
    s3label: "٠٣ — ما بنيته",
    s3title: <>مشاريع <em>مختارة</em></>,
    liveDemo: "عرض مباشر ↗", github: "GitHub",
    projectDesc: "موقع ملاحظات متكامل مبني بـ Java وSpring Boot، يستخدم Spring Data JPA وLombok وH2 Database. يتيح للمستخدمين إنشاء الملاحظات وقراءتها وتحديثها وحذفها عبر RESTful API.",
    s4label: "٠٤ — تواصل معي",
    s4title: <>لنعمل <em>معاً</em></>,
    contactDesc: "هل لديك مشروع في ذهنك؟ يسعدني سماع تفاصيله. أرسل لي رسالة ولنبنِ شيئاً رائعاً معاً.",
    labelName: "الاسم", labelEmail: "البريد الإلكتروني", labelSubject: "الموضوع", labelMessage: "الرسالة",
    phName: "اسمك", phEmail: "بريدك@example.com", phSubject: "ما الموضوع؟", phMessage: "أخبرني عن مشروعك...",
    sendBtn: "إرسال الرسالة ✦",
    sendingBtn: "جارٍ الإرسال...",
    sentMsg: "✦ تم إرسال رسالتك! سأرد عليك قريباً 🌸",
    errorMsg: "⚠️ حدث خطأ ما. يرجى المحاولة مجدداً.",
    footerBuilt: "© 2025 · بُني بـ React & 🌸",
  },
};

const LANGS = ["en", "fr", "ar"];

// ── STYLES ────────────────────────────────────────────────────
const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&family=DM+Mono:wght@300;400&family=Plus+Jakarta+Sans:wght@300;400;500;600&family=Cairo:wght@300;400;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root { scroll-behavior: smooth; }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: 'Plus Jakarta Sans', sans-serif;
    transition: background 0.4s, color 0.4s;
    overflow-x: hidden;
  }
  body[dir="rtl"] { font-family: 'Cairo', sans-serif; }

  /* ── LANG SWITCHER ── */
  .lang-switcher { display: flex; gap: 0.4rem; align-items: center; }
  .lang-btn {
    display: flex; align-items: center; gap: 0.3rem;
    padding: 0.3rem 0.65rem; border-radius: 999px;
    border: 1.5px solid var(--border); background: transparent;
    font-size: 0.72rem; font-weight: 600; letter-spacing: 0.06em;
    color: var(--text2); cursor: pointer; transition: all 0.2s;
    font-family: inherit;
  }
  .lang-btn:hover { border-color: var(--accent); color: var(--accent); }
  .lang-btn.active { background: var(--accent); color: #fff; border-color: var(--accent); }
  .lang-flag { font-size: 1rem; line-height: 1; }

  /* ── NAV ── */
  nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 100;
    background: var(--nav-bg);
    backdrop-filter: blur(18px); -webkit-backdrop-filter: blur(18px);
    border-bottom: 1px solid var(--border);
    padding: 0 2.5rem; height: 64px;
    display: flex; align-items: center; justify-content: space-between;
    transition: background 0.4s, border-color 0.4s; gap: 1rem;
  }
  .nav-logo {
    font-family: 'Cormorant Garamond', serif;
    font-size: 1.5rem; font-weight: 600;
    color: var(--accent); letter-spacing: 0.02em; flex-shrink: 0;
  }
  .nav-logo span { color: var(--text); }
  .nav-right { display: flex; gap: 1.2rem; align-items: center; }
  .nav-links { display: flex; gap: 1.5rem; align-items: center; }
  .nav-links a {
    font-size: 0.82rem; font-weight: 500; letter-spacing: 0.06em;
    text-transform: uppercase; text-decoration: none;
    color: var(--text2); transition: color 0.2s; white-space: nowrap;
  }
  .nav-links a:hover { color: var(--accent); }

  /* ── TOGGLE ── */
  .toggle {
    width: 52px; height: 28px; border-radius: 999px;
    background: var(--bg2); border: 1.5px solid var(--border);
    cursor: pointer; position: relative;
    transition: background 0.3s, border-color 0.3s; flex-shrink: 0;
  }
  .toggle-knob {
    position: absolute; top: 3px;
    width: 20px; height: 20px; border-radius: 50%;
    background: var(--accent);
    transition: transform 0.3s cubic-bezier(.34,1.56,.64,1);
    display: flex; align-items: center; justify-content: center; font-size: 11px;
  }
  .toggle-knob.dark  { transform: translateX(24px); }
  .toggle-knob.light { transform: translateX(3px); }

  /* ── HERO ── */
  .hero {
    min-height: 100vh; display: flex; align-items: center; justify-content: center;
    flex-direction: column; text-align: center;
    padding: 7rem 2rem 4rem; position: relative; overflow: hidden;
  }
  .hero-blob { position: absolute; border-radius: 50%; filter: blur(80px); opacity: 0.45; pointer-events: none; }
  .blob1 { width: 420px; height: 420px; background: var(--accent2); top: -80px; right: -80px; animation: float 8s ease-in-out infinite; }
  .blob2 { width: 300px; height: 300px; background: var(--accent); bottom: 40px; left: -60px; animation: float 10s ease-in-out infinite reverse; }
  @keyframes float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-28px)} }

  .hero-tag {
    font-family: 'DM Mono', monospace; font-size: 0.75rem;
    color: var(--accent); letter-spacing: 0.18em; text-transform: uppercase;
    background: var(--accent-glow); border: 1px solid var(--border);
    padding: 0.35rem 1rem; border-radius: 999px; margin-bottom: 1.5rem;
    animation: fadeUp 0.7s 0.1s both;
  }
  body[dir="rtl"] .hero-tag { font-family: 'Cairo', sans-serif; letter-spacing: 0; }
  .hero h1 {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(3.2rem, 8vw, 6.5rem); font-weight: 300; line-height: 1.05;
    letter-spacing: -0.02em; margin-bottom: 0.4rem; animation: fadeUp 0.7s 0.25s both;
  }
  body[dir="rtl"] .hero h1 { font-family: 'Cairo', serif; letter-spacing: 0; }
  .hero h1 .name { color: var(--accent); font-weight: 600; }
  .hero-sub {
    font-family: 'DM Mono', monospace; font-size: clamp(0.9rem, 2vw, 1.05rem);
    color: var(--text2); min-height: 1.6em; margin-bottom: 2rem;
    animation: fadeUp 0.7s 0.4s both;
  }
  body[dir="rtl"] .hero-sub { font-family: 'Cairo', sans-serif; }
  .cursor {
    display: inline-block; width: 2px; height: 1.1em; background: var(--accent);
    margin-left: 2px; animation: blink 1s step-end infinite; vertical-align: text-bottom;
  }
  body[dir="rtl"] .cursor { margin-left: 0; margin-right: 2px; }
  @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }
  .hero-btns { display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center; animation: fadeUp 0.7s 0.55s both; }
  .btn {
    padding: 0.75rem 2rem; border-radius: 999px; font-size: 0.85rem;
    font-weight: 600; letter-spacing: 0.05em; cursor: pointer;
    text-decoration: none; transition: all 0.25s; border: 1.5px solid transparent;
    display: inline-flex; align-items: center; gap: 0.5rem;
  }
  .btn-primary { background: var(--accent); color: #fff; border-color: var(--accent); }
  .btn-primary:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 8px 24px var(--accent-glow); }
  .btn-primary:disabled { opacity: 0.65; cursor: not-allowed; }
  .btn-outline { background: transparent; color: var(--accent); border-color: var(--border); }
  .btn-outline:hover { border-color: var(--accent); background: var(--accent-glow); transform: translateY(-2px); }
  @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
  .scroll-hint {
    position: absolute; bottom: 2.5rem; font-family: 'DM Mono', monospace; font-size: 0.7rem;
    color: var(--text2); letter-spacing: 0.12em;
    display: flex; flex-direction: column; align-items: center; gap: 0.5rem;
    animation: fadeUp 0.7s 1s both;
  }
  body[dir="rtl"] .scroll-hint { font-family: 'Cairo', sans-serif; letter-spacing: 0; }
  .scroll-line { width: 1px; height: 40px; background: linear-gradient(to bottom, var(--accent), transparent); animation: scrollPulse 2s ease-in-out infinite; }
  @keyframes scrollPulse { 0%,100%{opacity:0.3} 50%{opacity:1} }

  /* ── SECTIONS ── */
  section { padding: 7rem 2rem; max-width: 1100px; margin: 0 auto; }
  .section-label {
    font-family: 'DM Mono', monospace; font-size: 0.72rem;
    letter-spacing: 0.2em; text-transform: uppercase; color: var(--accent); margin-bottom: 0.75rem;
  }
  body[dir="rtl"] .section-label { font-family: 'Cairo', sans-serif; letter-spacing: 0; }
  .section-title {
    font-family: 'Cormorant Garamond', serif;
    font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 300; line-height: 1.15;
    margin-bottom: 1rem; color: var(--text);
  }
  body[dir="rtl"] .section-title { font-family: 'Cairo', serif; }
  .section-title em { color: var(--accent); font-style: italic; }
  body[dir="rtl"] .section-title em { font-style: normal; }
  .section-divider { width: 48px; height: 2px; background: var(--accent); border-radius: 2px; margin-bottom: 3rem; }

  /* ── ABOUT ── */
  .about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
  @media(max-width:768px){ .about-grid{ grid-template-columns:1fr; gap:2rem; } }
  .about-img-wrap {
    aspect-ratio: 4/5; border-radius: 24px;
    background: var(--surface2); border: 1.5px solid var(--border);
    display: flex; align-items: center; justify-content: center;
    position: relative; overflow: hidden; transition: border-color 0.3s;
  }
  .about-img-wrap::before {
    content: ''; position: absolute; inset: 0; z-index: 1; pointer-events: none;
    background: linear-gradient(135deg, var(--accent-glow), transparent 60%);
  }
  .about-img-wrap:hover { border-color: var(--accent); }
  .about-text p { color: var(--text2); line-height: 1.85; font-size: 1rem; margin-bottom: 1.2rem; }
  .about-stats { display: flex; gap: 2rem; margin-top: 1.5rem; flex-wrap: wrap; }
  .stat { text-align: center; }
  .stat-num { font-family: 'Cormorant Garamond', serif; font-size: 2.5rem; font-weight: 600; color: var(--accent); line-height: 1; }
  body[dir="rtl"] .stat-num { font-family: 'Cairo', serif; }
  .stat-label { font-size: 0.75rem; color: var(--text2); letter-spacing: 0.08em; text-transform: uppercase; margin-top: 0.25rem; }
  body[dir="rtl"] .stat-label { letter-spacing: 0; }

  /* ── SKILLS ── */
  .skills-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(140px, 1fr)); gap: 1rem; }
  .skill-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 16px; padding: 1.25rem 1rem;
    text-align: center; transition: all 0.25s; cursor: default;
  }
  .skill-card:hover { border-color: var(--accent); transform: translateY(-4px); box-shadow: 0 12px 32px var(--accent-glow); }
  .skill-icon { font-size: 1.8rem; margin-bottom: 0.5rem; display: flex; justify-content: center; }
  .skill-icon img { width: 40px; height: 40px; object-fit: contain; }
  body.dark-mode .skill-icon img[src*="github"] { filter: invert(1); }
  body.dark-mode .skill-icon img[src*="wordpress"] { filter: invert(0.8); }
  .skill-name { font-size: 0.8rem; font-weight: 600; letter-spacing: 0.04em; color: var(--text); }
  body[dir="rtl"] .skill-name { letter-spacing: 0; }

  /* ── PROJECTS ── */
  .projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(320px, 1fr)); gap: 1.5rem; }
  .project-card {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 20px; overflow: hidden; transition: all 0.3s; display: flex; flex-direction: column;
  }
  .project-card:hover { border-color: var(--accent); transform: translateY(-6px); box-shadow: 0 20px 48px var(--accent-glow); }
  .project-thumb {
    height: 180px; background: var(--surface2);
    display: flex; align-items: center; justify-content: center;
    font-size: 3.5rem; border-bottom: 1.5px solid var(--border); position: relative; overflow: hidden;
  }
  .project-thumb::after {
    content: ''; position: absolute; inset: 0;
    background: linear-gradient(135deg, var(--accent-glow) 0%, transparent 70%);
    opacity: 0; transition: opacity 0.3s;
  }
  .project-card:hover .project-thumb::after { opacity: 1; }
  .project-body { padding: 1.5rem; flex: 1; display: flex; flex-direction: column; }
  .project-tags { display: flex; gap: 0.4rem; flex-wrap: wrap; margin-bottom: 0.75rem; }
  .project-tag {
    font-family: 'DM Mono', monospace; font-size: 0.65rem;
    background: var(--accent-glow); color: var(--accent);
    border: 1px solid var(--border); border-radius: 999px; padding: 0.2rem 0.65rem; letter-spacing: 0.06em;
  }
  body[dir="rtl"] .project-tag { font-family: 'Cairo', sans-serif; letter-spacing: 0; }
  .project-title { font-size: 1.1rem; font-weight: 600; margin-bottom: 0.5rem; color: var(--text); }
  .project-desc { font-size: 0.87rem; color: var(--text2); line-height: 1.7; flex: 1; margin-bottom: 1.25rem; }
  .project-links { display: flex; gap: 0.75rem; }
  .project-link {
    font-size: 0.78rem; font-weight: 600; color: var(--accent);
    text-decoration: none; border: 1px solid var(--border);
    border-radius: 999px; padding: 0.3rem 0.9rem; transition: all 0.2s; letter-spacing: 0.04em;
  }
  .project-link:hover { background: var(--accent); color: #fff; border-color: var(--accent); }

  /* ── CONTACT ── */
  .contact-inner { max-width: 680px; margin: 0 auto; text-align: center; }
  .contact-inner > p { color: var(--text2); line-height: 1.8; margin-bottom: 2.5rem; font-size: 1rem; }
  .contact-form { display: flex; flex-direction: column; gap: 1rem; text-align: left; }
  body[dir="rtl"] .contact-form { text-align: right; }
  .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
  @media(max-width:540px){ .form-row{ grid-template-columns:1fr; } }
  .form-group { display: flex; flex-direction: column; gap: 0.4rem; }
  .form-group label { font-size: 0.75rem; font-weight: 600; letter-spacing: 0.08em; text-transform: uppercase; color: var(--text2); }
  body[dir="rtl"] .form-group label { letter-spacing: 0; }
  .form-group input, .form-group textarea {
    background: var(--surface); border: 1.5px solid var(--border);
    border-radius: 12px; padding: 0.85rem 1rem;
    color: var(--text); font-family: inherit; font-size: 0.9rem;
    outline: none; transition: border-color 0.2s, box-shadow 0.2s; resize: none;
  }
  .form-group input:focus, .form-group textarea:focus {
    border-color: var(--accent); box-shadow: 0 0 0 3px var(--accent-glow);
  }
  .form-group textarea { min-height: 130px; }
  .form-submit { align-self: flex-end; }
  body[dir="rtl"] .form-submit { align-self: flex-start; }

  /* ── FORM FEEDBACK ── */
  .sent-msg {
    text-align: center; color: var(--accent); font-size: 1rem;
    padding: 2rem; animation: fadeUp 0.5s both;
    background: var(--accent-glow); border: 1px solid var(--border);
    border-radius: 16px;
  }
  .error-msg {
    text-align: center; color: #e05; font-size: 0.85rem;
    padding: 0.75rem 1rem; background: rgba(220,0,80,0.08);
    border: 1px solid rgba(220,0,80,0.2); border-radius: 10px;
    animation: fadeUp 0.4s both;
  }
  .spinner {
    display: inline-block; width: 14px; height: 14px;
    border: 2px solid rgba(255,255,255,0.4); border-top-color: #fff;
    border-radius: 50%; animation: spin 0.7s linear infinite; margin-right: 6px;
  }
  body[dir="rtl"] .spinner { margin-right: 0; margin-left: 6px; }
  @keyframes spin { to { transform: rotate(360deg); } }

  /* ── FOOTER ── */
  footer {
    border-top: 1px solid var(--border); padding: 2rem 2.5rem;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 1rem; color: var(--text2); font-size: 0.8rem;
    transition: border-color 0.4s;
  }
  .footer-logo { font-family: 'Cormorant Garamond', serif; font-size: 1.2rem; color: var(--accent); }
  .footer-socials { display: flex; gap: 1rem; }
  .footer-socials a { color: var(--text2); text-decoration: none; transition: color 0.2s; }
  .footer-socials a:hover { color: var(--accent); }

  @media(max-width:700px){
    .nav-links { display: none; }
    .nav-right { gap: 0.5rem; }
    .lang-btn { padding: 0.25rem 0.45rem; font-size: 0.65rem; }
  }
`;

// ── SKILLS DATA ───────────────────────────────────────────────
const SKILLS = [
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg" alt="React" />, name: "React" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/javascript/javascript-plain.svg" alt="JS" />, name: "JavaScript" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original-wordmark.svg" alt="Java" />, name: "Java" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/css3/css3-plain-wordmark.svg" alt="CSS3" />, name: "CSS" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/html5/html5-plain-wordmark.svg" alt="HTML5" />, name: "HTML5" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-plain-wordmark.svg" alt="Node.js" />, name: "Node.js" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/php/php-original.svg" alt="PHP" />, name: "PHP" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-plain-wordmark.svg" alt="Git" />, name: "Git" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/github/github-original-wordmark.svg" alt="GitHub" />, name: "GitHub" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/androidstudio/androidstudio-original-wordmark.svg" alt="Android Studio" />, name: "Android Studio" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/figma/figma-original.svg" alt="Figma" />, name: "Figma" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/laravel/laravel-original.svg" alt="Laravel" />, name: "Laravel" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original-wordmark.svg" alt="VSCode" />, name: "VS Code" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg" alt="Tailwind" />, name: "Tailwind CSS" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/flutter/flutter-original.svg" alt="Flutter" />, name: "Flutter" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/wordpress/wordpress-plain.svg" alt="WordPress" />, name: "WordPress" },
  { icon: <img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/spring/spring-original.svg" alt="Spring" />, name: "Spring Boot" },
];

// ── TYPEWRITER HOOK ───────────────────────────────────────────
function useTypewriter(words, speed = 80, pause = 1800) {
  const [display, setDisplay] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    setDisplay(""); setWordIdx(0); setCharIdx(0); setDeleting(false);
  }, [words]);

  useEffect(() => {
    const current = words[wordIdx % words.length];
    const timeout = setTimeout(() => {
      if (!deleting) {
        setDisplay(current.slice(0, charIdx + 1));
        if (charIdx + 1 === current.length) setTimeout(() => setDeleting(true), pause);
        else setCharIdx(c => c + 1);
      } else {
        setDisplay(current.slice(0, charIdx - 1));
        if (charIdx - 1 === 0) {
          setDeleting(false);
          setWordIdx(i => (i + 1) % words.length);
          setCharIdx(0);
        } else setCharIdx(c => c - 1);
      }
    }, deleting ? speed / 2 : speed);
    return () => clearTimeout(timeout);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return display;
}

// ── APP ───────────────────────────────────────────────────────
export default function Portfolio() {
  const [dark, setDark]       = useState(false);
  const [lang, setLang]       = useState("en");
  const [sending, setSending] = useState(false); // ← form is submitting
  const [sent, setSent]       = useState(false); // ← email sent successfully
  const [error, setError]     = useState(false); // ← send failed
  const formRef = useRef();

  const tx   = LANG_DATA[lang];
  const role = useTypewriter(tx.roles);

  // Apply theme CSS vars
  useEffect(() => {
    const theme = dark ? themes.dark : themes.light;
    Object.entries(theme).forEach(([k, v]) => document.documentElement.style.setProperty(k, v));
    document.body.classList.toggle("dark-mode", dark);
  }, [dark]);

  // Apply RTL / LTR
  useEffect(() => {
    document.body.setAttribute("dir", tx.dir);
    document.documentElement.setAttribute("lang", lang);
  }, [lang, tx.dir]);

  // ── EMAILJS SUBMIT ──────────────────────────────────────────
  function handleSubmit(e) {
    e.preventDefault();
    setSending(true);
    setError(false);

    emailjs.sendForm(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      formRef.current,        // reads name attributes from inputs
      EMAILJS_PUBLIC_KEY
    )
    .then(() => {
      setSending(false);
      setSent(true);
      formRef.current.reset();
      setTimeout(() => setSent(false), 6000); // hide success after 6s
    })
    .catch((err) => {
      console.error("EmailJS error:", err);
      setSending(false);
      setError(true);
      setTimeout(() => setError(false), 6000); // hide error after 6s
    });
  }

  return (
    <>
      <style>{css}</style>

      {/* ── NAV ── */}
      <nav>
        <div className="nav-logo">dev<span>.</span>folio</div>
        <div className="nav-right">
          <div className="nav-links">
            {tx.nav.map((label, i) => (
              <a key={label} href={tx.navHrefs[i]}>{label}</a>
            ))}
          </div>
          <div className="lang-switcher">
            {LANGS.map(l => (
              <button
                key={l}
                className={`lang-btn${lang === l ? " active" : ""}`}
                onClick={() => setLang(l)}
                aria-label={`Switch to ${l}`}
              >
                <span className="lang-flag">{LANG_DATA[l].flag}</span>
                {LANG_DATA[l].code}
              </button>
            ))}
          </div>
          <button className="toggle" onClick={() => setDark(d => !d)} aria-label="Toggle theme">
            <div className={`toggle-knob ${dark ? "dark" : "light"}`}>
              {dark ? "🌙" : "☀️"}
            </div>
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="hero">
        <div className="hero-blob blob1" />
        <div className="hero-blob blob2" />
        <div className="hero-tag">{tx.available}</div>
        <h1>{tx.greeting} <span className="name">IKRAM</span></h1>
        <p className="hero-sub">{role}<span className="cursor" /></p>
        <div className="hero-btns">
          <a href="#projects" className="btn btn-primary">{tx.viewWork}</a>
          <a href="#contact"  className="btn btn-outline">{tx.letsTalk}</a>
        </div>
        <div className="scroll-hint">
          <div className="scroll-line" />
          {tx.scroll}
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about">
        <div className="section-label">{tx.s1label}</div>
        <h2 className="section-title">{tx.s1title}</h2>
        <div className="section-divider" />
        <div className="about-grid">
          <div className="about-img-wrap">
            <video
              src="src/assets/animate.mp4"
              autoPlay loop muted playsInline
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "22px" }}
            />
          </div>
          <div className="about-text">
            {tx.bio.map((para, i) => <p key={i}>{para}</p>)}
            <div className="about-stats">
              <div className="stat"><div className="stat-num">23</div><div className="stat-label">{tx.statAge}</div></div>
              <div className="stat"><div className="stat-num">6+</div><div className="stat-label">{tx.statProjects}</div></div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SKILLS ── */}
      <section id="skills" style={{ background: "var(--bg2)", maxWidth: "100%", borderTop: "1px solid var(--border)", borderBottom: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label">{tx.s2label}</div>
          <h2 className="section-title">{tx.s2title}</h2>
          <div className="section-divider" />
          <div className="skills-grid">
            {SKILLS.map(s => (
              <div key={s.name} className="skill-card">
                <div className="skill-icon">{s.icon}</div>
                <div className="skill-name">{s.name}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects">
        <div className="section-label">{tx.s3label}</div>
        <h2 className="section-title">{tx.s3title}</h2>
        <div className="section-divider" />
        <div className="projects-grid">
          <div className="project-card">
            <div className="project-thumb">
              <img src="src/assets/noteflow.PNG" alt="NoteFlow" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </div>
            <div className="project-body">
              <div className="project-tags">
                {["Java", "Spring Boot", "H2 Database", "REST API", "Lombok"].map(tag => (
                  <span key={tag} className="project-tag">{tag}</span>
                ))}
              </div>
              <div className="project-title">NoteFlow</div>
              <p className="project-desc">{tx.projectDesc}</p>
              <div className="project-links">
                <a href="#" className="project-link">{tx.liveDemo}</a>
                <a href="#" className="project-link">{tx.github}</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" style={{ background: "var(--bg2)", maxWidth: "100%", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div className="section-label">{tx.s4label}</div>
          <h2 className="section-title">{tx.s4title}</h2>
          <div className="section-divider" />
          <div className="contact-inner">
            <p>{tx.contactDesc}</p>

            {/* ── SUCCESS STATE ── */}
            {sent ? (
              <div className="sent-msg">{tx.sentMsg}</div>
            ) : (
              <form className="contact-form" onSubmit={handleSubmit} ref={formRef}>
                <div className="form-row">
                  <div className="form-group">
                    <label>{tx.labelName}</label>
                    {/* name="from_name" must match your EmailJS template variable {{from_name}} */}
                    <input name="from_name" type="text" placeholder={tx.phName} required />
                  </div>
                  <div className="form-group">
                    <label>{tx.labelEmail}</label>
                    {/* name="from_email" must match {{from_email}} */}
                    <input name="from_email" type="email" placeholder={tx.phEmail} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>{tx.labelSubject}</label>
                  {/* name="subject" must match {{subject}} */}
                  <input name="subject" type="text" placeholder={tx.phSubject} required />
                </div>
                <div className="form-group">
                  <label>{tx.labelMessage}</label>
                  {/* name="message" must match {{message}} */}
                  <textarea name="message" placeholder={tx.phMessage} required />
                </div>

                {/* ── ERROR STATE ── */}
                {error && (
                  <div className="error-msg">{tx.errorMsg}</div>
                )}

                <div className="form-submit">
                  <button type="submit" className="btn btn-primary" disabled={sending}>
                    {sending && <span className="spinner" />}
                    {sending ? tx.sendingBtn : tx.sendBtn}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer>
        <div className="footer-logo">dev.folio</div>
        <span>{tx.footerBuilt}</span>
        <div className="footer-socials">
          <a href="#">GitHub</a>
          <a href="#">LinkedIn</a>
          <a href="#">Twitter</a>
          <a href="#">Dribbble</a>
        </div>
      </footer>
    </>
  );
}