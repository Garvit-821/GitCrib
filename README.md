# GitCrib & StatPrint Engine

> High-performance, modular developer career blueprint and infographic engine generated dynamically via SVG/PDF for GitHub profile READMEs and social sharing.

![GitCrib Blueprint Demo](./demo-gitcrib.png)

GitCrib is an open-source data-infographic poster and banner creator designed to run fully inside the **Vercel Edge Runtime** using TypeScript, Preact, and zero external rendering engines. It ingests dense GitHub payloads and translates metrics into highly structured, glassmorphic technical blueprints with zero layout overlapping.

---

## 🚀 Key Features

*   **Multi-Aspect Coordinate Compositor**: Grid layouts adapt dynamically based on chosen target viewport dimensions:
    *   `Instagram Post` (1080x1080) - Condensed 2x4 row card layout
    *   `Instagram Portrait` (1080x1350) - Balanced 2x6 card wrap
    *   `Twitter Post` (1600x900) - 3-panel horizontal widescreen split
    *   `Poster / A4` (1200x1600) - High-density technical blueprint grid
    *   `4K / 8K Wallpaper` (3840x2160) - Side-by-side expanded group panels
    *   `Mobile Wallpaper` (1080x2400) - Single-column vertical scrolling stack
*   **Math-Driven Vector Charts**: Built-in coordinates mapping that bypasses heavyweight layout frameworks:
    *   *Line Charts*: Bezier cubic curve paths (`d="M... C..."`) tracking contribution histories.
    *   *Bar Charts*: Commits mapped to absolute scaled `<rect>` bars.
    *   *Donut Charts*: Trigonometric arc calculation (`Math.sin`, `Math.cos`) plotting languages.
    *   *Radar Charts*: Equidistant geometric angular skills projection plotting.
    *   *Heatmap Grid*: A 7x53 grid tile calendar tracking streaks and gaps.
*   **Achievement & Rank Badges**: Automatic evaluation of 13 gold, silver, and bronze level badges (e.g. Consistency King, Polyglot Developer, Night Owl, PR Master).
*   **Tech Stack Detection Matrix**: Scans public repositories, descriptions, and topics to detect and display tech badge layers (React, Next, Vue, Rust, FastAPI, Docker, and more).
*   **Graphics & Export Layers**: Native handlers for `renderToSVG()` (raw responsive SVG string), `renderToCanvas()` (HTML5 canvas drawers for JPG/PNG exports), and `renderToPDF()` (lightweight binary PDF streams).

---

## 🛠️ Local Development

### Prerequisites
*   Node.js (v18+)
*   npm

### Setup
1. Clone the repository and install dependencies:
   ```bash
   git clone https://github.com/Garvit-821/GitCrib.git
   cd GitCrib
   npm install
   ```

2. Compile TypeScript:
   ```bash
   npm run build
   ```

3. Launch the development server:
   ```bash
   node server.js
   ```
   Open [http://localhost:3000](http://localhost:3000) to view the interactive landing page.

---

## 🧪 Verification & Testing

Verify the engine modules, aspect ratios, achievement calculations, and canvas drawing contexts using the test scripts:

```bash
# Compile and run the StatPrint Engine verification suite
npm run build && node dist/engine/test.js

# Run integration tests against the local server
node test.js
```

---

## 🔌 API Query Parameters

Customize your blueprint embeds using URL query parameters:

| Parameter | Type | Description | Values |
| :--- | :--- | :--- | :--- |
| `username` | `string` | **Required**. GitHub username to fetch. | e.g. `Garvit-821` |
| `theme` | `string` | Visual aesthetic color palette. | `blueprint`, `cyberpunk`, `matrix`, `amber` |
| `layout` | `string` | Viewport aspect ratio preset. | `poster`, `banner` |
| `devClass` | `string` | Override the computed developer title. | e.g. `Systems Architect` |
| `stars` | `number` | Override total stars display. | e.g. `500` |

---

## ⚡ Deployment

### Vercel Deployment (Coming Soon)
A one-click deploy button to run your own instance of the GitCrib API on Vercel Serverless/Edge functions will be available soon.

---

## 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
