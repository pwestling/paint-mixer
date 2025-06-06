# UI Plan & Task Flows

### 12.1 Screen Map

```
┌── AppShell ────────────────────────────────────────┐
│  NavBar: Library • Mix • Match • Settings          │
├────────────────────────────────────────────────────┤
│  <Outlet/> (React‑Router routes)                   │
└────────────────────────────────────────────────────┘
     │
     ├─ /library   →  **Paint Library Screen**
     ├─ /mix       →  **Mix Calculator Screen**
     ├─ /match     →  **Colour Matcher Screen**
     └─ /settings  →  **Settings & Backup Screen**
```

### 12.2 Primary User Tasks

| # | Task                                 | Entry Point                                          | Flow Summary                                                                                        | Exit State                                                           |
| - | ------------------------------------ | ---------------------------------------------------- | --------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------- |
| 1 | **Add new paint**                    | Library ▶ “+ Paint” FAB                              | (1) Modal form → (2) Paste spectral CSV or upload file → (3) Live spectral preview chart → (4) Save | Paint stored in IndexedDB; Library list refreshes.                   |
| 2 | **Create palette**                   | Library ▶ checkbox select paints ▶ “Save as Palette” | Name palette → palette chip appears in header filter.                                               | Palette record created.                                              |
| 3 | **Compute mix**                      | Mix ▶ “Add component”                                | Autocomplete paint → type % → repeat → “Calculate”                                                  | Result card shows Lab, CR plot, tint strip; mix can be saved.        |
| 4 | **Match target colour (no opacity)** | Match ▶ target picker                                | (1) Upload/eyedropper RGB or enter Lab → (2) Select palette → (3) Press “Find”                      | Ranked list of mixes with ΔE; tap row to open Mix screen pre‑filled. |
| 5 | **Match colour + opacity**           | Match ▶ advanced tab                                 | Same as #4 but CR target slider visible; solver weights ΔE + CR diff                                | Ranked list with two metrics.                                        |
| 6 | **Visual swatch compare**            | Mix result ▶ “Show Swatch”                           | Full‑screen canvas: black‑white bars with overlay; thickness slider updates in real‑time            | User closes modal; no DB change.                                     |
| 7 | **Export backup**                    | Settings ▶ Backup                                    | “Export JSON” button → triggers file download                                                       | User has local .json.                                                |
| 8 | **Import backup**                    | Settings ▶ Backup                                    | “Import JSON” → file picker → confirmation dialog                                                   | IndexedDB wiped/re‑populated.                                        |

### 12.3 Wire‑level Interactions

**Drag‑and‑Drop CSV**

* Dropzone visible on Library screen. Validates column count → highlights errors inline.

**Spectral Plot**

* `recharts` area‑chart shows reflectance curve; hovering a wavelength shows numeric R.

**Mix Editor Table**

```
| Paint          | φ (%)  | Delete |
|----------------|--------|--------|
| Hansa Yellow   |  35    |  ×     |
| Bismuth Yellow |  65    |  ×     |
```

* % cells are number inputs constrained 0‑100; table footer enforces Σφ = 100.

**Solver Progress Bar**

* WebWorker posts progress; UI shows mix counter and ETA.

### 12.4 Error & Edge Cases

* Σφ ≠ 100 → “Fix percentages” toast; Calculate disabled.
* Uploaded spectrum length ≠ 33 → red form validation label.
* Unsupported browser (no IndexedDB) → splash screen explaining limitation.

### 12.5 Mobile UX Notes

* NavBar collapses to bottom tab bar.
* Swatch simulator uses pinch‑zoom canvas; sliders become vertical for thumb reach.
* File import prefers clipboard paste for spectra on iOS.

### 12.6 Accessibility Flows

* Every modal traps focus; Escape closes.
* Keyboard shortcuts: `N` new paint, `M` new mix, `F` find colour.
* Live‑region updates announce calculation completion and solver results.

---

### End of Spec
