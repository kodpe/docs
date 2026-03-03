import { QuartzComponentConstructor } from "./types"

const GraphFit: QuartzComponentConstructor = (() => {
  function GraphFit() {
    return null
  }

  GraphFit.afterDOMLoaded = `
(() => {
  function isGraphPage() {
    const slug = document.body?.getAttribute("data-slug") || ""
    return slug.startsWith("Games/") && slug !== "Games/index"
  }

  function getTargets() {
    const container = document.querySelector(".graph-container")
    const canvas = container?.querySelector("canvas")
    if (!container || !canvas) return null
    return { container, canvas }
  }

  // Resize propre : 1 seule fois, après stabilisation du layout
  function resizeCanvasOnce() {
    if (!isGraphPage()) return
    const t = getTargets()
    if (!t) return

    const { container, canvas } = t
    const rect = container.getBoundingClientRect()
    const cssW = Math.max(1, Math.floor(rect.width))
    const cssH = Math.max(1, Math.floor(rect.height))

    // Taille CSS
    canvas.style.width = cssW + "px"
    canvas.style.height = cssH + "px"

    // Taille buffer (évite étirement/flou)
    const dpr = window.devicePixelRatio || 1
    const bufW = Math.max(1, Math.floor(cssW * dpr))
    const bufH = Math.max(1, Math.floor(cssH * dpr))

    // IMPORTANT: on ne fait ça qu'après debounce (pas pendant le resize continu)
    if (canvas.width !== bufW) canvas.width = bufW
    if (canvas.height !== bufH) canvas.height = bufH
  }

  // Debounce de resize : on cache pendant resize, puis on recalcule une fois
  let timer
  function onResize() {
    if (!isGraphPage()) return
    document.body.classList.add("graph-resizing")
    clearTimeout(timer)
    timer = setTimeout(() => {
      // attendre un frame pour que le layout soit vraiment appliqué
      requestAnimationFrame(() => {
        resizeCanvasOnce()
        document.body.classList.remove("graph-resizing")
      })
    }, 250)
  }

  function onNavOrLoad() {
    if (!isGraphPage()) return
    // premier calcul (après 2 frames)
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        resizeCanvasOnce()
      })
    })
  }

  document.addEventListener("nav", onNavOrLoad)
  window.addEventListener("resize", onResize)

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onNavOrLoad, { once: true })
  } else {
    onNavOrLoad()
  }
})()
`

  return GraphFit
}) satisfies QuartzComponentConstructor

export default GraphFit