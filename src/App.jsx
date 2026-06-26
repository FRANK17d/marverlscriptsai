import { useMemo, useState, useEffect, useRef } from "react";

/* ──────────────────────────────────────────────
   DATA
   ────────────────────────────────────────────── */
const characters = [
  { id: "iron-man",      name: "Iron Man",       role: "Estratega sarcastico",    power: "armadura tactica y genio tecnico",              color: "#d6533f" },
  { id: "spider-man",    name: "Spider-Man",      role: "Heroe agil",              power: "sentido aracnido y humor bajo presion",          color: "#3f6fd6" },
  { id: "black-panther", name: "Black Panther",   role: "Rey protector",           power: "vibranium, sigilo y liderazgo",                  color: "#6b5bd6" },
  { id: "captain-marvel",name: "Captain Marvel",  role: "Fuerza cosmica",          power: "energia fotonica y vuelo interestelar",          color: "#d6983f" },
  { id: "doctor-strange",name: "Doctor Strange",  role: "Mago calculador",         power: "portales, hechizos y lectura de futuros",        color: "#3f9fd6" },
  { id: "scarlet-witch", name: "Scarlet Witch",   role: "Alteradora de realidad",  power: "magia del caos y memoria emocional",             color: "#c74763" },
  { id: "thor",          name: "Thor",            role: "Guerrero asgardiano",     power: "trueno, fuerza y presencia mitica",              color: "#6c8fbd" },
  { id: "loki",          name: "Loki",            role: "Tramposo brillante",      power: "ilusiones, manipulacion y planes dobles",        color: "#6b8f45" },
];

const tones     = ["Epico", "Comedia", "Oscuro", "Aventura", "Drama emocional"];
const lengths   = ["Corto", "Medio", "Largo"];
const conflicts = [
  "un artefacto antiguo abre una grieta temporal",
  "una IA rebelde replica las voces de los heroes",
  "una ciudad entera queda atrapada en un bucle de una hora",
  "un villano invisible manipula las decisiones del equipo",
  "una alianza imposible exige confiar en el personaje equivocado",
];

const marketingStrategy = {
  inbound: [
    "Contenido educativo en blog y reels sobre IA, guion y creatividad.",
    "SEO on-page y publicaciones semanales para atraer tráfico orgánico.",
    "Email marketing con lead magnet de prompts y plantillas de guion.",
  ],
  outbound: [
    "Campañas de Google Ads y Meta Ads para captar usuarios y validar demanda.",
    "Colaboraciones con creadores de contenido y comunidades de cine/IA.",
    "Remarketing para recuperar visitantes que no realizaron registro.",
  ],
  platforms: [
    "Página web principal con landing page, demostración y registro.",
    "Aplicación web premium para crear guiones con IA y exportación rápida.",
    "Futuro ecommerce de packs, plantillas y cursos creativos.",
  ],
  seoSem: [
    "Investigación de palabras clave: guion con IA, generador de guiones, prompts para cine, storytelling con IA.",
    "Optimización SEO técnico: títulos, meta descripciones, estructura HTML, velocidad y mobile first.",
    "SEM básico: campañas de marca, captura de leads y remarketing para usuarios interesados en creatividad digital.",
  ],
};

const smartGoals = [
  "Aumentar el tráfico orgánico a 1,500 visitantes mensuales en 90 días.",
  "Captar 100 leads cualificados y 20 usuarios activos en 120 días.",
];

const socialPlatforms = [
  { name: "Instagram", reason: "Ideal para reels, inspiración visual y comunidad creativa.",               url: "https://www.instagram.com/marvelscriptsai/" },
  { name: "TikTok",    reason: "Perfecto para contenido viral, guiones cortos y demos rápidas.",            url: "https://www.tiktok.com/@marvelscriptsai" },
  { name: "YouTube",   reason: "Permite enseñar procesos, tutoriales y showcases del producto.",            url: "https://www.youtube.com/@marvelscriptsai" },
  { name: "LinkedIn",  reason: "Útil para networking, partners y posicionamiento B2B del proyecto.",        url: "https://www.linkedin.com/company/marvelscriptsai/" },
];

const sceneCounts = { Corto: 2, Medio: 3, Largo: 5 };
const aiApiEnabled = import.meta.env.VITE_AI_API_ENABLED === "true";

/* ──────────────────────────────────────────────
   SCRIPT BUILDER
   ────────────────────────────────────────────── */
function buildScript({ selectedCharacters, premise, tone, length, conflict }) {
  const cast     = selectedCharacters.map((c) => c.name);
  const lead     = selectedCharacters[0];
  const foil     = selectedCharacters[1];
  const wildCard = selectedCharacters[selectedCharacters.length - 1];
  const sceneCount       = sceneCounts[length];
  const selectedConflict = conflict || conflicts[0];

  const locations = [
    "azotea de una ciudad cubierta por lluvia metalica",
    "laboratorio subterraneo con pantallas fallando",
    "puente suspendido sobre una grieta de energia",
    "sala de mando improvisada dentro de una nave danada",
    "calle vacia donde los anuncios repiten el mismo mensaje",
  ];

  const beats = [
    `${lead.name} detecta que ${selectedConflict}. Su ${lead.power} sirve para contener el primer golpe, pero no para explicar quien lo provoco.`,
    `${foil.name} descubre una pista que contradice el plan inicial. El equipo duda, porque la respuesta exige sacrificar tiempo y ventaja.`,
    `${wildCard.name} toma una decision inesperada y obliga al grupo a cambiar de tactica. La tension revela quien esta actuando por orgullo y quien por miedo.`,
    `La amenaza separa al equipo. Cada personaje debe usar su mejor habilidad sin perder de vista la premisa: ${premise}.`,
    `El conflicto se resuelve cuando ${lead.name} deja de intentar ganar solo y convierte el defecto del equipo en su senal mas fuerte.`,
  ];

  const dialogue = [
    `${lead.name}: "No necesitamos un milagro. Necesitamos tres segundos y que nadie improvise peor que yo."`,
    `${foil.name}: "Si esto sale mal, al menos que sea por una razon que podamos defender."`,
    `${wildCard.name}: "La verdad siempre aparece tarde. Por eso conviene dejarle una puerta abierta."`,
  ];

  const scenes = Array.from({ length: sceneCount }, (_, i) => ({
    title:    `Escena ${i + 1}: ${locations[i]}`,
    action:   beats[i],
    dialogue: dialogue[i % dialogue.length],
  }));

  return {
    title:     `${tone}: ${lead.name} y la fractura final`,
    logline:   `Cuando ${selectedConflict}, ${cast.join(", ")} deben resolver ${premise.toLowerCase()} antes de que la amenaza convierta su mayor poder en una trampa.`,
    cast, tone, length, scenes,
    finalHook: `Gancho final: una ultima senal demuestra que el enemigo no fue derrotado; solo estaba probando que combinacion de heroes podia detenerlo.`,
  };
}

function normalizeRemoteScript(remoteScript, fallbackScript) {
  const scenes = Array.isArray(remoteScript?.scenes)
    ? remoteScript.scenes
        .map((s, i) => ({
          title:    String(s?.title    || `Escena ${i + 1}`),
          action:   String(s?.action   || ""),
          dialogue: String(s?.dialogue || ""),
        }))
        .filter((s) => s.action && s.dialogue)
    : [];
  return {
    title:     String(remoteScript?.title     || fallbackScript.title),
    logline:   String(remoteScript?.logline   || fallbackScript.logline),
    cast:      Array.isArray(remoteScript?.cast) && remoteScript.cast.length ? remoteScript.cast.map(String) : fallbackScript.cast,
    tone:      String(remoteScript?.tone      || fallbackScript.tone),
    length:    String(remoteScript?.length    || fallbackScript.length),
    scenes:    scenes.length ? scenes : fallbackScript.scenes,
    finalHook: String(remoteScript?.finalHook || fallbackScript.finalHook),
  };
}

/* ──────────────────────────────────────────────
   PARTICLES
   ────────────────────────────────────────────── */
const PARTICLE_DATA = Array.from({ length: 26 }, (_, i) => ({
  id:      i,
  left:    `${(Math.random() * 98).toFixed(1)}%`,
  dur:     `${(10 + Math.random() * 16).toFixed(1)}s`,
  delay:   `${(Math.random() * 14).toFixed(1)}s`,
  opacity: (0.18 + Math.random() * 0.42).toFixed(2),
  size:    `${(1 + Math.random() * 2.2).toFixed(1)}px`,
}));

function Particles() {
  return (
    <div className="particles-container" aria-hidden="true">
      {PARTICLE_DATA.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left:             p.left,
            bottom:           "0",
            width:            p.size,
            height:           p.size,
            "--duration":     p.dur,
            "--delay":        p.delay,
            "--max-opacity":  p.opacity,
          }}
        />
      ))}
    </div>
  );
}

/* ──────────────────────────────────────────────
   ICONS
   ────────────────────────────────────────────── */
function IconSun() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41" />
    </svg>
  );
}

function IconMoon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
         strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

/* ──────────────────────────────────────────────
   APP COMPONENT
   ────────────────────────────────────────────── */
export default function App() {
  /* ── Theme ── */
  const [darkMode, setDarkMode] = useState(true);

  /* ── Navbar ── */
  const [scrolled,        setScrolled]        = useState(false);
  const [scrollProgress,  setScrollProgress]  = useState(0);

  /* ── Mouse parallax ── */
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  /* ── Custom cursor ── */
  const [cursorPos,   setCursorPos]   = useState({ x: -200, y: -200 });
  const [ringPos,     setRingPos]     = useState({ x: -200, y: -200 });
  const [isHovering,  setIsHovering]  = useState(false);
  const ringRef       = useRef({ x: -200, y: -200 });
  const targetRef     = useRef({ x: -200, y: -200 });
  const rafRef        = useRef(null);

  /* ── Script state ── */
  const [selectedIds,       setSelectedIds]       = useState(["iron-man", "spider-man"]);
  const [premise,           setPremise]           = useState("salvar la ciudad sin romper la confianza del equipo");
  const [tone,              setTone]              = useState("Epico");
  const [length,            setLength]            = useState("Medio");
  const [conflict,          setConflict]          = useState(conflicts[1]);
  const [script,            setScript]            = useState(null);
  const [status,            setStatus]            = useState("idle");
  const [error,             setError]             = useState("");
  const [copied,            setCopied]            = useState(false);
  const [generationSource,  setGenerationSource]  = useState("demo");
  const [notice,            setNotice]            = useState("");

  const selectedCharacters = useMemo(
    () => characters.filter((c) => selectedIds.includes(c.id)),
    [selectedIds],
  );

  /* ── Dark mode ── */
  useEffect(() => {
    document.documentElement.classList.toggle("light", !darkMode);
  }, [darkMode]);

  /* ── Scroll: navbar + progress ── */
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
      const total = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(total > 0 ? window.scrollY / total : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  /* ── Mouse parallax ── */
  useEffect(() => {
    const onMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth  - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      });
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ── Custom cursor ring (lerp animation) ── */
  useEffect(() => {
    const onMove = (e) => setCursorPos({ x: e.clientX, y: e.clientY });
    window.addEventListener("mousemove", onMove);

    const lerp   = (a, b, t) => a + (b - a) * t;
    const animate = () => {
      const t  = targetRef.current;
      const r  = ringRef.current;
      ringRef.current = { x: lerp(r.x, t.x, 0.11), y: lerp(r.y, t.y, 0.11) };
      setRingPos({ ...ringRef.current });
      rafRef.current = requestAnimationFrame(animate);
    };
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  /* ── Hover detection for cursor enlargement ── */
  useEffect(() => {
    const on  = () => setIsHovering(true);
    const off = () => setIsHovering(false);
    const els = document.querySelectorAll("a, button, input, select, textarea");
    els.forEach((el) => { el.addEventListener("mouseenter", on); el.addEventListener("mouseleave", off); });
    return () => els.forEach((el) => { el.removeEventListener("mouseenter", on); el.removeEventListener("mouseleave", off); });
  });

  /* ── IntersectionObserver: scroll reveal ── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) e.target.classList.add("is-visible"); }),
      { threshold: 0.08, rootMargin: "0px 0px -40px 0px" },
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  });

  /* ── Script helpers ── */
  const scriptText = useMemo(() => {
    if (!script) return "";
    return [
      script.title, "",
      `Logline: ${script.logline}`,
      `Tono: ${script.tone}`,
      `Duracion: ${script.length}`,
      `Reparto: ${script.cast.join(", ")}`, "",
      ...script.scenes.flatMap((s) => [s.title, s.action, s.dialogue, ""]),
      script.finalHook,
    ].join("\n");
  }, [script]);

  function toggleCharacter(id) {
    setSelectedIds((ids) => ids.includes(id) ? ids.filter((i) => i !== id) : [...ids, id]);
  }

  async function generateScript() {
    setCopied(false);
    setNotice("");

    if (selectedCharacters.length < 2) {
      setError("Selecciona al menos dos personajes para crear conflicto y dialogo.");
      setStatus("error");
      return;
    }
    if (!premise.trim()) {
      setError("Escribe una premisa para que la IA sepa que historia construir.");
      setStatus("error");
      return;
    }

    setError("");
    setStatus("loading");

    const payload      = { selectedCharacters, premise: premise.trim(), tone, length, conflict };
    const fallback     = buildScript(payload);

    if (!aiApiEnabled) {
      window.setTimeout(() => {
        setScript(fallback);
        setGenerationSource("demo");
        setNotice("Generado con el motor local de demo. Usa npm run dev:full para IA real.");
        setStatus("ready");
      }, 450);
      return;
    }

    try {
      const res = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("AI API unavailable");
      const result = await res.json();
      setScript(normalizeRemoteScript(result.data, fallback));
      setGenerationSource("api");
      setNotice("Generado con IA real desde el backend.");
      setStatus("ready");
    } catch {
      window.setTimeout(() => {
        setScript(fallback);
        setGenerationSource("demo");
        setNotice("API de IA no conectada: se uso el generador local de respaldo.");
        setStatus("ready");
      }, 450);
    }
  }

  async function copyScript() {
    if (!scriptText) return;
    await navigator.clipboard.writeText(scriptText);
    setCopied(true);
  }

  function resetWorkspace() {
    setSelectedIds(["iron-man", "spider-man"]);
    setPremise("salvar la ciudad sin romper la confianza del equipo");
    setTone("Epico");
    setLength("Medio");
    setConflict(conflicts[1]);
    setScript(null);
    setStatus("idle");
    setError("");
    setCopied(false);
    setGenerationSource("demo");
    setNotice("");
  }

  /* ── Parallax derived values ── */
  const heroImgStyle     = { transform: `scale(1.08) translate(${mousePos.x * -9}px, ${mousePos.y * -7}px)` };
  const signalPanelStyle = { transform: `translate(${mousePos.x * 7}px, ${mousePos.y * 5}px)` };

  /* ════════════════════════════════════════════
     RENDER
     ════════════════════════════════════════════ */
  return (
    <>
      {/* ── Custom cursor ───────────────────── */}
      <div
        className="cursor cursor-dot"
        style={{ left: cursorPos.x, top: cursorPos.y }}
        aria-hidden="true"
      />
      <div
        className={`cursor cursor-ring${isHovering ? " is-hovering" : ""}`}
        style={{ left: ringPos.x, top: ringPos.y }}
        aria-hidden="true"
      />

      {/* ── Scroll progress bar ─────────────── */}
      <div
        className="scroll-progress"
        style={{ transform: `scaleX(${scrollProgress})` }}
        aria-hidden="true"
      />

      {/* ── Sticky Glassmorphism Navbar ─────── */}
      <header className={`navbar${scrolled ? " scrolled" : ""}`} role="banner">
        <div className="navbar-inner">

          <a className="navbar-logo" href="#hero" aria-label="Marvel Scripts AI — inicio">
            <div className="navbar-logo-mark" aria-hidden="true">M</div>
            <span className="navbar-logo-text">Marvel Scripts AI</span>
          </a>

          <nav aria-label="Navegación principal">
            <ul className="navbar-links">
              <li><a href="#hero"     className="active">Inicio</a></li>
              <li><a href="#strategy"            >Estrategia</a></li>
              <li><a href="#editor"              >Editor</a></li>
              <li><a href="#social"              >Redes</a></li>
            </ul>
          </nav>

          <div className="navbar-actions">
            <button
              className="theme-toggle"
              onClick={() => setDarkMode((d) => !d)}
              aria-label={darkMode ? "Activar modo claro" : "Activar modo oscuro"}
              title={darkMode ? "Modo claro" : "Modo oscuro"}
            >
              {darkMode ? <IconSun /> : <IconMoon />}
            </button>
            <button
              className="primary-button"
              style={{ padding: "10px 20px", fontSize: "0.87rem" }}
              onClick={generateScript}
              type="button"
            >
              Generar guion
            </button>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════
          APP SHELL
          ════════════════════════════════════════ */}
      <div className="app-shell">
        {/* Ambient orbs */}
        <div className="ambient ambient-one"   aria-hidden="true" />
        <div className="ambient ambient-two"   aria-hidden="true" />
        <div className="ambient ambient-three" aria-hidden="true" />

        {/* Particles */}
        <Particles />

        {/* ────────────────────────────────────
            HERO SECTION
            ──────────────────────────────────── */}
        <section className="hero-section" id="hero" aria-labelledby="page-title">

          {/* Background image with mouse parallax */}
          <div className="hero-bg" aria-hidden="true">
            <img
              className="hero-bg-image"
              src="/hero.jpg"
              alt=""
              style={heroImgStyle}
              loading="eager"
              fetchpriority="high"
              decoding="async"
            />
            <div className="hero-bg-overlay" />
          </div>

          <div className="hero-content">

            {/* ── Left: copy ── */}
            <div className="hero-copy">
              <p className="hero-eyebrow">
                <span className="hero-eyebrow-dot" aria-hidden="true" />
                Fan script studio con motor IA
              </p>

              <h1 className="hero-title" id="page-title">
                Marvel<br />
                <span>Scripts AI</span>
              </h1>

              <p className="hero-subtitle">
                Crea una escena, elige heroes, define el tono y genera un guion
                listo para pulir, grabar o convertir en storyboard.
              </p>

              <div className="hero-actions">
                <button className="primary-button" type="button" onClick={generateScript}>
                  Generar guion
                </button>
                <button className="ghost-button" type="button" onClick={resetWorkspace}>
                  Reiniciar mesa
                </button>
              </div>

              <p className="hero-legal">
                Prototipo no afiliado a Marvel. Usa personajes y conceptos bajo tu responsabilidad creativa.
              </p>
            </div>

            {/* ── Right: signal panel with mouse parallax ── */}
            <div
              className="signal-panel"
              aria-label="Estado del generador"
              style={signalPanelStyle}
            >
              <div className="signal-header">
                <span className="status-dot" aria-hidden="true" />
                <span>{generationSource === "api" ? "IA real conectada" : "Demo local lista"}</span>
              </div>

              <div className="signal-grid">
                <div>
                  <strong>{selectedCharacters.length}</strong>
                  <span>personajes</span>
                </div>
                <div>
                  <strong>{length}</strong>
                  <span>duracion</span>
                </div>
                <div>
                  <strong>{tone}</strong>
                  <span>tono</span>
                </div>
              </div>

              <div className="type-line">
                <span>prompt:</span>{" "}
                {premise || "esperando premisa"}
              </div>
            </div>

          </div>
        </section>

        {/* ────────────────────────────────────
            MARKETING SECTION
            ──────────────────────────────────── */}
        <section
          className="marketing-section page-content"
          id="strategy"
          aria-labelledby="marketing-title"
        >
          <div className="section-header reveal from-bottom">
            <p className="eyebrow">
              <span className="eyebrow-line" aria-hidden="true" />
              Avance trabajo final
              <span className="eyebrow-line" aria-hidden="true" />
            </p>
            <h2 id="marketing-title">Estrategia de Marketing Digital</h2>
          </div>

          <div className="marketing-grid">

            {/* Card 1 */}
            <article className="marketing-card reveal from-bottom" data-delay="1">
              <h3>Estrategias digitales</h3>
              <div className="strategy-grid">
                <div>
                  <h4>Inbound</h4>
                  <ul>
                    {marketingStrategy.inbound.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4>Outbound</h4>
                  <ul>
                    {marketingStrategy.outbound.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </article>

            {/* Card 2 — slide in from left */}
            <article className="marketing-card reveal from-left" data-delay="2">
              <h3>Plataformas digitales</h3>
              <ul>
                {marketingStrategy.platforms.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            {/* Card 3 — slide in from right */}
            <article className="marketing-card reveal from-right" data-delay="2">
              <h3>SEO y SEM</h3>
              <ul>
                {marketingStrategy.seoSem.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>

            {/* Card 4 — social + platform cards */}
            <article className="marketing-card reveal from-bottom" data-delay="3" id="social">
              <h3>Redes Sociales</h3>
              <p className="marketing-note">Objetivos SMART para la marca:</p>
              <ul>
                {smartGoals.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>

              <div className="platform-grid">
                {socialPlatforms.map((platform, index) => (
                  <a
                    key={platform.name}
                    className="platform-card reveal from-bottom"
                    data-delay={String(index + 1)}
                    href={platform.url}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <strong>{platform.name}</strong>
                    <span>{platform.reason}</span>
                    <em>Ver perfil / evidencia →</em>
                  </a>
                ))}
              </div>
            </article>

          </div>
        </section>

        {/* ────────────────────────────────────
            WORKSPACE / EDITOR
            ──────────────────────────────────── */}
        <section
          className="workspace page-content"
          id="editor"
          aria-label="Editor de guiones"
        >

          {/* Control panel */}
          <form className="control-panel reveal from-left" onSubmit={(e) => e.preventDefault()}>

            <div className="panel-heading">
              <p className="eyebrow">Mesa creativa</p>
              <h2>Configura el episodio</h2>
            </div>

            <div className="field-group">
              <label htmlFor="premise">Premisa del guion</label>
              <textarea
                id="premise"
                rows="4"
                value={premise}
                onChange={(e) => setPremise(e.target.value)}
                placeholder="Ej: una traicion obliga al equipo a dividirse"
              />
              <p className="helper-text">Define el centro emocional de la escena.</p>
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
              <label htmlFor="conflict">Conflicto principal</label>
              <select id="conflict" value={conflict} onChange={(e) => setConflict(e.target.value)}>
                {conflicts.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            <div className="character-section">
              <div>
                <h3>Personajes</h3>
                <p>Elige minimo dos para que la escena tenga tension real.</p>
              </div>
              <div className="character-grid">
                {characters.map((character, index) => {
                  const isSelected = selectedIds.includes(character.id);
                  return (
                    <button
                      key={character.id}
                      className={`character-card${isSelected ? " is-selected" : ""}`}
                      style={{ "--accent": character.color, "--index": index }}
                      type="button"
                      onClick={() => toggleCharacter(character.id)}
                      aria-pressed={isSelected}
                    >
                      <span className="character-mark" aria-hidden="true" />
                      <strong>{character.name}</strong>
                      <small>{character.role}</small>
                    </button>
                  );
                })}
              </div>
            </div>

            {status === "error" && (
              <p className="error-message" role="alert">{error}</p>
            )}

            <button className="generate-button" type="button" onClick={generateScript}>
              Crear guion con IA
            </button>
          </form>

          {/* Output panel */}
          <section
            className="output-panel reveal from-right"
            aria-live="polite"
            aria-label="Guion generado"
          >
            <div className="output-toolbar">
              <div>
                <p className="eyebrow">Resultado</p>
                <h2>Guion generado</h2>
              </div>
              <button
                className="ghost-button compact"
                type="button"
                onClick={copyScript}
                disabled={!script}
              >
                {copied ? "Copiado ✓" : "Copiar"}
              </button>
            </div>

            {notice && <p className="notice-message">{notice}</p>}

            {status === "loading" && (
              <div className="loading-state" aria-label="Generando guion">
                <span />
                <span />
                <span />
                <p>La IA esta ordenando conflicto, dialogo y cierre.</p>
              </div>
            )}

            {status !== "loading" && !script && (
              <div className="empty-state">
                <p className="empty-kicker">Sin guion todavia</p>
                <h3>Selecciona personajes y pulsa generar.</h3>
                <p>
                  El resultado aparecera aqui con logline, escenas, acciones,
                  dialogos y gancho final.
                </p>
              </div>
            )}

            {status !== "loading" && script && (
              <article className="script-card">
                <header>
                  <p>{script.tone} / {script.length}</p>
                  <h3>{script.title}</h3>
                  <p>{script.logline}</p>
                </header>

                <div className="cast-list">
                  {script.cast.map((name) => <span key={name}>{name}</span>)}
                </div>

                <div className="scene-list">
                  {script.scenes.map((scene) => (
                    <section className="scene" key={scene.title}>
                      <h4>{scene.title}</h4>
                      <p>{scene.action}</p>
                      <blockquote>{scene.dialogue}</blockquote>
                    </section>
                  ))}
                </div>

                <p className="final-hook">{script.finalHook}</p>
              </article>
            )}
          </section>

        </section>

        {/* ── Footer ── */}
        <footer className="site-footer page-content" aria-label="Pie de página">
          <p>Marvel Scripts AI — Proyecto académico no afiliado a Marvel Entertainment.</p>
          <button
            className="ghost-button compact"
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          >
            Volver al inicio ↑
          </button>
        </footer>

      </div>
    </>
  );
}
