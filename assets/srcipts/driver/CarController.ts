// CarController.ts

import { _decorator, Component, Vec2, v2, tween, Vec3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class CarController extends Component {

    // 车道的 x 坐标值
    private lanePositions: number[] = [-250, 0, 250];

    // 当前车道索引
    private currentLaneIndex: number = 1;

    start() {
        // 初始化车辆位置
        this.node.setPosition(this.lanePositions[this.currentLaneIndex], 0);

        // 开始前进动画
        this.runMoveAnim();
    }

    update(deltaTime: number) {
        // 处理刹车逻辑
        //判断碰撞

    }

    private brakeAnim() {
        // 刹车逻辑
        // this.node.stopAllActions(); // 停止之前的移动动作
    }

    private runMoveAnim() {
        //前进
    }

    turnLeft() {
        // 左转逻辑
        if (this.currentLaneIndex > 0) {
            this.currentLaneIndex--;
            this.turnToCurrentLane();
        }
    }

    turnRight() {
        // 右转逻辑
        if (this.currentLaneIndex < this.lanePositions.length - 1) {
            this.currentLaneIndex++;
            this.turnToCurrentLane();
        }
    }

    private turnToCurrentLane() {
        // 使用 tween 实现车辆左右位移
        const targetX = this.lanePositions[this.currentLaneIndex];
        const duration = 0.5; // 根据需要调整

        console.log("targetX->", targetX)
        tween(this.node.position)
            .to(duration, new Vec3(targetX, this.node.position.y, 0), {                        // to 接口表示节点的绝对值
                onUpdate: (target: Vec3, ratio: number) => {                        // 实现 ITweenOption 的 onUpdate 回调，接受当前缓动的进度
                    this.node.position = target;                                 // 将缓动系统计算出的结果赋予 node 的位置        
                }
            })
            .start();
    }
}
