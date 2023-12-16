
/**
 * 迷宫的配置
*/

// 难度1: 一个直角转弯
const mazeLevel1: string =
    `0,1,0,0,0,0
     0,1,0,0,0,0
     0,1,0,0,0,0
     0,1,0,0,0,0
     0,1,1,1,1,1
     0,0,0,0,0,0`;

// 难度2: 两个直角转弯
const mazeLevel2: string =
    `1,1,0,0,1,0
     0,1,0,1,1,0
     0,1,1,1,0,0
     0,0,0,1,0,0
     0,0,0,1,0,0
     0,0,0,1,1,1`;


// 难度3: 三个直角转弯，包括一个T形路口
const mazeLevel3: string =
    `0,1,0,0,1,1
     0,1,0,0,1,0
     0,1,1,1,1,0
     0,1,0,1,0,0
     0,1,0,1,1,0
     0,0,0,0,1,1
`;

// 难度4: 四个直角转弯，包括两个T形路口
const mazeLevel4: string =
    `0,1,0,0,0,1,0
     0,1,0,0,0,1,0
     0,1,1,1,1,1,0
     0,0,0,1,0,0,0
     0,0,0,1,0,0,0
     0,1,1,1,1,1,0
     0,0,0,1,0,0,0
`;

// 难度5: 五个直角转弯，包括三个T形路口
const mazeLevel5: string =
    `1,1,0,0,1,0,1,0,0
     0,1,0,0,1,0,1,0,0
     0,1,1,1,1,1,1,1,0
     0,0,0,0,0,0,1,0,0
     0,1,0,0,1,1,1,1,1
     0,1,0,0,1,0,0,0,0
     0,1,1,1,1,1,1,1,0
     0,1,0,0,0,0,0,0,0
`;

export interface ExamInfo {
    retryCount: number,
    tipCount: number,
    level: number, //难度
    map: string, //地图
    time: number, //倒计时
    start: Array<number>, //起始点
    end: Array<number>, //结束点
    path: Array<Array<number>>, //正确路点
    errorPath: Array<Array<number>> //岔路点xy,提示路点xy, 角度
}
export default class Config {

    static LevelData: Array<ExamInfo> = [
        {
            retryCount: 3,
            tipCount: 1,
            level: 1, //难度
            map: mazeLevel1, //地图
            time: 60, //倒计时
            start: [5, 4], //起始点
            end: [1, 0], //结束点
            path: [[5, 4], [4, 4], [3, 4], [2, 4], [1, 4], [1, 3], [1, 2], [1, 1], [1, 0]],
            errorPath: [[3, 1, 2, 2, 0]]//岔路点xy,提示路点xy, 角度
        },
        {
            retryCount: 3,
            tipCount: 1,
            level: 2, //难度
            map: mazeLevel2, //地图
            time: 60, //倒计时
            start: [5, 5], //起始点
            end: [0, 0], //结束点
            path: [[5, 5], [4, 5], [3, 5], [3, 4], [3, 3], [3, 2], [2, 2], [1, 2], [1, 1], [1, 0], [0, 0]],
            errorPath: [[3, 1, 2, 2, 0]]//岔路点xy,提示路点xy, 角度
        },
        {
            retryCount: 3,
            tipCount: 1,
            level: 3, //难度
            map: mazeLevel3, //地图
            time: 60, //倒计时
            start: [5, 5], //起始点
            end: [5, 0], //结束点
            path: [[5, 5], [4, 5], [4, 4], [3, 4], [3, 3], [3, 2], [4, 2], [4, 1], [4, 0], [5, 0]],
            errorPath: [[2, 2, 4, 2, -90]]//岔路点
        },
        {
            retryCount: 3,
            tipCount: 1,
            level: 4, //难度
            map: mazeLevel4, //地图
            time: 60, //倒计时
            start: [3, 6], //起始点
            end: [1, 0], //结束点
            path: [[3, 6], [3, 5], [3, 4], [3, 3], [3, 2], [2, 2], [1, 2], [1, 1], [1, 0]],
            errorPath: [[4, 2, 2, 2, 0]]//岔路点
        },
        {

            retryCount: 3,
            tipCount: 1,
            level: 5, //难度
            map: mazeLevel5, //地图
            time: 60, //倒计时
            start: [1, 7], //起始点
            end: [0, 0], //结束点
            path: [[1, 7], [1, 6], [2, 6], [3, 6], [4, 6], [4, 5], [4, 4], [5, 4], [6, 4], [6, 3], [6, 2], [5, 2], [4, 2], [3, 2], [2, 2], [1, 2], [1, 1], [1, 0], [0, 0]],
            errorPath: [[5, 2, 4, 2, 0], [3, 6, 4, 5, -90], [4, 1, 3, 2, 0]]//岔路点
        },
    ]
}