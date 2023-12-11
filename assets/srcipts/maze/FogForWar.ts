import { _decorator, Component, Node, Texture2D, Sprite, Vec3, Mask, Graphics, EventTouch, UITransform, v3, Vec2, Color } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FogOfWar')
export class FogOfWar extends Component {

    @property(Node)
    player: Node = null;

    @property(Mask)
    Mask: Mask = null;

    @property(Node)
    ContentNode: Node = null;

    @property(Sprite)
    fogSprite: Sprite = null;

    private graphics: Graphics = null;
    uiTrans: UITransform = null

    onLoad() {
    }

    protected start(): void {
        // @ts-ignore
        this.graphics = this.Mask.node.getComponent(Graphics);
        // this.Mask.inverted = true;

        this.graphics.lineWidth = 20;
        this.graphics.strokeColor = Color.GRAY;

        this.uiTrans = this.Mask.node.parent.getComponent(UITransform)

        this.ContentNode.on(Node.EventType.TOUCH_START, this.onTouchStart, this)
        this.ContentNode.on(Node.EventType.TOUCH_MOVE, this.onTouchMove, this)
        this.ContentNode.on(Node.EventType.TOUCH_END, this.onTouchEnd, this)
    }

    prePos: Vec3
    onTouchStart(event: EventTouch) {
        let pos = event.getUILocation()
        let localPos = this.uiTrans.convertToNodeSpaceAR(v3(pos.x, pos.y))
        this.prePos = localPos;
        // this.graphics.moveTo(localPos.x, localPos.y)
        // this.graphics.lineTo(localPos.x, localPos.y)

        // this.graphics.stroke()
    }

    onTouchMove(event: EventTouch) {
        let pos = event.getUILocation()
        let localPos = this.uiTrans.convertToNodeSpaceAR(v3(pos.x, pos.y))

        this.graphics.moveTo(this.prePos.x, this.prePos.y)
        // this.graphics.moveTo(localPos.x, localPos.y)
        this.graphics.lineTo(localPos.x, localPos.y)

        this.graphics.stroke()

        this.prePos = localPos;
    }

    onTouchEnd(event: EventTouch) {
        let pos = event.getUILocation()
        let localPos = this.uiTrans.convertToNodeSpaceAR(v3(pos.x, pos.y))

        this.graphics.moveTo(this.prePos.x, this.prePos.y)
        this.graphics.lineTo(localPos.x, localPos.y)

        this.graphics.stroke()
    }


}
