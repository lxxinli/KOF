import { GameObject } from '../object/object.js'
import { Controller } from '../controller/controller.js';


class GameMap extends GameObject {
    constructor(root) {
        super();
        
        this.root = root
        this.$canvas = $('<canvas width="1280" height="720" tabindex=0></canvas>');
        this.ctx = this.$canvas[0].getContext('2d');
        this.root.$kof.append(this.$canvas);
        // 为了获取输入，需要将当前canvas聚焦
        this.$canvas.focus();

        this.controller = new Controller(this.$canvas);

        this.root.$kof.append($(`<div class="kof-head">
                                <div class="kof-head-hp-0"><div><div></div></div></div>
                                <div class="kof-head-timer">60</div>
                                <div class="kof-head-hp-1"><div><div></div></div></div>
                            </div>`))

        this.time_left = 60000;        // 剩余时间（单位：ms）
        this.$timer = this.root.$kof.find(".kof-head-timer")

        this.$text = $(`textarea`);
    }

    start() {
        // 插入游戏玩法提示：
        this.$text.text(`游戏玩法：

玩家1:                                      玩家2:
W:跳跃                                     ⬆:跳跃
A:向后移动                               ➡:向后移动
D:向前移动                               ⬅:向前移动
Space:攻击                               EnterEnter:攻击`)
    }

    update() {
        let [a, b] = this.root.players;
        if (a.status !== 6 && b.status !== 6)
        {
            this.time_left -= this.timedelta;
            if (this.time_left < 0) 
            {
                this.time_left = 0;

                if (a.status !== 6 && b.status !== 6)
                {
                    a.status = b.status = 6;
                    a.frame_current_cnt = b.frame_current_cnt = 0;
                    a.vx = b.vx = 0;
                }

            }
            this.$timer.text(parseInt(this.time_left / 1000));
        }


        this.render();
    }

    // 渲染方法：清空地图
    render() {
        this.ctx.clearRect(0, 0, this.ctx.canvas.width, this.ctx.canvas.height);
        
    }
}

export {
    GameMap
}