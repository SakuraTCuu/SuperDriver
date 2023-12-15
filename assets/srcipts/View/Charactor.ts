import { _decorator, Component } from "cc";
import MovieClip from "./MovieClip";

const { ccclass, property } = _decorator;

export enum CharactorState {
    stand = 0,
    run = 1,
    sitdown = 2,
    sitdown_run = 3,
}

/**
 * 场景角色 
 * 
 */

@ccclass
export default class Charactor extends Component {

    private _movieClip: MovieClip = null;

    public get movieClip(): MovieClip {
        if (!this._movieClip) {
            this._movieClip = this.getComponentInChildren(MovieClip);
        }
        return this._movieClip;
    }


    private _direction: number = 0;

    public get direction(): number {
        return this._direction;
    }

    public set direction(value: number) {
        this._direction = value;

        if (value > 4) {
            this.movieClip.rowIndex = 4 - value % 4;
            this.movieClip.node.setScale(1, -1, 1);
        } else {
            this.movieClip.rowIndex = value;
            // this.movieClip.node.scaleX = 1;
            this.movieClip.node.setScale(1, 1, 1);
        }
    }

    private _state: CharactorState = 0;

    public get state(): CharactorState {
        return this._state;
    }

    public set state(value: CharactorState) {
        this._state = value;

        switch (this._state) {
            case CharactorState.stand:
                this.movieClip.begin = 0;
                this.movieClip.end = 6;
                break;

            case CharactorState.run:
                this.movieClip.begin = 6;
                this.movieClip.end = 12;
                break;

            case CharactorState.sitdown:
                this.movieClip.begin = 12;
                this.movieClip.end = 18;
                break;

            case CharactorState.sitdown_run:
                this.movieClip.begin = 18;
                this.movieClip.end = 24;
                break;
        }
    }


    public moving: boolean = false;

    public moveSpeed: number = 200;

    private _moveAngle: number = 0;

    start() {

        this.direction = 0;
        this.state = 3;

    }

    update(dt) {
        if (this.moving) {

            var speed: number = this.moveSpeed * dt;

            // if (dx * dx + dy * dy > speed * speed) {
            //     if (this._moveAngle == 0) {
            //         this._moveAngle = Math.atan2(dy, dx);

            //         var dire: number = Math.round((-this._moveAngle + Math.PI) / (Math.PI / 4));
            //         this.direction = dire > 5 ? dire - 6 : dire + 2;
            //     }

            //     var xspeed: number = Math.cos(this._moveAngle) * speed;
            //     var yspeed: number = Math.sin(this._moveAngle) * speed;

            //     this.node.x += xspeed;
            //     this.node.y += yspeed;

            // } else {
            //     this._moveAngle = 0;

            //     if (this._nodeIndex == this._roadNodeArr.length - 1) {
            //         this.node.x = nextNode.px;
            //         this.node.y = nextNode.py

            //         this.stop();
            //     } else {

            //     }
            // }
        }
    }

    /**
     * 根据路节点路径行走
     * @param roadNodeArr 
     */
    public walkByRoad() {
        this.move();
    }

    public move() {
        this.moving = true;
        this.state = CharactorState.run;
    }

    public stop() {
        this.moving = false;
        this.state = CharactorState.stand;
    }
}
