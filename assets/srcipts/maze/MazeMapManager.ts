import { _decorator, Component, instantiate, Prefab, TextAsset, Node, v3, tween, Vec3, Vec2, v2, UITransform } from "cc";
import Config from "./Config";
import TileItem from "./TileItem";
import { FogOfWar } from "./FogForWar";

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

    private targetPath: Array<Array<number>> = [];

    //二维数组
    private mapData: Array<Array<Tile>> = [];

    private historyPath: Array<Vec2> = [];

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
                // console.log("x=" + j + ",y=" + i, v3(j * this.tileWidth + this.tileWidth / 2, - i * this.tileHeight - this.tileHeight / 2))
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

        let x = data.start[0]
        let y = data.start[1]
        // console.log(x, y)
        // console.log("x=" + x + ",y=" + y, v3(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2))
        this.heroNode.setPosition(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2);

        this.endNode.setSiblingIndex(998)
        this.heroNode.setSiblingIndex(999)
        this.targetPath = data.path;

        this.scheduleOnce(() => {
            let uiTrans = this.contentNode.getComponent(UITransform)
            let worldPos = uiTrans.convertToWorldSpaceAR( this.heroNode.getPosition())
            this.historyPath.push(v2(x, y))
            this.fogManager.updatePath(worldPos)
        })

        x = data.end[0]
        y = data.end[1]
        this.endNode.setPosition(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2);
    }

    initView() {
        let len = this.targetPath.length - 1;
        let idx = 0;
        this.schedule(() => {
            let pos = this.targetPath[idx]
            let x = pos[0] * this.tileWidth + this.tileWidth / 2
            let y = -  pos[1] * this.tileHeight - this.tileHeight / 2

            console.log("updatePat1h", pos)

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
 
}

