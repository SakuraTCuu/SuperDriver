import { _decorator, Component, easing, Node, Tween, tween, TweenAction, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass
export class ArrowItem extends Component {

    private tweenRef: Tween<Node> = null;

    showArrow(rotate: number) {
        //设置角度
        this.node.angle = rotate;

        this.playAction()
    }

    public playAction() {
        if (this.tweenRef) {
            return
        }
        let tween1 = tween(this.node)
            // .to(0.8, { scale: v3(1.2, 1.2) }, { easing: easing.sineOut })
            // .to(0.8, { scale: v3(0.8, 0.8) }, { easing: easing.sineOut })
            .to(1, { scale: v3(1.1, 1.1) })
            .to(1, { scale: v3(0.8, 0.8) })
            .union();

        this.tweenRef = tween(this.node).repeatForever(tween1).start()
    }

    public hideArrow() {
        if (this.tweenRef) {
            this.tweenRef.stop()
            this.tweenRef = null;
        }
        this.node.destroy();
    }
}

