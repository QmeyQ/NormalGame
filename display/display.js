//import '../js/libs/weapp-adapter'
const {EnDis} = require('./enDis.js')

const fs = wx.getFileSystemManager();

export const Display = {
  enD: {
    trans: 0xe0,
    da: 0xe1,
    re: 0xe2,
    transE: 0xe3,
  },
  split: 4,
  layout: [],
  layoutM: [],
  ctx: canvas.getContext('2d'),
  LIndex: '',
  DRun: '',
  CSpeed: '',
  frameSpeed: '8',
  LIndex: {
    bg: 0
  },
  screenWidth: 512,
  screenHeight: 512,
  deData() {

  },
  enData() {

  },
  drawing(datas, x, y) {
    if (this.layout[datas.LI]) {
      this.layout[datas.LI] = datas;
    }
  },
  refresh(rTime) {
    rTime = Math.floor(rTime);
    if(EnDis.LF > 0){
      EnDis.LF = 0;
      EnDis.deData(EnDis.rD);
    }

    for (var i = 0; i < this.layout.length; i++) {

    }

    if (this.CSpeed != rTime) {
      this.CSpeed = rTime;
      if (this.DRun) {
        clearInterval(this.DRun);
      }
      this.DRun = setInterval(function () {
        Display.refresh(rTime)
      }, this.frameSpeed, 'maintain display');
    }

  },
  init() {

    
    EnDis.enData('images/bullet.png');

    //init h screen pixl     -----------------初始化屏幕最大区域
    if (window.innerWidth < -1) {
      this.screenWidth = window.innerWidth * -1;
    } else if (window.innerWidth > 0) {
      this.screenWidth = window.innerWidth;
    }

    if (window.innerHeight < -1) {
      this.screenHeight = window.innerHeight * -1;
    } else if (window.innerHeight > 0) {
      this.screenHeight = window.innerHeight;
    }


    const ctx = this.ctx;
    const img = new Image()
    var iD;
    /*img.src = 'images/bullet.png'
    img.onload = function () {
      

    }*/

    //this.layout = [];
    this.layout.push(0, []);

    // build  display
    this.refresh(this.frameSpeed);
    //layout[LIndex.bg] ;
  }
}