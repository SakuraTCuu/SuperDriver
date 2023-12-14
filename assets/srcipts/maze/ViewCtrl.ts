import { _decorator, Component, Prefab, Node, instantiate, Sprite, SpriteFrame, Color, UITransform, EventKeyboard, KeyCode, NodeEventType, Input, input, Label, Vec2, Vec3, v3 } from "cc";
import MazeMapManager, { Tile } from "./MazeMapManager";
import TimeLab from "../View/TimeLab";
import { ArrowCtrl } from "../test/ArrowCtrl";
import { ArrowItem } from "./ArrowItem";
import { Dialog, DialogInfo } from "../View/Dialog";

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
    uiRoot: Node = null;

    @property(Label)
    scoreLab: Label = null;

    @property(TimeLab)
    timeLab: TimeLab = null;

    @property(Prefab)
    arrowPrefab: Node = null;

    @property(Prefab)
    confirmPrefab: Node = null;

    MazeManager: MazeMapManager = null;

    private leftBtn: Node = null;
    private rightBtn: Node = null;
    private upBtn: Node = null;
    private downBtn: Node = null;

    private isRunning: boolean = false;
    private curDirection: DirectionType = DirectionType.LEFT;
    private isShowArrow: boolean = false;
    private configData: any = { time: 3 }

    onLoad() {
        let handle = this.uiRoot.getChildByName("handle")
        this.leftBtn = handle.getChildByName("left")
        this.rightBtn = handle.getChildByName("right")
        this.upBtn = handle.getChildByName("up")
        this.downBtn = handle.getChildByName("down")

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        this.addTouchEvent(this.leftBtn)
        this.addTouchEvent(this.rightBtn)
        this.addTouchEvent(this.upBtn)
        this.addTouchEvent(this.downBtn)
    }

    init(ref: MazeMapManager) {
        this.MazeManager = ref;

        let info = this.MazeManager.getGameInfo()
        this.timeLab.initTime(info.time);
    }

    update(dt: number): void {
        if (!this.isRunning) {
            return;
        }
        this.playHeroRun(this.curDirection)
    }

    private addTouchEvent(node: Node) {
        node.on(NodeEventType.TOUCH_START, () => {
            if (node === this.leftBtn) {
                this.curDirection = DirectionType.LEFT;
            } else if (node === this.rightBtn) {
                this.curDirection = DirectionType.RIGHT;
            } else if (node === this.upBtn) {
                this.curDirection = DirectionType.UP;
            } else {
                this.curDirection = DirectionType.DOWN;
            }
            this.isRunning = true;
        }, this)

        node.on(NodeEventType.TOUCH_END, () => {
            this.isRunning = false;
        }, this)
        node.on(NodeEventType.TOUCH_CANCEL, () => {
            this.isRunning = false;
        }, this)
    }

    onKeyDown(e: EventKeyboard) {
        let key = e.keyCode;
        if (key === KeyCode.KEY_A) {
            this.curDirection = DirectionType.LEFT;
        } else if (key === KeyCode.KEY_D) {
            this.curDirection = DirectionType.RIGHT;
        } else if (key === KeyCode.KEY_W) {
            this.curDirection = DirectionType.UP;
        } else if (key === KeyCode.KEY_S) {
            this.curDirection = DirectionType.DOWN;
        }
        this.isRunning = true;
    }

    onKeyUp(e: EventKeyboard) {
        // let key = e.keyCode;
        // if (key === KeyCode.KEY_A) {
        //     this.curDirection = DirectionType.LEFT;
        // } else if (key === KeyCode.KEY_D) {
        //     this.curDirection = DirectionType.RIGHT;
        // } else if (key === KeyCode.KEY_W) {
        //     this.curDirection = DirectionType.UP;
        // } else if (key === KeyCode.KEY_S) {
        //     this.curDirection = DirectionType.DOWN;
        // }
        this.isRunning = false;
    }

    //点击图标, 开始移动
    private playHeroRun(direction: DirectionType) {
        this.MazeManager.playHeroRun(direction);
    }


    /**展示箭头 */
    public showArrow(pos: Vec3, angle: number) {
        if (this.isShowArrow) {
            return false;
        }
        this.isShowArrow = true;

        let arrowItem = instantiate(this.arrowPrefab)
        let arrowItemCtrl = arrowItem.getComponent(ArrowItem)

        //TODO: 计算角度
        arrowItemCtrl.showArrow(angle)

        this.scheduleOnce(() => {
            arrowItemCtrl.hideArrow()
            this.isShowArrow = false;
        }, this.configData.time)

        this.node.addChild(arrowItem)
        arrowItem.setWorldPosition(pos);

        return true;
    }

    public showConfirmPanel(info: DialogInfo, confirmCb: Function, cancelCb: Function) {
        let panel = instantiate(this.confirmPrefab)
        let dialog = panel.getComponent(Dialog)
        dialog.init(info, confirmCb, cancelCb)
        this.node.addChild(panel)
    }
}
