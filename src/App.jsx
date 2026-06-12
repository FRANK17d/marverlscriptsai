import { useMemo, useState } from "react";

const characters = [
  {
    id: "iron-man",
    name: "Iron Man",
    role: "Estratega sarcastico",
    power: "armadura tactica y genio tecnico",
    color: "#d6533f",
  },
  {
    id: "spider-man",
    name: "Spider-Man",
    role: "Heroe agil",
    power: "sentido aracnido y humor bajo presion",
    color: "#3f6fd6",
  },
  {
    id: "black-panther",
    name: "Black Panther",
    role: "Rey protector",
    power: "vibranium, sigilo y liderazgo",
    color: "#6b5bd6",
  },
  {
    id: "captain-marvel",
    name: "Captain Marvel",
    role: "Fuerza cosmica",
    power: "energia fotonica y vuelo interestelar",
    color: "#d6983f",
  },
  {
    id: "doctor-strange",
    name: "Doctor Strange",
    role: "Mago calculador",
    power: "portales, hechizos y lectura de futuros",
    color: "#3f9fd6",
  },
  {
    id: "scarlet-witch",
    name: "Scarlet Witch",
    role: "Alteradora de realidad",
    power: "magia del caos y memoria emocional",
    color: "#c74763",
  },
  {
    id: "thor",
    name: "Thor",
    role: "Guerrero asgardiano",
    power: "trueno, fuerza y presencia mitica",
    color: "#6c8fbd",
  },
  {
    id: "loki",
    name: "Loki",
    role: "Tramposo brillante",
    power: "ilusiones, manipulacion y planes dobles",
    color: "#6b8f45",
  },
];

const tones = ["Epico", "Comedia", "Oscuro", "Aventura", "Drama emocional"];
const lengths = ["Corto", "Medio", "Largo"];

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
  {
    name: "Instagram",
    reason: "Ideal para reels, inspiración visual y comunidad creativa.",
    url: "https://www.instagram.com/marvelscriptsai/",
  },
  {
    name: "TikTok",
    reason: "Perfecto para contenido viral, guiones cortos y demos rápidas.",
    url: "https://www.tiktok.com/@marvelscriptsai",
  },
  {
    name: "YouTube",
    reason: "Permite enseñar procesos, tutoriales y showcases del producto.",
    url: "https://www.youtube.com/@marvelscriptsai",
  },
  {
    name: "LinkedIn",
    reason: "Útil para networking, partners y posicionamiento B2B del proyecto.",
    url: "https://www.linkedin.com/company/marvelscriptsai/",
  },
];

const sceneCounts = {
  Corto: 2,
  Medio: 3,
  Largo: 5,
};

const aiApiEnabled = import.meta.env.VITE_AI_API_ENABLED === "true";

function buildScript({ selectedCharacters, premise, tone, length, conflict }) {
  const cast = selectedCharacters.map((character) => character.name);
  const lead = selectedCharacters[0];
  const foil = selectedCharacters[1];
  const wildCard = selectedCharacters[selectedCharacters.length - 1];
  const sceneCount = sceneCounts[length];
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

  const scenes = Array.from({ length: sceneCount }, (_, index) => ({
    title: `Escena ${index + 1}: ${locations[index]}`,
    action: beats[index],
    dialogue: dialogue[index % dialogue.length],
  }));

  return {
    title: `${tone}: ${lead.name} y la fractura final`,
    logline: `Cuando ${selectedConflict}, ${cast.join(", ")} deben resolver ${premise.toLowerCase()} antes de que la amenaza convierta su mayor poder en una trampa.`,
    cast,
    tone,
    length,
    scenes,
    finalHook: `Gancho final: una ultima senal demuestra que el enemigo no fue derrotado; solo estaba probando que combinacion de heroes podia detenerlo.`,
  };
}

function normalizeRemoteScript(remoteScript, fallbackScript) {
  const scenes = Array.isArray(remoteScript?.scenes)
    ? remoteScript.scenes
        .map((scene, index) => ({
          title: String(scene?.title || `Escena ${index + 1}`),
          action: String(scene?.action || ""),
          dialogue: String(scene?.dialogue || ""),
        }))
        .filter((scene) => scene.action && scene.dialogue)
    : [];

  return {
    title: String(remoteScript?.title || fallbackScript.title),
    logline: String(remoteScript?.logline || fallbackScript.logline),
    cast:
      Array.isArray(remoteScript?.cast) && remoteScript.cast.length
        ? remoteScript.cast.map(String)
        : fallbackScript.cast,
    tone: String(remoteScript?.tone || fallbackScript.tone),
    length: String(remoteScript?.length || fallbackScript.length),
    scenes: scenes.length ? scenes : fallbackScript.scenes,
    finalHook: String(remoteScript?.finalHook || fallbackScript.finalHook),
  };
}

function App() {
  const [selectedIds, setSelectedIds] = useState(["iron-man", "spider-man"]);
  const [premise, setPremise] = useState(
    "salvar la ciudad sin romper la confianza del equipo",
  );
  const [tone, setTone] = useState("Epico");
  const [length, setLength] = useState("Medio");
  const [conflict, setConflict] = useState(conflicts[1]);
  const [script, setScript] = useState(null);
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);
  const [generationSource, setGenerationSource] = useState("demo");
  const [notice, setNotice] = useState("");

  const selectedCharacters = useMemo(
    () => characters.filter((character) => selectedIds.includes(character.id)),
    [selectedIds],
  );

  const scriptText = useMemo(() => {
    if (!script) return "";

    return [
      script.title,
      "",
      `Logline: ${script.logline}`,
      `Tono: ${script.tone}`,
      `Duracion: ${script.length}`,
      `Reparto: ${script.cast.join(", ")}`,
      "",
      ...script.scenes.flatMap((scene) => [
        scene.title,
        scene.action,
        scene.dialogue,
        "",
      ]),
      script.finalHook,
    ].join("\n");
  }, [script]);

  function toggleCharacter(characterId) {
    setSelectedIds((currentIds) => {
      if (currentIds.includes(characterId)) {
        return currentIds.filter((id) => id !== characterId);
      }

      return [...currentIds, characterId];
    });
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

    const payload = {
      selectedCharacters,
      premise: premise.trim(),
      tone,
      length,
      conflict,
    };

    const fallbackScript = buildScript(payload);

    if (!aiApiEnabled) {
      window.setTimeout(() => {
        setScript(fallbackScript);
        setGenerationSource("demo");
        setNotice("Generado con el motor local de demo. Usa npm run dev:full para IA real.");
        setStatus("ready");
      }, 450);
      return;
    }

    try {
      const response = await fetch("/api/generate-script", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("AI API unavailable");
      }

      const result = await response.json();
      setScript(normalizeRemoteScript(result.data, fallbackScript));
      setGenerationSource("api");
      setNotice("Generado con IA real desde el backend.");
      setStatus("ready");
    } catch {
      window.setTimeout(() => {
        setScript(fallbackScript);
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

  return (
    <main className="app-shell">
      <div className="ambient ambient-one" />
      <div className="ambient ambient-two" />

      <section className="hero-section" aria-labelledby="page-title">
        <div className="hero-copy">
          <p className="eyebrow">Fan script studio con motor IA</p>
          <h1 id="page-title">Marvel Scripts AI</h1>
          <p className="hero-text">
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
          <p className="legal-note">
            Prototipo no afiliado a Marvel. Usa personajes y conceptos bajo tu
            responsabilidad creativa.
          </p>
        </div>

        <div className="signal-panel" aria-label="Estado del generador">
          <div className="signal-header">
            <span className="status-dot" />
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
            <span>prompt:</span> {premise || "esperando premisa"}
          </div>
        </div>
      </section>

      <section className="marketing-section" aria-labelledby="marketing-title">
        <div className="panel-heading">
          <p className="eyebrow">Avance trabajo final</p>
          <h2 id="marketing-title">Estrategia de Marketing Digital (Parte 1)</h2>
        </div>

        <article className="marketing-card">
          <h3>1. Estrategias digitales</h3>
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

        <article className="marketing-card">
          <h3>2. Plataformas digitales a utilizar</h3>
          <ul>
            {marketingStrategy.platforms.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="marketing-card">
          <h3>3. SEO y SEM</h3>
          <ul>
            {marketingStrategy.seoSem.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </article>

        <article className="marketing-card">
          <h3>4. Redes Sociales</h3>
          <p className="marketing-note">Objetivos SMART para la marca:</p>
          <ul>
            {smartGoals.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <div className="platform-grid">
            {socialPlatforms.map((platform) => (
              <a
                className="platform-card"
                key={platform.name}
                href={platform.url}
                target="_blank"
                rel="noreferrer"
              >
                <strong>{platform.name}</strong>
                <span>{platform.reason}</span>
                <em>Ver perfil / evidencia</em>
              </a>
            ))}
          </div>
        </article>
      </section>

      <section className="workspace" aria-label="Editor de guiones">
        <form className="control-panel" onSubmit={(event) => event.preventDefault()}>
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
              onChange={(event) => setPremise(event.target.value)}
              placeholder="Ej: una traicion obliga al equipo a dividirse"
            />
            <p className="helper-text">Define el centro emocional de la escena.</p>
          </div>

          <div className="split-fields">
            <div className="field-group">
              <label htmlFor="tone">Tono</label>
              <select id="tone" value={tone} onChange={(event) => setTone(event.target.value)}>
                {tones.map((toneOption) => (
                  <option key={toneOption} value={toneOption}>
                    {toneOption}
                  </option>
                ))}
              </select>
            </div>

            <div className="field-group">
              <label htmlFor="length">Duracion</label>
              <select
                id="length"
                value={length}
                onChange={(event) => setLength(event.target.value)}
              >
                {lengths.map((lengthOption) => (
                  <option key={lengthOption} value={lengthOption}>
                    {lengthOption}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="field-group">
            <label htmlFor="conflict">Conflicto principal</label>
            <select
              id="conflict"
              value={conflict}
              onChange={(event) => setConflict(event.target.value)}
            >
              {conflicts.map((conflictOption) => (
                <option key={conflictOption} value={conflictOption}>
                  {conflictOption}
                </option>
              ))}
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
                    className={`character-card ${isSelected ? "is-selected" : ""}`}
                    key={character.id}
                    style={{ "--accent": character.color, "--index": index }}
                    type="button"
                    onClick={() => toggleCharacter(character.id)}
                    aria-pressed={isSelected}
                  >
                    <span className="character-mark" />
                    <strong>{character.name}</strong>
                    <small>{character.role}</small>
                  </button>
                );
              })}
            </div>
          </div>

          {status === "error" && <p className="error-message">{error}</p>}

          <button className="generate-button" type="button" onClick={generateScript}>
            Crear guion con IA
          </button>
        </form>

        <section className="output-panel" aria-live="polite" aria-label="Guion generado">
          <div className="output-toolbar">
            <div>
              <p className="eyebrow">Resultado</p>
              <h2>Guion generado</h2>
            </div>
            <button className="ghost-button compact" type="button" onClick={copyScript} disabled={!script}>
              {copied ? "Copiado" : "Copiar"}
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
                {script.cast.map((name) => (
                  <span key={name}>{name}</span>
                ))}
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
    </main>
  );
}

export default App;
