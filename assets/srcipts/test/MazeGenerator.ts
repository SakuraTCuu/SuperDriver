import { _decorator, Component, Node, Prefab, instantiate, UITransform, Sprite, Color } from 'cc';
import { Cell, generateMaze } from './Test';
const { ccclass, property } = _decorator;

@ccclass
export class MazeGenerator extends Component {

    @property(Prefab)
    wallPrefab: Prefab = null;

    protected onLoad(): void {
        console.log('onload')
    }

    start() {
        let maze = generateMaze(3, 3);
        console.log("222", maze)
        this.drawMaze(maze);
    }

    drawMaze(maze: Cell[][]) {
        let parent = this.node;

        for (let y = 0; y < maze.length; y++) {
            for (let x = 0; x < maze[y].length; x++) {

                let cell = maze[y][x];
                console.log(cell)
                if (cell.top) this.createWall(parent, x, y, 0);
                if (cell.right) this.createWall(parent, x, y, 90);
                if (cell.bottom) this.createWall(parent, x, y, 180);
                if (cell.left) this.createWall(parent, x, y, 270);
            }
        }
    }

    createWall(parent: Node, x: number, y: number, rotation: number) {
        let wall = instantiate(this.wallPrefab);
        // wall.setPosition(x * 40, y * 40, 0);
        let offset = 17.5
        let width = 40
        let height = 40
        if (rotation === 0) {
            wall.setPosition(x * width, y * height + offset, 0);
        } else if (rotation === 90) {
            wall.setPosition(x * width + offset, y * height, 0);
        } else if (rotation === 180) {
            wall.setPosition(x * width, y * height - offset, 0);
        } else if (rotation === 270) {
            wall.setPosition(x * width - offset, y * height, 0);
        }
        wall.angle = rotation
        parent.addChild(wall);

        if (x == 0 && y == 0) {
            wall.getComponent(Sprite).color = Color.RED
        }
    }
}
