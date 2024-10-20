export const File = {
  mFlag: 0,
  sData: [
    [],
  ],
  dataList: [
    [],
  ],
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
      w: while (true) {
        for (var i = 0; i < res.length; i++) {
          if (datas[j] == res[i])
            break w;
        }
        tmp.push(datas[j]);
      }
    }
    //console.log("pre List:");
    //console.log(res)
   // console.log(tmp)
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
      return false;
    } else {

      return true;
    }
  },
  getData(value, flag) {
    if (this.dataList[flag] == undefined) {
      return undefined;
    }
    for (var i = 0; i < this.dataList[flag].length; i++) {
      if (this.dataList[flag].length == value) {
        return this.sData[flag][i];
      }
    }
    return undefined;
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