import React from "react"
import {NODE_SIZE, STATES, COLORS} from "../config/constants.js"

const Node = ({
    state,
    onClick
}) => {
    let backgroundColor
    switch(state){
        case STATES.WALKABLE:
            backgroundColor = COLORS.WALKABLE
            break
        case STATES.BLOCKED:
            backgroundColor = COLORS.BLOCKED
            break
        case STATES.START:
            backgroundColor = COLORS.START
            break
        case STATES.END:
            backgroundColor = COLORS.END
            break
        case STATES.PATH:
            backgroundColor = COLORS.PATH
            break
        default:
            backgroundColor = COLORS.WALKABLE
    }
    return(
        <div
            className="node"
            style={{width: NODE_SIZE, height: NODE_SIZE, backgroundColor}}
            onClick={onClick}
        />
    )
}

export default Node
