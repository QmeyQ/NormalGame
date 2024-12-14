//import '../js/libs/weapp-adapter'
/**使用egret 绘制*/
//import { egret } = require('egret.');
import {EnDis} from "./enDis.js"

  const Display = {
    testTest:'',
    enD: {
      trans: 0xe0,
      da: 0xe1,
      re: 0xe2,
      transE: 0xe3,
    },
    ctx: wx.createCanvas().getContext('2d'),
    split: 4,
    layout: [],
    layoutM: [],
    LIndex: '',
    DRun: '',
    CSpeed: '',
    frameSpeed: '80',
    LIndex: {
      bg: 0
    },
    screenWidth: 512,
    screenHeight: 512,
    deData() {

    },
    enData() {

    },
    drawing(datas, x = 0, y = 0, flag = 0) {
      if (this.layout[flag] == undefined) {
        this.layout.push([]);
      }
      this.layout[flag].push(datas);
    },
    refresh(rTime) {
      rTime = Math.floor(rTime);

     
      var imageData ;
      var enData;
      //for (var i = 0; i < this.layout.length; i++) {
        //for(var j = 0; j < this.layout[i].length; j ++){
        //imageData = new ImageData(canvas.width, canvas.height)
        //if(this.layout[i][j][0] << 8 | this.layout[i][j][1] > 3000){
          //console.log(j, this.layout[i].length ,this.layout[i][j][0] << 8 | this.layout[i][j][1] , this.layout[i][j][2] << 8 | this.layout[i][j][3], this.layout[i][j]);
          //break;
        //}else{
          //if(j == 0)
            //continue
          
        //console.log("display:" ,Display.layout)
          //enData = EnDis.putData(this.layout[0][0], this.layout[i][j]);
          //var drawData =EnDis.deData(enData.datas);
        //console.log("draw:" ,drawData);
        //imageData = this.ctx.createImageData(this.screenWidth, this.screenHeight)//drawData.width, drawData.height);//this.layout[i][j][0] << 8 | this.layout[i][j][1] , this.layout[i][j][2] << 8 | this.layout[i][j][3]);
        //for(let x = 0 ; x < imageData.data.length; x++){
          //imageData.data[x] = 0;//Math.random()*255;//drawData.datas[x];
        //}
        //ctx.globalCompositeOperation = 'source-over'
        //ctx.putImageData(imageData, 0, 0)//Math.random()*100, Math.random()*1000);
        /**分割testTest用换行 绘制Testtest到画布 字体大小100 */
        var tmp = this.testTest.split("\n");
        var v = -1;
        while(++v < tmp.length){``
        this.ctx.fillStyle = 'white';
        this.ctx.font = '10px Arial';
        this.ctx.fillText(tmp[v], 0, 10 * v);
        }

        if(Display.testTest.length > 800)
          Display.testTest = ""//Display.testTest.slice(200, Display.testTest.length);

        
      /*if (this.CSpeed != rTime) {
        this.CSpeed = rTime;
        if (this.DRun) {
          clearInterval(this.DRun);
        }*/
        //this.DRun = 
        setTimeout(function () {
          Display.refresh(rTime)
          //Display.ctx.draw();
        }, rTime);
     //}
      //}
      //}
      //}

    },
    init() {
      //EnDis.enData('images/bullet.png');

      //init h screen pixl     -----------------初始化屏幕最大区域
    /* if (window.innerWidth < -1) {
        this.screenWidth = window.innerWidth * -1;
      } else if (window.innerWidth > 0) {
        this.screenWidth = window.innerWidth;
      }
      //const windowInfo = wx.getWindowInfo ? wx.getWindowInfo() : wx.getSystemInfoSync();



      if (window.innerHeight < -1) {
        this.screenHeight = window.innerHeight * -1;
      } else if (window.innerHeight > 0) {
        this.screenHeight = window.innerHeight;
      }
  */

      // 创建canvas元素
      //var canvas = document.createElement('h1');
      //canvas.id = 'canvas';
      //canvas.textContent = 'h1xxxxxxxxxx<br/>xxxxxxx';

      this.ctx.fillStyle = 'blue';

      // 绘制矩形
      this.ctx.fillRect(50, 50, 200, 100); // (x, y, width, height)
      
      // 设置矩形的边框颜色
      this.ctx.strokeStyle = 'red';
      
      // 绘制矩形边框
      this.ctx.strokeRect(50, 50, 200, 100); // (x, y, width, height)
      
      //canvas.width = 800; 
      //canvas.height = 600; 
      //canvas.style.border = '1px solid #000';

      
      //console.log(document.body.appendChild(canvas))
      /*var x = canvas.getContext('2d')
      x.fillStyle = 'white';
        x.font = '10px Arial';
      x.fillText("xxxxxxx", 0, 10 * 1);
      
      x.fillText("xxxxxxxzzzzzzzz", 0, 10 * 2);
      //ctx = canvas.getContext('2d');
  */
      //console.log(document)


      // 初始化 WebGL 上下文
  //const gl = canvas.getContext('webgl');
  //if (!gl) {
      //console.error('WebGL not supported, falling back on experimental-webgl');
      ////gl = canvas.getContext('experimental-webgl');
  //}
  //if (!gl) {
    //alert('Your browser does not support WebGL');
  //}

      /*img.src = 'images/bullet.png'
      img.onload = function () {
        

      

      }*/

      //this.layout = [];
      //this.layout.push(0, []);

      // build  display
      this.refresh(this.frameSpeed);
      //layout[LIndex.bg] ;
    }
  }
export default Display