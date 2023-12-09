// ScoreManager.ts

import { _decorator, Component, log } from "cc";
import Config from "./Config";

const { ccclass, property } = _decorator;

@ccclass
export default class ScoreManager extends Component {
    private score: number = 0;

    updateScore(obstacleLevel: number) {
        // 更新得分逻辑
        this.score += Config.difficultyLevels[obstacleLevel - 1].score;

        // 在这里你可以根据其他游戏事件（例如成功躲避障碍物）增加得分

        // 更新UI显示，根据需要调整
        log(`当前得分：${this.score}`);
    }
}
