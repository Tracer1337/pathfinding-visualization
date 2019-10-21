export const DEBUG_MODE = false

export const GRID_PADDING = 10
export const NODE_BORDER_WIDTH = 1

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
    [STATES.BLOCKED]: "#2c3e50",
    [STATES.START]: "#3498db",
    [STATES.END]: "#e74c3c",
    [STATES.PATH]: "#2ecc71",
    [STATES.CURRENT]: "#f1c40f",
    [STATES.OPEN]: "#1abc9c",
    [STATES.CLOSED]: "#16a085"
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
