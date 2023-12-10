import { _decorator, Component, easing, Node, Tween, tween, TweenAction, v3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('ArrowCtrl')
export class ArrowCtrl extends Component {

    private tweenRef: Tween<Node> = null;

    start() {

    }

    init(rotate: number) {
        //设置角度
        this.node.angle = rotate;
    }

    update(dt: number) {

    }

    /**
     * 
     * @param time 
     */
    showArrow(time?: number) {
        time = time || 99999999;
        this.playAction()
        this.scheduleOnce(() => {
            this.stopAction()
            // this.node.active = false;
        }, time)
    }

    private playAction() {
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

    private stopAction() {
        if (this.tweenRef) {
            this.tweenRef.stop()
            this.tweenRef = null;
        }
    }

}

