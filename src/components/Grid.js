import React, {useRef, useState} from "react"

import Node from "./Node.js"

export default ({
    rows,
    columns
}) => {
    const gridRef = useRef()
    const [grid, setGrid] = useState(Array(rows).fill(0).map(() => Array(columns).fill(0)))

    return(
        <div className="grid">
            {grid.flat().map((node, i) => <Node state={node} key={i}/>)}
        </div>
    )
}
