// ObstacleManager.ts

import { _decorator, Component, Prefab, instantiate, v2, v3 } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class ObstacleManager extends Component {

    @property(Prefab)
    obstaclePrefab: Prefab = null;

    update(deltaTime: number) {
        // 处理障碍物的生成和移动逻辑
        // 你可以根据难度等级生成不同类型的障碍物，这里只是一个简化的示例
        this.spawnObstacle();
    }

    spawnObstacle() {
        // 随机生成障碍物
        const obstacle = instantiate(this.obstaclePrefab);
        obstacle.parent = this.node;

        // 设置障碍物的初始位置，根据需要调整
        obstacle.setPosition(v3(this.getRandomXPosition() * 200, 300, 0));

        // 添加障碍物移动组件，例如使用 Action 或 update 方法进行移动
    }

    getRandomXPosition(): number {
        // 生成一个位于 [-1, 1) 范围内的随机数，然后缩放和偏移以生成 -200 到 200 之间的随机数
        return (Math.random() - 0.5) * 400;
    }


    handleCollision() {
        // 处理障碍物与车辆的碰撞检测
        // 你需要在这里添加逻辑来检测障碍物和车辆的碰撞
        // 如果发生碰撞，调用游戏结束的方法
    }
}
