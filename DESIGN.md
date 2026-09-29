---
version: alpha
name: CodeClinic-design-system
description: |
  An uncompromisingly minimal, documentation-first system that treats code health and diagnosis like a precision clinical workstation — paper-white canvas, 36px center-aligned display heading, a single black pill CTA, an inline terminal install snippet, and a clinical cross mascot as the only ornamental element. No gradients, no hero photography, no marketing pyrotechnics. The chrome is a strict utility palette of pure black, pure white, and three neutral grays; every interactive element is fully rounded into a pill (`{rounded.full}`); typography is SF Pro Rounded for headings paired with system sans for body and ui-monospace for code. Triage cases, surgical diffs, ICU sandboxes, and patient charts all sit on the same flat canvas inside thin-border cards — the system is the clinical chart, and the chart is the system.

colors:
  primary: "#000000"
  on-primary: "#ffffff"
  ink: "#000000"
  ink-deep: "#090909"
  charcoal: "#525252"
  body: "#737373"
  mute: "#a3a3a3"
  canvas: "#ffffff"
  surface-soft: "#fafafa"
  surface-card: "#ffffff"
  hairline: "#e5e5e5"
  hairline-strong: "#d4d4d4"
  on-dark: "#ffffff"
  on-dark-mute: "rgba(255,255,255,0.7)"
  surface-dark: "#171717"
  focus-ring: "rgba(59,130,246,0.5)"
  link: "#000000"
  link-mute: "#737373"
  terminal-red: "#ff5f56"
  terminal-yellow: "#ffbd2e"
  terminal-green: "#27c93f"

typography:
  display-xl:
    fontFamily: SF Pro Rounded
    fontSize: 36px
    fontWeight: 500
    lineHeight: 1.11
    letterSpacing: 0
  display-lg:
    fontFamily: SF Pro Rounded
    fontSize: 30px
    fontWeight: 500
    lineHeight: 1.2
    letterSpacing: 0
  heading-lg:
    fontFamily: SF Pro Rounded
    fontSize: 24px
    fontWeight: 600
    lineHeight: 1.33
    letterSpacing: 0
  heading-md:
    fontFamily: ui-sans-serif
    fontSize: 20px
    fontWeight: 500
    lineHeight: 1.4
    letterSpacing: 0
  heading-sm:
    fontFamily: ui-sans-serif
    fontSize: 18px
    fontWeight: 500
    lineHeight: 1.56
    letterSpacing: 0
  body-md:
    fontFamily: ui-sans-serif
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  body-strong:
    fontFamily: ui-sans-serif
    fontSize: 16px
    fontWeight: 500
    lineHeight: 1.5
    letterSpacing: 0
  body-sm:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  body-sm-strong:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1.43
    letterSpacing: 0
  caption-sm:
    fontFamily: ui-sans-serif
    fontSize: 12px
    fontWeight: 400
    lineHeight: 1.33
    letterSpacing: 0
  code-md:
    fontFamily: ui-monospace
    fontSize: 16px
    fontWeight: 400
    lineHeight: 1.5
    letterSpacing: 0
  code-sm:
    fontFamily: ui-monospace
    fontSize: 14px
    fontWeight: 400
    lineHeight: 1.43
    letterSpacing: 0
  button-md:
    fontFamily: ui-sans-serif
    fontSize: 14px
    fontWeight: 500
    lineHeight: 1
    letterSpacing: 0

rounded:
  none: 0px
  sm: 6px
  md: 8px
  lg: 12px
  full: 9999px

spacing:
  xxs: 2px
  xs: 4px
  sm: 8px
  md: 12px
  lg: 16px
  xl: 24px
  xxl: 32px
  section: 88px

components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 20px
    height: 36px
  button-primary-active:
    backgroundColor: "{colors.ink-deep}"
    textColor: "{colors.on-primary}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
  button-secondary:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 20px
    height: 36px
  button-pill-on-dark:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.button-md}"
    rounded: "{rounded.full}"
    padding: 8px 20px
  button-disabled:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.mute}"
    rounded: "{rounded.full}"
  search-pill:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 36px
  search-pill-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  text-input:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.full}"
    padding: 8px 16px
    height: 40px
  text-input-focused:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    rounded: "{rounded.full}"
  install-snippet:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.code-md}"
    rounded: "{rounded.full}"
    padding: 12px 20px
    height: 48px
  command-tag:
    backgroundColor: "{colors.surface-soft}"
    textColor: "{colors.ink}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.full}"
    padding: 6px 12px
  terminal-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.lg}"
    padding: 16px
  terminal-traffic-lights:
    rounded: "{rounded.full}"
    size: 12px
  patient-chart-card:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.lg}"
    padding: 24px
  surgical-diff-card:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.code-sm}"
    rounded: "{rounded.lg}"
    padding: 20px
  feature-bullet:
    textColor: "{colors.charcoal}"
    typography: "{typography.body-sm}"
  triage-row:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
    rounded: "{rounded.none}"
    padding: 16px 0px
  link-inline:
    textColor: "{colors.ink}"
    typography: "{typography.body-md}"
  link-mute:
    textColor: "{colors.body}"
    typography: "{typography.body-sm}"
  primary-nav:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.ink}"
    typography: "{typography.body-sm-strong}"
    rounded: "{rounded.none}"
    height: 56px
  footer-section:
    backgroundColor: "{colors.canvas}"
    textColor: "{colors.body}"
    typography: "{typography.caption-sm}"
    rounded: "{rounded.none}"
    padding: 32px 24px
  cta-strip-dark:
    backgroundColor: "{colors.surface-dark}"
    textColor: "{colors.on-dark}"
    typography: "{typography.heading-lg}"
    rounded: "{rounded.lg}"
    padding: 24px 32px
---

## Overview

Code Clinic's interface is an aggressively minimal, documentation-first surface designed for high-signal engineering diagnosis. The application reads like a clean technical specification or a pristine clinical chart: a 36px center-aligned heading sits above an inline `curl` install snippet inside a soft-gray pill, a single black "Admit Patient" / "Consult" CTA, and a minimalist clinical cross mascot as the only ornament. Everything else — the Emergency Room triage presets, the interactive Consultation intake, the ICU sandbox executor, and the surgical diff verification view — sits on the same paper-white canvas (`{colors.canvas}`) with quiet `{colors.body}` neutrals carrying technical explanations. The system is the clinical chart, and the chart is the system.

The design philosophy is geometric: every interactive element collapses to `{rounded.full}` (9999px) — buttons, search pills, install-snippet pills, text inputs, status badges, and terminal-traffic-light dots. There are no decorative drop shadows, no rainbow gradients, and no hero photography. Cards use a crisp `{rounded.lg}` (12px) and a subtle 1px hairline border (`{colors.hairline}`). The single inverted moment in the system is the dark ICU execution card / Surgical Diff card — `{colors.surface-dark}` with high-contrast text — which acts as the focused operating theatre in an otherwise studiously flat layout.

Typography pairs SF Pro Rounded (display headings, weight 500–600) with the operating system's default sans (`ui-sans-serif`) for body and `ui-monospace` for code. The roundness of the heading face is the only "personality" the chrome carries — it gently echoes the `{rounded.full}` pill geometry without being decorative about it.

**Key Characteristics:**
- Paper-white `{colors.canvas}` end-to-end with no surface alternation — the whole page is one continuous sheet
- Center-aligned hero with `{typography.display-xl}` SF Pro Rounded headline, no eyebrow, no decorative subhead beyond a focused clinical diagnosis mission statement
- Pill geometry everywhere: every button, badge, chip, and input is `{rounded.full}`; cards use `{rounded.lg}`; nothing is sharp-cornered except section dividers
- Single-color CTA system: pure black `{colors.primary}` pills carry every action; outline pills provide secondary affordances
- Inline `curl` install snippet rendered as a pill with `{typography.code-md}` — sitting directly under the hero headline
- Terminal-mockup card with macOS traffic-light dots and live ICU sandbox execution — the workspace's focused surgical suite
- Inverted dark `{component.surgical-diff-card}` for code inspection and diff verification, breaking the flat-white rhythm exactly once per view

## Colors

### Brand & Accent
- **Pure Black** (`{colors.primary}` — `#000000`): the brand. Every primary CTA, every black pill, active tab indicator, and solid icon. There is no other primary brand color.
- **Ink Deep** (`{colors.ink-deep}` — `#090909`): pressed-state black for the primary pill — a single notch below pure black.

### Surface
- **Canvas** (`{colors.canvas}` — `#ffffff`): the screen itself. Every core surface in the system.
- **Soft Surface** (`{colors.surface-soft}` — `#fafafa`): install-snippet pill background, search pill, triage chip backgrounds, alternating row fills.
- **Surface Dark** (`{colors.surface-dark}` — `#171717`): the dark ICU terminal, surgical diff card, and dark CTA strips. The single inverted surface in the system.
- **Hairline** (`{colors.hairline}` — `#e5e5e5`): 1px card border, tab bar border line, and dividers between consultation dialogue rows.
- **Hairline Strong** (`{colors.hairline-strong}` — `#d4d4d4`): slightly stronger divider where extra separation is needed.

### Text
- **Ink** (`{colors.ink}` — `#000000`): all headlines, primary nav links, button text on light surfaces, clinical case identifiers.
- **Charcoal** (`{colors.charcoal}` — `#525252`): list-item text, secondary labels, and vitals copy.
- **Body** (`{colors.body}` — `#737373`): default body color for paragraph copy, doctor advice, and clinical notes — the system's most-used text color after pure black.
- **Mute** (`{colors.mute}` — `#a3a3a3`): caption text, terminal comments, and lowest-emphasis metadata.
- **On Dark** (`{colors.on-dark}` — `#ffffff`): primary text on `{colors.surface-dark}`.
- **On Dark Mute** (`{colors.on-dark-mute}` — `rgba(255,255,255,0.7)`): secondary copy inside the dark terminal and diff views.

### Semantic (Diagnostic Lights)
The only non-monochrome colors in the system represent clinical diagnostics and terminal traffic lights:
- **Terminal Red** (`{colors.terminal-red}` — `#ff5f56`): close-window dot, critical triage priority, fatal syntax errors.
- **Terminal Yellow** (`{colors.terminal-yellow}` — `#ffbd2e`): minimize dot, warning / pending triage cases.
- **Terminal Green** (`{colors.terminal-green}` — `#27c93f`): zoom dot, healthy vitals, passing ICU test executions.

These appear strictly inside `{component.terminal-card}` and diagnostic badges.

### Focus
- **Focus Ring** (`{colors.focus-ring}` — `rgba(59,130,246,0.5)`): translucent blue browser/system focus ring around interactive elements.

## Typography

### Font Family
- **SF Pro Rounded** (display headings) — Apple's rounded geometric sans, used at weights 500 and 600 for headlines from `{typography.display-xl}` (36px) down to `{typography.heading-lg}` (24px). Falls back to `system-ui` → `-apple-system`.
- **ui-sans-serif** (body, links, buttons, captions) — the operating system's default sans-serif. Carries every non-display text role at 12–20px. Falls back through `system-ui`.
- **ui-monospace** (code, install snippet, triage tags) — the OS default monospace. Used inside the terminal sandbox, the inline `curl` install pill, and code diff blocks. Falls back to SFMono-Regular → Menlo → Monaco → Consolas.

### Hierarchy

| Token | Size | Weight | Line Height | Letter Spacing | Use |
|---|---|---|---|---|---|
| `{typography.display-xl}` | 36px | 500 | 1.11 | 0 | Hero headline ("The easiest way to diagnose and cure broken code") |
| `{typography.display-lg}` | 30px | 500 | 1.2 | 0 | Section headlines ("Emergency Triage", "ICU Sandbox") |
| `{typography.heading-lg}` | 24px | 600 | 1.33 | 0 | View subtitles ("Surgical Diff Prescription", "Patient Chart") |
| `{typography.heading-md}` | 20px | 500 | 1.4 | 0 | Case name, card title ("Memory Leak #819", "Hydration Error #102") |
| `{typography.heading-sm}` | 18px | 500 | 1.56 | 0 | Symptom label, in-card subtitle |
| `{typography.body-md}` | 16px | 400 | 1.5 | 0 | Default body, physician questions, paragraph copy |
| `{typography.body-strong}` | 16px | 500 | 1.5 | 0 | Inline emphasis, primary navigation badge |
| `{typography.body-sm}` | 14px | 400 | 1.43 | 0 | Diagnostic bullet, symptom description |
| `{typography.body-sm-strong}` | 14px | 500 | 1.43 | 0 | Button label, triage-card badge |
| `{typography.caption-sm}` | 12px | 400 | 1.33 | 0 | Footer timestamp, session ID metadata |
| `{typography.code-md}` | 16px | 400 | 1.5 | 0 | Install-snippet `curl` line, in-terminal script |
| `{typography.code-sm}` | 14px | 400 | 1.43 | 0 | Terminal output line, surgical diff line, code chip |
| `{typography.button-md}` | 14px | 500 | 1 | 0 | Every button label across the system |

### Principles
Typography is built for clinical clarity and high legibility. SF Pro Rounded's softened terminals on headings convey humane reassurance, while `ui-sans-serif` and `ui-monospace` preserve strict engineering utility. The heading-to-body scale compresses tightly so the interface reads as a single focused diagnosis sheet.

## Layout

### Spacing System
- **Base unit:** 8px (with 2/4/6px sub-units for tight badges and inline tags)
- **Tokens:** `{spacing.xxs}` (2px) · `{spacing.xs}` (4px) · `{spacing.sm}` (8px) · `{spacing.md}` (12px) · `{spacing.lg}` (16px) · `{spacing.xl}` (24px) · `{spacing.xxl}` (32px) · `{spacing.section}` (88px)
- **Universal section rhythm:** Sections are separated by `{spacing.section}` (88px) of plain white space, never by colored bands or drop shadows.
- **Card internal padding:** Clinical cards use `{spacing.xl}` (24px) or `{spacing.xxl}` (32px) padding; triage rows use `{spacing.lg}` (16px) vertical padding.

### Grid & Container
- **Max reading width:** ~720px content column for focused reading and symptom intake.
- **Consultation / Chart split:** On desktop screens (>=860px), layout splits 65/35 into Consultation dialogue on the left and Patient Chart vitals on the right. Collapses to 1-column on mobile.
- **Triage carousel:** Horizontal scrollable strip of flat cards with snap points.
- **Footer:** Single row of small body-sm links, center-aligned.

## Elevation & Depth

| Level | Treatment | Use |
|---|---|---|
| 0 — Flat | No border, no shadow | Hero, symptom intake dialogue, section headers |
| 1 — Hairline border | 1px solid `{colors.hairline}` | Triage cards, Patient Chart, Learning Vault cards |
| 2 — Inverted dark | `{colors.surface-dark}` fill | ICU Code Sandbox and Surgical Diff views — the system's operating rooms |

The system uses zero drop shadows. Elevation is conveyed strictly through 1px hairlines or inverted dark contrast.

## Shapes

### Border Radius Scale

| Token | Value | Use |
|---|---|---|
| `{rounded.none}` | 0px | Nav bars, tab bars, dividing lines |
| `{rounded.sm}` | 6px | Inline code tags, language badges |
| `{rounded.md}` | 8px | Dropdown panels and popovers |
| `{rounded.lg}` | 12px | Patient cards, terminal sandbox container, diff preview |
| `{rounded.full}` | 9999px | Every button, pill input, search pill, triage chip, traffic-light dot |

Interactive elements are pills (`{rounded.full}`); structural containers are flat 12px rounded cards (`{rounded.lg}`).

## Components

### Buttons

**`button-primary`** — the universal black action pill
- Background `{colors.primary}`, text `{colors.on-primary}`, typography `{typography.button-md}`, padding `8px 20px`, height `36px`, rounded `{rounded.full}`.
- Used for "Admit Patient", "+ New Patient", "Run Execution", "Apply Prescription".
- Pressed state drops to `{colors.ink-deep}` (`#090909`).

**`button-secondary`** — outline alternative on light canvas
- Background `{colors.canvas}`, text `{colors.ink}`, border `1px solid {colors.hairline-strong}`, rounded `{rounded.full}`, padding `8px 20px`, height `36px`.
- Used for "📋 Chart", "Reset Session", "View Vault".

**`button-pill-on-dark`** — white pill on dark surface
- Background `{colors.canvas}`, text `{colors.ink}`, typography `{typography.button-md}`, rounded `{rounded.full}`.
- Used inside dark ICU execution cards for "Run Diagnostics" or "Deploy Fix".

**`button-disabled`**
- Background `{colors.surface-soft}`, text `{colors.mute}`, rounded `{rounded.full}`.

### Inputs & Forms

**`search-pill`**
- Background `{colors.surface-soft}`, text `{colors.ink}`, typography `{typography.body-sm}`, padding `8px 16px`, height `36px`, rounded `{rounded.full}`.
- Placed in the Knowledge Vault and consultation search bar.

**`text-input`**
- Background `{colors.canvas}`, 1px solid `{colors.hairline}`, typography `{typography.body-md}`, padding `8px 16px`, height `40px`, rounded `{rounded.full}`.

**`install-snippet`** — the signature install pill
- Background `{colors.surface-soft}`, text `{colors.ink}` rendered in `{typography.code-md}`, border `1px solid {colors.hairline}`, padding `12px 20px`, height `48px`, rounded `{rounded.full}`.
- Features `curl -fsSL https://codeclinic.dev/cure.sh | sh` with an inline black pill button.

**`command-tag`** — triage chip
- Background `{colors.surface-soft}`, text `{colors.ink}` in `{typography.code-sm}`, padding `6px 12px`, rounded `{rounded.full}`.

### Cards & Containers

**`terminal-card`** — ICU Code Sandbox
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `16px`, rounded `{rounded.lg}`.
- Header: three `{component.terminal-traffic-lights}` dots (`#ff5f56`, `#ffbd2e`, `#27c93f` at 12px) in a horizontal row.
- Body: code execution input and stdout/stderr rendered in `{typography.code-sm}`.

**`patient-chart-card`** — Clinical Vitals & Memory
- Container: background `{colors.canvas}`, 1px solid `{colors.hairline}`, padding `24px`, rounded `{rounded.lg}`.
- Displays active symptoms, session vitals, verification checklist, and loaded hypotheses.

**`surgical-diff-card`** — Surgical Diff & Prescription
- Container: background `{colors.surface-dark}`, padding `20px`, rounded `{rounded.lg}`.
- Displays unified diff lines with green additions, red deletions, and inline black pill test execution button.

### Navigation

**`primary-nav`**
- Background `{colors.canvas}`, text `{colors.ink}`, height 56px, borderBottom `1px solid {colors.hairline}`.
- Left: Clinical mascot + "Code Clinic". Center: Session status badge. Right: "📋 Chart" + black pill "+ New Patient".

## Do's and Don'ts

### Do
- Treat every screen like a focused diagnostic workstation: clean reading column, generous `{spacing.section}` whitespace, zero unnecessary ornamentation.
- Use `{component.button-primary}` (black pill) for every primary action.
- Default to `{rounded.full}` for all interactive elements (buttons, inputs, chips, badges).
- Confine code editing and test running to the `{component.terminal-card}` with the 3 traffic-light dots.
- Use a single 1px hairline border (`{colors.hairline}`) for light cards, and inverted `{colors.surfaceDark}` for surgical execution cards.
- Keep the clinical cross mascot the only illustration in the system.

### Don't
- Don't introduce gradients, drop shadows, or floating cards.
- Don't use bright brand accent colors; rely entirely on black (`#000000`), white (`#ffffff`), and neutral grays.
- Don't use sharp corners for interactive elements or buttons.
- Don't create multi-colored dashboards; clinical restraint is the core aesthetic.
- Don't mention prohibited product names anywhere in UI, code, or documentation.

## Responsive Behavior

| Breakpoint | Width | Behavior |
|---|---|---|
| desktop | 1024px+ | 720px reading column; two-column Consultation + Patient Chart split |
| tablet | 768px–1023px | Single column with sticky patient chart toggle button in header |
| mobile | <768px | Display title scales to 28px; install snippet wraps cleanly; full-width stacked cards |
