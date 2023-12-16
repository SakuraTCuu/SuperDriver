import { _decorator, Component } from "cc";
import MovieClip from "./MovieClip";
import { DirectionType } from "../maze/ViewCtrl";

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
            this.movieClip.node.setScale(-1, 1, 1);
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

        }
    }

    /**
     * 行走
     */
    public walk(dire: DirectionType) {
        this._moveAngle = 0;

        if (dire === DirectionType.LEFT) {
            this.direction = 2;
        } else if (dire === DirectionType.RIGHT) {
            this.direction = 6;
        } else if (dire === DirectionType.UP) {
            this.direction = 4;
        } else if (dire === DirectionType.DOWN) {
            this.direction = 0;
        }

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
