# Marvel Scripts AI

App web para crear guiones de super heroes seleccionando personajes, tono, duracion, premisa y conflicto.

## Ejecutar

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`.

## Ejecutar con IA real

1. Copia `.env.example` como `.env`.
2. Coloca tu clave de OpenRouter en `OPENROUTER_API_KEY`.
3. Ejecuta todo junto:

```bash
npm run dev:full
```

La app llama a `POST /api/generate-script` desde el backend Node. Si no hay clave o el backend no esta corriendo, el frontend usa el generador local de respaldo para que puedas seguir trabajando.

Modelo por defecto: `openrouter/free`. Si quieres fijar un modelo gratis concreto, cambia `OPENROUTER_MODEL` en `.env`, por ejemplo `qwen/qwen3-coder:free` si aparece disponible en OpenRouter.

## Incluye

- Selector de personajes.
- Configuracion de tono, duracion, premisa y conflicto.
- Generador con IA real via backend opcional.
- Generador local de respaldo con estado de carga, error y resultado.
- Copia del guion al portapapeles.
- Diseno responsive para desktop y movil.

## API

Endpoint principal:

```http
POST /api/generate-script
```

Body:

```json
{
  "selectedCharacters": [
    { "name": "Iron Man", "role": "Estratega sarcastico", "power": "armadura tactica y genio tecnico" },
    { "name": "Spider-Man", "role": "Heroe agil", "power": "sentido aracnido y humor bajo presion" }
  ],
  "premise": "salvar la ciudad sin romper la confianza del equipo",
  "tone": "Epico",
  "length": "Medio",
  "conflict": "una IA rebelde replica las voces de los heroes"
}
```

Prototipo no afiliado a Marvel.
