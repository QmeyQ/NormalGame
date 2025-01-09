import Display from "../display/display";

const fs = wx.getFileSystemManager();

const File = {
  loadStore: [],
  fileTime: 0,
  isE: false,
  fileRun: undefined,
  fileList: [],
  fileDatas: [],
  fileNa: [],
  sucList: [],
  volInd: 0,
  vol: -1,
  mFlag: 0,
  sData: [
    [],
  ],
  dataList: [
    [],
  ],

   is(path, suc) {
    try {
       fs.access({
        path: path,
        success() {
          if (suc != undefined){
            suc();
          }
        },
        fail(err) {
          if (suc != undefined){
            suc(err);
          }
        }
      });
    } catch (e) {
      return false;
    }
  },
  /**
   * 
   * @param {*} path 
   * @param {*} suc(data, path)
   */
  readFile(path, suc) {
    if (path == undefined){
      console.error("path is undefined", path);
      return;
    }
    try {
        fs.readFile({
          filePath: path,
          //encoding: '', // 设置编码方式
          success(res) {
              suc(res.data, path);
          },
          fail(error) {
            if (error.errCode === -2147024894) {
              Display.testTest += error.errMsg;
              console.error(`文件不存在：${path}`);
            } else {
              Display.testTest += error.errMsg;
              console.log(`读取文件错误：${error.errMsg}`);
            }
            suc();
          }
        });
    }catch(e){
      console.error(`读取文件时发生异常：${e}`);
      suc();
    }
  },
  /** delete data（name， layout -0） */
  deData(na, flag) {
    if (na == undefined)
      return;
    if (flag == undefined)
      flag = 0;
    var tmp, tmp1;
    for (var i = 0; i < this.dataList[flag].length; i++) {
      tmp = this.dataList[flag].shift();
      tmp1 = this.sData[flag].shift();
      if (tmp != na) {
        this.dataList[flag].push(tmp);
        this.sData[flag].push(tmp1);
      }
    }
  },
  /** put data（name，data， layout -0） */
  putData(na, data, flag) {
    if (flag == undefined) {
      flag = 0;
    }
    if (flag >= this.dataList.length) {
      this.dataList.push([]);
      this.sData.push([]);
    }
    if (this.dataList[flag] == undefined) {
      return false;
    }
    for (var i = 0; i < this.dataList[flag].length; i++) {
      if (this.dataList[flag][i] == na) {
        this.dataList[flag][i] = na;
        this.sData[flag][i] = data;
        return false;
      }
    }
    this.dataList[flag].push(na);
    this.sData[flag].push(data);
    return true;
  },
  getVol() {
    StorageManager.getAllKeys((keys) => {
      if (File.preStore(keys)) {
        File.volInd = keys.length;
        File.vol = 0;
        for (var i = 0; i < keys.length; i++) {
          if (File.getData(keys[i]) == null)
            break;
          File.readFile(File.getData(keys[i]), function (data, p) {
            if (data == undefined)
              return;
            if (File.volInd > 0) {
              File.vol += data.byteLength;
              File.volInd--;
              console.log(File.vol);
            }
          });
        }
      }
    }, (error) => {
      console.log("store:");
      console.error(error);
    });
    return this.vol;
  },
  readDir(path) {
    return fs.readdirSync(path);
  },

  del(path, suc) {
    try {
      fs.unlink({
        filePath: path,
        success() {
          console.log(`文件已删除：${path}`);
          if (suc != undefined) {
            suc();
          }
        },
        fail(err) {
          console.error(`删除文件失败：${err.errMsg}`);
          if (suc != undefined) {
            suc(err);
          }
        }
      });
    } catch (e) {
      console.error(`删除文件时发生异常：${e}`);
      if (suc != undefined) {
        suc(e);
      }
    }
  }
};

export default File;