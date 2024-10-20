
import { Res } from './handle/res'
import './js/libs/weapp-adapter'
var symbol = require( './js/libs/symbol')
const {Net} = require('./handle/net')

import Main from './js/main.js'
const { Display } = require('./display/display.js')

Display.init();


const img = new Image();
Net.down(Res.teimg);

setInterval(function () {

  if(Net.fileList.length < 2){
    Net.down(Res.teimg);
  }

  if(Net.fileList.length > 0){
    img.src = Net.fileList[0]
    Display.ctx.drawImage(img, 200,200, 100, 100);
  }
  
}, 1000, 'maintain display');

//new Main()
