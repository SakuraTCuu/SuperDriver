import { _decorator, Component, instantiate, Prefab, TextAsset, Node, v3, tween, Vec3, Vec2, v2, UITransform, input, Input, view, EventKeyboard, KeyCode, Camera } from "cc";
import Config from "./Config";
import TileItem from "./TileItem";
import { FogOfWar } from "./FogForWar";
import { DirectionType } from "./ViewCtrl";

// MazeMapManager.ts
const { ccclass, property } = _decorator;

export interface Tile {
    x: number;
    y: number;
    width: number;
    height: number;
    isRoad: boolean;
    text: string;
    item: Node;
}

@ccclass
export default class MazeMapManager extends Component {

    @property(Camera)
    Camera: Camera = null

    @property(Node)
    UIRoot: Node = null;

    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    contentNode: Node = null;

    @property(Node)
    heroNode: Node = null;

    @property(Node)
    endNode: Node = null;

    @property(FogOfWar)
    fogManager: FogOfWar = null;

    private level: number = 1;
    private tileWidth: number = 100;
    private tileHeight: number = 100;

    //地图数据
    private mapData: Array<Array<Tile>> = [];
    private targetPath: Array<Array<number>> = [];
    //移动的历史数据
    private historyPath: Array<Vec2> = [];
    //当前路径索引
    private pathIndex: number = 0;

    //起始点  结束点  当前点
    private startPos = v2();
    private endPos = v2();
    private curPos = v2();

    private is_running: boolean = false;

    private winSize = view.getVisibleSize();
    private mapWidth = 1800
    private mapHeight = 1800

    //节点移动临时对象
    private targetPos: Vec3 = Vec3.ZERO;


    start(): void {
        //初始化地图
        this.initMap();
        this.initView();
    }

    initMap() {
        let data = Config.TextData[this.level];
        let mapText = data.map;
        let lineList = mapText.split("\n");
        for (let i = 0; i < lineList.length; i++) {
            let line = lineList[i];
            if (!line) {
                continue;
            }
            let rowList = line.split(",");
            let arr = [];
            for (let j = 0; j < rowList.length; j++) {
                let flag = rowList[j]
                let item = instantiate(this.itemPrefab);
                //初始化item
                item.setPosition(v3(j * this.tileWidth + this.tileWidth / 2, - i * this.tileHeight - this.tileHeight / 2))
                this.contentNode.addChild(item);
                let itemCtrl = item.getComponent(TileItem)
                let tile: Tile = {
                    x: j,
                    y: i,
                    width: this.tileWidth,
                    height: this.tileHeight,
                    isRoad: flag === "1",
                    text: flag,
                    item: item
                }
                itemCtrl.init(tile)
                arr.push(tile);
            }
            this.mapData.push(arr);
        }

        let startX = data.start[0]
        let startY = data.start[1]
        this.heroNode.setPosition(startX * this.tileWidth + this.tileWidth / 2, - startY * this.tileHeight - this.tileHeight / 2);

        let endX = data.end[0]
        let endY = data.end[1]
        this.endNode.setPosition(endX * this.tileWidth + this.tileWidth / 2, - endY * this.tileHeight - this.tileHeight / 2);

        this.endNode.setSiblingIndex(998)
        this.heroNode.setSiblingIndex(999)

        this.targetPath = data.path;
        this.startPos = v2(startX, startY)
        this.endPos = v2(endX, endY);


        // this.scheduleOnce(() => {
        //     let uiTrans = this.contentNode.getComponent(UITransform)
        //     let worldPos = uiTrans.convertToWorldSpaceAR(this.heroNode.getPosition())
        //     this.historyPath.push(v2(x, y))
        //     this.fogManager.updatePath(worldPos)
        // })
    }

    initView() {
        let len = this.targetPath.length - 1;
        let idx = 0;
        this.schedule(() => {
            let pos = this.targetPath[idx]
            let x = pos[0] * this.tileWidth + this.tileWidth / 2
            let y = -  pos[1] * this.tileHeight - this.tileHeight / 2

            let uiTrans = this.contentNode.getComponent(UITransform)
            let worldPos = uiTrans.convertToWorldSpaceAR(v3(x, y))
            this.historyPath.push(v2(x, y))
            this.fogManager.updatePath(worldPos)

            // this.heroNode.setPosition(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2);
            tween(this.heroNode.position).to(0.5, new Vec3(x, y, 0), {
                onUpdate: (target: Vec3, ratio: number) => {
                    this.heroNode.position = target;
                }
            }).start()
            idx++;
        }, 0.5, len)
    }

    public playHeroRun(direction: DirectionType) {
        let dir = [[-1, 0], [1, 0], [0, 1], [0, -1]];
        let idx = 0;
        if (direction === DirectionType.LEFT) {
            idx = 0;
        } else if (direction === DirectionType.RIGHT) {
            idx = 1;
        } else if (direction === DirectionType.UP) {
            idx = 2;
        } else if (direction === DirectionType.DOWN) {
            idx = 3;
        }
        let nextPos = v2(this.curPos.x + dir[idx][0], this.curPos.y + dir[idx][1])
        if (!this.canMove(nextPos)) {
            return;
        }

        //移动到下一个位置
        let targetX = nextPos[0] * this.tileWidth + this.tileWidth / 2
        let targetY = -  nextPos[1] * this.tileHeight - this.tileHeight / 2
        this.heroMove(targetX, targetY)
    }

    private heroMove(x: number, y: number) {
        if (this.is_running) {
            return;
        }
        this.is_running = true;
        tween(this.heroNode.position).to(0.5, new Vec3(x, y, 0), {
            onUpdate: (target: Vec3, ratio: number) => {
                this.heroNode.position = target;
            }
        }).call(() => {
            this.is_running = false;
        }).start()
    }

    private canMove(pos: Vec2) {
        let x = pos.x;
        let y = pos.y;
        if (this.mapData[y] && this.mapData[y][x] && this.mapData[y][x].isRoad) {
            return true;
        }
        return false;
    }

    /**
    * 视图跟随玩家
    * @param dt
    */
    public followPlayer(dt: number) {
        //玩家当前的位置
        let pos = this.heroNode.position.clone();
        pos.z = 1;
        this.targetPos = pos;

        //摄像头不能超出范围
        if (this.targetPos.x > this.mapWidth / 2 - this.winSize.width / 2) {
            this.targetPos.x = this.mapWidth / 2 - this.winSize.width / 2;
        } else if (this.targetPos.x < this.winSize.width / 2 - this.mapWidth / 2) {
            this.targetPos.x = this.winSize.width / 2 - this.mapWidth / 2;
        }

        if (this.targetPos.y > this.mapHeight / 2 - this.winSize.height / 2) {
            this.targetPos.y = this.mapHeight / 2 - this.winSize.height / 2;
        } else if (this.targetPos.y < this.winSize.height / 2 - this.mapHeight / 2) {
            this.targetPos.y = this.winSize.height / 2 - this.mapHeight / 2;
        }

        //摄像机平滑跟随
        let cameraPos = this.Camera.node.position;
        cameraPos.lerp(this.targetPos, dt * 2.0);
        this.Camera.node.setPosition(this.targetPos);
        this.UIRoot.setPosition(this.targetPos);
    }

    /**
     *把视野定位到给定位置
     * @param px
     * @param py
     */
    public setViewToPoint(px: number, py: number): void {
        this.targetPos = v3(px, py, 0).subtract(v3(this.winSize.width / 2, this.winSize.height / 2, -1));

        if (this.targetPos.x > this.mapWidth - this.winSize.width) {
            this.targetPos.x = this.mapWidth - this.winSize.width;
        } else if (this.targetPos.x < 0) {
            this.targetPos.x = 0;
        }

        if (this.targetPos.y > this.mapHeight - this.winSize.height) {
            this.targetPos.y = this.mapHeight - this.winSize.height;
        } else if (this.targetPos.y < 0) {
            this.targetPos.y = 0;
        }

        this.Camera.node.position = this.targetPos;
    }

}

