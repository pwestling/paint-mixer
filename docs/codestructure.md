# Code Structure Guidelines

This repository uses Vite with React and TypeScript. The root of the project contains the Vite configuration and source files.

```
paint-mixer/
├─ src/            # All TypeScript/TSX source code
│  ├─ components/  # Reusable UI components
│  ├─ pages/       # Route level pages
│  ├─ stores/      # zustand stores and context providers
│  ├─ utils/       # Helper functions including colour math
│  └─ index.css    # Tailwind entry
├─ public/         # Static assets copied as-is
├─ index.html      # Application entry
├─ vite.config.ts  # Build configuration
```

- **components** should remain dumb/presentational when possible.
- **pages** contain page level logic and compose components.
- **stores** hold global state using zustand and React Context.
- **utils** hosts general-purpose helpers including Kubelka–Munk calculations.

Additional docs live under `docs/`.
