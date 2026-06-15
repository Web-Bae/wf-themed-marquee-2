import {
  Children,
  useEffect,
  useRef,
  type CSSProperties,
  type ReactNode,
} from 'react'
import * as stylesModule from './LogoMarquee.module.css'

// Webflow's bundler exposes CSS Modules as named exports (no default), while
// Vite provides both. A namespace import + cast works in both environments.
const styles = stylesModule as unknown as Record<string, string>

export interface LogoMarqueeProps {
  /** The logos to scroll. Drop any number of SVGs / images here. (Webflow Slot) */
  logos?: ReactNode
  /** Ergonomic alias for `logos` when used directly in React via JSX nesting. */
  children?: ReactNode
  /** Scroll speed in pixels per second. */
  speed?: number
  /** Space between logos, in pixels. */
  gap?: number
  /** Every logo is normalized to this height, in pixels. */
  logoHeight?: number
  /** Toggle the soft fade (mask-image gradient) on the left/right edges. */
  fadeEdges?: boolean
  /** Width of the soft fade on each edge, in pixels. */
  fade?: number
  /** Scroll direction. */
  direction?: 'left' | 'right'
  /** Pause the animation while the visitor hovers the strip. */
  pauseOnHover?: boolean
  /**
   * Color applied to every logo. The component rewrites each SVG's fills to
   * `currentColor`, so any CSS color value works (hex, rgb, a theme variable
   * like `var(--brand)`, etc.). Leave empty to inherit the surrounding theme.
   */
  color?: string
}

const isServer = typeof window === 'undefined'

/** Rewrite an element's (and its descendants') SVG fills to `currentColor`. */
function recolorFills(node: Element) {
  const apply = (el: Element) => {
    const fill = el.getAttribute('fill')
    if (fill !== null && fill !== 'none') el.setAttribute('fill', 'currentColor')
    const styleFill = (el as HTMLElement).style?.fill
    if (styleFill && styleFill !== 'none') {
      ;(el as HTMLElement).style.fill = 'currentColor'
    }
  }
  apply(node)
  node.querySelectorAll('[fill], [style*="fill"]').forEach(apply)
}

export function LogoMarquee({
  logos,
  children,
  speed = 80,
  gap = 72,
  logoHeight = 40,
  fadeEdges = true,
  fade = 120,
  direction = 'left',
  pauseOnHover = false,
  color,
}: LogoMarqueeProps) {
  const rootRef = useRef<HTMLDivElement>(null)
  const sourceRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)

  const content = logos ?? children
  const contentCount = Children.count(content)

  // The marquee is assembled imperatively: Webflow delivers slot content through
  // a real <slot> element (light DOM), so we read the assigned nodes, clone them
  // into the animated track, then size / recolor / duplicate the clones.
  useEffect(() => {
    if (isServer) return
    const root = rootRef.current
    const source = sourceRef.current
    const track = trackRef.current
    if (!root || !source || !track) return

    let frame = 0
    let lastWidth = -1

    const getSources = (): Element[] => {
      const slot = source.querySelector('slot')
      if (slot) {
        const assigned = slot.assignedElements({ flatten: true })
        // Webflow wraps slot content in a single <div slot="logos">. Unwrap it
        // so each logo becomes its own track item.
        if (assigned.length === 1 && assigned[0].hasAttribute('slot')) {
          return Array.from(assigned[0].children)
        }
        if (assigned.length > 0) return assigned
      }
      return Array.from(source.children).filter(
        (el) => el.tagName.toLowerCase() !== 'slot',
      )
    }

    const makeItem = (node: Element, hidden: boolean) => {
      const item = document.createElement('span')
      item.className = styles.item
      if (hidden) item.setAttribute('aria-hidden', 'true')
      const clone = node.cloneNode(true) as Element
      recolorFills(clone)
      item.appendChild(clone)
      return item
    }

    const build = () => {
      const sources = getSources()
      track.replaceChildren()
      if (sources.length === 0) return

      lastWidth = root.offsetWidth

      // One set first, so we can measure a single loop's width.
      const firstSet = sources.map((node) => makeItem(node, false))
      firstSet.forEach((el) => track.appendChild(el))

      const gapPx = parseFloat(getComputedStyle(track).columnGap) || 0
      // Width of one set = each item's width + the gap that follows it. Including
      // the trailing gap is what makes the wrap point seamless.
      const oneSet = firstSet.reduce(
        (sum, el) => sum + el.getBoundingClientRect().width + gapPx,
        0,
      )
      if (oneSet <= 0) return

      // Enough sets to always cover the viewport plus the off-screen copy.
      const copies = Math.max(2, Math.ceil(root.offsetWidth / oneSet) + 1)
      for (let copy = 1; copy < copies; copy++) {
        sources.forEach((node) => track.appendChild(makeItem(node, true)))
      }

      track.style.setProperty('--marquee-shift', `${oneSet}px`)
      track.style.setProperty(
        '--marquee-duration',
        `${oneSet / Math.max(speed, 1)}s`,
      )
    }

    const scheduleBuild = () => {
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(build)
    }

    build()

    const slot = source.querySelector('slot')
    slot?.addEventListener('slotchange', scheduleBuild)

    let observer: ResizeObserver | undefined
    if (typeof ResizeObserver !== 'undefined') {
      observer = new ResizeObserver(() => {
        // Only rebuild on width changes; height changes from our own clones
        // would otherwise cause a feedback loop.
        if (root.offsetWidth !== lastWidth) scheduleBuild()
      })
      observer.observe(root)
    }

    return () => {
      cancelAnimationFrame(frame)
      slot?.removeEventListener('slotchange', scheduleBuild)
      observer?.disconnect()
    }
  }, [gap, logoHeight, speed, contentCount])

  const rootStyle = {
    '--marquee-gap': `${gap}px`,
    '--marquee-logo-height': `${logoHeight}px`,
    '--marquee-fade': `${fade}px`,
    ...(color ? { color } : null),
  } as CSSProperties

  return (
    <div
      ref={rootRef}
      className={styles.root}
      style={rootStyle}
      data-pause={pauseOnHover ? 'true' : 'false'}
      data-fade={fadeEdges ? 'true' : 'false'}
      data-direction={direction}
    >
      {/* Receives the slot/children content; never shown, only cloned from. */}
      <div ref={sourceRef} className={styles.source} aria-hidden="true">
        {content}
      </div>
      <div ref={trackRef} className={styles.track} />
    </div>
  )
}

export default LogoMarquee
