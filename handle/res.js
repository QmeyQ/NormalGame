import { File } from "./file";
import { Net } from "./net";

var tD;
export const Res = {
  downRes(datas, flag) {
    if(flag == undefined)
     flag = 0;
     if(datas == undefined)
     return false;
      if (File.preStore(datas, flag)) {
        console.log("pre ok")
        for(var i = 0; i < datas.length; i ++){
          tD = File.getData(datas[i]);
          if(tD !== undefined){
            console.log(tD)
            //const tD = tD;
            File.readFile(tD, function(datas, path){
              if(path == undefined)
                return
              if(datas != undefined && datas.byteLength > 1){
                console.log("文件有效：" + (datas[0] << 8 & datas[1]) + "/" + (datas[2] << 8 & datas[3]))
                Net.fileList.push(path);
              }else{
                console.log("文件wu效：");
                console.log(datas)
                File.delStore(tD);
              }
            });
            
          }else{
            console.log("download:===>" +datas[i]);
            Net.down(datas[i]);
          }
        }
      }

      return false;
  },
  getRes(name){
    for(var i = 0; i<this.resList.length; i++){
      if(this.resList[i][0] == name)
      return this.resList[i][1];
    }
    return null;
  },
  resList: [
    ['tsimg', 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg']
  ],

 
}