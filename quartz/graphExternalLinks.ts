import GAMES_DB from "../quartz/data/gamesDB.json"
import GENRES_DB from "../quartz/data/genresDB.json"

/*
    Données des nodes fictifs (non basé sur notes obsidians)
*/

export type GraphVirtualGameNode = {
    url: string
    genres?: string[]
}
export const GRAPH_VIRTUAL_GAME_NODES = new Map<string, GraphVirtualGameNode>(Object.entries(GAMES_DB))

export type GraphVirtualGenreNode = {
    genres?: string[]
}
export const GRAPH_VIRTUAL_GENRE_NODES = new Map<string, GraphVirtualGenreNode>(Object.entries(GENRES_DB))

export const VIRTUAL_NODE_COLOR = {
    virt_game_selected: "#ffb300",
    virt_game_adjacent: "#fcba03",
    virt_game_distant: "#cf9d05",
    virt_genre_selected: "#aab7bb",
    virt_genre_adjacent: "#92999e",
    virt_genre_distant: "#757f81",
} as const