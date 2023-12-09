// BgController.ts

import { _decorator, Component, Vec2, v2, tween, Vec3, Node, v3, CCInteger } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class BgController extends Component {

    @property(CCInteger)
    speed: number = 200; // 初始速度，根据需要调整

    @property(Node)
    root: Node = null

    @property([Node])
    bgNodeList: Node[] = []

    private isBrake: boolean = false

    private height: number = 1280

    start() {
        // 开始前进动画
    }

    updateState(state) {
        this.isBrake = state;
    }

    update(deltaTime: number) {
        if (this.isBrake) {
            return;
        }
        // 处理刹车逻辑
        //判断碰撞

        for (let i = 0; i < this.bgNodeList.length; i++) {
            let item = this.bgNodeList[i]

            let pos = item.getPosition();
            pos.y -= deltaTime * this.speed;
            item.setPosition(pos)

            if (pos.y <= - this.height) {
                console.log("pos->", i)
                item.setPosition(v3(0, this.height * 2))
            }
        }
    }

}
