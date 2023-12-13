import { _decorator, Component, Label, Node, NodeEventType, UITransform, v3 } from 'cc';
const { ccclass, property } = _decorator;

export interface DialogInfo {
    autoClose?: boolean;
    onceBtn?: boolean; //单确定按钮
    time?: number; //倒计时关闭
    desc: string; //描述文本
}

@ccclass('Dialog')
export class Dialog extends Component {

    @property(Node)
    ConfirmNode: Node = null;

    @property(Node)
    CancelNode: Node = null;

    @property(Label)
    DescLab: Label = null;

    @property(Node)
    MaskNode: Node = null;

    private confirmCallback: Function = null;
    private cancelCallback: Function = null;

    private info: DialogInfo = null;
    private time: number = -1;

    private confirmLab: Label = null;

    start() {
        this.ConfirmNode.on(NodeEventType.TOUCH_END, this.onTouchConfirm, this);
        this.CancelNode.on(NodeEventType.TOUCH_END, this.onTouchCancel, this);
        this.MaskNode.on(NodeEventType.TOUCH_END, this.onTouchClose, this);

        this.confirmLab = this.ConfirmNode.getChildByName("Label").getComponent(Label);

        this.init({ desc: "thi2222s", onceBtn: true }, () => { console.log("confirm") }, () => { console.log("cancel") })
    }

    public init(info: DialogInfo, confirmCb: Function, cancelCb: Function) {
        // this.isAutoClose = info.autoClose === false ? false : true; //除非显示声明autoClose为false, 否则都可以自动关闭
        this.info = info;
        this.confirmCallback = confirmCb;
        this.cancelCallback = cancelCb;

        this.initView();
    }

    private initView() {
        if (this.info.onceBtn) {
            this.CancelNode.active = false;
            let pos = this.ConfirmNode.getPosition()
            pos.x = 0 //设为中间位置
            this.ConfirmNode.setPosition(pos);
        }

        if (this.info.desc.length >= 80) {
            this.info.desc = this.info.desc.substring(0, 80) + "..."
        }

        this.DescLab.string = this.info.desc;

        this.time = this.info.time || -1;
    }

    update(dt: number) {
        if (this.time === -1) {
            return
        }
        this.time -= dt;
        if (this.time <= 0) {
            this.closeView()
            return;
        }
        this.updateTime();
    }

    private updateTime() {
        if (this.time < 0) {
            this.time = 0;
        }
        this.confirmLab.string = `确定(${Math.floor(this.time)})`
    }

    onTouchConfirm() {
        this.confirmCallback && this.confirmCallback();
        this.closeView();
    }

    onTouchCancel() {
        this.cancelCallback && this.cancelCallback();
        this.closeView();
    }

    onTouchClose() {
        if (this.info.autoClose) {
            this.closeView();
        }
    }

    closeView() {
        this.node.active = false;
        this.node.destroy()
    }
}


