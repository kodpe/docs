import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

const isGraphPage = (page: any) => {
  const slug = page.fileData.slug
  return slug.startsWith("Games/") && slug !== "Games/index"
}

const ExplorerFiltered = Component.Explorer({
  filterFn: (node: any) => {
    if (node.slugSegment === "tags") return false
    const slug = node.slug ?? node.path ?? node.filePath ?? ""
    return !(slug === "_ghosts" || String(slug).startsWith("_ghosts/"))
  },
})

export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    Component.InjectBodyClass({ className: "q-graph-only", slugPrefix: "Games/" }),
    Component.ConditionalRender({
      component: Component.GraphFit(undefined),
      condition: isGraphPage,
    }),
  ],
  footer: Component.Footer({
    links: {
      GitHub: "https://github.com/kodpe",
      "Discord Community": "https://discord.gg/7GZcQ9ZzMJ",
    },
  }),
}

// Layout normal (pages classiques)
const normalContentLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    Component.ContentMeta(),
    Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
        { Component: Component.ReaderMode() },
      ],
    }),
    ExplorerFiltered,
  ],
  right: [
    Component.Graph(),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// Layout graph-only : pour toutes les pages dans /games/
const graphOnlyLayout: PageLayout = {
  beforeBody: [
    Component.Graph({
      localGraph: {
        depth: 20,
        enableRadial: false,
        showTags: false,
        focusOnHover: false,
      },
    })
  ],
  left: [],
  right: [],
}

// Applique le bon layout selon la page
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: graphOnlyLayout.beforeBody![0],
      condition: isGraphPage,
    }),
    ...normalContentLayout.beforeBody!.map((c) =>
      Component.ConditionalRender({ component: c, condition: (p) => !isGraphPage(p) }),
    ),
  ],
  left: [
    ...normalContentLayout.left!.map((c) =>
      Component.ConditionalRender({ component: c, condition: (p) => !isGraphPage(p) }),
    ),
  ],
  right: [
    ...normalContentLayout.right!.map((c) =>
      Component.ConditionalRender({ component: c, condition: (p) => !isGraphPage(p) }),
    ),
  ],
}

export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        { Component: Component.Search(), grow: true },
        { Component: Component.Darkmode() },
      ],
    }),
    ExplorerFiltered,
  ],
  right: [],
}