

export default class Res {
  tD;
  path;
  item;
  Net = require("./net");
  File = require("./file");
  /**
   * 
   * @param {*解析资源文件} files 
   */
  constructor() {
    //return this;
  }



  /**从链接文件初始资源目录*/
  url(url) {
    this.Net.default.down(url, function (res) {
      console.log(res)
      this.File.default.readFile(res.tempFilePath, function (res) {
        console.log(res);
        console.log(JSON.parse(new Uint8Array(res).toString()));
      })
    }.bind(this))//下载资源对照文件
    return this;
  }

  downRes(RO, flag) {
    if (flag == undefined)
      flag = 0;
    if (datas == undefined)
      return false;
    if (File.preStore(datas, flag)) {
      //console.log("pre ok")
      for (var i = 0; i < datas.length; i++) {
        tD = File.getData(datas[i]);
        if (tD !== null) {
          File.readFile(tD, function (datas, path) {
            if (path == undefined)
              return
            if (datas != undefined && datas.byteLength > 1) {
              Net.fileList.push(path);
              Display.drawing(EnDis.initData(new Uint8Array(datas)));
            } else {
              console.log("文件wu效：");
              console.log(datas)
              File.delStore(tD);
            }
          })

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
  }
  getRes(name) {
    for (var i = 0; i < this.resList.length; i++) {
      if (this.resList[i][0] == name)
        return this.resList[i][1];
    }
    return null;
  }
}