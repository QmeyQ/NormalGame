import Display  from './display/display'
import EnDis from './display/enDis'
import Net from './handle/net'
import Res from './handle/res'

//Net.id = '#' + ~~(Math.random() * 100)
var mdata = [[0, 2, 0, 10, 0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6],[0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6]]
var data = [[0, 2, 0, 10, 0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6],[0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6]]

new Res().url("https://agc-storage-drcn.platform.dbankcloud.cn/v0/sgf-rhq1y/res.json?token=b239b799-d211-4458-ad72-640e985090e4");

console.log(EnDis.deData(mdata[0], 1))
Net.login(function(res){
  console.log(res)
});
//console.log(EnDis.putData(mdata, data));

Display.init();





/*Net.udpSend(Net.id + ":" + Net.ip + ":" + Net.port, "47.119.120.119", 50132, (res)=>{
    var mes = new Int8Array(res.message);
    /**数组转字符串 
   console.log(mes)
    if(mes[0]==35){
        var str = "";
        for (var i = 0; i < mes.length; i++) {
            str += String.fromCharCode(mes[i]);
        }
        Net.Uip(str)
        /**打印ip和端口 
        //console.log(res.remoteInfo.address, res.remoteInfo.port)
        //console.log()
    }
});
Net.udpLoop();*/







