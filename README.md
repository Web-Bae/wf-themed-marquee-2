# Logo Marquee — Webflow Code Component

An auto-scrolling, seamless logo strip built as a [Webflow Code Component](https://developers.webflow.com/code-components/introduction). Drop any number of SVGs into a single slot and it sizes, spaces, duplicates, and loops them automatically — no matter how many you add.

**[▶ Watch the demo (Loom)](https://www.loom.com/share/53ae06f2181d48559f91af38493b1df5)**

- **One slot, any count** — clones your logos as needed to fill the strip and loop seamlessly.
- **Constant speed** — scroll speed stays the same (px/second) regardless of how many logos you drop in.
- **Theme-aware color** — rewrites SVG fills to `currentColor` so a single `Color` prop (any CSS value, including theme variables) recolors every logo.
- **Tunable** — speed, direction, gap, logo height, edge fade, and pause-on-hover.
- **Accessible** — respects `prefers-reduced-motion` (falls back to a static, wrapped row).

Built with React 19 + Vite. Styles are scoped via CSS Modules and the component renders inside Webflow's Shadow DOM.

## Use it in your own Webflow project

Publishing pushes the component to **your own** Webflow Workspace using your CLI login — nothing here connects to anyone else's workspace.

1. **Fork** this repo to your GitHub account (use the **Fork** button at the top of the GitHub page), then clone your fork:
   ```bash
   git clone https://github.com/<your-username>/wf-themed-marquee.git
   cd wf-themed-marquee
   npm install
   ```
2. **Claim the library as your own.** In `webflow.json`, remove the existing `library.id` (and set a `library.name` you like) so the CLI creates a fresh library in your workspace:
   ```jsonc
   {
     "library": {
       "name": "My Logo Marquee",
       "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"]
       // no "id" — the CLI assigns one on first import
     }
   }
   ```
3. **Authenticate** with the Webflow CLI (opens a browser; credentials are saved outside the repo):
   ```bash
   npx webflow auth login
   ```
4. **Share the library** to your workspace. When prompted, choose **Create new code library**:
   ```bash
   npm run wf:import
   ```
5. In the Webflow Designer, open a site in that workspace, install your library from **Libraries**, drag the **Logo Marquee** component onto the canvas, and drop **SVG embeds** into the Logos slot.

To customize before publishing, edit `src/components/LogoMarquee/` (see [Props](#props)) and re-run `npm run wf:import`.

## Getting started

```bash
npm install
npm run dev      # local demo at http://localhost:5173
```

The local demo (`src/App.tsx`) renders the component with the sample SVGs in `src/assets/logos/`.

## Project layout

```
src/components/LogoMarquee/
  LogoMarquee.tsx          # The React component
  LogoMarquee.module.css   # Scoped styles (Shadow-DOM safe)
  LogoMarquee.webflow.tsx  # Webflow code-component definition (declareComponent)
webflow.json               # DevLink library config
```

## Props

Configured in the Webflow Designer (and available when using the React component directly).

| Prop | Webflow name | Type | Default | Description |
| --- | --- | --- | --- | --- |
| `logos` | Logos | Slot | — | The logos to scroll. Drop inline SVGs here (see note below). |
| `speed` | Speed | Number | `80` | Scroll speed in pixels per second. |
| `direction` | Direction | `left` \| `right` | `left` | Scroll direction. |
| `pauseOnHover` | Pause on hover | Boolean | `false` | Pause the animation while hovered. |
| `gap` | Gap | Number | `72` | Space between logos, in pixels. |
| `logoHeight` | Logo height | Number | `40` | Every logo is normalized to this height, in pixels. |
| `fadeEdges` | Fade edges | Boolean | `true` | Toggle the soft mask-image gradient on the left/right edges. |
| `fade` | Edge fade width | Number | `120` | Width of the edge fade, in pixels (when Fade edges is on). |
| `color` | Color | Text | `""` | Recolors every logo via `currentColor`. Any CSS color (hex, rgb, or a theme variable like `var(--brand)`). Leave empty to inherit the surrounding theme color. |

### A note on logos and color

`currentColor` recoloring only works with **inline SVGs**, not `<img src="logo.svg">` (an external image can't be traversed or recolored). In Webflow, add your logos as **SVG embeds** inside the Logos slot. With an empty `Color`, logos inherit the surrounding theme color (monochrome); set `Color` to override.

## Using the React component directly

```tsx
import { LogoMarquee } from './components/LogoMarquee/LogoMarquee'

<LogoMarquee speed={70} logoHeight={32} color="var(--text-h)">
  {/* inline SVGs */}
  <span dangerouslySetInnerHTML={{ __html: svgString }} />
</LogoMarquee>
```

## Publishing to Webflow (DevLink)

This repo is configured as a DevLink library via `webflow.json`. To publish the component to your Webflow Workspace:

```bash
# Bundle + upload + share the library
npm run wf:import
```

Then install the **WF Themed Marquee** library on any site in your workspace from **Libraries**, drag the **Logo Marquee** component onto the canvas, and drop your SVG embeds into the Logos slot.

> Authentication is stored in the Webflow CLI session (`~/.config/webflow/auth.json`), not in this repo. If you instead use `--api-token`, the CLI writes a token to `.env`, which is gitignored.

## Scripts

| Script | Description |
| --- | --- |
| `npm run dev` | Start the Vite dev server / local demo. |
| `npm run build` | Type-check and build. |
| `npm run lint` | Run ESLint. |
| `npm run preview` | Preview the production build. |
| `npm run wf:import` | Bundle and publish the component library to Webflow. |
