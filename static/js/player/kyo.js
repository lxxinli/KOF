import { Player } from "./player.js";
import {GIF} from "../utils/gif.js"

// 定义人物角色类，继承自player.js
class Kyo extends Player {
    constructor(root, info)
    {
        super(root, info);

        this.init_animations();
    }

    init_animations() {

        let offsets_y = [0, -22, -22, -140, 0, 0, 0]

        for (let i = 0; i < 7; i ++)
        {
            let gif = GIF();
            gif.load(`../static/images/player/kyo/${i}.gif`);

            this.animations.set(i, {
                gif: gif,
                frame_cnt: 0,               // 当前gif的总帧数
                frame_rate: 5,              // 每秒刷新帧的速率
                offset_y: offsets_y[i],                // y方向偏移量(因为不同动画高度可能不一致)
                loaded: false,              // 是否被加载成功
                scale: 2,                   // 缩放倍数
            })

            // 加载函数
            gif.onload = () => {
                let obj = this.animations.get(i);
                obj.frame_cnt = gif.frames.length;
                obj.loaded = true;

            }
        }
    }
}

export {
    Kyo
}