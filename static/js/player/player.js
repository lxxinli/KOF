import { GameObject } from "../object/object.js";

class Player extends GameObject {
    constructor(root, info) {
        super();

        this.root = root;
        this.id = info.id;
        this.x = info.x;
        this.y = info.y;
        this.width = info.width;
        this.height = info.height;
        
        this.ctx = this.root.game_map.ctx;

        this.direction = 1;
        this.vx = 0;
        this.vy = 0;

        this.gravity = 50;     // 重力

        this.basic_speedx = 400;     // 设置的水平移动速度基础速度
        this.basic_speedy = -1500 ;    // 设置的跳起的基础速度

        // 这里使用了状态机模型
        this.status = 3;       // 状态： 0：站立静止； 1：向前； 2：向后； 3：跳跃； 4：攻击； 5：被打； 6：死亡

        this.pressed_keys = this.root.game_map.controller.pressed_keys;

        this.animations = new Map();  // 存储对于动作

        this.frame_current_cnt = 0;   // 记录当前在第几帧

        this.hp = 100;                // 生命值总数
        this.$hp_red = this.root.$kof.find(`.kof-head-hp-${this.id}>div`);
        this.$hp_green = this.root.$kof.find(`.kof-head-hp-${this.id}>div>div`);
    }

    start() {

    }

    update_control() {
        let w, a, d, space;
        if (this.id === 0)
        {
            w = this.pressed_keys.has('w');
            a = this.pressed_keys.has('a');
            d = this.pressed_keys.has('d');
            space = this.pressed_keys.has(' ');
        }
        else 
        {
            w = this.pressed_keys.has('ArrowUp');
            a = this.pressed_keys.has('ArrowLeft');
            d = this.pressed_keys.has('ArrowRight');
            space = this.pressed_keys.has('Enter');
        }

        // 状态机转移d
        if (this.status === 0 || this.status === 1) {
            if (space)
            {
                this.status = 4;
                this.vx = 0;
                this.frame_current_cnt = 0;
            }
            else if (w)
            {
                // 三种跳跃方式
                if (d) 
                    this.vx = this.basic_speedx;
                else if (a)
                    this.vx = -this.basic_speedx;
                else
                    this.vx = 0;
                this.vy = this.basic_speedy;
                this.status = 3;
                this.frame_current_cnt = 0;
            }
            else if (d) 
            {
                this.vx = this.basic_speedx;
                this.status = 1;

            }
            else if (a)
            {
                this.vx = -this.basic_speedx;
                this.status = 1;
            }
            else
            {
                this.vx = 0;
                this.status = 0;
            }
        }
    }

    update_move() {
        // 考虑重力加速度
        this.vy += this.gravity;

        this.x += this.vx * this.timedelta / 1000;
        this.y += this.vy * this.timedelta / 1000;
        if (this.y > 400)
        {
            this.y = 400;
            this.vy = 0;
            if (this.status === 3)
                this.status = 0;
        }

        if (this.x < 0) 
            this.x = 0;
        if (this.x + this.width > this.ctx.canvas.width)
            this.x = this.ctx.canvas.width - this.width;
    } 

    // 让小人永远朝向对手方向
    update_direction() {
        // 逝者为大，我们不用再改变方向了
        if (this.status === 6) return;

        let players = this.root.players;
        if (players[0] && players[1])
        {
            let me = players[this.id], you = players[1 - this.id];
            if (me.x < you.x) me.direction = 1;
            else me.direction = -1;
        }
    }

    // 碰撞检测
    is_collision(position1, position2)
    {
        if (Math.max(position1.x1, position2.x1) > Math.min(position1.x2, position2.x2)) 
            return false;
        if (Math.max(position1.y1, position2.y1) > Math.min(position1.y2, position2.y2))
            return false;
        return true;
    }

    // 生成随机数方法：用来随机扣血
    getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    is_attack() {
        // 逝者为大，我们不能再攻击他了
        if (this.status === 6) return;

        this.status = 5;
        this.frame_current_cnt = 0;
        
        let minusHp = this.getRandomInt(18, 30);
        console.log(minusHp);
        
        // 改变血条长度
        this.hp = Math.max(0, this.hp - minusHp);
        this.$hp_green.animate({
            width: this.$hp_red.parent().width() * this.hp / 100,
        }, 300);
        // 红色变得慢一点，就会显示拖影效果
        this.$hp_red.animate({
            width: this.$hp_red.parent().width() * this.hp / 100,
        }, 500);                        

        // 死亡
        if (this.hp <= 0)
        {
            this.status = 6;
            this.frame_current_cnt = 0;
            this.vx = 0;
        }
    }
    
    update_attack() {
        if (this.status === 4 && this.frame_current_cnt === 18)
        {
            let me = this.root.players[this.id], you = this.root.players[1 - this.id];
            let position1;
            // 拳头坐标
            if (this.direction === 1) 
                position1 = {
                    x1: this.x + 120,
                    y1: this.y + 40,
                    x2: this.x + 120 + 100,
                    y2: this.y + 40 + 20 
                }
            else 
                position1 = {
                    x1: this.x + this.width - 120 - 100,
                    y1: this.y + 40,
                    x2: this.x + this.width - 120 - 100 + 100,
                    y2: this.y + 40 + 20 
                }
            let position2 = {
                x1: you.x,
                y1: you.y,
                x2: you.x + you.width,
                y2: you.y + you.height,
            }

            if (this.is_collision(position1, position2))
            {
                you.is_attack();
            }
        }


    }

    update() {
        this.update_control();
        this.update_move();
        this.update_direction();
        this.update_attack();

        this.render();
    }

    // 渲染
    render() {
        // this.ctx.fillStyle = 'blue';
        // this.ctx.fillRect(this.x, this.y, this.width, this.height);
        // this.ctx.fillStyle = 'red';
        // if (this.direction === 1)
        //     this.ctx.fillRect(this.x + 120, this.y + 40, 100, 20);
        // else
        //     this.ctx.fillRect(this.x + this.width - 120 - 100, this.y + 40, 100, 20);

        let status = this.status;

        if (status === 1 && this.direction * this.vx < 0)
        {
            status = 2;
        }

        let obj = this.animations.get(status);
        if (obj && obj.loaded) {

            if (this.direction === 1)
            {
                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                this.ctx.drawImage(image, this.x, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);
            }
            else 
            {
                // 保存现场
                this.ctx.save();
                // 坐标系相对于y轴翻转， 并平移
                this.ctx.scale(-1, 1), this.ctx.translate(-this.root.game_map.ctx.canvas.width, 0);
                

                let k = parseInt(this.frame_current_cnt / obj.frame_rate) % obj.frame_cnt;
                let image = obj.gif.frames[k].image;
                // 这里的x值因为变换坐标系而需要进行中心对称
                this.ctx.drawImage(image, this.root.game_map.ctx.canvas.width - this.x - this.width, this.y + obj.offset_y, image.width * obj.scale, image.height * obj.scale);

                // 恢复现场
                this.ctx.restore();
            }
        }

        // 攻击状态and被攻击状态and死亡状态：当前动作动画走完就需要停下来
        if (status === 4 || status === 5 || status === 6)
        {
            if (this.frame_current_cnt === obj.frame_rate * (obj.frame_cnt - 1))
            {
                if (status === 6) this.frame_current_cnt --;      // 帧数再也不变了
                else this.status = 0;
            }

        }


        this.frame_current_cnt ++;
    }
}




export {
    Player
}