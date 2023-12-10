import { _decorator, Camera, CCBoolean, Component, EventKeyboard, input, Input, instantiate, KeyCode, Node, NodeEventType, Prefab, Size, size, UITransform, v3, Vec3, view } from 'cc';
import { ArrowCtrl } from './ArrowCtrl';
import { MazeRenderer } from './MazeRenderer';
import { Cell } from './maze';
const { ccclass, property } = _decorator;

@ccclass('GameCtrl')
export class GameCtrl extends Component {

    @property(CCBoolean)
    public isFollowPlayer: boolean = true;

    @property(Camera)
    Camera: Camera = null

    @property(MazeRenderer)
    MazeRenderer: MazeRenderer = null;

    @property(Node)
    heroNode: Node = null

    @property(Node)
    UIRoot: Node = null;

    @property(Prefab)
    ArrowPrefab: Prefab = null;

    private leftBtn: Node = null;
    private rightBtn: Node = null;
    private upBtn: Node = null;
    private downBtn: Node = null;

    private winSize = view.getVisibleSize();
    private targetPos: Vec3 = Vec3.ZERO;

    private mapWidth = 1800
    private mapHeight = 1800

    private heroNodeSize: Size = size()

    private path: Cell[] = [];
    private pathIndex: number = 0;

    start() {
        let handle = this.UIRoot.getChildByName("handle")
        this.leftBtn = handle.getChildByName("left")
        this.rightBtn = handle.getChildByName("right")
        this.upBtn = handle.getChildByName("up")
        this.downBtn = handle.getChildByName("down")

        this.heroNodeSize = this.heroNode.getComponent(UITransform).contentSize;

        this.addTouchEvent(this.leftBtn)
        this.addTouchEvent(this.rightBtn)
        this.addTouchEvent(this.upBtn)
        this.addTouchEvent(this.downBtn)

        input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
        input.on(Input.EventType.KEY_UP, this.onKeyUp, this);

        let arrowNode = instantiate(this.ArrowPrefab)
        this.UIRoot.addChild(arrowNode)
        let arrowCtrl = arrowNode.getComponent(ArrowCtrl);
        arrowCtrl.showArrow(4);

        this.scheduleOnce(() => {
            this.path = this.MazeRenderer.getPath()

            this.showPathArrow();
        }, 0.2)
    }

    showPathArrow() {
        let cell = this.path[this.pathIndex]
        if (!cell) {
            console.log('path is null')
            return
        }
        // cell.x
    }

    private addTouchEvent(node: Node) {

        node.on(NodeEventType.TOUCH_START, () => {
            if (node === this.leftBtn) {
                this.onClickLeft = true
            } else if (node === this.rightBtn) {
                this.onClickRight = true
            } else if (node === this.upBtn) {
                this.onClickUp = true
            } else {
                this.onClickDown = true
            }
        }, this)

        node.on(NodeEventType.TOUCH_END, () => {
            if (node === this.leftBtn) {
                this.onClickLeft = false
            } else if (node === this.rightBtn) {
                this.onClickRight = false
            } else if (node === this.upBtn) {
                this.onClickUp = false
            } else {
                this.onClickDown = false
            }
        }, this)
    }

    onClickLeft = false;
    onClickRight = false;
    onClickUp = false;
    onClickDown = false;

    onKeyDown(e: EventKeyboard) {
        let key = e.keyCode;
        if (key === KeyCode.KEY_A) {
            this.onClickLeft = true;
        } else if (key === KeyCode.KEY_D) {
            this.onClickRight = true;
        } else if (key === KeyCode.KEY_W) {
            this.onClickUp = true;
        } else if (key === KeyCode.KEY_S) {
            this.onClickDown = true;
        }
    }

    onKeyUp(e: EventKeyboard) {
        let key = e.keyCode;
        if (key === KeyCode.KEY_A) {
            this.onClickLeft = false;
        } else if (key === KeyCode.KEY_D) {
            this.onClickRight = false;
        } else if (key === KeyCode.KEY_W) {
            this.onClickUp = false;
        } else if (key === KeyCode.KEY_S) {
            this.onClickDown = false;
        }
    }

    speed = 300;
    protected update(dt: number): void {
        let pos = this.heroNode.getPosition()
        if (this.onClickLeft) {
            pos.x -= dt * this.speed;
        }
        if (this.onClickRight) {
            pos.x += dt * this.speed;
        }
        if (this.onClickUp) {
            pos.y += dt * this.speed;
        }
        if (this.onClickDown) {
            pos.y -= dt * this.speed;
        }

        if (pos.x > this.mapWidth / 2 - this.heroNodeSize.width / 2) {
            pos.x = this.mapWidth / 2 - this.heroNodeSize.width / 2
        }
        if (pos.x < -this.mapWidth / 2 + this.heroNodeSize.width / 2) {
            pos.x = -this.mapWidth / 2 + this.heroNodeSize.width / 2
        }
        if (pos.y < -this.mapHeight / 2 + this.heroNodeSize.height / 2) {
            pos.y = -this.mapHeight / 2 + this.heroNodeSize.height / 2
        }
        if (pos.y > this.mapHeight / 2 - this.heroNodeSize.height / 2) {
            pos.y = this.mapHeight / 2 - this.heroNodeSize.height / 2
        }

        this.heroNode.setPosition(pos)

        if (this.isFollowPlayer) {
            this.followPlayer(dt);
        }
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

