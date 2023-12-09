export class Cell {
    visited = false;
    top = true;
    right = true;
    bottom = true;
    left = true;
}

export function generateMaze(width: number, height: number): Cell[][] {
    console.log("generateMaze")
    let maze: Cell[][] = Array(height).fill(0).map(() => Array(width).fill(0).map(() => new Cell()));
    let stack: { x: number, y: number }[] = [];
    // let current = { x: Math.floor(Math.random() * width), y: Math.floor(Math.random() * height) };
    let current = { x: 0, y: 0 };

    function isInside(x: number, y: number) {
        return x >= 0 && y >= 0 && x < width && y < height;
    }

    function isVisited(x: number, y: number) {
        if (!isInside(x, y)) { //不在考虑范围内
            return true
        }
        return isInside(x, y) && maze[y][x].visited;
    }

    function checkNeighbors(x: number, y: number) {
        let neighbors = [];

        if (!isVisited(x, y - 1)) neighbors.push({ x: x, y: y - 1, dir: 'top' });
        if (!isVisited(x + 1, y)) neighbors.push({ x: x + 1, y: y, dir: 'right' });
        if (!isVisited(x, y + 1)) neighbors.push({ x: x, y: y + 1, dir: 'bottom' });
        if (!isVisited(x - 1, y)) neighbors.push({ x: x - 1, y: y, dir: 'left' });

        if (neighbors.length === 0) return null;

        return neighbors[Math.floor(Math.random() * neighbors.length)];
    }


    function removeWall(current: { x: number, y: number }, next: { x: number, y: number, dir: string }) {
        maze[current.y][current.x].visited = true;  // 添加这行代码

        if (next.dir === 'top') {
            maze[current.y][current.x].top = false;
            maze[next.y][next.x].bottom = false;
        } else if (next.dir === 'right') {
            maze[current.y][current.x].right = false;
            maze[next.y][next.x].left = false;
        } else if (next.dir === 'bottom') {
            maze[current.y][current.x].bottom = false;
            maze[next.y][next.x].top = false;
        } else if (next.dir === 'left') {
            maze[current.y][current.x].left = false;
            maze[next.y][next.x].right = false;
        }
    }

    while (current) {
        maze[current.y][current.x].visited = true;
        let next = checkNeighbors(current.x, current.y);
        if (next) {
            removeWall(current, next);
            stack.push(current);
            current = { x: next.x, y: next.y };
        } else if (stack.length > 0) {
            current = stack.pop();
        } else {
            current = null;
        }
    }

    return maze;
}
