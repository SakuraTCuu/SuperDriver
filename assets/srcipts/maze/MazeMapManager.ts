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

    private level: number = 0;

    private tileWidth: number = 40;
    private tileHeight: number = 40;

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
            let rowList = line.split(",");

            let arr = [];
            for (let j = 0; j < rowList.length; j++) {
                let flag = rowList[j]

                let item = instantiate(this.itemPrefab);
                //初始化item
                item.setPosition(v3(i * 40, j * 40))
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
    }

    initView() {

    }
}

