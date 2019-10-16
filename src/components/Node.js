import React from "react"
import {NODE_SIZE, STATES, COLORS} from "../config/constants.js"

const Node = ({
    state,
    onMouseEnter,
    onMouseDown
}) => {
    let backgroundColor
    switch(state){
        case STATES.WALKABLE:
            backgroundColor = COLORS.WALKABLE
            break
        case STATES.BLOCKED:
            backgroundColor = COLORS.BLOCKED
            break
        default:
            backgroundColor = COLORS.WALKABLE
    }
    return(
        <div
            className="node"
            style={{width: NODE_SIZE, height: NODE_SIZE, backgroundColor}}
            onMouseEnter={onMouseEnter}
            onMouseDown={onMouseDown}
        />
    )
}

export default Node
