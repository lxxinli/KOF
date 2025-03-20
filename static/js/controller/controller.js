class Controller {
    constructor($canvas) {
        this.$canvas = $canvas;

        this.pressed_keys = new Set();
        this.start();
    }

    start() {
        // let outer = this;
        this.$canvas.keydown((e) => {
            this.pressed_keys.add(e.key);
            console.log(e.key)
        });
        this.$canvas.keyup((e) => {
            this.pressed_keys.delete(e.key);
        })
    }
}

export {
    Controller
}



