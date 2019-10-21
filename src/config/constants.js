export const DEBUG_MODE = false

export const GRID_PADDING = 10

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

export const COLORS = {
    [STATES.WALKABLE]: "white",
    [STATES.BLOCKED]: "black",
    [STATES.START]: "blue",
    [STATES.END]: "green",
    [STATES.PATH]: "green",
    [STATES.CURRENT]: "yellow",
    [STATES.OPEN]: "cyan",
    [STATES.CLOSED]: "grey"
}

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
