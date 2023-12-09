import { _decorator, Component, Prefab, Vec2, instantiate } from "cc";

// GameManager.ts
const { ccclass, property } = _decorator;

@ccclass
export default class MazeManager extends Component {

    @property(Node)
    mazeManager: Node = null; // 迷宫管理节点

    @property(Prefab)
    arrowPrefab: Prefab = null; // 路牌预制体

    @property
    gameTime: number = 30; // 游戏时间

    @property
    signDuration: number = 5; // 路牌显示时间

    // 难度等级配置
    @property
    easyConfig: any = null;

    @property
    mediumConfig: any = null;

    @property
    hardConfig: any = null;

    private currentConfig: any = null;

    onLoad() {
        this.currentConfig = this.mediumConfig; // 默认中等难度
        this.schedule(this.updateGame, 1);
    }

    updateGame() {
        this.gameTime--;
        if (this.gameTime <= 0) {
            this.gameOver(false); // 游戏结束，未到达正确终点
        }
    }

    showArrowAt(position: Vec2) {
        const arrow = instantiate(this.arrowPrefab);
        arrow.position = position;
        this.mazeManager.addChild(arrow);
        this.scheduleOnce(() => {
            arrow.destroy();
        }, this.signDuration);
    }

    endGame(isWin: boolean) {
        // 处理游戏结束逻辑，显示UI，播放音效等
        if (isWin) {
            // 播放欢呼音效
        } else {
            // 播放NG音效
        }
        // 显示相应的UI，重置游戏状态
        // ...
    }

    setDifficulty(difficulty: string) {
        this.currentConfig = this.getConfigByDifficulty(difficulty);
        // 重新初始化游戏场景、玩家、迷宫等
        // ...
    }

    private getConfigByDifficulty(difficulty: string): any {
        switch (difficulty) {
            case "easy":
                return this.easyConfig;
            case "medium":
                return this.mediumConfig;
            case "hard":
                return this.hardConfig;
            default:
                return this.mediumConfig;
        }
    }
}
