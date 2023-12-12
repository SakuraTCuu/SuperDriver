import { _decorator, Component, instantiate, Prefab, TextAsset, Node, v3 } from "cc";
import Config from "./Config";
import TileItem from "./TileItem";

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

    // 在这里实现迷宫生成逻辑，可以使用 TiledMap 或其他方式
    @property(Prefab)
    itemPrefab: Prefab = null;

    @property(Node)
    contentNode: Node = null;

    @property(Node)
    heroNode: Node = null;

    @property(Node)
    endNode: Node = null;

    private level: number = 1;
    private tileWidth: number = 100;
    private tileHeight: number = 100;

    private targetPath: Array<Array<number>> = [];

    //二维数组
    private mapData: Array<Array<Tile>> = [];

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
                console.log("x=" + j + ",y=" + i, v3(j * this.tileWidth + this.tileWidth / 2, - i * this.tileHeight - this.tileHeight / 2))
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
        console.log(x, y)
        console.log("x=" + x + ",y=" + y, v3(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2))
        this.heroNode.setPosition(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2);
        x = data.end[0]
        y = data.end[1]
        this.endNode.setPosition(x * this.tileWidth + this.tileWidth / 2, - y * this.tileHeight - this.tileHeight / 2);

        this.endNode.setSiblingIndex(998)
        this.heroNode.setSiblingIndex(999)
        this.targetPath = data.path;
        
    }

    initView() {

    }
}

