let GAME_OBJECTS = [];

class GameObject {
    constructor() {
        GAME_OBJECTS.push(this);

        // 每一帧距离上一帧时间
        this.timedelta = 0;
        // 记录当前对象有没有执行过 start() 这个函数
        this.has_call_start = false;
    }

    // 初始执行一次
    start() {

    }

    // 每一帧执行一次(除了初始的第一帧)
    update() {
        
    }

    // 删除当前对象
    destroy() {
        for (let i in GAME_OBJECTS)
        {
            if (GAME_OBJECTS[i] == this)
            {
                GAME_OBJECTS.slice(i, 1);
                break;
            }
        }
    }
}

let last_timestamp;

let GAME_OBJECTS_FRAME = (timestamp) => {
    for (let obj of GAME_OBJECTS)
    {
        if (!obj.has_call_start) 
        {
            obj.start();
            obj.has_call_start = true;
        } 
        else 
        {
            obj.timedelta = timestamp - last_timestamp;
            obj.update();
        }
    }
    last_timestamp = timestamp;
    requestAnimationFrame(GAME_OBJECTS_FRAME)
}
requestAnimationFrame(GAME_OBJECTS_FRAME)


export {
    GameObject,
    

}