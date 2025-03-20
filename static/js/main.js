import {GameMap} from './map/map.js'
import {Kyo} from './player/kyo.js'


class KOF {
    constructor(id)
    {
        this.$kof = $('#' + id);
        
        this.game_map = new GameMap(this);

        this.players = [
            new Kyo(this, {
                id: 0,
                x: 100,
                y: 0,
                width: 120,
                height: 200,

            }), 
            new Kyo(this, {
                id: 1,
                x: 800,
                y: 0,
                width: 120,
                height: 200,

            }), 
        ];
    }
}

export {
    KOF
}