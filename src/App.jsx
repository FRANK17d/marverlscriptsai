import { useMemo, useState, useEffect, useRef } from "react";

/* ─────────────────────────────────────────────
   DATA
   ───────────────────────────────────────────── */
const characters = [
  { id:"iron-man",       name:"Iron Man",       role:"Estratega sarcastico",   power:"armadura tactica y genio tecnico",         color:"#d6533f" },
  { id:"spider-man",     name:"Spider-Man",      role:"Heroe agil",             power:"sentido aracnido y humor bajo presion",     color:"#3f6fd6" },
  { id:"black-panther",  name:"Black Panther",   role:"Rey protector",          power:"vibranium, sigilo y liderazgo",             color:"#6b5bd6" },
  { id:"captain-marvel", name:"Captain Marvel",  role:"Fuerza cosmica",         power:"energia fotonica y vuelo interestelar",     color:"#d6983f" },
  { id:"doctor-strange", name:"Doctor Strange",  role:"Mago calculador",        power:"portales, hechizos y lectura de futuros",   color:"#3f9fd6" },
  { id:"scarlet-witch",  name:"Scarlet Witch",   role:"Alteradora de realidad", power:"magia del caos y memoria emocional",        color:"#c74763" },
  { id:"thor",           name:"Thor",            role:"Guerrero asgardiano",    power:"trueno, fuerza y presencia mitica",         color:"#6c8fbd" },
  { id:"loki",           name:"Loki",            role:"Tramposo brillante",     power:"ilusiones, manipulacion y planes dobles",   color:"#6b8f45" },
];

const tones     = ["Epico","Comedia","Oscuro","Aventura","Drama emocional"];
const lengths   = ["Corto","Medio","Largo"];
const conflicts = [
  "un artefacto antiguo abre una grieta temporal",
  "una IA rebelde replica las voces de los heroes",
  "una ciudad entera queda atrapada en un bucle de una hora",
  "un villano invisible manipula las decisiones del equipo",
  "una alianza imposible exige confiar en el personaje equivocado",
];

const marketingStrategy = {
  inbound:[
    "Contenido educativo en blog y reels sobre IA, guion y creatividad.",
    "SEO on-page y publicaciones semanales para atraer tráfico orgánico.",
    "Email marketing con lead magnet de prompts y plantillas de guion.",
  ],
  outbound:[
    "Campañas de Google Ads y Meta Ads para captar usuarios y validar demanda.",
    "Colaboraciones con creadores de contenido y comunidades de cine/IA.",
    "Remarketing para recuperar visitantes que no realizaron registro.",
  ],
  platforms:[
    "Página web principal con landing page, demostración y registro.",
    "Aplicación web premium para crear guiones con IA y exportación rápida.",
    "Futuro ecommerce de packs, plantillas y cursos creativos.",
  ],
  seoSem:[
    "Investigación de palabras clave: guion con IA, generador de guiones, prompts para cine, storytelling con IA.",
    "Optimización SEO técnico: títulos, meta descripciones, estructura HTML, velocidad y mobile first.",
    "SEM básico: campañas de marca, captura de leads y remarketing.",
  ],
};

const smartGoals = [
  "Aumentar el tráfico orgánico a 1,500 visitantes mensuales en 90 días.",
  "Captar 100 leads cualificados y 20 usuarios activos en 120 días.",
];

const socialPlatforms = [
  { name:"Instagram", reason:"Ideal para reels, inspiración visual y comunidad creativa.",        url:"https://www.instagram.com/marvelscriptsai/" },
  { name:"TikTok",    reason:"Perfecto para contenido viral, guiones cortos y demos rápidas.",     url:"https://www.tiktok.com/@marvelscriptsai" },
  { name:"YouTube",   reason:"Permite enseñar procesos, tutoriales y showcases del producto.",     url:"https://www.youtube.com/@marvelscriptsai" },
  { name:"LinkedIn",  reason:"Útil para networking, partners y posicionamiento B2B del proyecto.", url:"https://www.linkedin.com/company/marvelscriptsai/" },
];

const sceneCounts  = { Corto:2, Medio:3, Largo:5 };
const aiApiEnabled = import.meta.env.PROD || import.meta.env.VITE_AI_API_ENABLED === "true";

/* ─────────────────────────────────────────────
   SCRIPT BUILDER
   ───────────────────────────────────────────── */
function buildScript({ selectedCharacters, premise, tone, length, conflict }) {
  const cast     = selectedCharacters.map((c) => c.name);
  const lead     = selectedCharacters[0];
  const foil     = selectedCharacters[1];
  const wildCard = selectedCharacters[selectedCharacters.length - 1];
  const n        = sceneCounts[length];
  const c        = conflict || conflicts[0];

  const locs = [
    "azotea de una ciudad cubierta por lluvia metalica",
    "laboratorio subterraneo con pantallas fallando",
    "puente suspendido sobre una grieta de energia",
    "sala de mando improvisada dentro de una nave danada",
    "calle vacia donde los anuncios repiten el mismo mensaje",
  ];
  const beats = [
    `${lead.name} detecta que ${c}. Su ${lead.power} sirve para contener el primer golpe, pero no para explicar quien lo provoco.`,
    `${foil.name} descubre una pista que contradice el plan inicial. El equipo duda, porque la respuesta exige sacrificar tiempo y ventaja.`,
    `${wildCard.name} toma una decision inesperada y obliga al grupo a cambiar de tactica. La tension revela quien actua por orgullo y quien por miedo.`,
    `La amenaza separa al equipo. Cada personaje debe usar su mejor habilidad sin perder de vista la premisa: ${premise}.`,
    `El conflicto se resuelve cuando ${lead.name} deja de intentar ganar solo y convierte el defecto del equipo en su senal mas fuerte.`,
  ];
  const lines = [
    `${lead.name}: "No necesitamos un milagro. Necesitamos tres segundos y que nadie improvise peor que yo."`,
    `${foil.name}: "Si esto sale mal, al menos que sea por una razon que podamos defender."`,
    `${wildCard.name}: "La verdad siempre aparece tarde. Por eso conviene dejarle una puerta abierta."`,
  ];
  const scenes = Array.from({ length: n }, (_, i) => ({
    title: `Escena ${i + 1}: ${locs[i]}`, action: beats[i], dialogue: lines[i % lines.length],
  }));
  return {
    title:     `${tone}: ${lead.name} y la fractura final`,
    logline:   `Cuando ${c}, ${cast.join(", ")} deben resolver ${premise.toLowerCase()} antes de que la amenaza convierta su mayor poder en una trampa.`,
    cast, tone, length, scenes,
    finalHook: `Gancho final: una ultima senal demuestra que el enemigo no fue derrotado; solo estaba probando que combinacion de heroes podia detenerlo.`,
  };
}

function normalizeRemoteScript(r, fb) {
  const scenes = Array.isArray(r?.scenes)
    ? r.scenes.map((s,i)=>({ title:String(s?.title||`Escena ${i+1}`), action:String(s?.action||""), dialogue:String(s?.dialogue||"") })).filter(s=>s.action&&s.dialogue)
    : [];
  return {
    title:     String(r?.title     || fb.title),
    logline:   String(r?.logline   || fb.logline),
    cast:      Array.isArray(r?.cast) && r.cast.length ? r.cast.map(String) : fb.cast,
    tone:      String(r?.tone      || fb.tone),
    length:    String(r?.length    || fb.length),
    scenes:    scenes.length ? scenes : fb.scenes,
    finalHook: String(r?.finalHook || fb.finalHook),
  };
}

/* ─────────────────────────────────────────────
   PARTICLES
   ───────────────────────────────────────────── */
const PARTICLES = Array.from({ length: 20 }, (_, i) => ({
  id: i,
  left:    `${(Math.random() * 98).toFixed(1)}%`,
  dur:     `${(10 + Math.random() * 16).toFixed(1)}s`,
  delay:   `${(Math.random() * 14).toFixed(1)}s`,
  opacity: (0.12 + Math.random() * 0.32).toFixed(2),
  size:    `${(1 + Math.random() * 2).toFixed(1)}px`,
}));

function Particles() {
  return (
    <div className="particles-container" aria-hidden="true">
      {PARTICLES.map((p) => (
        <div key={p.id} className="particle" style={{
          left:p.left, bottom:"0", width:p.size, height:p.size,
          "--duration":p.dur, "--delay":p.delay, "--max-opacity":p.opacity,
        }} />
      ))}
    </div>
  );
}

/* ─────────────────────────────────────────────
   ICONS
   ───────────────────────────────────────────── */
const IconSun  = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/>
  </svg>
);
const IconMoon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

/* ─────────────────────────────────────────────
   BOOK CARD — Comic book cover style
   ───────────────────────────────────────────── */
function BookCard({ script, index, onClick, onDelete }) {
  const lead  = characters.find((c) => c.name === script.cast[0]);
  const color = lead?.color || "#ed1d24";
  const issue = String(index + 1).padStart(2, "0");

  function handleDelete(e) {
    e.stopPropagation();
    onDelete(index);
  }

  return (
    <div
      className="book-card"
      style={{ "--idx": index }}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && onClick()}
      aria-label={`Abrir guion: ${script.title}`}
    >
      {/* Delete button */}
      <button
        className="book-delete"
        onClick={handleDelete}
        aria-label={`Eliminar guion: ${script.title}`}
        title="Eliminar"
      >
        ✕
      </button>

      <div className="book-inner">
        <div className="book-cover">
          <div className="book-cover-color" style={{ background:`linear-gradient(145deg,${color},#000)` }} />
          <div className="book-cover-icon">
            <span className="book-cover-tone">{script.tone}</span>
            <span className="book-cover-title">{script.title.split(":")[1]?.trim() || script.title}</span>
            <span className="book-cover-cast">{script.cast.slice(0,2).join(" & ")}</span>
          </div>
          <div className="book-cover-overlay">
            <span className="book-open-btn">Leer guion</span>
          </div>
        </div>
        <div className="book-meta">
          <p className="book-meta-issue">#{issue} · {script.length}</p>
          <p className="book-meta-title">{script.cast[0]}</p>
          <p className="book-meta-sub">{script.tone}</p>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   SCRIPT READER MODAL
   ───────────────────────────────────────────── */
function ScriptModal({ script, index, onClose, onCopy, copied }) {
  const issue = String(index + 1).padStart(2, "0");

  useEffect(() => {
    const fn = (e) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", fn);
    return () => document.removeEventListener("keydown", fn);
  }, [onClose]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const scriptText = [
    script.title, "",
    `Logline: ${script.logline}`,
    `Tono: ${script.tone}`, `Duracion: ${script.length}`,
    `Reparto: ${script.cast.join(", ")}`, "",
    ...script.scenes.flatMap((s) => [s.title, s.action, s.dialogue, ""]),
    script.finalHook,
  ].join("\n");

  return (
    <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <p className="modal-issue">Guion #{issue} · {script.tone} · {script.length}</p>
          <h2 className="modal-title" id="modal-title">{script.title}</h2>
          <p className="modal-logline">{script.logline}</p>
          <button className="modal-close" onClick={onClose} aria-label="Cerrar">✕</button>
        </div>
        <div className="modal-body">
          <div className="modal-cast">
            {script.cast.map((n) => <span key={n} className="modal-cast-tag">{n}</span>)}
          </div>
          {script.scenes.map((scene) => (
            <div key={scene.title} className="modal-scene">
              <h4>{scene.title}</h4>
              <p>{scene.action}</p>
              <blockquote>{scene.dialogue}</blockquote>
            </div>
          ))}
          <div className="modal-hook">{script.finalHook}</div>
        </div>
        <div className="modal-footer">
          <button className="btn-ghost btn-sm" onClick={onClose}>Cerrar</button>
          <button
            className="btn-primary btn-sm"
            onClick={() => onCopy(scriptText)}
          >
            {copied ? "Copiado ✓" : "Copiar texto"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   MAIN APP
   ───────────────────────────────────────────── */
export default function App() {
  /* ── Theme ── */
  const [darkMode, setDarkMode] = useState(true);

  /* ── Navbar ── */
  const [scrolled,       setScrolled]       = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [activeSection,  setActiveSection]  = useState("hero");

  /* ── Mouse ── */
  const [mousePos, setMousePos] = useState({ x:0, y:0 });

  /* ── Cursor ── */
  const [cursorPos,  setCursorPos]  = useState({ x:-200, y:-200 });
  const [ringPos,    setRingPos]    = useState({ x:-200, y:-200 });
  const [isHovering, setIsHovering] = useState(false);
  const ringRef   = useRef({ x:-200, y:-200 });
  const targetRef = useRef({ x:-200, y:-200 });
  const rafRef    = useRef(null);

  /* ── Script editor ── */
  const [selectedIds, setSelectedIds] = useState(["iron-man","spider-man"]);
  const [premise,     setPremise]     = useState("salvar la ciudad sin romper la confianza del equipo");
  const [tone,        setTone]        = useState("Epico");
  const [length,      setLength]      = useState("Medio");
  const [conflict,    setConflict]    = useState(conflicts[1]);
  const [status,      setStatus]      = useState("idle");
  const [error,       setError]       = useState("");
  const [genSource,   setGenSource]   = useState("demo");

  /* ── Library ── */
  const [library,      setLibrary]      = useState([]);
  const [activeBook,   setActiveBook]   = useState(null);
  const [copied,       setCopied]       = useState(false);
  const [latestScript, setLatestScript] = useState(null);

  const selectedCharacters = useMemo(
    () => characters.filter((c) => selectedIds.includes(c.id)),
    [selectedIds],
  );

  /* ── Effects ── */

  // Dark mode
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  // Scroll → navbar + progress
  useEffect(() => {
    const fn = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Scroll spy — detect active section
  useEffect(() => {
    const sections = ["hero", "editor", "library", "strategy"];
    const observers = sections.map((id) => {
      const el = document.getElementById(id);
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => { if (entry.isIntersecting) setActiveSection(id); },
        { threshold: 0.25, rootMargin: "-80px 0px -40% 0px" },
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  // Mouse parallax
  useEffect(() => {
    const fn = (e) => {
      setMousePos({ x:(e.clientX/window.innerWidth-.5)*2, y:(e.clientY/window.innerHeight-.5)*2 });
      targetRef.current = { x:e.clientX, y:e.clientY };
    };
    window.addEventListener("mousemove", fn);
    return () => window.removeEventListener("mousemove", fn);
  }, []);

  // Cursor lerp ring
  useEffect(() => {
    const fn = (e) => setCursorPos({ x:e.clientX, y:e.clientY });
    window.addEventListener("mousemove", fn);
    const lerp = (a,b,t) => a+(b-a)*t;
    const tick = () => {
      const t=targetRef.current, r=ringRef.current;
      ringRef.current = { x:lerp(r.x,t.x,.11), y:lerp(r.y,t.y,.11) };
      setRingPos({...ringRef.current});
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => { window.removeEventListener("mousemove",fn); cancelAnimationFrame(rafRef.current); };
  }, []);

  // Cursor hover
  useEffect(() => {
    const on  = () => setIsHovering(true);
    const off = () => setIsHovering(false);
    const els = document.querySelectorAll("a, button, input, select, textarea, [role='button']");
    els.forEach((el) => { el.addEventListener("mouseenter",on); el.addEventListener("mouseleave",off); });
    return () => els.forEach((el) => { el.removeEventListener("mouseenter",on); el.removeEventListener("mouseleave",off); });
  });

  // Scroll reveal
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold:.08, rootMargin:"0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal, .section-head").forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  });

  /* ── Script actions ── */
  function toggleCharacter(id) {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter((i)=>i!==id) : [...ids, id]);
  }

  async function generateScript() {
    if (selectedCharacters.length < 2) { setError("Selecciona al menos dos personajes."); setStatus("error"); return; }
    if (!premise.trim())               { setError("Escribe una premisa para la historia."); setStatus("error"); return; }
    setError(""); setStatus("loading");

    const payload  = { selectedCharacters, premise:premise.trim(), tone, length, conflict };
    const fallback = buildScript(payload);

    const save = (s, source) => {
      setLatestScript(s);
      setLibrary((prev) => [s, ...prev]);
      setGenSource(source);
      setStatus("ready");
    };

    if (!aiApiEnabled) {
      window.setTimeout(() => save(fallback, "demo"), 450);
      return;
    }
    try {
      const res = await fetch("/api/generate-script", {
        method:"POST", headers:{"Content-Type":"application/json"}, body:JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      const result = await res.json();
      save(normalizeRemoteScript(result.data, fallback), "api");
    } catch {
      window.setTimeout(() => save(fallback, "demo"), 450);
    }
  }

  function deleteFromLibrary(index) {
    setLibrary((prev) => prev.filter((_, i) => i !== index));
    if (latestScript && library[index] === latestScript) setLatestScript(null);
  }

  function resetWorkspace() {
    setSelectedIds(["iron-man","spider-man"]);
    setPremise("salvar la ciudad sin romper la confianza del equipo");
    setTone("Epico"); setLength("Medio"); setConflict(conflicts[1]);
    setStatus("idle"); setError(""); setLatestScript(null);
  }

  function handleCopy(text) {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  }

  const heroImgStyle     = { transform:`scale(1.08) translate(${mousePos.x*-9}px,${mousePos.y*-6}px)` };
  const signalPanelStyle = { transform:`translate(${mousePos.x*7}px,${mousePos.y*5}px)` };

  /* ── NAV LINKS shared ── */
  const navLinks = [
    { id:"hero",     label:"Inicio" },
    { id:"editor",   label:"Crear" },
    { id:"library",  label:"Biblioteca" },
    { id:"strategy", label:"Estrategia" },
  ];

  /* ════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════ */
  return (
    <>
      {/* Custom cursor */}
      <div className="cursor cursor-dot" style={{ left:cursorPos.x, top:cursorPos.y }} aria-hidden="true" />
      <div className={`cursor cursor-ring${isHovering?" is-hovering":""}`} style={{ left:ringPos.x, top:ringPos.y }} aria-hidden="true" />

      {/* Scroll progress */}
      <div className="scroll-progress" style={{ transform:`scaleX(${scrollProgress})` }} aria-hidden="true" />

      {/* ── FLOATING NAVBAR ─────────────────── */}
      <header className={`navbar${scrolled?" scrolled":""}`}>
        <div className="navbar-inner">

          <a className="navbar-logo" href="#hero" aria-label="Marvel Scripts AI">
            <img src="/logo.png" alt="Marvel Scripts AI" className="navbar-logo-img" />
            <span className="navbar-logo-text">Marvel<span>Scripts</span> AI</span>
          </a>

          {/* Desktop links */}
          <nav aria-label="Navegación principal">
            <ul className="navbar-links">
              {navLinks.map(({ id, label }) => (
                <li key={id}>
                  <a href={`#${id}`} className={activeSection === id ? "active" : ""}>{label}</a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="navbar-actions">
            <button
              className="theme-toggle"
              type="button"
              onClick={() => setDarkMode((d)=>!d)}
              aria-label={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>

            <a href="#editor" className="navbar-cta" aria-label="Ir al editor">
              Crear guion
            </a>

            {/* Hamburger */}
            <button
              className={`hamburger${mobileOpen?" open":""}`}
              onClick={() => setMobileOpen((o)=>!o)}
              aria-label="Menú"
              aria-expanded={mobileOpen}
            >
              <span /><span /><span />
            </button>
          </div>

        </div>
      </header>

      {/* Mobile nav drawer */}
      {mobileOpen && (
        <nav className="mobile-nav open" aria-label="Menú móvil">
          {navLinks.map(({ id, label }) => (
            <a
              key={id}
              href={`#${id}`}
              className={activeSection === id ? "active" : ""}
              onClick={() => setMobileOpen(false)}
            >
              {label}
            </a>
          ))}
        </nav>
      )}

      {/* ════════ APP SHELL ════════════════════ */}
      <div className="app-shell">
        <div className="ambient ambient-one" aria-hidden="true" />
        <div className="ambient ambient-two" aria-hidden="true" />
        <Particles />

        {/* ── HERO ──────────────────────────── */}
        <section className="hero-section" id="hero" aria-labelledby="hero-title">
          <div className="hero-bg" aria-hidden="true">
            <img
              className="hero-bg-image"
              src="/hero.jpg"
              alt=""
              style={heroImgStyle}
              loading="eager"
              fetchPriority="high"
              decoding="async"
            />
            <div className="hero-bg-overlay" />
          </div>
          <div className="hero-accent-bar" aria-hidden="true" />

          <div className="hero-content">
            <div className="hero-copy">
              <div className="hero-badge">
                <span className="hero-badge-dot">AI</span>
                <span>Fan script studio con motor de IA</span>
              </div>

              <h1 className="hero-title" id="hero-title">
                <span className="hero-title-red">Marvel</span>
                Scripts AI
                <span className="hero-title-sub">Generador de guiones con inteligencia artificial</span>
              </h1>

              <p className="hero-subtitle">
                Elige tus héroes, define el conflicto y el tono. La IA construye
                escenas completas con acciones, diálogos y ganchos narrativos.
              </p>

              <div className="hero-cta">
                <a href="#editor" className="btn-primary">Crear guion ahora</a>
                <a href="#library" className="ghost-button">Ver biblioteca</a>
              </div>

              <div className="hero-stats">
                <div className="hero-stat"><strong>8</strong><span>Héroes</span></div>
                <div className="hero-stat"><strong>5</strong><span>Conflictos</span></div>
                <div className="hero-stat"><strong>IA</strong><span>Motor</span></div>
                <div className="hero-stat"><strong>{library.length}</strong><span>Guardados</span></div>
              </div>
            </div>

            <div className="signal-panel" aria-label="Estado del generador" style={signalPanelStyle}>
              <div className="signal-header">
                <span className="status-dot" aria-hidden="true" />
                <span>{genSource === "api" ? "IA real conectada" : "Motor demo listo"}</span>
              </div>
              <div className="signal-grid">
                <div><strong>{selectedCharacters.length}</strong><span>personajes</span></div>
                <div><strong>{length}</strong><span>duración</span></div>
                <div><strong>{tone}</strong><span>tono</span></div>
              </div>
              <div className="type-line">
                <span>prompt:</span> {premise || "esperando premisa…"}
              </div>
            </div>
          </div>
        </section>

        {/* ── EDITOR ────────────────────────── */}
        <section className="section page-wrap" id="editor" aria-labelledby="editor-title">
          <div className="section-head reveal from-bottom">
            <p className="eyebrow"><span className="eyebrow-bar" />Studio<span className="eyebrow-bar" /></p>
            <h2 className="section-title" id="editor-title">Crea tu guion</h2>
            <p className="section-sub">
              Configura personajes, tono y conflicto. El motor genera escenas completas al instante.
            </p>
          </div>

          <div className="editor-grid">

            {/* ── Control panel ── */}
            <div className="panel reveal from-left">
              <div className="panel-head">
                <p className="eyebrow"><span className="eyebrow-bar" />Configuración</p>
                <h2>Episodio</h2>
              </div>
              <form className="panel-body" onSubmit={(e) => e.preventDefault()}>

                <div className="field-group">
                  <label htmlFor="premise">Premisa</label>
                  <textarea id="premise" rows="3" value={premise}
                    onChange={(e) => setPremise(e.target.value)}
                    placeholder="Ej: una traicion obliga al equipo a dividirse" />
                  <p className="helper">Define el centro emocional de la escena.</p>
                </div>

                <div className="split-fields">
                  <div className="field-group">
                    <label htmlFor="tone">Tono</label>
                    <select id="tone" value={tone} onChange={(e) => setTone(e.target.value)}>
                      {tones.map((t) => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                  <div className="field-group">
                    <label htmlFor="length">Duración</label>
                    <select id="length" value={length} onChange={(e) => setLength(e.target.value)}>
                      {lengths.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </div>

                <div className="field-group">
                  <label htmlFor="conflict">Conflicto</label>
                  <select id="conflict" value={conflict} onChange={(e) => setConflict(e.target.value)}>
                    {conflicts.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>

                <div className="char-section">
                  <div>
                    <h3>Personajes</h3>
                    <p>Selecciona mínimo dos.</p>
                  </div>
                  <div className="char-grid">
                    {characters.map((char, index) => {
                      const sel = selectedIds.includes(char.id);
                      return (
                        <button key={char.id}
                          className={`char-card${sel?" is-selected":""}`}
                          style={{ "--accent":char.color, "--index":index }}
                          type="button" onClick={() => toggleCharacter(char.id)} aria-pressed={sel}
                        >
                          <span className="char-mark" aria-hidden="true" />
                          <strong>{char.name}</strong>
                          <small>{char.role}</small>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {status === "error" && <p className="error-msg" role="alert">{error}</p>}

                <button className="generate-button" type="button" onClick={generateScript}>
                  {status === "loading" ? "Generando…" : "Crear guion con IA"}
                </button>

                {latestScript && (
                  <button className="ghost-button" style={{ width:"100%", textAlign:"center" }}
                    type="button" onClick={resetWorkspace}>
                    Nueva sesión
                  </button>
                )}
              </form>
            </div>

            {/* ── Output panel ── */}
            <div className="panel output-panel-wrap reveal from-right">
              <div className="output-toolbar">
                <div>
                  <p className="eyebrow"><span className="eyebrow-bar" />Resultado</p>
                  <h2>Guion generado</h2>
                </div>
              </div>

              <div className="output-inner">
                {/* Demo mode info — NOT an error */}
                {genSource === "demo" && status === "ready" && (
                  <div className="demo-notice">
                    <span className="demo-notice-dot" />
                    Motor demo activo · Conecta la API para IA real (npm run dev:full).
                  </div>
                )}

                {status === "loading" && (
                  <div className="loading-state">
                    <span /><span /><span />
                    <p>Construyendo conflicto, escenas y diálogos…</p>
                  </div>
                )}

                {status !== "loading" && !latestScript && (
                  <div className="empty-state">
                    <p className="empty-kicker">Listo para crear</p>
                    <h3>Configura y genera.</h3>
                    <p>El guion aparecerá aquí y se guardará en tu biblioteca automáticamente.</p>
                  </div>
                )}

                {status !== "loading" && latestScript && (
                  <div className="script-preview">
                    <div className="script-preview-head">
                      <p className="script-preview-tone">{latestScript.tone} · {latestScript.length}</p>
                      <h3 className="script-preview-title">{latestScript.title}</h3>
                      <p className="script-preview-logline">{latestScript.logline}</p>
                    </div>
                    <div className="script-preview-body">
                      <div className="cast-row">
                        {latestScript.cast.map((n) => <span key={n} className="cast-tag">{n}</span>)}
                      </div>
                      <div className="scene-list">
                        {latestScript.scenes.map((scene) => (
                          <div key={scene.title} className="scene-item">
                            <h4>{scene.title}</h4>
                            <p>{scene.action}</p>
                            <blockquote>{scene.dialogue}</blockquote>
                          </div>
                        ))}
                      </div>
                      <div className="hook-box">{latestScript.finalHook}</div>
                      <div className="preview-actions">
                        <button className="btn-primary btn-sm"
                          onClick={() => setActiveBook({ script:latestScript, index:0 })}>
                          Ver completo
                        </button>
                        <button className="btn-ghost btn-sm"
                          onClick={() => handleCopy([
                            latestScript.title,"",
                            `Logline: ${latestScript.logline}`,
                            `Tono: ${latestScript.tone}`,
                            `Reparto: ${latestScript.cast.join(", ")}`, "",
                            ...latestScript.scenes.flatMap((s) => [s.title,s.action,s.dialogue,""]),
                            latestScript.finalHook,
                          ].join("\n"))}>
                          Copiar texto
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

          </div>
        </section>

        {/* ── LIBRARY ───────────────────────── */}
        <section className="library-section page-wrap" id="library" aria-labelledby="library-title">
          <div className="section-head reveal from-bottom">
            <p className="eyebrow"><span className="eyebrow-bar" />Tu colección<span className="eyebrow-bar" /></p>
            <h2 className="section-title" id="library-title">Biblioteca de guiones</h2>
            <p className="section-sub">
              Cada guion se guarda como cómic. Haz clic para leerlo o en ✕ para eliminarlo.
            </p>
          </div>

          <div className="library-grid">
            {library.length === 0 ? (
              <div className="library-empty">
                <div className="library-empty-icon">📚</div>
                <h3>Biblioteca vacía</h3>
                <p>Genera tu primer guion en el Studio y aparecerá aquí como una portada de cómic.</p>
              </div>
            ) : (
              library.map((script, i) => (
                <BookCard
                  key={`${script.title}-${i}`}
                  script={script}
                  index={i}
                  onClick={() => setActiveBook({ script, index:i })}
                  onDelete={deleteFromLibrary}
                />
              ))
            )}
          </div>
        </section>

        {/* ── STRATEGY ──────────────────────── */}
        <section className="section page-wrap" id="strategy" aria-labelledby="strategy-title">
          <div className="section-head reveal from-bottom">
            <p className="eyebrow"><span className="eyebrow-bar" />Trabajo final<span className="eyebrow-bar" /></p>
            <h2 className="section-title" id="strategy-title">Estrategia de Marketing</h2>
            <p className="section-sub">Plan digital completo para Marvel Scripts AI.</p>
          </div>

          <div className="strategy-cards" style={{ marginBottom:"clamp(40px,6vw,80px)" }}>
            {[
              { icon:"📥", title:"Inbound Marketing",     items:marketingStrategy.inbound,   dir:"from-left",   delay:"1" },
              { icon:"📢", title:"Outbound Marketing",    items:marketingStrategy.outbound,  dir:"from-bottom", delay:"2" },
              { icon:"🖥️", title:"Plataformas digitales", items:marketingStrategy.platforms, dir:"from-right",  delay:"1" },
              { icon:"🔍", title:"SEO y SEM",             items:marketingStrategy.seoSem,    dir:"from-left",   delay:"2" },
            ].map(({ icon, title, items, dir, delay }) => (
              <div key={title} className={`strategy-card reveal ${dir}`} data-delay={delay}>
                <div className="strategy-card-icon">{icon}</div>
                <h3>{title}</h3>
                <ul>{items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
            ))}
          </div>

          <div style={{ marginBottom:"clamp(36px,5vw,72px)" }}>
            <div className="section-head reveal from-bottom">
              <p className="eyebrow"><span className="eyebrow-bar" />Objetivos SMART</p>
            </div>
            <div className="smart-goals reveal from-bottom" data-delay="1">
              {smartGoals.map((goal,i) => (
                <div key={goal} className="smart-goal">
                  <span className="smart-goal-num">{i+1}</span>
                  {goal}
                </div>
              ))}
            </div>
          </div>

          <div>
            <div className="section-head reveal from-bottom">
              <p className="eyebrow"><span className="eyebrow-bar" />Redes sociales</p>
              <h2 className="section-title">Presencia digital</h2>
            </div>
            <div className="platform-grid">
              {socialPlatforms.map((p, i) => (
                <a key={p.name} href={p.url} target="_blank" rel="noreferrer"
                  className="platform-card reveal from-bottom" data-delay={String(i+1)}>
                  <strong>{p.name}</strong>
                  <span>{p.reason}</span>
                  <em>Ver perfil →</em>
                </a>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ────────────────────────── */}
        <footer className="site-footer" aria-label="Pie de página">
          <div className="footer-inner">
            <div className="footer-brand">
              <img src="/logo.png" alt="Marvel Scripts AI" className="footer-logo" />
              <p>Proyecto académico · No afiliado a Marvel Entertainment.</p>
            </div>
            <nav className="footer-links" aria-label="Links">
              {navLinks.map(({ id, label }) => (
                <a key={id} href={`#${id}`}>{label}</a>
              ))}
              <button onClick={() => window.scrollTo({ top:0, behavior:"smooth" })}>
                Inicio ↑
              </button>
            </nav>
          </div>
        </footer>

      </div>

      {/* ── SCRIPT READER MODAL ─────────────── */}
      {activeBook && (
        <ScriptModal
          script={activeBook.script}
          index={activeBook.index}
          onClose={() => { setActiveBook(null); setCopied(false); }}
          onCopy={handleCopy}
          copied={copied}
        />
      )}
    </>
  );
}
