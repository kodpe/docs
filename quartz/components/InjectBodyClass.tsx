import { QuartzComponentConstructor, QuartzComponentProps } from "./types"

interface Options {
  className: string
  slugPrefix?: string
}

const InjectBodyClass: QuartzComponentConstructor<Options> = (opts) => {
  const C = (_props: QuartzComponentProps) => null

  const className = opts.className
  const prefix = opts.slugPrefix ?? "Games/"

  C.afterDOMLoaded = `
(() => {
  const CLASS = ${JSON.stringify(className)};
  const PREFIX = ${JSON.stringify(prefix)};
  const INDEX_SLUG = "Games/index";

  function apply() {
    const slug = document.body?.getAttribute("data-slug") || "";

    // Cas spécial : la page du dossier -> on retire la classe
    if (slug === INDEX_SLUG) {
      document.body.classList.remove(CLASS);
      return;
    }

    const isNoteInsideFolder =
      slug.startsWith(PREFIX) && slug !== PREFIX.slice(0, -1);

    document.body.classList.toggle(CLASS, isNoteInsideFolder);
  }

  apply();
  document.addEventListener("nav", apply);
})();
`

  return C
}

export default InjectBodyClass
