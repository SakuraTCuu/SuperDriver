// GameManager.ts

import CarController from "./CarController";
import ObstacleManager from "./ObstacleManager";
import ScoreManager from "./ScoreManager";
import { _decorator, Component, input, Label, log, Node } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class GameManager extends Component {

    @property(CarController)
    carController: CarController = null;

    @property(ObstacleManager)
    obstacleManager: ObstacleManager = null;

    @property(ScoreManager)
    scoreManager: ScoreManager = null;

    @property(Node)
    uiNode: Node = null;

    private distanceToFinish: number = 10;
    private score: number = 0;
    private obstacleLevel: number = 1;

    private descLab: Label = null;
    private distanceLab: Label = null;
    private scoreLabel: Label = null;
    private directionBtn: Node = null;
    private handleBtn: Node = null;
    private leftBtn: Node = null;
    private rightBtn: Node = null;

    //是否刹车
    private isBrake: boolean = false;

    onLoad() {
        // 初始化游戏数据和场景
        this.distanceToFinish = 10;
        this.score = 0;
        this.obstacleLevel = 1;
    }

    start() {
        // 启动游戏主循环
        this.directionBtn = this.uiNode.getChildByName("direction_btn")

        this.leftBtn = this.directionBtn.getChildByName("left")
        this.rightBtn = this.directionBtn.getChildByName("right")

        this.handleBtn = this.uiNode.getChildByName("handle_btn")
        this.descLab = this.handleBtn.getChildByName("desc").getComponent(Label)
        this.distanceLab = this.uiNode.getChildByName("dist_lab").getComponent(Label)
        this.scoreLabel = this.uiNode.getChildByName("score_lab").getComponent(Label)

        this.handleBtn.on(Node.EventType.TOUCH_END, this.onHandleTouch, this)
        this.leftBtn.on(Node.EventType.TOUCH_END, this.onTurnLeft, this)
        this.rightBtn.on(Node.EventType.TOUCH_END, this.onTurnRight, this)
    }

    onHandleTouch() {
        this.isBrake = !this.isBrake;
        this.descLab.string = this.isBrake ? "前进" : "刹车"
    }

    onTurnLeft() {
        console.log("onTurnLeft")
        this.carController.turnLeft()
    }

    onTurnRight() {
        this.carController.turnRight()
    }

    update(dt) {
        // 游戏主循环逻辑
        this.distanceToFinish -= 0.1; // 假设每次循环距离减少0.1

        // 处理障碍物逻辑
        // this.obstacleManager.update(dt);

        // 处理得分逻辑
        // this.scoreManager.updateScore(this.obstacleLevel);

        // 更新距离显示
        // this.updatedistanceLab();

        // 检查游戏结束条件
        if (this.distanceToFinish <= 0) {
            this.gameOver();
        }
    }

    updatedistanceLab() {
        this.distanceLab.string = `距离终点：${this.distanceToFinish.toFixed(2)} 公里`;
    }

    gameOver() {
        // 处理游戏结束逻辑
        // this.unschedule(this.gameLoop); // 停止主循环

        // 显示得分等信息，并提供再试一次按钮
        // log(`游戏结束，得分：${this.score}`);
    }

    // 处理用户输入的方法可以放在这里，例如点击再试一次按钮时的回调函数
    onRetryButtonClicked() {
        // 重新初始化游戏数据
        this.distanceToFinish = 10;
        this.score = 0;
        this.obstacleLevel = 1;

        // 重新启动游戏主循环
        // this.schedule(this.gameLoop, 0.1);
    }
}
