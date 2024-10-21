
const fs = wx.getFileSystemManager();

export const File = {
  mFlag: 0,
  sData: [
    [],
  ],
  dataList: [
    [],
  ],
  readFile(path, suc){
    fs.readFile({
      filePath: path,
      encoding: '', // 设置编码方式
      success: (res) => {
        console.log('读取的文件：' + path);
        suc(res.data, path);
      },
      fail: (error) => {
        if (error.errCode === -2147024894) {
          console.error(`文件不存在：${tempFilePath}`);
        } else {
          console.error(`读取文件错误：${error.errMsg}`);
        }
      },
    });
  }
  ,
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
  delStore(na, flag){
    if (flag == undefined)
    flag = 0;
    wx.removeStorage({
      key: na,
      success: function (res) {
        console.log(`已删除 key: ${key}`);
      },
      fail: function (error) {
        console.error(`删除 key: ${key} 失败：${error.errMsg}`);
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
    var result = datas.length;
    var tmp = [],
      res = [];
    if (datas[layout] != undefined) {
      for (var i = 0; i < datas[layout].length; i++) {
        for (var j = 0; j < datas.length; j++) {
          if (this.dataList[layout] == undefined || this.dataList[layout][i] == undefined) {
            break;
          }
          if (this.dataList[layout][i] == datas[j]) {
            result--;
            res.push(this.dataList[layout][i]);
            break;
          }
        }
      }
    }
    tmp = [];
    for (var j = 0; j < datas.length; j++) {
      for (var i = 0; i < res.length; i++) {
        if (datas[j] == res[i]){
          i += 10;
          break;
        }
      }
      if (i >= res.length)
        tmp.push(datas[j]);
    }
    console.log("pre List:");

    for (var i = 0; i < tmp.length; i++) {
      const na = tmp[i];
      wx.getStorage({
        key: tmp[i],
        success(res) {
          if (res.data === null) {
            console.log('存储的值为空');
          } else {
            console.log(res);
            console.log('获取的值为：', res.data);
            File.putData(na, res.data);
          }
        },
        fail(err) {
          if (err.errMsg === 'getStorage:fail key not exist') {
            console.log('指定的 key 不存在');
          } else {
            console.error(na + '其他错误：', err);
            File.putData(na, null);
            console.log(File.dataList)
            console.log(File.sData)
          }
        }
      })
    }


    if (result > 0) {
      console.log(result)
      return false;
    } else {

      return true;
    }
  },
  getData(value, flag) {
    if(flag == undefined)
    flag = 0;
    if (this.dataList[flag] == undefined) {
      return ;
    }
    for (var i = 0; i < this.dataList[flag].length; i++) {
      if (this.dataList[flag][i] == value) {
        return this.sData[flag][i];
      }
    }
    return ;
  },
  deData(na, flag){
    if(flag == undefined)
    flag = 0;
    var tmp, tmp1;
    for(var i = 0; i < this.dataList[flag].length; i++){
      tmp = this.dataList[flag].shift();
      tmp1 = this.sData[flag].shift();
      if(tmp != na){
        this.dataList[flag].push(tmp);
        this.sData[flag].push(tmp1);
      }
    }
  },
  putData(na, data, flag) {
    if (flag == undefined) {
      flag = 0;
    }
    if (flag > this.dataList.length) {
      this.dataList.push([])
      this.sData.push([])
    }
    if (this.dataList[flag] == undefined) {
      return undefined;
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
  }
}