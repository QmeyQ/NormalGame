import Storage from './handle/storage';
import Display from './display/display'
import Res from './handle/res'
import cloud from './handle/cloud'
import Linsener from './handle/linsener'
import Process from './handle/process'
import { Obj, BG, Cha, Txt } from './handle/Obj'
import Time from './handle/time';


Display.init();

var bg = new BG("welcome");
bg.load({welcome:"image/welcome.png"});
bg.setBG();
bg.show();

var clo = new cloud();
clo.select();

var mdata = [[0, 2, 0, 10, 0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6], [0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6]]
var data = [[0, 2, 0, 10, 0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6], [0xe0, 2, 0xe3, 2, 4, 255, 244, 233, 255, 244, 222, 0xe0, 6]]

var mRes = new Res().url("https://agc-storage-drcn.platform.dbankcloud.cn/v0/sgf-rhq1y/res.json?token=b239b799-d211-4458-ad72-640e985090e4");

Linsener.init();
let otimer = new Obj("timer");
otimer.eve = ()=>{Time.calibrateTime()}
otimer.invoke = 100000;
Process.onEnt(otimer);


const proBro = new Txt("showPrograss");



const tmpWhile = () => {

    Storage.get("resJson", (data) => {
        if (clo.version != undefined && data != null && mRes.list != undefined) {
            if (mRes.list['v']['v'] != clo.version) {
                if (Process.is("jsonE")) {
                    Display.testTest += "\n资源版本不匹配";
                    console.log("资源版本不匹配");
                    mRes.sto.delete("resJson");
                    Process.end("jsonE");
                    process.clear("downS");
                }
            }
            if (!Process.is("downS")) {
                Display.testTest += "\n检查同步资源文件";
                mRes.downRes();
                Process.end("downS");
            }
        }
    });


    if (mRes.process == mRes.count && mRes.count > 0) {

        /*if(Time.invoke("xxwwwww") > 1000){
            Time.start("xxwwwww");
            Display.clear([0, 100, 2000, 2000]);
            Display.clear();
            console.log(Display.disMap)
        }*/


        if (!Process.is("sload")) {
            console.log("资源加载完成", mRes.process, mRes.count);

            Display.load(Object.values(mRes.img));

            Linsener.login((res) => {
                console.log(res);
            });
            Process.end("sload");

            var cat = new Cha("cat");
            cat.load(mRes.img.cat);
            cat.show(0);
            console.log(cat.instanse)

            var cat1 = new Cha("cat");
            cat1.y = 100;
            cat1.load(mRes.img.cat);
            cat1.show(0);
            console.log(cat1.instanse)

            var cat2 = new Cha("cat");
            cat2.y = 200;
            cat2.load(mRes.img.cat);
            cat2.layout = 2;
            cat2.show(0);
            console.log(cat2.instanse)

            Process.end("sload");
        }
    } else {
        if (!proBro.invisable) {
            proBro.x = 10;
            proBro.y = 450;
            proBro.wid = 200;
            proBro.hei = 100;
            proBro.show(0);
        }
        if (mRes.process != undefined) {
            proBro.text = mRes.process + "/" + mRes.count + "/err:" + mRes.err;
            proBro.wid = proBro.text.length * 20;
        }
    }

    if (mRes.err > 0) {
        Display.drawText("资源加载失败:" + mRes.err, 0, 200);
    }

    setTimeout(tmpWhile, 100);
};

tmpWhile();



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







