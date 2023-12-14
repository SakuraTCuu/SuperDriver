import { _decorator, Component, instantiate, Prefab, TextAsset, Node, v3, tween, Vec3, Vec2, v2, UITransform, input, Input, view, EventKeyboard, KeyCode, Camera, game, Size, size } from "cc";
import Config from "./Config";
import TileItem from "./TileItem";
import { FogOfWar } from "./FogForWar";
import ViewCtrl, { DirectionType } from "./ViewCtrl";

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

    @property(ViewCtrl)
    viewCtrl: ViewCtrl = null;

    private level: number = 1;

    private tileWidth: number = 100;
    private tileHeight: number = 100;
    private moveSpeed: number = 200;
    private heroSize: Size = size();

    //地图数据
    private mapData: Array<Array<Tile>> = [];
    private targetPath: Array<Array<number>> = [];
    private errorPath: Array<Array<number>> = [];

    //移动的历史数据
    private historyPath: Array<Vec2> = [];
    //当前路径索引
    private pathIndex: number = 0;

    //起始点  结束点  x,y 为index
    private startPos = v2();
    private endPos = v2();
    // 当前点 具体坐标点
    private curPos = v2();

    private winSize = view.getVisibleSize();
    private mapWidth = 1800
    private mapHeight = 1800

    //节点移动临时对象
    private targetPos: Vec3 = Vec3.ZERO;

    private isGameEnd: boolean = false;
    private uiTrans: UITransform = null;

    start(): void {
        this.uiTrans = this.contentNode.getComponent(UITransform);
        this.heroSize = this.heroNode.getComponent(UITransform).contentSize;

        //初始化地图
        this.initMap();
        this.initView();
        this.viewCtrl.init(this)
    }

    initMap() {
        let data = Config.LevelData[this.level];
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
        this.errorPath = data.errorPath;
        this.startPos = v2(startX, startY);
        this.endPos = v2(endX, endY);

        this.curPos = v2(startX * this.tileWidth + this.tileWidth / 2, - startY * this.tileHeight - this.tileHeight / 2);

        let pos = this.uiTrans.convertToWorldSpaceAR(this.heroNode.getPosition())
        this.fogManager.initCircleView(v2(pos.x, pos.y))
    }

    initView() {
        //初始化ui界面相关
    }

    public playHeroRun(direction: DirectionType) {
        if (this.isGameEnd) {
            return;
        }
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
        let x = dir[idx][0] * this.moveSpeed * game.frameTime / 1000;
        let y = dir[idx][1] * this.moveSpeed * game.frameTime / 1000;

        //归一化 坐标转index
        let nextPos = v2(this.curPos.x + x, this.curPos.y + y)
        if (!this.canMove(nextPos)) {
            return;
        }

        //判断第几次显示 
        let { isError, errorPos, angle } = this.isErrorRoad(nextPos)
        if (isError) {
            errorPos = this.index2Pos(errorPos)
            console.log("showArrow", errorPos)
            let arrowPos = this.uiTrans.convertToWorldSpaceAR(v3(errorPos.x, errorPos.y))
            // 提示正确的箭头
            this.viewCtrl.showArrow(arrowPos, angle);
        }

        this.curPos = nextPos;
        this.heroNode.setPosition(v3(this.curPos.x, this.curPos.y, 0))

        //转为世界坐标
        let worldPos = this.uiTrans.convertToWorldSpaceAR(v3(nextPos.x, nextPos.y))
        this.fogManager.updatePath(worldPos)

        if (this.isRunTargetPoint(nextPos)) {
            //正确到达目的地
            this.gameOver();
        }
    }

    /**
     * 索引转坐标
     */
    private index2Pos(indexArr: Vec2) {
        return v2(indexArr.x * this.tileWidth + this.tileWidth / 2, - indexArr.y * this.tileHeight - this.tileHeight / 2);
    }
    /**
     * 坐标转索引
     */
    private pos2Index(pos: Vec2) {
        // this.curPos = v2(startX * this.tileWidth + this.tileWidth / 2, - startY * this.tileHeight - this.tileHeight / 2);
        // return v2(Math.floor((pos.x - this.tileWidth / 2) / this.tileWidth), Math.floor(-(pos.y + this.tileHeight / 2) / this.tileHeight))
        return v2(Math.floor(pos.x / this.tileWidth), Math.floor(-pos.y / this.tileHeight))
    }

    /**
     * 是否行走到终点
     */
    private isRunTargetPoint(pos: Vec2) {
        let point = this.pos2Index(pos)
        if (point.x === this.endPos.x && point.y === this.endPos.y) {
            return true;
        }
        return false;
    }

    private canMove(pos: Vec2) {
        //不只是判定位置, 还要判定范围
        //判断四个点是, 任一个点只要在障碍范围, 就不能行走
        let topLeft = v2(pos.x - this.heroSize.width / 2, pos.y + this.heroSize.height / 2)
        let topRight = v2(pos.x + this.heroSize.width / 2, pos.y + this.heroSize.height / 2)
        let bottomLeft = v2(pos.x - this.heroSize.width / 2, pos.y - this.heroSize.height / 2)
        let bottomRight = v2(pos.x + this.heroSize.width / 2, pos.y - this.heroSize.height / 2)

        let topLeftPos = this.pos2Index(topLeft)
        let topRightPos = this.pos2Index(topRight)
        let bottomLeftPos = this.pos2Index(bottomLeft)
        let bottomRightPos = this.pos2Index(bottomRight)

        if (!this.isInRoad(topLeftPos)) {
            return false;
        }
        if (!this.isInRoad(topRightPos)) {
            return false;
        }
        if (!this.isInRoad(bottomLeftPos)) {
            return false;
        }
        if (!this.isInRoad(bottomRightPos)) {
            return false;
        }

        return true;
    }

    private isInRoad(indexArr: Vec2) {
        let x = indexArr.x;
        let y = indexArr.y;
        if (this.mapData[y] && this.mapData[y][x] && this.mapData[y][x].isRoad) {
            return true;
        }
        return false;
    }

    //判断走岔路
    private isErrorRoad(pos: Vec2) {
        let index = this.pos2Index(pos)

        //深入到某个岔路点, 即为走错
        for (let i = 0; i < this.errorPath.length; i++) {
            let indexArr = this.errorPath[i]
            if (indexArr[0] === index.x && indexArr[1] === index.y) {
                return {
                    isError: true,
                    errorPos: v2(indexArr[2], indexArr[3]),
                    angle: indexArr[4]
                };
            }
        }
        return {
            isError: false,
            errorPos: null,
            angle: 0
        };
    }

    /**
     * 获取游戏信息
     */
    public getGameInfo() {
        return Config.LevelData[this.level]
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

    /**
     * 游戏结束
     */
    private gameOver() {
        this.isGameEnd = true;
        this.viewCtrl.showConfirmPanel({
            time: 10,
            desc: "恭喜通关,继续下一关?"
        }, () => {
            this.showNextLevel();
        }, () => {
            console.log("取消")
        })
    }

    private resetView() {
        //保存上一个历史移动数据
        this.historyPath = [];
        //当前路径索引
        this.pathIndex = 0;
        //起始点  结束点  x,y 为index
        this.startPos = v2();
        this.endPos = v2();
        // 当前点 具体坐标点
        this.curPos = v2();

        this.mapData = [];

        this.isGameEnd = false;

    }

    //展示下一关
    private showNextLevel() {
        this.resetView();
        this.level = this.level + 1;
        this.initMap();
        this.initView();
    }
}

