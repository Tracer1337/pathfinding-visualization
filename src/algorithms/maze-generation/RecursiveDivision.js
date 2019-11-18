const random = (min, max) => Math.floor(Math.random() * (max - min + 1) + min)

export default class RecursiveDivision{
    constructor(grid){
        this.grid = grid
    }

    fillBorder = () => {
        this.grid[0].fill(1)
        this.grid[this.grid.length-1].fill(1)
        this.grid.forEach(row => {
            row[0] = 1
            row[row.length-1] = 1
        })
    }

    getSubWallsWithHoles = (from, to, xWall, yWall) => {
        const walls = []
        // Determine which wall will not get a hole
        const wallWithoutHole = random(0, 3)
        // Generate all four sub walls
        for(let i = 0; i < 4; i+=2){
            const subYWall = []
            const subXWall = []
            if(i === 0){
                // Horizontal wall: left part
                for(let x = from[0]; x < xWall; x++){
                    subYWall.push([x, yWall])
                }
                // Vertical wall: top part
                for(let y = from[1]; y < yWall; y++){
                    subXWall.push([xWall, y])
                }
            }else{
                // Horizontal wall: right part
                for(let x = xWall+1; x <= to[0]; x++){
                    subYWall.push([x, yWall])
                }
                // Vertical wall: bottom part
                for(let y = yWall+1; y <= to[1]; y++){
                    subXWall.push([xWall, y])
                }
            }
            // Create a hole in three of the four walls
            if(wallWithoutHole !== i){
                subXWall[random(0, subXWall.length-1)] = null
            }
            if(wallWithoutHole !== i+1){
                subYWall[random(0, subYWall.length-1)] = null
            }
            walls.push(subYWall, subXWall)
        }
        return walls
    }

    divideChamber = ([from, to]) => {
        // Exit recursion when the chamber has either a width or a height of 1
        if(to[0] - from[0] <= 1 || to[1] - from[1] <= 1) return

       // Generate x value for the vertical wall and y value for the horizontal wall
       const xWall = random(from[0]+1, to[0]-1)
       const yWall = random(from[1]+1, to[1]-1)

       // Generate walls and insert 3 random holes
       const subWalls = this.getSubWallsWithHoles(from, to, xWall, yWall)

       // Fill walls
       subWalls.flat().forEach(cell => cell ? this.grid[cell[1]][cell[0]] = 1 : null)
       // Fill intersection of walls since it is not included in subWalls
       this.grid[yWall][xWall] = 1

       // Call divideChamber for all four new generated chambers
       this.divideChamber([[from[0]+1, from[1]+1], [xWall-1, yWall-1]])
       this.divideChamber([[xWall  +1, from[1]+1], [to[0]-1, yWall-1]])
       this.divideChamber([[from[0]+1, yWall  +1], [xWall-1, to[1]-1]])
       this.divideChamber([[xWall  +1, yWall  +1], [to[0]-1, to[1]-1]])
   }

    generateMaze = () => {
        // Fill the borders of the grid
        this.fillBorder()

        // Generate maze recursively
        const startChamber = [[1,1], [this.grid[0].length-2, this.grid.length-2]]
        this.divideChamber(startChamber)

        return this.grid
    }
}
