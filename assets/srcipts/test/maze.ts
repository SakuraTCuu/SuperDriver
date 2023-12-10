export type Cell = {
    x: number;
    y: number;
    walls: boolean[];
    visited: boolean;
};

export class Maze {
    grid: Cell[][];
    stack: Cell[];
    size: number;
    cellSize: number;
    startPos: number[];

    constructor(size: number, cellSize: number) {
        this.size = size;
        this.cellSize = cellSize;
        this.grid = [];
        this.stack = [];
        this.initGrid();
    }

    initGrid() {
        for (let y = 0; y < this.size; y++) {
            let row: Cell[] = [];
            for (let x = 0; x < this.size; x++) {
                row.push({
                    x,
                    y,
                    walls: [true, true, true, true], // top, right, bottom, left
                    visited: false,
                });
            }
            this.grid.push(row);
        }
    }

    getCell(x: number, y: number): Cell | undefined {
        if (x >= 0 && y >= 0 && x < this.size && y < this.size) {
            return this.grid[y][x];
        }
        return undefined;
    }

    getUnvisitedNeighbors(cell: Cell): Cell[] {
        let neighbors: Cell[] = [];
        let directions = [
            { x: 0, y: -1 }, // top
            { x: 1, y: 0 },  // right
            { x: 0, y: 1 },  // bottom
            { x: -1, y: 0 }, // left
        ];

        for (let i = 0; i < directions.length; i++) {
            let nx = cell.x + directions[i].x;
            let ny = cell.y + directions[i].y;
            let neighbor = this.getCell(nx, ny);
            if (neighbor && !neighbor.visited) {
                neighbors.push(neighbor);
            }
        }

        return neighbors;
    }

    removeWalls(current: Cell, next: Cell) {
        let dx = current.x - next.x;
        let dy = current.y - next.y;

        if (dx === 1) {
            current.walls[3] = false;
            next.walls[1] = false;
        } else if (dx === -1) {
            current.walls[1] = false;
            next.walls[3] = false;
        }

        if (dy === 1) {
            current.walls[0] = false;
            next.walls[2] = false;
        } else if (dy === -1) {
            current.walls[2] = false;
            next.walls[0] = false;
        }
    }

    generate() {
        let startX = Math.floor(this.size / 2)
        this.startPos = [0, startX]
        // let current = this.grid[0][0];
        let current = this.grid[0][startX];
        current.visited = true;
        this.stack.push(current);

        while (this.stack.length > 0) {
            current = this.stack.pop()!;
            let neighbors = this.getUnvisitedNeighbors(current);

            if (neighbors.length > 0) {
                this.stack.push(current);
                let next = neighbors[Math.floor(Math.random() * neighbors.length)];
                next.visited = true;
                this.removeWalls(current, next);
                this.stack.push(next);
            }
        }
    }

    // 新增方法：重置迷宫中所有格子的 visited 属性
    resetVisited() {
        for (let y = 0; y < this.size; y++) {
            for (let x = 0; x < this.size; x++) {
                this.grid[y][x].visited = false;
            }
        }
    }

    // 新增方法：找到从起点到终点的路径
    findPath() {
        this.resetVisited(); // 重置所有格子的 visited 属性
        let path: Cell[] = [];
        let startY = this.startPos[0]
        let startX = this.startPos[1]
        let current = this.grid[startY][startX]; // 假设起点是左上角
        let end = this.grid[this.size - 1][this.size - 1]; // 假设终点是右下角
        this.solve(current, path, end);
        return path;
    }

    // 修改后的 solve 方法
    // solve(cell: Cell, path: Cell[], end: Cell): boolean {
    //   if (cell === end) {
    //     path.push(cell);
    //     return true;
    //   }

    //   cell.visited = true;
    //   let neighbors = this.getUnvisitedNeighbors(cell);

    //   for (let neighbor of neighbors) {
    //     if (!cell.visited && !neighbor.walls[0] && cell.y > neighbor.y) { // 上
    //       if (this.solve(neighbor, path, end)) {
    //         path.push(cell);
    //         return true;
    //       }
    //     } else if (!cell.visited && !neighbor.walls[1] && cell.x < neighbor.x) { // 右
    //       if (this.solve(neighbor, path, end)) {
    //         path.push(cell);
    //         return true;
    //       }
    //     } else if (!cell.visited && !neighbor.walls[2] && cell.y < neighbor.y) { // 下
    //       if (this.solve(neighbor, path, end)) {
    //         path.push(cell);
    //         return true;
    //       }
    //     } else if (!cell.visited && !neighbor.walls[3] && cell.x > neighbor.x) { // 左
    //       if (this.solve(neighbor, path, end)) {
    //         path.push(cell);
    //         return true;
    //       }
    //     }
    //   }

    //   // 回溯时取消当前格子的访问标记
    //   cell.visited = false;
    //   return false;
    // }

    solve(cell: Cell, path: Cell[], end: Cell): boolean {
        if (cell === end) {
            path.push(cell);
            return true;
        }

        cell.visited = true;
        let neighbors = this.getUnvisitedNeighbors(cell);

        for (let i = 0; i < neighbors.length; i++) {
            let neighbor = neighbors[i];
            if (!neighbor.visited) {
                // 检查当前格子和邻居格子之间是否有墙壁
                let dx = cell.x - neighbor.x;
                let dy = cell.y - neighbor.y;

                if (dx === 1 && !cell.walls[3]) { // 左
                    if (this.solve(neighbor, path, end)) {
                        path.push(cell);
                        return true;
                    }
                } else if (dx === -1 && !cell.walls[1]) { // 右
                    if (this.solve(neighbor, path, end)) {
                        path.push(cell);
                        return true;
                    }
                }
                if (dy === 1 && !cell.walls[0]) { // 上
                    if (this.solve(neighbor, path, end)) {
                        path.push(cell);
                        return true;
                    }
                } else if (dy === -1 && !cell.walls[2]) { // 下
                    if (this.solve(neighbor, path, end)) {
                        path.push(cell);
                        return true;
                    }
                }
            }
        }

        // 如果没有找到通路，返回 false 并将当前格子标记为未访问
        cell.visited = false;
        return false;
    }
}

// 使用示例
// let maze = new Maze(40, 40);
// maze.generate();
// 在这里调用绘制迷宫的方法
