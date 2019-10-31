import Arrow from "../assets/icons/chevron_right-24px.svg"
import Cross from "../assets/icons/highlight_off-24px.svg"

export const DEBUG_MODE = false
export const TITLE = "Pathfinding Visualization" 

export const NODE_BORDER_WIDTH = 1
export const MAX_WIDTH_FOR_LAYOUT_CHANGE = 700

export const ROWS_CONSTRAINT = 50
export const COLUMNS_CONSTRAINT = 50

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
const Image = img => ["Image", img]

export const BACKGROUNDS = {
    [STATES.WALKABLE]: Color("white"),
    [STATES.BLOCKED]: Color("#2c3e50"),
    [STATES.START]: Image(`url(${Arrow})`),
    [STATES.END]: Image(`url(${Cross})`),
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
