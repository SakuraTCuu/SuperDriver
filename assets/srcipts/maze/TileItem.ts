import { _decorator, Component, Prefab, Vec2, instantiate, Sprite, SpriteFrame, Color, Node, Label } from "cc";
import { Tile } from "./MazeMapManager";

const { ccclass, property } = _decorator;

@ccclass
export default class TileItem extends Component {

    @property(Sprite)
    itemSprite: Sprite = null; // 迷宫管理节点

    onLoad() {

    }

    init(data: Tile) {
        this.itemSprite.color = data.isRoad ? Color.GRAY : Color.YELLOW;
    }

    setStart() {
        let node = new Node();
        let lab = node.addComponent(Label)
        lab.string = "起点"
        lab.color = Color.BLACK;
        this.node.addChild(node)
    }

    setEnd() {
        let node = new Node();
        let lab = node.addComponent(Label)
        lab.string = "终点"
        lab.color = Color.BLACK;
        this.node.addChild(node)
    }
}
