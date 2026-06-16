import { declareComponent } from '@webflow/react'
import { props } from '@webflow/data-types'
import { LogoMarquee } from './LogoMarquee'

export default declareComponent(LogoMarquee, {
  name: 'Logo Marquee',
  description:
    'An auto-scrolling, seamless logo strip. Drop any number of SVGs into the Logos slot and it sizes, spaces, and loops them automatically.',
  group: 'Marketing',
  props: {
    logos: props.Slot({
      name: 'Logos',
      group: 'Content',
      tooltip: 'Drop any number of SVGs or images here.',
    }),
    speed: props.Number({
      name: 'Speed',
      group: 'Animation',
      tooltip: 'Scroll speed in pixels per second.',
      defaultValue: 40,
      min: 1,
      max: 1000,
    }),
    direction: props.Variant({
      name: 'Direction',
      group: 'Animation',
      options: ['left', 'right'],
      defaultValue: 'left',
    }),
    pauseOnHover: props.Boolean({
      name: 'Pause on hover',
      group: 'Animation',
      defaultValue: false,
    }),
    gap: props.Number({
      name: 'Gap',
      group: 'Layout',
      tooltip: 'Space between logos, in pixels.',
      defaultValue: 72,
      min: 0,
      max: 400,
    }),
    logoHeight: props.Number({
      name: 'Logo height',
      group: 'Layout',
      tooltip: 'Every logo is normalized to this height, in pixels.',
      defaultValue: 40,
      min: 8,
      max: 200,
    }),
    fadeEdges: props.Boolean({
      name: 'Fade edges',
      group: 'Layout',
      tooltip: 'Soft mask-image gradient on the left/right edges.',
      defaultValue: true,
    }),
    fade: props.Number({
      name: 'Edge fade width',
      group: 'Layout',
      tooltip: 'Width of the edge fade, in pixels (when Fade edges is on).',
      defaultValue: 120,
      min: 0,
      max: 600,
    }),
    color: props.Text({
      name: 'Color',
      group: 'Style',
      tooltip:
        'Recolors every logo via currentColor. Accepts any CSS color (hex, rgb, or a theme variable like var(--brand)). Leave empty to inherit the theme.',
      defaultValue: '',
    }),
  },
  options: {
    // Our styles are scoped via CSS Modules, but enabling this lets any
    // tag-level styles reach the Shadow DOM the component renders into.
    applyTagSelectors: true,
  },
})
