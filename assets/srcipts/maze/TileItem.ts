import { _decorator, Component, Prefab, Vec2, instantiate, Sprite, SpriteFrame } from "cc";
import { Tile } from "./MazeMapManager";

const { ccclass, property } = _decorator;

@ccclass
export default class TileItem extends Component {

    @property(SpriteFrame)
    spfRoad: SpriteFrame = null;

    @property(SpriteFrame)
    spfWall: SpriteFrame = null;

    @property(Sprite)
    itemSprite: Sprite = null; // 迷宫管理节点

    onLoad() {

    }

    init(data: Tile) {
        this.itemSprite.spriteFrame = data.isRoad ? this.spfRoad : this.spfWall;
    }
}
