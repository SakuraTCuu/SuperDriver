import { _decorator, Component, Prefab, Node, instantiate, Sprite, SpriteFrame, Color, UITransform, EventKeyboard, KeyCode, NodeEventType, Input, input } from "cc";
import MazeMapManager, { Tile } from "./MazeMapManager";

const { ccclass, property } = _decorator;

export enum DirectionType {
    LEFT = 0,
    RIGHT = 1,
    UP = 2,
    DOWN = 3
}

@ccclass
export default class ViewCtrl extends Component {

    @property(Node)
    HeroNode: Node = null

    @property(Node)
    UIRoot: Node = null;

    @property(Prefab)
    ArrowPrefab: Prefab = null;

    @property(MazeMapManager)
    MazeManager: MazeMapManager = null;

    private leftBtn: Node = null;
    private rightBtn: Node = null;
    private upBtn: Node = null;
    private downBtn: Node = null;

    onLoad() {
        let handle = this.UIRoot.getChildByName("handle")
        this.leftBtn = handle.getChildByName("left")
        this.rightBtn = handle.getChildByName("right")
        this.upBtn = handle.getChildByName("up")
        this.downBtn = handle.getChildByName("down")

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);

        this.addTouchEvent(this.leftBtn)
        this.addTouchEvent(this.rightBtn)
        this.addTouchEvent(this.upBtn)
        this.addTouchEvent(this.downBtn)
    }

    private addTouchEvent(node: Node) {
        // node.on(NodeEventType.TOUCH_START, () => {
        //     if (node === this.leftBtn) {
        //         this.playHeroRun(DirectionType.LEFT)
        //     } else if (node === this.rightBtn) {
        //         this.playHeroRun(DirectionType.RIGHT)
        //     } else if (node === this.upBtn) {
        //         this.playHeroRun(DirectionType.UP)
        //     } else {
        //         this.playHeroRun(DirectionType.DOWN)
        //     }
        // }, this)

        node.on(NodeEventType.TOUCH_END, () => {
            if (node === this.leftBtn) {
                this.playHeroRun(DirectionType.LEFT)
            } else if (node === this.rightBtn) {
                this.playHeroRun(DirectionType.RIGHT)
            } else if (node === this.upBtn) {
                this.playHeroRun(DirectionType.UP)
            } else {
                this.playHeroRun(DirectionType.DOWN)
            }
        }, this)
    }

    onKeyDown(e: EventKeyboard) {
        let key = e.keyCode;
        if (key === KeyCode.KEY_A) {
            this.playHeroRun(DirectionType.LEFT)
        } else if (key === KeyCode.KEY_D) {
            this.playHeroRun(DirectionType.RIGHT)
        } else if (key === KeyCode.KEY_W) {
            this.playHeroRun(DirectionType.UP)
        } else if (key === KeyCode.KEY_S) {
            this.playHeroRun(DirectionType.DOWN)
        }
    }

    //点击图标, 开始移动
    private playHeroRun(direction) {
        this.MazeManager.playHeroRun(direction);
    }

}
