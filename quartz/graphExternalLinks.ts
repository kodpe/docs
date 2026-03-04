export const GRAPH_EXTERNAL_LINKS = new Map<string, string>([
    ["_ghosts/GamesDB/Frostpunk", "https://en.wikipedia.org/wiki/Frostpunk"],
    ["_ghosts/GamesDB/RimWorld", "https://en.wikipedia.org/wiki/RimWorld"],
    ["_ghosts/GamesDB/PlanetBase", "https://en.wikipedia.org/wiki/Planetbase"],
    ["_ghosts/GamesDB/Don't-Starve", "https://en.wikipedia.org/wiki/Don%27t_Starve"],
    ["_ghosts/GamesDB/The-Survivalists", "https://thesurvivalists.fandom.com/wiki/The_Survivalists"],
    ["_ghosts/GamesDB/GTA", "https://en.wikipedia.org/wiki/Grand_Theft_Auto"],
    ["_ghosts/GamesDB/Minecraft", "https://en.wikipedia.org/wiki/Minecraft"],
    ["_ghosts/GamesDB/Tropico", "https://en.wikipedia.org/wiki/Tropico_(video_game)"],
    ["_ghosts/GamesDB/Factorio", "https://en.wikipedia.org/wiki/Factorio"],
    ["_ghosts/GamesDB/Resident-Evil", "https://en.wikipedia.org/wiki/Resident_Evil"],
    ["_ghosts/GamesDB/Red-Dead-Redemption", "https://en.wikipedia.org/wiki/Red_Dead_Redemption"],
    ["_ghosts/GamesDB/Outlast", "https://en.wikipedia.org/wiki/Outlast"],
    ["_ghosts/GamesDB/Valheim", "https://en.wikipedia.org/wiki/Valheim"],
    ["_ghosts/GamesDB/Roblox", "https://en.wikipedia.org/wiki/Roblox"],
    ["_ghosts/GamesDB/Raft", "https://en.wikipedia.org/wiki/Raft_(video_game)"],
])

// données des nodes fictifs (on ne se base plus sur des notes obsidians)
export type GraphVirtualGameNode = {
    url: string
    genres?: string[]
}
export const GRAPH_VIRTUAL_GAME_NODES = new Map<string, GraphVirtualGameNode>([
    ["Frostpunk", { genres: ["Survival"], url: "https://en.wikipedia.org/wiki/Frostpunk" }],
    ["Don't Starve", { genres: ["Survival"], url: "https://en.wikipedia.org/wiki/Don%27t_Starve" }],
    ["GTA", { genres: ["Action"], url: "https://en.wikipedia.org/wiki/Grand_Theft_Auto" }],
    ["Raft", { genres: ["Survival", "Sandbox"], url: "https://en.wikipedia.org/wiki/Raft_(video_game)" }],
    ["Minecraft", { genres: ["Sandbox", "Survival"], url: "https://en.wikipedia.org/wiki/Minecraft" }],
] as const)

export type GraphVirtualGenreNode = {
    genres?: string[]
}
export const GRAPH_VIRTUAL_GENRE_NODES = new Map<string, GraphVirtualGenreNode>([
    ["Survival", { genres: ["Action", "Simulation"] }],
    ["Action", { genres: ["Survival"] }],
    ["Simulation", { genres: ["Survival"] }],
    ["Sandbox", { genres: [] }],
] as const)