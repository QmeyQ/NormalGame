const fs = wx.getFileSystemManager();

export const File = {
  vol: -1,
  mFlag: 0,
  sData: [
    [],
  ],
  dataList: [
    [],
  ],
  /**
   * 
   * @param {*} path 
   * @param {*} suc(data, path)
   */
  readFile(path, suc) {
    try {
        return fs.readFileSync(path);
    } catch (e) {
      console.log('readfile:' + path, e);
      return ;
    }
  },
  store(keyName, datas) {
    wx.setStorage({
      key: keyName, // 存储的 key 名称
      data: datas, // 要存储的数据
      success(res) {},
      fail(err) {
        console.error('Failed to store data:', err);
      },
      complete(res) {
        // 存储完成后的回调函数
        console.log(res)
      }
    });
  },
  delStore(na, flag) {
    if (flag == undefined)
      flag = 0;
    wx.removeStorage({
      key: na,
      success: function (res) {
        console.log(`已删除 key: ${this.key}`);
      },
      fail: function (error) {
        console.error(`删除 key: ${this.key} 失败：${error.errMsg}`);
      },
      complete: function () {
        console.log('删除 key 操作完成');
      }
    });
    this.deData(na, flag);
  },
  /*** 预加载的键值对 */
  preStore(datas, layout) {
    if (layout == undefined)
      layout = 0;
    if (datas == undefined)
      return false;
    var tmp = [];
    if (this.dataList[layout] != undefined) {
      for (var i = 0; i < datas.length; i++) {
        //tmp = datas.shift();
        look: while (true) {
          for (var j = 0; j < this.dataList[layout].length; j++) {
            if (this.dataList[layout] == undefined || this.dataList[layout][j] == undefined) {
              tmp.push(datas[i]);
              break look;
            }
            if (this.dataList[layout][j] == datas[i]) {
              break look;
            }
          }
          tmp.push(datas[i]);
          break;
        }
      }
    }

    for (var i = 0; i < tmp.length; i++) {
      wx.getStorage({
        key: tmp[i],
        success(res) {
          if (res.data === null) {
            console.log('存储的值为空');
          } else {
            //console.log(res);
            //console.log('获取的值为：', res.data);
          }
          File.putData(this.key, res.data);
        },
        fail(err) {
          if (err.errMsg === 'getStorage:fail key not exist') {
            console.log('指定的 key 不存在');
          } else {
            console.info(this.key + '其他错误：', err);
          }
          File.putData(this.key, null);
          //console.log(File.dataList)
          //console.log(File.sData)
        }
      })
    }

    if (tmp.length > 0) {
      return false;
    } else {
      return true;
    }
  },
  /** */
  getData(value, flag) {
    if (flag == undefined)
      flag = 0;
    if (this.dataList[flag] == undefined) {
      return;
    }
    for (var i = 0; i < this.dataList[flag].length; i++) {
      if (this.dataList[flag][i] == value) {
        return this.sData[flag][i];
      }
    }
    return;
  },
  deData(na, flag) {
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
  putData(na, data, flag) {
    if (flag == undefined) {
      flag = 0;
    }
    if (flag >= this.dataList.length) {
      this.dataList.push([])
      this.sData.push([])
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

    File.vol = 0;
    wx.getStorageInfo({
      success(res) {
        if (File.preStore(res.keys)) {
          for (var i = 0; i < res.keys.length; i++) {
            if (File.getData(res.keys[i]) == null)
              break;
            File.readFile(File.getData(res.keys[i]), function (data, p) {
              //console.log(File.getData(res.keys[i]));
              if (data == undefined)
                return;
              File.vol += data.byteLength;
            });
          }
        }
        console.log(File.vol)
      },
      fail(error) {
        console.log("store:")
        console.error(error);
      }
    });

    return this.vol
  }
}