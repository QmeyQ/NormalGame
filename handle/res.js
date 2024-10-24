import {
  File
} from "./file";
import {
  Net
} from "./net";

var tD, path;
export const Res = {
  downRes(datas, flag) {
    if (flag == undefined)
      flag = 0;
    if (datas == undefined)
      return false;
    if (File.preStore(datas, flag)) {
      //console.log("pre ok")
      for (var i = 0; i < datas.length; i++) {
        tD = File.getData(datas[i]);
        if (tD !== null) {
          const tmp = File.readFile(tD)
          if(tmp != undefined && tmp.byteLength > 0){
            console.log(datas[i] + "文件有效：" + tmp.byteLength) //(datas[0] << 8 & datas[1]) + "/" + (datas[2] << 8 & datas[3]))
            Net.fileList.push(datas[i]);
          } else {
            //console.log("文件wu效：");
            //console.log(datas)
            File.delStore(tD);
          }

        } else {
          console.log("download:===>" + datas[i] + ":" + Res.getRes(datas[i]));
          if (Res.getRes(datas[i]) != undefined) {
            const id = datas[i]
            Net.down(Res.getRes(datas[i]), function (path) {
              console.log(id)
              File.store(id, path);
            });
          }
        }
      }
    }

    return false;
  },
  getRes(name) {
    for (var i = 0; i < this.resList.length; i++) {
      if (this.resList[i][0] == name)
        return this.resList[i][1];
    }
    return null;
  },
  resList: [
    ['tsimg', 'https://cdn.pixabay.com/photo/2018/01/14/23/12/nature-3082832_1280.jpg'],
    ['th1', 'http://localhost/EndNoteX9_CHS.zip'],
    ['th2', 'http://localhost/EndNoteX9_CHS1.zip'],
    ['th3', 'http://localhost/EndNoteX9_CHS12.zip'],
    ['th4', 'http://localhost/EndNoteX9_CHS13.zip'],
    ['th', 'http://localhost/EndNoteX9_CHS14.zip']
  ],


}