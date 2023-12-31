import { _decorator, Component, Node, Texture2D, Sprite, Vec3, Mask, Graphics, EventTouch, UITransform, v3, Vec2, Color, tween } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('FogOfWar')
export class FogOfWar extends Component {

    @property(Mask)
    Mask: Mask = null;

    @property(Node)
    CloudNode: Node = null;

    private graphics: Graphics = null;
    uiTrans: UITransform = null

    private historyPath: Array<Vec3> = [];

    private lineWidth: number = 80;

    private prePos: Vec3 = v3();

    onLoad() {
        this.graphics = this.Mask.getComponent(Graphics);
        this.uiTrans = this.Mask.getComponent(UITransform)
    }

    protected start(): void {

        // this.Mask.inverted = true;

        this.graphics.lineWidth = this.lineWidth;
        this.graphics.strokeColor = Color.GRAY;
    }

    /**
     * 生成一个初始空的区域
     */
    public initCircleView(pos: Vec2) {
        console.log("initCircleView", pos)
        this.resetView();
        let localPos = this.uiTrans.convertToNodeSpaceAR(v3(pos.x, pos.y))
        this.historyPath.push(localPos)
        if (!this.prePos) {
            this.prePos = localPos;
        }

        this.graphics.circle(localPos.x, localPos.y, this.lineWidth)
        this.graphics.fill()
        this.prePos = localPos;
    }

    public resetView() {
        console.log("clear")
        this.graphics.clear();

    }

    protected update(dt: number): void {
        // for (let i = 0; i < this.CloudNode.children.length; i++) {
        //     let node = this.CloudNode.children[i]
        //     let pos = node.getPosition()
        //     pos.x += dt * 100;
        //     if (pos.x > 720) {
        //         pos.x = -720;
        //     }
        //     node.setPosition(pos)
        // }
    }

    public updatePath(pos: Vec3) {
        this.uiTrans = this.Mask.node.getComponent(UITransform)
        let localPos = this.uiTrans.convertToNodeSpaceAR(v3(pos.x, pos.y))
        this.historyPath.push(localPos)
        if (!this.prePos) {
            this.prePos = localPos;
        }

        this.graphics.moveTo(this.prePos.x, this.prePos.y)
        this.graphics.lineTo(localPos.x, localPos.y)
        this.graphics.stroke()

        this.graphics.circle(localPos.x, localPos.y, this.lineWidth)
        this.graphics.fill()

        this.prePos = localPos;
    }
}
