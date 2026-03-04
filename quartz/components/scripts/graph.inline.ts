import type { ContentDetails } from "../../plugins/emitters/contentIndex"
import {
  SimulationNodeDatum,
  SimulationLinkDatum,
  Simulation,
  forceSimulation,
  forceManyBody,
  forceCenter,
  forceLink,
  forceCollide,
  forceRadial,
  zoomIdentity,
  select,
  drag,
  zoom,
} from "d3"
import { Text, Graphics, Application, Container, Circle } from "pixi.js"
import { Group as TweenGroup, Tween as Tweened } from "@tweenjs/tween.js"
import { registerEscapeHandler, removeAllChildren } from "./util"
import { FullSlug, SimpleSlug, getFullSlug, resolveRelative, simplifySlug } from "../../util/path"
import { D3Config } from "../Graph"
// my imports
import { SPECIAL_NODE_COLORS } from "../../graphNodeColors"
import { GRAPH_VIRTUAL_GAME_NODES } from "../../graphExternalLinks"
import { GRAPH_VIRTUAL_GENRE_NODES } from "../../graphExternalLinks"

type GraphicsInfo = {
  color: string
  gfx: Graphics
  alpha: number
  active: boolean
}

type NodeData = {
  id: SimpleSlug
  text: string
  tags: string[]
  // ajout perso
  externalUrl?: string
  // isExternal?: boolean
} & SimulationNodeDatum

type SimpleLinkData = {
  source: SimpleSlug
  target: SimpleSlug
}

type LinkData = {
  source: NodeData
  target: NodeData
} & SimulationLinkDatum<NodeData>

type LinkRenderData = GraphicsInfo & {
  simulationData: LinkData
}

type NodeRenderData = GraphicsInfo & {
  simulationData: NodeData
  label: Text
}

const localStorageKey = "graph-visited"
function getVisited(): Set<SimpleSlug> {
  return new Set(JSON.parse(localStorage.getItem(localStorageKey) ?? "[]"))
}

function addToVisited(slug: SimpleSlug) {
  const visited = getVisited()
  visited.add(slug)
  localStorage.setItem(localStorageKey, JSON.stringify([...visited]))
}

type TweenNode = {
  update: (time: number) => void
  stop: () => void
}

const VIRTUAL_PREFIX = "_virtual" as const
const gameId = (name: string) => `${VIRTUAL_PREFIX}/game/${name}` as SimpleSlug
const genreId = (name: string) => `${VIRTUAL_PREFIX}/genre/${name}` as SimpleSlug
const isGameId = (id: SimpleSlug) => String(id).startsWith(`${VIRTUAL_PREFIX}/game/`)
const isGenreId = (id: SimpleSlug) => String(id).startsWith(`${VIRTUAL_PREFIX}/genre/`)
const gameNameFromId = (id: SimpleSlug) => String(id).slice(`${VIRTUAL_PREFIX}/game/`.length)
const genreNameFromId = (id: SimpleSlug) => String(id).slice(`${VIRTUAL_PREFIX}/genre/`.length)

const DEFAULT_MODE = "DEFAULT"
const VIRTUAL_MODE = "VIRTUAL"
type GraphMode = "DEFAULT" | "VIRTUAL"
let GRAPH_MODE_SL: GraphMode = DEFAULT_MODE
const VIRTUAL_MODE_FLAG = "Games/TPS"
const VIRTUAL_SLUG = genreId("Survival")

async function renderGraph(graph: HTMLElement, fullSlug: FullSlug) {
  const realslug = simplifySlug(fullSlug)
  let slug = simplifySlug(fullSlug)
  GRAPH_MODE_SL = DEFAULT_MODE
  if (realslug === VIRTUAL_MODE_FLAG) {
    GRAPH_MODE_SL = VIRTUAL_MODE
    slug = VIRTUAL_SLUG as SimpleSlug
  }
  console.warn("realslug =", realslug)
  console.warn("slug     =", slug)
  console.warn("mode     =", GRAPH_MODE_SL)

  // --- CREATION DES VIRTUAL NODES ---
  type VirtualNode = {
    id: SimpleSlug
    text: string
    externalUrl: string
    linksTo: SimpleSlug[]
    isVirtualGame?: boolean
    isVirtualGenre?: boolean
  }
  const virtualNodes: VirtualNode[] = []
  for (const [gName, g] of GRAPH_VIRTUAL_GENRE_NODES.entries()) {
    virtualNodes.push({
      id: genreId(gName),
      text: gName,
      externalUrl: "",
      linksTo: (g.genres ?? []).map(genreId),
      isVirtualGenre: true,
    })
  }
  for (const [gameName, game] of GRAPH_VIRTUAL_GAME_NODES.entries()) {
    virtualNodes.push({
      id: gameId(gameName),
      text: gameName,
      externalUrl: game.url,
      linksTo: (game.genres ?? []).map(genreId),
      isVirtualGame: true,
    })
  }
  const virtualNodesMap = new Map<SimpleSlug, VirtualNode>(virtualNodes.map(n => [n.id, n]))
  const externalLabel = new Map<SimpleSlug, string>(virtualNodes.map(n => [n.id, n.text]))
  const externalUrlMap = new Map<SimpleSlug, string>(virtualNodes.map(n => [n.id, n.externalUrl]))
  console.log(virtualNodes)
  // --- END ---

  const visited = getVisited()
  removeAllChildren(graph)

  let {
    drag: enableDrag,
    zoom: enableZoom,
    depth,
    scale,
    repelForce,
    centerForce,
    linkDistance,
    fontSize,
    opacityScale,
    removeTags,
    showTags,
    focusOnHover,
    enableRadial,
  } = JSON.parse(graph.dataset["cfg"]!) as D3Config

  const data: Map<SimpleSlug, ContentDetails> = new Map(
    Object.entries<ContentDetails>(await fetchData).map(([k, v]) => [
      simplifySlug(k as FullSlug),
      v,
    ]),
  )
  const links: SimpleLinkData[] = []
  const tags: SimpleSlug[] = []
  let validLinks
  if (GRAPH_MODE_SL === VIRTUAL_MODE) {
    validLinks = new Set<SimpleSlug>([
      // ...data.keys(),
      ...virtualNodes.map(n => n.id),
    ])
  } else {
    validLinks = new Set<SimpleSlug>([
      ...data.keys(),
      // ...virtualNodes.map(n => n.id),
    ])
  }

  const tweens = new Map<string, TweenNode>()
  for (const [source, details] of data.entries()) {
    const outgoing = details.links ?? []

    for (const dest of outgoing) {
      if (validLinks.has(dest)) {
        links.push({ source: source, target: dest })
      }
    }

    if (showTags) {
      const localTags = details.tags
        .filter((tag) => !removeTags.includes(tag))
        .map((tag) => simplifySlug(("tags/" + tag) as FullSlug))

      tags.push(...localTags.filter((tag) => !tags.includes(tag)))

      for (const tag of localTags) {
        links.push({ source: source, target: tag })
      }
    }
  }

  // --- AJOUT PERSO : liens des nodes externes
  for (const n of virtualNodes) {
    for (const t of n.linksTo) {
      if (validLinks.has(t)) {
        links.push({ source: n.id, target: t })
      }
    }
  }
  //
  // console.log(validLinks)
  console.log(links)

  // COMPUTE NEIGHBOURS
  // console.log("COMPUTE NEIGHBOURS")
  const neighbourhood = new Set<SimpleSlug>()
  const wl: (SimpleSlug | "__SENTINEL")[] = [slug, "__SENTINEL"]
  if (depth >= 0) {

    const seen = new Set<SimpleSlug>()

    while (depth >= 0 && wl.length > 0) {
      // console.log("depth", depth)
      // console.log("wl.length", wl.length)
      // console.log("neighbourdhood.size", neighbourhood.size);
      // compute neighbours
      const cur = wl.shift()!
      if (cur === "__SENTINEL") {
        depth--
        wl.push("__SENTINEL")
      } else {
        if (seen.has(cur)) continue // deja vu donc on passe au suivant
        seen.add(cur) // on ajoute le deja vu

        neighbourhood.add(cur)
        const outgoing = links.filter((l) => l.source === cur)
        const incoming = links.filter((l) => l.target === cur)

        for (const n of outgoing.map((l) => l.target)) {
          if (!seen.has(n)) wl.push(n)
        }
        for (const n of incoming.map((l) => l.source)) {
          if (!seen.has(n)) wl.push(n)
        }
        // wl.push(...outgoing.map((l) => l.target), ...incoming.map((l) => l.source))
      }

      // hard cap test
      if (wl.length > 300000) {
        console.log("hard cap 300000 reached -> break")
        break
      }
      //

    }
  } else { // if depth == -1 (global)
    validLinks.forEach((id) => neighbourhood.add(id))
    if (showTags) tags.forEach((tag) => neighbourhood.add(tag))
  }

  const nodes = [...neighbourhood].map((url) => {
    // const text = url.startsWith("tags/") ? "#" + url.substring(5) : (data.get(url)?.title ?? url)
    // ajout perso
    let text = externalLabel.get(url)
    if (!text) {
      text = url.startsWith("tags/") ? "#" + url.substring(5) : (data.get(url)?.title ?? url)
    }
    //
    return {
      id: url,
      text,
      tags: data.get(url)?.tags ?? [],
      externalUrl: externalUrlMap.get(url),
      // isExternal: externalUrlMap.has(url),
    }
  })
  const graphData: { nodes: NodeData[]; links: LinkData[] } = {
    nodes,
    links: links
      .filter((l) => neighbourhood.has(l.source) && neighbourhood.has(l.target))
      .map((l) => ({
        source: nodes.find((n) => n.id === l.source)!,
        target: nodes.find((n) => n.id === l.target)!,
      })),
  }

  // DEBUG
  // const nodeIds = new Set(graphData.nodes.map(n => n.id))
  // console.log(nodeIds)

  const width = graph.offsetWidth
  const height = Math.max(graph.offsetHeight, 250)

  // we virtualize the simulation and use pixi to actually render it
  const simulation: Simulation<NodeData, LinkData> = forceSimulation<NodeData>(graphData.nodes)
    .force("charge", forceManyBody().strength(-100 * repelForce))
    .force("center", forceCenter().strength(centerForce))
    .force("link", forceLink(graphData.links).distance(linkDistance))
    .force("collide", forceCollide<NodeData>((n) => nodeRadius(n)).iterations(3))

  const radius = (Math.min(width, height) / 2) * 0.8
  if (enableRadial) simulation.force("radial", forceRadial(radius).strength(0.2))

  // precompute style prop strings as pixi doesn't support css variables
  const cssVars = [
    "--secondary",
    "--tertiary",
    "--gray",
    "--light",
    "--lightgray",
    "--dark",
    "--darkgray",
    "--bodyFont",
  ] as const
  const computedStyleMap = cssVars.reduce(
    (acc, key) => {
      acc[key] = getComputedStyle(document.documentElement).getPropertyValue(key)
      return acc
    },
    {} as Record<(typeof cssVars)[number], string>,
  )

  // calculate color
  const color = (d: NodeData) => {

    console.log(d.id)
    console.log(d)

    const special = SPECIAL_NODE_COLORS.get(String(d.id))
    if (special) return special

    const isCurrent = d.id === slug
    if (isCurrent) {
      return computedStyleMap["--secondary"]
    } else if (visited.has(d.id) || d.id.startsWith("tags/")) {
      return computedStyleMap["--tertiary"]
    } else {
      return computedStyleMap["--gray"]
    }
  }

  /*
  // DEBUG
  const sample = graphData.links
  .filter((l) => (l.source as any)?.id === "ext1" || (l.target as any)?.id === "ext1")
  .slice(0, 20)
  .map((l) => ({
    s: (l.source as any),
    t: (l.target as any),
  }))
  console.log("ext1 matching links sample", sample)
  */

  function nodeRadius(d: NodeData) {
    // console.log("graphData.links ", graphData.links.length)
    const numLinks = graphData.links.filter(
      (l) => l.source.id === d.id || l.target.id === d.id,
    ).length
    const radius = 2 + Math.sqrt(numLinks)
    // console.log("id", d.id, "radius", radius, "numlinks", numLinks)
    return radius
  }

  let hoveredNodeId: string | null = null
  let hoveredNeighbours: Set<string> = new Set()
  const linkRenderData: LinkRenderData[] = []
  const nodeRenderData: NodeRenderData[] = []
  function updateHoverInfo(newHoveredId: string | null) {
    hoveredNodeId = newHoveredId

    if (newHoveredId === null) {
      hoveredNeighbours = new Set()
      for (const n of nodeRenderData) {
        n.active = false
      }

      for (const l of linkRenderData) {
        l.active = false
      }
    } else {
      hoveredNeighbours = new Set()
      for (const l of linkRenderData) {
        const linkData = l.simulationData
        if (linkData.source.id === newHoveredId || linkData.target.id === newHoveredId) {
          hoveredNeighbours.add(linkData.source.id)
          hoveredNeighbours.add(linkData.target.id)
        }

        l.active = linkData.source.id === newHoveredId || linkData.target.id === newHoveredId
      }

      for (const n of nodeRenderData) {
        n.active = hoveredNeighbours.has(n.simulationData.id)
      }
    }
  }

  let dragStartTime = 0
  let dragging = false

  function renderLinks() {
    tweens.get("link")?.stop()
    const tweenGroup = new TweenGroup()

    for (const l of linkRenderData) {
      let alpha = 1

      // if we are hovering over a node, we want to highlight the immediate neighbours
      // with full alpha and the rest with default alpha
      if (hoveredNodeId) {
        alpha = l.active ? 1 : 0.2
      }

      l.color = l.active ? computedStyleMap["--gray"] : computedStyleMap["--lightgray"]
      tweenGroup.add(new Tweened<LinkRenderData>(l).to({ alpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("link", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderLabels() {
    tweens.get("label")?.stop()
    const tweenGroup = new TweenGroup()

    const defaultScale = 1 / scale
    const activeScale = defaultScale * 1.1
    for (const n of nodeRenderData) {
      const nodeId = n.simulationData.id

      if (hoveredNodeId === nodeId) {
        tweenGroup.add(
          new Tweened<Text>(n.label).to(
            {
              alpha: 1,
              scale: { x: activeScale, y: activeScale },
            },
            100,
          ),
        )
      } else {
        tweenGroup.add(
          new Tweened<Text>(n.label).to(
            {
              alpha: n.label.alpha,
              scale: { x: defaultScale, y: defaultScale },
            },
            100,
          ),
        )
      }
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("label", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderNodes() {
    tweens.get("hover")?.stop()

    const tweenGroup = new TweenGroup()
    for (const n of nodeRenderData) {
      let alpha = 1

      // if we are hovering over a node, we want to highlight the immediate neighbours
      if (hoveredNodeId !== null && focusOnHover) {
        alpha = n.active ? 1 : 0.2
      }

      tweenGroup.add(new Tweened<Graphics>(n.gfx, tweenGroup).to({ alpha }, 200))
    }

    tweenGroup.getAll().forEach((tw) => tw.start())
    tweens.set("hover", {
      update: tweenGroup.update.bind(tweenGroup),
      stop() {
        tweenGroup.getAll().forEach((tw) => tw.stop())
      },
    })
  }

  function renderPixiFromD3() {
    renderNodes()
    renderLinks()
    renderLabels()
  }

  tweens.forEach((tween) => tween.stop())
  tweens.clear()

  const app = new Application()
  await app.init({
    width,
    height,
    antialias: true,
    autoStart: false,
    autoDensity: true,
    backgroundAlpha: 0,
    preference: "webgpu",
    resolution: window.devicePixelRatio,
    eventMode: "static",
  })
  graph.appendChild(app.canvas)

  const stage = app.stage
  stage.interactive = false

  const labelsContainer = new Container<Text>({ zIndex: 3, isRenderGroup: true })
  const nodesContainer = new Container<Graphics>({ zIndex: 2, isRenderGroup: true })
  const linkContainer = new Container<Graphics>({ zIndex: 1, isRenderGroup: true })
  stage.addChild(nodesContainer, labelsContainer, linkContainer)

  for (const n of graphData.nodes) {
    const nodeId = n.id
    const isDark = document.documentElement.getAttribute("saved-theme") === "dark"
    // console.log("nodeId", nodeId)
    const customColor = isDark ? SPECIAL_NODE_COLORS.get(String(nodeId)) : undefined

    const label = new Text({
      interactive: false,
      eventMode: "none",
      text: n.text,
      alpha: 0,
      anchor: { x: 0.5, y: 1.2 },
      style: {
        fontSize: fontSize * 15,
        fill: customColor ?? computedStyleMap["--dark"],
        fontFamily: computedStyleMap["--bodyFont"],
      },
      resolution: window.devicePixelRatio * 4,
    })
    label.scale.set(1 / scale)

    let oldLabelOpacity = 0
    const isTagNode = nodeId.startsWith("tags/")
    const gfx = new Graphics({
      interactive: true,
      label: nodeId,
      eventMode: "static",
      hitArea: new Circle(0, 0, nodeRadius(n)),
      cursor: "pointer",
    })
      .circle(0, 0, nodeRadius(n))
      .fill({ color: isTagNode ? computedStyleMap["--light"] : color(n) })
      .on("pointerover", (e) => {
        updateHoverInfo(e.target.label)
        oldLabelOpacity = label.alpha
        if (!dragging) {
          renderPixiFromD3()
        }
      })
      .on("pointerleave", () => {
        updateHoverInfo(null)
        label.alpha = oldLabelOpacity
        if (!dragging) {
          renderPixiFromD3()
        }
      })

    if (isTagNode) {
      gfx.stroke({ width: 2, color: computedStyleMap["--tertiary"] })
    }

    nodesContainer.addChild(gfx)
    labelsContainer.addChild(label)

    const nodeRenderDatum: NodeRenderData = {
      simulationData: n,
      gfx,
      label,
      color: color(n),
      alpha: 1,
      active: false,
    }

    nodeRenderData.push(nodeRenderDatum)
  }

  for (const l of graphData.links) {
    const gfx = new Graphics({ interactive: false, eventMode: "none" })
    linkContainer.addChild(gfx)

    const linkRenderDatum: LinkRenderData = {
      simulationData: l,
      gfx,
      color: computedStyleMap["--lightgray"],
      alpha: 1,
      active: false,
    }

    linkRenderData.push(linkRenderDatum)
  }

  let currentTransform = zoomIdentity
  if (enableDrag) {
    select<HTMLCanvasElement, NodeData | undefined>(app.canvas).call(
      drag<HTMLCanvasElement, NodeData | undefined>()
        .container(() => app.canvas)
        .subject(() => graphData.nodes.find((n) => n.id === hoveredNodeId))
        .on("start", function dragstarted(event) {
          if (!event.active) simulation.alphaTarget(1).restart()
          event.subject.fx = event.subject.x
          event.subject.fy = event.subject.y
          event.subject.__initialDragPos = {
            x: event.subject.x,
            y: event.subject.y,
            fx: event.subject.fx,
            fy: event.subject.fy,
          }
          dragStartTime = Date.now()
          dragging = true
        })
        .on("drag", function dragged(event) {
          const initPos = event.subject.__initialDragPos
          event.subject.fx = initPos.x + (event.x - initPos.x) / currentTransform.k
          event.subject.fy = initPos.y + (event.y - initPos.y) / currentTransform.k
        })
        .on("end", function dragended(event) {
          if (!event.active) simulation.alphaTarget(0)
          event.subject.fx = null
          event.subject.fy = null
          dragging = false

          // if the time between mousedown and mouseup is short, we consider it a click
          if (Date.now() - dragStartTime < 250) {
            const node = graphData.nodes.find((n) => n.id === event.subject.id) as NodeData
            if (GRAPH_MODE_SL === VIRTUAL_MODE) {
              if (node.externalUrl) {
                window.open(node.externalUrl, "_blank", "noopener,noreferrer")
              }
            }
            else if (GRAPH_MODE_SL === DEFAULT_MODE) {
              const targ = resolveRelative(fullSlug, node.id)
              window.spaNavigate(new URL(targ, window.location.toString()))
            }
          }
        }),
    )
  } else {
    for (const node of nodeRenderData) {
      node.gfx.on("click", () => {
        if (GRAPH_MODE_SL === VIRTUAL_MODE) {
          const externalUrlv2 = node.simulationData.externalUrl
          if (externalUrlv2) {
            window.open(externalUrlv2, "_blank", "noopener,noreferrer")
          }
        }
        if (GRAPH_MODE_SL === DEFAULT_MODE) {
          const targ = resolveRelative(fullSlug, node.simulationData.id)
          window.spaNavigate(new URL(targ, window.location.toString()))
        }
      })
    }
  }

  let zoomBehaviour: any = null

  if (enableZoom) {
    zoomBehaviour = zoom<HTMLCanvasElement, NodeData>()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.25, 4])
      .on("zoom", ({ transform }) => {
        currentTransform = transform
        stage.scale.set(transform.k, transform.k)
        stage.position.set(transform.x, transform.y)

        // zoom adjusts opacity of labels too
        const scale = transform.k * opacityScale
        let scaleOpacity = Math.max((scale - 1) / 3.75, 0)
        const activeNodes = nodeRenderData.filter((n) => n.active).flatMap((n) => n.label)

        for (const label of labelsContainer.children) {
          if (!activeNodes.includes(label)) {
            label.alpha = scaleOpacity
          }
        }
      }),
      select<HTMLCanvasElement, NodeData>(app.canvas).call(zoomBehaviour)
  }

  function centerOnNode(nodeId: SimpleSlug, k = 1.2) {
    const node = graphData.nodes.find((n) => n.id === nodeId)
    if (!node || node.x == null || node.y == null) return

    // IMPORTANT: toi tu affiches en (x + width/2, y + height/2)
    const worldX = node.x + width / 2
    const worldY = node.y + height / 2

    // On veut: worldX * k + tx = width/2  => tx = width/2 - worldX*k
    const tx = width / 2 - worldX * k
    const ty = height / 2 - worldY * k

    const t = zoomIdentity.translate(tx, ty).scale(k)

    if (enableZoom && zoomBehaviour) {
      select(app.canvas).call(zoomBehaviour.transform, t)
    } else {
      // fallback si zoom désactivé
      currentTransform = t
      stage.scale.set(k, k)
      stage.position.set(tx, ty)
    }
  }

  let stopAnimation = false
  function animate(time: number) {
    if (stopAnimation) return
    for (const n of nodeRenderData) {
      const { x, y } = n.simulationData
      if (x == null || y == null) continue
      n.gfx.position.set(x + width / 2, y + height / 2)
      if (n.label) {
        n.label.position.set(x + width / 2, y + height / 2)
      }
    }

    for (const l of linkRenderData) {
      const linkData = l.simulationData
      l.gfx.clear()
      l.gfx.moveTo(linkData.source.x! + width / 2, linkData.source.y! + height / 2)
      l.gfx
        .lineTo(linkData.target.x! + width / 2, linkData.target.y! + height / 2)
        .stroke({ alpha: l.alpha, width: 1, color: l.color })
    }

    tweens.forEach((t) => t.update(time))
    app.renderer.render(stage)
    requestAnimationFrame(animate)
  }

  // Option: “slug” = page courante, ou "ext1", etc.
  const targetId = (slug as SimpleSlug) // ou slug
  console.log(slug)
  requestAnimationFrame(() => {
    simulation.tick(30)
    centerOnNode(targetId, 1.7)
  })

    // Expose a recenter method on the graph container (DOM element)
    ; (graph as any).__recenter = (k = 1.7, target: SimpleSlug = slug) => {
      simulation.tick(30)
      centerOnNode(target, k)
    }

  requestAnimationFrame(animate)
  return () => {
    stopAnimation = true
    delete (graph as any).__recenter
    app.destroy()
  }

}

let localGraphCleanups: (() => void)[] = []
let globalGraphCleanups: (() => void)[] = []

function cleanupLocalGraphs() {
  for (const cleanup of localGraphCleanups) {
    cleanup()
  }
  localGraphCleanups = []
}

function cleanupGlobalGraphs() {
  for (const cleanup of globalGraphCleanups) {
    cleanup()
  }
  globalGraphCleanups = []
}

document.addEventListener("nav", async (e: CustomEventMap["nav"]) => {
  const slug = e.detail.url
  addToVisited(simplifySlug(slug))

  async function renderLocalGraph() {
    cleanupLocalGraphs()
    const localGraphContainers = document.getElementsByClassName("graph-container")
    for (const container of localGraphContainers) {
      localGraphCleanups.push(await renderGraph(container as HTMLElement, slug))
    }
  }

  await renderLocalGraph()
  const handleThemeChange = () => {
    void renderLocalGraph()
  }

  document.addEventListener("themechange", handleThemeChange)
  window.addCleanup(() => {
    document.removeEventListener("themechange", handleThemeChange)
  })

  const containers = [...document.getElementsByClassName("global-graph-outer")] as HTMLElement[]
  async function renderGlobalGraph() {
    const slug = getFullSlug(window)
    for (const container of containers) {
      container.classList.add("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = "1"
      }

      const graphContainer = container.querySelector(".global-graph-container") as HTMLElement
      registerEscapeHandler(container, hideGlobalGraph)
      if (graphContainer) {
        globalGraphCleanups.push(await renderGraph(graphContainer, slug))
      }
    }
  }

  function hideGlobalGraph() {
    cleanupGlobalGraphs()
    for (const container of containers) {
      container.classList.remove("active")
      const sidebar = container.closest(".sidebar") as HTMLElement
      if (sidebar) {
        sidebar.style.zIndex = ""
      }
    }
  }

  async function shortcutHandler(e: HTMLElementEventMap["keydown"]) {
    if (e.key === "g" && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
      e.preventDefault()
      const anyGlobalGraphOpen = containers.some((container) =>
        container.classList.contains("active"),
      )
      anyGlobalGraphOpen ? hideGlobalGraph() : renderGlobalGraph()
    }
  }

  if (GRAPH_MODE_SL === DEFAULT_MODE) {
    const containerIcons = document.getElementsByClassName("global-graph-icon")
    Array.from(containerIcons).forEach((icon) => {
      icon.addEventListener("click", renderGlobalGraph)
      window.addCleanup(() => icon.removeEventListener("click", renderGlobalGraph))
    })
  }
  else if (GRAPH_MODE_SL === VIRTUAL_MODE) {
    const containerIcons = document.getElementsByClassName("global-graph-icon")
    function recenterLocalGraph() {
      // On cible le premier graph local
      const container = document.getElementsByClassName("graph-container")[0] as any
      if (!container) return

      if (typeof container.__recenter === "function") {
        container.__recenter(1.6) // k = 1.6, cible = slug courant par défaut
      }
    }

    Array.from(containerIcons).forEach((icon) => {
      const handler = (e: Event) => {
        e.preventDefault()
        e.stopPropagation()
        recenterLocalGraph()
      }

      icon.addEventListener("click", handler)
      window.addCleanup(() => icon.removeEventListener("click", handler))
    })
  }

  document.addEventListener("keydown", shortcutHandler)
  window.addCleanup(() => {
    document.removeEventListener("keydown", shortcutHandler)
    cleanupLocalGraphs()
    cleanupGlobalGraphs()
  })
})
