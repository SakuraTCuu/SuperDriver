import { _decorator, Component, Node, Graphics, Color, v3, Camera, CCBoolean, view, Vec3, input, Input, EventKeyboard, KeyCode, Size, size, UITransform } from 'cc';
import { Maze, Cell } from './maze'; // 假设迷宫类在 'Maze.ts' 文件中
const { ccclass, property } = _decorator;

@ccclass('MazeRenderer')
export class MazeRenderer extends Component {

    @property
    mazeSize: number = 40; // 迷宫的大小（格子数）

    @property
    cellSize: number = 40; // 每个格子的大小（像素）

    @property(Node)
    heroNode: Node = null

    private path: Cell[] = [];

    start() {
        const maze = new Maze(this.mazeSize, this.cellSize);
        maze.generate();
        this.drawMaze(maze);

        this.path = maze.findPath();
        console.log("path", this.path)
        this.drawPath(this.path);

        this.heroNode.setPosition(v3(this.cellSize / 2, this.cellSize / 2))
    }

    public getPath() {
        return this.path
    }

    drawMaze(maze: Maze) {
        const graphics = this.getComponent(Graphics);
        if (!graphics) return;

        graphics.clear();

        for (let y = 0; y < maze.size; y++) {
            for (let x = 0; x < maze.size; x++) {
                const cell = maze.grid[y][x];
                const posX = x * maze.cellSize;
                const posY = y * maze.cellSize;

                // 绘制格子的墙壁
                graphics.strokeColor.fromHEX('#000000'); // 黑色
                if (cell.walls[0]) {
                    // 上
                    graphics.moveTo(posX, posY);
                    graphics.lineTo(posX + maze.cellSize, posY);
                    graphics.stroke();
                }
                if (cell.walls[1]) {
                    // 右
                    graphics.moveTo(posX + maze.cellSize, posY);
                    graphics.lineTo(posX + maze.cellSize, posY + maze.cellSize);
                    graphics.stroke();
                }
                if (cell.walls[2]) {
                    // 下
                    graphics.moveTo(posX, posY + maze.cellSize);
                    graphics.lineTo(posX + maze.cellSize, posY + maze.cellSize);
                    graphics.stroke();
                }
                if (cell.walls[3]) {
                    // 左
                    graphics.moveTo(posX, posY);
                    graphics.lineTo(posX, posY + maze.cellSize);
                    graphics.stroke();
                }
            }
        }
    }

    drawPath(path: Cell[]) {
        const graphics = this.getComponent(Graphics);
        if (!graphics) return;

        graphics.strokeColor = Color.RED; // 设置路径颜色为红色

        let i = path.length - 1
        this.schedule(() => {
            if (i < 0) {
                return
            }
            const cell = path[i];
            const nextCell = path[i - 1];
            const x = cell.x * this.cellSize + this.cellSize / 2;
            const y = cell.y * this.cellSize + this.cellSize / 2;
            const nextX = nextCell.x * this.cellSize + this.cellSize / 2;
            const nextY = nextCell.y * this.cellSize + this.cellSize / 2;

            // this.heroNode.setPosition(v3(x, y))
            graphics.moveTo(x, y);
            graphics.lineTo(nextX, nextY);
            graphics.stroke();
            i--
        }, 0.02, path.length - 2)

        // for (let i = path.length - 1; i > 0; i--) {
        //     const cell = path[i];
        //     const nextCell = path[i - 1];
        //     const x = cell.x * this.cellSize + this.cellSize / 2;
        //     const y = cell.y * this.cellSize + this.cellSize / 2;
        //     const nextX = nextCell.x * this.cellSize + this.cellSize / 2;
        //     const nextY = nextCell.y * this.cellSize + this.cellSize / 2;

        //     graphics.moveTo(x, y);
        //     graphics.lineTo(nextX, nextY);
        //     graphics.stroke();
        // }
    }
}
