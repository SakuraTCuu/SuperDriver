import { Component, Label, _decorator } from "cc";

const { ccclass, property } = _decorator;

@ccclass
export default class TimeLab extends Component {

    @property(Label)
    TimeLabel: Label = null;

    private time: number = 2

    private running: boolean = false;

    protected start(): void {
        this.running = true;
    }
    
    /**
     * 初始化倒计时时间
     */
    initTime(time: number) {
        this.time = time;
    }

    pause() {
        this.running = false;
    }

    resume() {
        this.running = true;
    }

    reset() {
        this.running = false;
    }
    /**
     * 重置时间
     */
    resetTime(time: number) {
        this.time = time;
    }

    update(dt: number): void {
        if (!this.running) {
            return;
        }

        this.time -= dt;
        this.updateTime();
        if (this.time > 0) {
            return;
        }
        this.reset();

        console.log("事件出去")
        //send 事件出去
        //dispatch
    }

    private updateTime() {
        if (this.time < 0) {
            this.time = 0;
        }
        this.TimeLabel.string = this.formatTime(Math.floor(this.time))
    }

    private formatTime(seconds: number): string {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return this.pad(minutes) + ':' + this.pad(remainingSeconds);
    }

    private pad(num: number): string {
        return num < 10 ? '0' + num : num.toString();
    }
}