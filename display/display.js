//import '../js/libs/weapp-adapter'
/**使用egret 绘制*/
//import { egret } = require('egret.');

import Time from "../handle/time";

const Display = {
  van: '',
  testTest: '',
  enD: {
    trans: 0xe0,
    da: 0xe1,
    re: 0xe2,
    transE: 0xe3,
  },
  canvas: null,
  ctx: null,
  split: 4,
  LIndex: '',
  DRun: '',
  CSpeed: '',
  frameSpeed: '80',
  imgList: {},
  textStyle: '20px Arial',
  rgba: [255, 255, 255, 1],
  disMap: { map: {} },
  layout: 0,
  x: 0,
  y: 0,
  split: 200,
  wid: undefined,
  hei: undefined,
  isLoad(res) {
    if (Display.imgList[res] == undefined)
      return false;
    else
      return true;
  }
  ,
  load(res, suc) {
    if (!Array.isArray(res)) {
      res = [res];
    }
    for (const key in res) {
      const timg = wx.createImage();
      timg.src = res[key];
      timg.onload = () => {
        this.imgList[res[key]] = timg;
        if (suc != undefined) {
          suc(timg);
        }
      }
    }
  },
  up(x, y, wid, hei) {

    let zxStart = Math.floor(x / this.split);
    if (!Number.isInteger(zxStart)) {
      zxStart--;
    }
    let zxEnd = Math.floor((x + wid) / this.split);
    if (!Number.isInteger(zxEnd)) {
      zxEnd++;
    }
    let zyStart = Math.floor(y / this.split);
    if (!Number.isInteger(zyStart)) {
      zyStart--;
    }
    let zyEnd = Math.floor((y + hei) / this.split);
    if (!Number.isInteger(zyEnd)) {
      zyEnd++;
    }

    for (let zx = zxStart; zx <= zxEnd; zx++) {
      for (let zy = zyStart; zy <= zyEnd; zy++) {
        let zone = zx + ":" + zy;
        if (this.disMap.map[zone] != undefined) {
          for (var s in this.disMap.map[zone]) {
            this.disMap.map[zone][s].up(x, y, wid, hei);
          }
        }
      }
    }
    this.clear();
  },
  clear(rect) {
    if (rect == undefined) {
      if (this.rect == undefined) {
        return;
      }
      if (Display.rect[0] + Display.rect[2] >= Display.x && Display.rect[0] <= Display.x + Display.wid
        && Display.rect[1] + Display.rect[3] >= Display.y && Display.rect[1] <= Display.y + Display.hei) {
        const clipX = Math.max(Display.x, Display.rect[0]);
        const clipY = Math.max(Display.y, Display.rect[1]);
        const clipWid = Math.min(Display.x + Display.wid, Display.rect[0] + Display.rect[2]) - clipX;
        const clipHei = Math.min(Display.y + Display.hei, Display.rect[1] + Display.rect[3]) - clipY;
        if (Display.bg == undefined || Display.bg.bg == undefined) {
          Display.ctx.clearRect(clipY + Display.y + Display.rect[1], clipWid, clipHei,
            Display.rect[0], Display.rect[1], clipWid, clipHei);
        } else {
          Display.drawImg(Display.bg.bg,
            clipX, clipY, clipWid, clipHei,
            clipX - Display.x, clipY - Display.y, clipWid, clipHei);
        }
        Display.rect = undefined;
        return;
      }
    }
    if (this.rect == undefined) {
      this.rect = rect;
      return;
    }
    //this.ctx.clearRect(this.rect[0] + this.rect[2], this.rect[1] + this.rect[3]);

    // 计算每个矩形的边界坐标
    let right1 = this.rect[0] + this.rect[2];
    let bottom1 = this.rect[1] + this.rect[3];
    let right2 = rect[0] + rect[2];
    let bottom2 = rect[1] + rect[3];

    // 求出最小外包矩形的边界
    const xmin = Math.min(this.rect[0], rect[0]);
    const ymin = Math.min(this.rect[1], rect[1]);
    const xmax = Math.max(right1, right2);
    const ymax = Math.max(bottom1, bottom2);

    // 计算合并后矩形的尺寸
    this.rect[0] = xmin;
    this.rect[1] = ymin;
    this.rect[2] = xmax - xmin;
    this.rect[3] = ymax - ymin;

    ///////////////////////////////////////////////////////
    return this.rect;
  },
  setText(size, style) {
    if (style == undefined)
      style = "Arial"
    this.textStyle = size + " " + style;
  },
  drawRect(x, y, wid, hei) {
    this.ctx.fillStyle = 'rgba(' + this.rgba[0] + ',' + this.rgba[1] + ',' + this.rgba[2] + ',' + this.rgba[3] + ')';
    this.ctx.fillRect(x, y, wid, hei);
  },
  drawText(text, x, y) {
    this.rgba = [0, 0, 0, 1]
    this.ctx.fillStyle = 'rgba(' + this.rgba[0] + ',' + this.rgba[1] + ',' + this.rgba[2] + ',' + this.rgba[3] + ')';
    this.ctx.font = this.textStyle;
    this.ctx.fillText(text, x, y);
  }
  ,
  drawImg(img, x = 0, y = 0, wid, hei, dx, dy, dwid, dhei) {
    if (!this.isLoad(img)) {
      if (wid == undefined) {
        wid = this.wid;
        hei = this.hei
      }
      this.drawRect(x, y, wid, hei);
      return false;
    }
    if (wid == undefined) {
      wid = Display.imgList[img].naturalWidth;
    }
    if (hei == undefined) {
      hei = Display.imgList[img].naturalHeight;
    }

    if (x < 0) {
      dx = x * -1;
      dwid -= dx;
    }
    if (y < 0) {
      dy = y * -1;
      dhei -= dy;
      if (dx == undefined) {
        dx = 0;
        dwid = this.imgList[img].naturalWidth;
      }
    }

    if (x < 0 && dy == undefined) {
      dy = 0;
      dhei = this.imgList[img].naturalHeight;
    }

    //console.log(x, y, wid, hei)
    if (dx != undefined && dy != undefined) {
      Display.ctx.drawImage(this.imgList[img], dx, dy, dwid, dhei, x, y, wid, hei);
    } else {
      Display.ctx.drawImage(this.imgList[img], x, y, wid, hei);
    }
    return true;
  },
  refresh() {
    /*Time.timer(5000, ()=>{
      if(Time.invoke("disref") > 5000)
        this.ref = false;
    })*/
    if (this.ref == true)
      return;
    this.ref = true;
    setTimeout(() => {
      Time.start("disref");
      for (var s in this.disMap) {
        if (s != "map") {
          this.disMap[s].cond();
          this.disMap[s].dis();
          if (this.disMap[s].layout == 0) {
            this.bg = this.disMap[s]
          }
        }
      }
      this.rect = undefined;
      var maps = {};

      this.zone(maps, [Display.x, Display.y, Display.wid, Display.hei], 0);

      var keys = Object.keys(maps);
      if(keys.length > 1){
        for(var n = keys.length - 1; n > 0; n --){
        for(var v = keys.length - 2; v > 0; v--){
          if(maps[keys[n]].layout < maps[keys[v]].layout){
            var tmp = keys[n]
            keys[n] = keys[v]
            keys[v] = tmp;
          }
          if(n < keys.length -1 && maps[keys[n - 1]].layout == maps[keys[n]].layout){
            break;
          }
        }
      }
      //keys.sort((a, b) => b- a);
    
      }
      //console.log(keys);
      for (var s in keys) {
        maps[keys[s]].cond();
      }
      if (this.rect != undefined)
        this.up(this.rect[0], this.rect[1], this.rect[2], this.rect[3]);

      for (var s in keys) {
        maps[keys[s]].dis();
      }
      Display.ref = false;
    }, 1);
  },
  init() {
    this.canvas = wx.createCanvas();
    this.ctx = this.canvas.getContext('2d')
    this.wid = this.canvas.width;
    this.hei = this.canvas.height;
    // 创建canvas元素
    //var canvas = document.createElement('h1');
    //canvas.id = 'canvas';
    //canvas.textContent = 'h1xxxxxxxxxx<br/>xxxxxxx';

    this.refresh();
    //layout[LIndex.bg] ;
  },
  /**装载和删除区域记录 */
  zone(obj, rect, opt) {
    var zxStart = Math.floor(rect[0] / Display.split);
    if (!Number.isInteger(zxStart)) {
      zxStart--;
    }
    var zxEnd = Math.floor((rect[0] + rect[2]) / Display.split);
    if (!Number.isInteger(zxEnd)) {
      zxEnd++;
    }
    var zyStart = Math.floor(rect[1] / Display.split);
    if (!Number.isInteger(zyStart)) {
      zyStart--;
    }
    var zyEnd = Math.floor((rect[1] + rect[3]) / Display.split);
    if (!Number.isInteger(zyEnd)) {
      zyEnd++;
    }
    for (var zx = zxStart; zx <= zxEnd; zx++) {
      for (var zy = zyStart; zy <= zyEnd; zy++) {
        var zone = zx + ":" + zy;
        if(opt == undefined && this.disMap.map[zone] == undefined){
          this.disMap.map[zone] = {};
        }
        if (this.disMap.map[zone] != undefined) {
          if(opt == undefined){
           this.disMap.map[zone][obj.instanse] = obj;
          }else if(opt== true){
            delete this.disMap.map[zone][obj.instanse]
          }else{
            for (var s in this.disMap.map[zone]) {
              obj[this.disMap.map[zone][s].layout + this.disMap.map[zone][s].instanse] = this.disMap.map[zone][s];
            }
          }
        }
      }
    }
  }
}
export default Display