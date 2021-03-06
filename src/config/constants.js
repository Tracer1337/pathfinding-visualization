import SettingsProvider from "../utils/SettingsProvider.js"

import Arrow from "../assets/icons/chevron_right-24px.svg"
import Cross from "../assets/icons/highlight_off-24px.svg"

export const DEBUG_MODE = false
export const TITLE = "Pathfinding Visualization"

export const NODE_BORDER_WIDTH = 1
export const MAX_WIDTH_FOR_LAYOUT_CHANGE = 700
export const ANIMATION_OFFSET = SettingsProvider.settings.nodeSize.value*.25

export const ROWS_CONSTRAINT = 100
export const COLUMNS_CONSTRAINT = 100

export const STATES = {
    WALKABLE: 0,
    BLOCKED: 1,
    START: 2,
    END: 3,
    PATH: 4,
    CURRENT: 5,
    OPEN: 6,
    CLOSED: 7
}

const Color = c => ["Color", c]
const Image = (c, img) => ["Image", c, img]

export const BACKGROUNDS = {
    [STATES.WALKABLE]: Color("#ffffff"),
    [STATES.BLOCKED]: Color("#2c3e50"),
    [STATES.START]: Image("#2ecc71", Arrow),
    [STATES.END]: Image("#2ecc71", Cross),
    [STATES.PATH]: Color("#2ecc71"),
    [STATES.CURRENT]: Color("#f1c40f"),
    [STATES.OPEN]: Color("#1abc9c"),
    [STATES.CLOSED]: Color("#16a085")
}

export const CURSOR_POINTER_STATES = [
    STATES.START,
    STATES.END
]

export const Directions = [
    // Up, Down, Left, Right
    [
                  [0, -1],
        [-1,  0],          [1,  0],
                  [0,  1]
    ],
    // All Directions
    [
        [-1, -1], [0, -1], [1, -1],
        [-1,  0],          [1,  0],
        [-1,  1], [0,  1], [1,  1]
    ]
]

export const Heuristics = [
    // Manhattan Distance
    (currentNode, endNode) => Math.abs(currentNode.x-endNode.x)+Math.abs(currentNode.y-endNode.y),
    // Diagonal Distance
    (currentNode, endNode) => Math.max(Math.abs(currentNode.x-endNode.x),Math.abs(currentNode.y-endNode.y)),
    // Euclidean Distance
    (currentNode, endNode) => ((currentNode.x-endNode.x)**2+(currentNode.y-endNode.y)**2)**(1/2)
]
