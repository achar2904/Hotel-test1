---
version: alpha
name: Hotel-Case-Reporting-Calm-Terracotta
description: |
  An eye-comfort, hospitality-focused case reporting and task dispatch design system built around warm terracotta orange (`#D95A1E`), soothing soft linen canvas (`#F1F3F5`), elevated white cards (`#FFFFFF`), and calm slate ink (`#1E293B` / `#475569`). 
  Tailored specifically for hotel operations (Regent Cha-am / VALA Beach Resort), providing gentle contrast, reduced glare, and a clutter-free visual hierarchy for 24/7 front-desk and engineering shifts.

colors:
  primary: "#D95A1E"
  primary-hover: "#C24813"
  primary-active: "#9E380D"
  primary-soft: "#FCECE0"
  primary-subtle: "#FDF6F0"
  primary-border: "#F8D5BD"

  canvas: "#F1F3F5"
  surface: "#FFFFFF"
  surface-subtle: "#F8FAFC"
  surface-sunken: "#EDF2F7"

  hairline: "#E2E8F0"
  hairline-strong: "#CBD5E1"
  hairline-subtle: "#F1F3F5"

  ink: "#1E293B"
  ink-body: "#475569"
  ink-muted: "#64748B"
  ink-subtle: "#94A3B8"
  ink-inverse: "#FFFFFF"

  # Semantic Status for Hotel Cases (Calm Pastels)
  status-pending: "#C53030"
  status-pending-bg: "#FED7D7"
  status-pending-border: "#FEB2B2"

  status-progress: "#C05621"
  status-progress-bg: "#FEEBC8"
  status-progress-border: "#FBD38D"

  status-resolved: "#276749"
  status-resolved-bg: "#C6F6D5"
  status-resolved-border: "#9AE6B4"

  status-escalated: "#2B6CB0"
  status-escalated-bg: "#BEE3F8"
  status-escalated-border: "#90CDF4"

typography:
  font-family-sans: "'Inter', 'Noto Sans Thai', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
  font-family-mono: "'JetBrains Mono', monospace"

  display-xl:
    fontSize: "32px"
    fontWeight: 700
    lineHeight: "1.2"
    letterSpacing: "-0.5px"

  headline:
    fontSize: "24px"
    fontWeight: 700
    lineHeight: "1.3"
    letterSpacing: "-0.3px"

  title:
    fontSize: "18px"
    fontWeight: 600
    lineHeight: "1.4"

  body-bold:
    fontSize: "14px"
    fontWeight: 600
    lineHeight: "1.5"

  body:
    fontSize: "14px"
    fontWeight: 400
    lineHeight: "1.5"

  body-sm:
    fontSize: "12px"
    fontWeight: 400
    lineHeight: "1.4"

  caption:
    fontSize: "11px"
    fontWeight: 500
    lineHeight: "1.3"
    letterSpacing: "0.2px"

radii:
  sm: "6px"
  md: "10px"
  lg: "16px"
  xl: "20px"
  pill: "9999px"

shadows:
  card: "0 2px 4px -1px rgba(0, 0, 0, 0.04), 0 1px 2px -1px rgba(0, 0, 0, 0.02)"
  card-hover: "0 10px 15px -3px rgba(249, 115, 22, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.04)"
  dropdown: "0 10px 25px -5px rgba(15, 23, 42, 0.1), 0 8px 10px -6px rgba(15, 23, 42, 0.04)"
  focus-ring: "0 0 0 3px rgba(249, 115, 22, 0.25)"

components:
  topbar:
    background: "surface"
    borderBottom: "1px solid hairline"
    height: "64px"
    logoBg: "primary"
    logoColor: "ink-inverse"
    logoRadius: "md"

  sidebar:
    background: "surface"
    borderRight: "1px solid hairline"
    activeItemBg: "primary-soft"
    activeItemColor: "primary"
    hoverItemBg: "surface-subtle"

  caseCard:
    background: "surface"
    border: "1px solid hairline"
    borderRadius: "lg"
    padding: "16px"
    roomBadgeBg: "primary-soft"
    roomBadgeColor: "primary"

  buttons:
    primary:
      background: "primary"
      hoverBackground: "primary-hover"
      color: "ink-inverse"
      borderRadius: "md"
      fontWeight: 600
      padding: "10px 18px"
    secondary:
      background: "surface"
      hoverBackground: "surface-subtle"
      border: "1px solid hairline"
      color: "ink-body"
      borderRadius: "md"

  badges:
    borderRadius: "pill"
    padding: "4px 10px"
    fontWeight: 600
    fontSize: "caption"

rules:
  1. Never use pure black (#000000) for body text; always use `ink-body` (#334155) or `ink` (#0F172A).
  2. Use `primary` (#F97316) for positive call-to-actions, room badges, and active navigation items.
  3. Every interactive card must have a subtle hover transition with `shadows.card-hover`.
  4. Ensure all text and icons comply with WCAG AA contrast against their backgrounds.
---
