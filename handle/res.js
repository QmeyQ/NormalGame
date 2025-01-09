import File from "./file";
import Storage from "./storage";
import EnDis from "../display/enDis";
import Display from "../display/display";

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
    Storage.pro(["resJson"]);
    this.img = [];
    return this;
  }



  /**从链接文件初始资源目录*/
  url(url, forse) {

    Storage.get("resJson", (data) => {
      if (data === null || forse != undefined) {
        console.log("Load:res.json文件");
        this.Net.default.down(url, function (downRes) {
          if (downRes == null) {
            Storage.delete("resJson");
            console.log("res.json文件下载失败");
            return;
          }
          this.File.default.readFile(downRes.tempFilePath, (res) => {
            if (res == null) {
              Storage.delete("resJson");
              return;
            }
            console.log("res.json文件下载成功");
            this.list = JSON.parse(EnDis.bToS(new Uint8Array(res)));
            console.log("res.json文件加载成功:" + downRes.tempFilePath);
            Storage.store("resJson", downRes.tempFilePath);
          })
        }.bind(this))//下载资源对照文件
      } else{
        this.File.default.readFile(Storage.result, (res) => {
        if (res == null) {
          Storage.delete("resJson");
          console.log("res.json文件加载失败");
          this.url(url, 0);
          return;
        }
        try {
          this.list = JSON.parse(EnDis.bToS(new Uint8Array(res)));
          console.log("res.json文件加载成功");
        } catch (error) {
          console.log("res.json文件格式错误");
          Storage.delete("resJson");
            this.url(url, 0);
        }
      })
    }
    });
    return this;
  }

  down(str, forse) {
    Storage.get(str, (dataRes) => {
      if (dataRes != undefined && forse == undefined) {
        this.File.default.is(dataRes, function (res) {
          if (res) {
            Storage.delete(str);
            console.log("文件错误:" + str, res);
            this.down(str, 0)
            return
          }
          this.img[str] = dataRes;
          this.process++;
        }.bind(this))
      } 
      else {
        this.Net.default.down((this.list[str][0]), function (path) {
          if (path.dataLength < 10) {
            console.log("文件下载失败", this.list[str][0], res);
            this.err++;
            return;
          }
          Storage.store(str, path.tempFilePath);
          this.img[str] = path.tempFilePath;
          this.process++;
        }.bind(this))
      }
    });
  }

  downRes() {
    this.err = 0;
    this.process = 0;
    this.img = {};
    this.count = 0;
    let keys = Object.keys(this.list);

      for (let j = 0; j < keys.length; j++) {
        if (keys[j] == 'v') {
          continue;
        }
        const keyName = keys[j];
        this.count += this.list[keyName].length - 1;
        this.img[keyName] = [];
        let vList = [];
        var v = this.list[keyName].length;
        // 补足资源文件第一个元素差
        while (--v > 0) {
          vList.push(keyName + v);
        }
        Storage.pro(vList);
        for (var ii = 1; ii < this.list[keyName].length; ii++) {
          const ind = ii;
          this.img[keyName].push('');
          Storage.get(keyName + ind, (dataRes) => {
            if (dataRes != undefined) {
              this.File.default.is(dataRes, function (res) {
                if (res != undefined) {
                  Storage.delete(keyName + ind);
                  console.log("文件错误:" + keyName + ind, res);
                  this.Net.default.down((this.list[keyName][0] + this.list[keyName][ind]), function (path) {
                    if (path.dataLength < 10) {
                      console.log("文件下载失败", this.list[keyName][0] + this.list[keyName][ind], res);
                      this.err++;
                      return;
                    }
                    Storage.store(keyName + ind, path.tempFilePath);
                    this.img[keyName][ind - 1] = path.tempFilePath;
                    this.process++;
                  }.bind(this))
                  return
                }
                this.img[keyName][ind - 1] = dataRes;
                this.process++;
              }.bind(this))
            } else {
              this.Net.default.down((this.list[keyName][0] + this.list[keyName][ind]), function (path) {
                if (path.dataLength < 10) {
                  console.log("文件下载失败", this.list[keyName][0] + this.list[keyName][ind], res);
                  this.err++;
                  return;
                }
                Storage.store(keyName + ind, path.tempFilePath);
                this.img[keyName][ind - 1] = path.tempFilePath;
                this.process++;
              }.bind(this))
            }
          });
        }
      }

    return;
  }
  /**
   *反回reslist 名称所对应的下载地址
   */
  get(name){
    if (this.list[name]) {
      return this.img[this.resList[name]]
    } else {
      console.log("Resource not found: " + name);
      return null;
    }
  }

}