import Linsener from "./linsener";
import Display from "../display/display";
import Time from "./time";
import Process from "./process";

/**公共对象类,一个对象集成交互事件,显示功能 */
class Obj {

    constructor(name) {
        this.name = name;
        this.state = 0;
        this.resList = {};
        this.ref = true;
        this.x = 0;
        this.y = 0;
        /** 当前贞点 */
        this.index = 0;
        this.oInd = -1;
        /**refresh speed */
        this.invoke = 0;
        this.pri = 0;
        this.instanse = name + Process.iCount++;
        this.invisable = false;
    }

    up(x, y, wid, hei) {
        if (x + wid >= this.x && x <= this.x + this.wid
            && y + hei >= this.y && y <= this.y + this.hei) {
            this.ref = true;
        }
    }

    point(x, y) {
        this.x = x;
        this.y = y;
        return this;
    };

    size(wid, hei) {
        this.wid = wid;
        this.hei = hei;
        return this;
    }
    /** 装载资源图片的地址对应img到当前对象内 */
    load(res) {
        if (Array.isArray(res)) {
            var source = {};
            for (let i = 0; i < res.length; i++) {
                source[i] = res[i]
            }
            res = source;
        }
        let imgs = [];
        for (var key in res) {
            if (Display.imgList[res[key]] == undefined) {
                imgs.push(res[key])
            }
            this.resList[key] = res[key]
        }
        if (imgs.length > 0)
            Display.load(imgs);
        this.item = Object.keys(this.resList)//.sort((a, b) => a - b);
        const xxx = () => {
            if (Display.imgList[this.resList[this.item[0]]] != undefined) {
                if (this.wid == undefined) {
                    this.wid = Display.imgList[this.resList[this.item[0]]].naturalWidth;
                    this.hei = Display.imgList[this.resList[this.item[0]]].naturalHeight;
                }
            } else {
                setTimeout(xxx, 10);
            }
        }
        xxx();
    }

    show(zone) {
        this.invisable = true;
        if (zone == undefined) {
            Display.disMap[this.instanse] = this;
        } else {
            Display.zone(this, [this.x, this.y, this.wid === undefined ? 1 : this.wid, this.hei === undefined ? 1 : this.hei]);
        }
    }

    cond() {
        if (this.eve != undefined)
        this.eve();
        if (this.invoke > 0 && this.instanse != undefined) {
            if (Time.invoke(this.instanse) < this.invoke) {
                return;
            }
        }
        Time.start(this.instanse);

        if (this.item != undefined) {
            if (this.item.length > 0) {
                if (this.index + 2 <= this.item.length)
                    this.index++;
                else
                    this.index = 0;
            }
        }
    }

    hide() {
        this.invisable = false;
        if (Display.disMap[this.instanse] != undefined) {
            delete Display.disMap[this.instanse];
        }
        if (Display.disMap.map[this.instanse] != undefined) {
            delete Display.disMap.map[this.instanse];
        }
    }

    dis() {
        if (this.item == undefined || this.item.length <= 0)
            return;
        if (this.invoke < 0) {
            return;
        }

        this.oDis = [
            this.x,
            this.y,
            this.wid,
            this.hei
        ]
    }

    on() {
        this.cond();
    }
}

class BG extends Obj {
    constructor(name = 'BG') {
        super(name);
        this.wid = Display.canvas.width;
        this.hei = Display.canvas.height;
        this.invoke = 100;
        this.layout = 0;
    }

    setBG() {
        if (this.resList[this.item[this.index]] == undefined || Display.imgList[this.resList[this.item[this.index]]] == undefined) {
            setTimeout(() => {
                this.setBG()
            }, 80);
            return;
        }
        var cav = wx.createCanvas();
        var ctx = cav.getContext("2d");
        ctx.drawImage(Display.imgList[this.resList[this.item[this.index]]], 0, 0, Display.canvas.width, Display.canvas.height);
        cav.naturalWidth = Display.canvas.width;
        cav.naturalHeight = Display.canvas.height;
        this.wid = Display.canvas.width;
        this.hei = Display.canvas.height;
        Display.imgList[this.instanse + (this.item.length+1)] = cav;
        this.bg = this.instanse + (this.item.length + 1);
        this.isBG = true;
        this.invoke = 0;
    }

    refresh() {
        this.invoke = 0;
    }

    cond(){
        super.cond();
        if(this.isBG != true)
            this.bg = this.resList[this.item[this.index]];
        this.ref = true;
        Display.refresh();
    }

    dis() {
        super.dis();

        if (this.invoke < 0) {
            return;
        }
        if (this.ref) {
            if (Display.drawImg(this.bg, this.x, this.y, this.wid, this.hei)) {
                this.invoke = 1000;
            } else {
                this.invoke = 1000;
            }
            this.ref = false;
        } else {
            //console.log(this.item)
        }
    }
}

class Cha extends Obj {
    constructor(name) {
        super(name);
        this.layout = 1;
        this.invoke = 300;
        //while(Display.disMap.map);
    }

    show(zone) {
        super.show(zone);
        var xxx = () => {
            if (this.wid != undefined) {
                Process.onDis(this, this.x, this.y, this.wid, this.hei)
                console.log(Process.map.map, this.instanse)
            } else {
                setTimeout(() => {
                    xxx();
                }, 80);
            }
        }
        xxx();
    }

    cond() {
        super.cond()
        if (this.state == 0 && this.index > 3) {
            this.index = 0;
        }
        if (this.oInd != this.index) {
            this.ref = true;
        }
        if(this.ref == true){
            if (Display.imgList[this.resList[this.item[this.oInd]]] != undefined) {
                Display.clear([this.x, this.y, Display.imgList[this.resList[this.item[this.oInd]]].naturalWidth,
                Display.imgList[this.resList[this.item[this.oInd]]].naturalHeight])
            } else {
                Display.clear([this.x, this.y, this.wid, this.hei]);
            }
        }
        if(this.ref == true)
        Display.refresh();
    };

    dis() {
        super.dis();
        if (this.item.length > 0) {
            if (this.ref) {
                Display.drawImg(this.resList[this.item[this.index]], this.x, this.y);
                this.oInd = this.index;
                this.ref = false;
            }
        } else {
            //console.log(this.item)
        }
    }
}

class Txt extends Obj {
    constructor(text) {
        super("TxT");
        this.layout = 1;
        this.invoke = 80;
        this.text = text;
        //while(Display.disMap.map);
    }

    show(zone) {
        if (this.wid == undefined) {
            this.wid = 200;
            this.hei = 200;
        }
        super.show(zone);
        Process.onDis(this, this.x, this.y, this.wid, this.hei)
    }

    cond() {
        super.cond();
        if (this.text != this.otext) {
            this.ref = true;
        }
        if(this.ref == true){
            Display.clear([this.x, this.y - 10, this.wid, this.hei]);
        }
        if(this.ref== true)
            Display.refresh();
    };

    dis() {
        super.dis();
        if (this.ref) {
            if (this.item != undefined) {
                Display.drawImg(this.resList[this.item[this.index]], this.x, this.y, this.wid, this.hei);
                if (this.text != null && this.text != "") {
                    console.log(this.text)
                    Display.drawText(this.text, this.x, this.y);
                }
            } else {
                Display.drawText(this.text, this.x, this.y);
            }
            this.otext = this.text;
            this.ref = false;
        }
    }
}



export { Obj, BG, Cha, Txt }