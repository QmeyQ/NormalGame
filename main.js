
//import { Display } from './display/display.js'


GameGlobal.canvas = wx.createCanvas()


export default class Main {
  constructor() {
//import {EnDis}  from './display/enDis'
//const  {Net} = require('./handle/net')

//const cli = ~~(Math.random()*100);
//Display.init();

/*Display.drawing(EnDis.create(window.innerWidth, window.innerHeight));

Display.testTest += "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx\nxxxxxxxxxxxxxxxx";

console.log("game:" ,Display.layout)


Net.id = "#"+cli;
var xxx = "";
Net.getIp()//function(){
  //console.log("send", message)///Net.id+ ":" + Net.ip + ":" + Net.port
  Net.udpSend("", "47.119.120.119", 50132, (res)=>{
    // datas arraybuffer 转字符串 
    var uint8Array = new Uint8Array(res.message);
    var str = "";
    for (let i = 0; i < uint8Array.length; i++) {
      str += String.fromCharCode(uint8Array[i]);
    }
    if(uint8Array[0] == 35){
      var str = "";
      for (let i = 0; i < uint8Array.length; i++) {
        str += String.fromCharCode(uint8Array[i]);
      }
      if(str.charAt(0) == '#')
      ;
      
      console.log(Net.Uip(str))
      Display.testTest += str +  xxx + "\n"
    }else{
      if(uint8Array[0] != 1 && uint8Array[1] != 1){
      console.log(res, "P2P data", str);
      const decoder = new TextDecoder('utf-8');
      /**截断50个字符+上新的数据 */
      /*xxx = xxx.slice(0, 50) + "\n" + "P2P data:" + decoder.decode(uint8Array) + "\n"
      }
    }
  }, "");
  Net.udpLoop();
//});







setInterval(function () {

  if(Net.fileList.length < 2){}
    
  //File.getVol();
    //Res.downRes([Res.resList[0][0] , 'th1', 'th2'])//, 'th1', 'th2', 'th3', 'th4']);
    //File.getVol();
  //}

  /*if(Net.fileList.length > 0){
    img.src = Net.fileList[0]
    Display.ctx.drawImage(img, 200,200, 100, 100 );
  }*/
  
//}, 2000, 'maintain display');
/**/
//new Main()

  }
}