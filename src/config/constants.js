export const NODE_SIZE = 75

export const GRID_PADDING = 10

export const STATES = {
    WALKABLE: 0,
    BLOCKED: 1,
    START: 2,
    END: 3,
    PATH: 4
}

export const COLORS = {
    WALKABLE: "white",
    BLOCKED: "black",
    START: "blue",
    END: "green",
    PATH: "green",
    CURRENT: "yellow",
    OPEN: "cyan",
    CLOSED: "grey"
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
