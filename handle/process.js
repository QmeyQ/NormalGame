import Display from "../display/display";
import Time from "./time";

const Process = {
    proList: {},
    flags: {},
    runFlag: false,
    map: { map: {} },
    iCount:0,
    disPro(ms) {
        var keys = Object.keys(this.map).sort((a, b) => b - a);
        for (var s in this.map) {
            if (s == 'map') {
                continue;
            }
            this.map[s].on();
        }

        var maps = {}, v = 0;

        let zxStart = Math.floor(Display.x / Display.split);
        if (!Number.isInteger(zxStart)) {
            zxStart--;
        }
        let zxEnd = Math.floor((Display.x + Display.wid) / Display.split);
        if (!Number.isInteger(zxEnd)) {
            zxEnd ++;
        }
        let zyStart = Math.floor(Display.y / Display.split);
        if (!Number.isInteger(zyStart)) {
            zyStart--;
        }
        let zyEnd = Math.floor((Display.y + Display.hei) / Display.split);
        if (!Number.isInteger(zyEnd)) {
            zyEnd ++;
        }
        for (let zx = zxStart; zx <= zxEnd; zx++) {
            for (let zy = zyStart; zy <= zyEnd; zy++) {
                let zone = zx + ":" + zy;
                if (this.map.map[zone] != undefined) {
                    for (var s in this.map.map[zone]) {
                        maps[(this.map.map[zx + ":" + zy][s].pri << 16 + v++) + (this.map.map[zx + ":" + zy][s].instanse)] 
                        = (this.map.map[zx + ":" + zy][s]);
                    }
                }
            }
        }

        var keys = Object.keys(maps).sort((a, b) => b - a);
        for (var s in keys) {
            maps[keys[s]].on();
        }
        //console.log(maps)
        if(Time.invoke(1000) > 1000){
            Time.start(1000)
        //console.log(this.map.map)
    }

        if (this.runFlag) {
            setTimeout(() => {
                this.disPro(ms)
            }, ms);
        }
    },
    onEnt(obj) {
        if (this.runFlag == false) {
            this.runFlag = true;
            this.disPro(10);
        }
        this.map[obj.name] = obj;
    },
    onDis(obj, x, y, wid, hei) {
        if (this.runFlag == false) {
            this.runFlag = true;
            this.disPro(10);
        }
        let zxStart = Math.floor(x / Display.split);
        let zyStart = Math.floor(y / Display.split);
        let zxEnd = Math.floor((x + wid) / Display.split);
        let zyEnd = Math.floor((y + hei) / Display.split);


        for (let zx = zxStart; zx <= zxEnd; zx++) {
            for (let zy = zyStart; zy <= zyEnd; zy++) {
                let zone = zx + ":" + zy;
                if (this.map.map[zone] == undefined) {
                    this.map.map[zone] = {};
                }
                this.map.map[zone][obj.instanse] = obj;
            }
        }
    }
    ,
    clear(proName) {
        delete this.proList[proName];
        if (this.flags[proName] != undefined)
            delete this.flags[proName]
    },
    end(proName, flag) {
        this.proList[proName] = true;
        if (flag != undefined) {
            this.flags[proName] = flag;
        }
    },
    is(proName) {
        if (this.proList[proName] != undefined) {
            if (this.flags[proName] != undefined)
                return this.flags[proName]
            return true;
        } else {
            return false;
        }
    }
}

export default Process;