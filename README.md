# PaintMix Web Application – Requirements Specification

## 1  Purpose & Scope

A **client‑side, installable PWA** that lets miniature painters and paint formulators:

* Store personal paint libraries (spectral data, labels, notes).
* Virtually mix paints to predict **colour**, **opacity/hiding**, and **tint behaviour** using Kubelka‑Munk.
* Find the best match within a chosen palette for a target colour (with or without an opacity constraint).
* Preview a digital swatch over the classic black‑and‑white bar pattern used on Golden® draw‑downs.

*No backend services, all computation & storage in the browser.*

---

## 2  Goals / Non‑Goals

|         | **In‑scope**                                                | **Out‑of‑scope**                          |
| ------- | ----------------------------------------------------------- | ----------------------------------------- |
| *Core*  | KM‑based colour & opacity prediction; personal library CRUD | Physical ordering of paints, cloud sync   |
| *Data*  | Import CSV (Golden SoFlat pre‑loaded), manual entry UI      | Spectral measurement via spectro hardware |
| *Match* | ΔE00 colour matching; optional CR target                    | Physical texture / gloss prediction       |
| *UX*    | Desktop & mobile PWA; light/dark themes                     | Multi‑user collaboration                  |

---

## 3  User Personas

1. **Hobby Painter** – wants quick coverage check & palette matching.
2. **Formulator/Tinkerer** – enters custom spectra, tweaks opacity boosters.
3. **Colour‑Science Enthusiast** – validates KM predictions vs. real swatches.

---

## 4  Functional Requirements

### 4.1 Paint Library

* **Add paint**: name, brand, series, notes, spectral CSV *(380–700 nm @10 nm)*, default wet‑film µm.
* **Edit / delete** paints.
* **Bulk import**: drop CSV with multiple records.
* **Palette builder**: multi‑select paints → save as named palette.

### 4.2 Mix Calculator

* **Input**: list of paint IDs with volume fractions.
* **Output**:

  * Predicted CIE Lab / sRGB.
  * Contrast‑ratio **CR(t)** at user‑chosen thickness or CR∞.
  * Tint table: 0 %, 25 %, 50 %, 75 %, 100 % white.
* **Save mix** with notes/history.

### 4.3 Colour Matching

* **Target picker**: eyedropper on user image or Lab numeric entry.
* Modes:

  1. *Colour‑only*: minimise ΔE00.
  2. *Colour + Opacity*: minimise ΔE00 & |CR\_target – CR\_mix|.
* **Search space**: brute‑force all N‑paint combos up to configurable N (default 3) within selected palette.
* **Results**: top 10 mixes sorted by penalty score.

### 4.4 Swatch Simulator

* Canvas element showing 4 black & 4 white stripes with user‑set film thickness overlay.
* Toggle before/after overlay for comparison.
* Export PNG.

### 4.5 Storage / Settings

* All user data persisted in **IndexedDB** via `idb` wrapper.
* Optional export/import JSON backup.
* Settings: observer illuminant (D65/A), film thickness default, ΔE formula (76/94/00).

---

## 5  Data Model (IndexedDB v1)

```text
Paint {
  id: UUID,
  brand: string,
  name: string,
  series: string?,
  notes: string?,
  spectrum: number[33],   // 380–700 nm
  K: number[33],          // derived, cached
  S: number[33],
  defaultWetMicrons: number
}
Palette { id, name, paintIds[] }
Mix { id, name, components[{paintId, φ}], savedLab, savedCR, timestamp }
Settings { illuminant, filmµm, deltaEFormula }
```

---

## 6  Algorithms

### 6.1 Kubelka‑Munk Pre‑compute per Paint

1. Invert double‑thickness reflectance to **K(λ), S(λ)**.
2. Cache in paint record.

### 6.2 Mix Equations

```math
K_mix(λ)=Σφ_i K_i(λ)
S_mix(λ)=Σφ_i S_i(λ)
CR(t)=\frac{1+K/S}{1+K/S\,e^{2St}}
```

Colour prediction: $R_∞=1/(1+K/S)\Rightarrow XYZ\Rightarrow Lab\Rightarrow sRGB$.

### 6.3 Matching Solver

* Enumerate combinations; compute penalty:
  $score = ΔE00 + w_{cr}|CR_target-CR_mix|$ (w=0 for colour‑only).
* Optimisations: pre‑filter by hue angle, memoise pair mixes.

---

## 7  UI/UX Requirements

* **React** SPA with router: *Library • Calculator • Matcher • Settings*.
* Drag‑and‑drop CSV import.
* Responsive grid; uses Tailwind.
* Colour‑blind‑safe indicator chips.
* Light/dark system theme.

---

## 8  Proposed Tech Stack

| Layer       | Choice                                                          | Rationale                             |
| ----------- | --------------------------------------------------------------- | ------------------------------------- |
| Framework   | **React 18 + TypeScript**                                       | Mature, hooks for state, PWA support. |
| Build       | **Vite**                                                        | Fast HMR, ES modules.                 |
| State       | React Context + `zustand`                                       | Lightweight global store.             |
| Data        | **IndexedDB** via `idb`                                         | Promise‑based, easy backup/export.    |
| Colour math | `colour-science` (transpiled) or `culori`, plus custom KM utils | Accurate spectral→Lab.                |
| UI lib      | Tailwind CSS + shadcn/ui                                        | Dev‑speed, good theming.              |
| Charts      | `recharts` for spectral plot.                                   |                                       |
| Testing     | Vitest + React Testing Library                                  | First‑class TS support.               |
| Deployment  | GitHub Pages / Netlify                                          | Static PWA, no server.                |

---

## 9  Accessibility & i18n

* All interactive controls WCAG 2.1 AA.
* ARIA roles on canvas elements.
* Text scale with `rem`; contrasts ≥ 4.5:1.
* i18n hooks via `react-i18next` (English default).

---

## 10  Performance & Offline

* PWA manifest + Service Worker (workbox) → full offline functionality.
* Heavy brute‑force matching offloaded to Web Workers.
* Spectral arrays float32; mem kept < 10 MB typical.

---

## 11  Future Extensions

1. **Spectro integration** via WebUSB for live scans.
2. Share/export palettes & mixes via QR.
3. Gloss prediction (add grey‑scale specular model).
4. Account‑less cloud sync using browser KV + WebCrypto.

---

### End of Spec
