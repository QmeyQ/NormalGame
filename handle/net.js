const {
  File
} = require('./file')
const {
  Res
} = require('./res')

export const Net = {
  flag: false,
  fileList: [],
  down(id) {
    if (this.flag!=true) {
      this.flag = true;
      if (File.preStore([Res.teimg.na], File.mFlag)) {
        console.log("pre ok:" + File.getData(Res.teimg.na))

        if (File.getData(Res.teimg.na) != null) {
          console.log("读取内存：" + res.tempFilePath)
          this.fileList.push(res.tempFilePath);
          Net.flag = false;
        } else {
          console.log("download File:" + File.getData(Res.teimg.na))
          wx.downloadFile({
            url: id.va,
            success: (res) => {

              this.fileList.push(res.tempFilePath);
              File.store(id.na, res.tempFilePath);
              // 可以在这里将临时文件路径保存到持久化存储中
              // 例如：wx.saveFile
              Net.flag = false;
              console.info("down sucess:" + res.tempFilePath);
            },
            fail: (err) => {
              console.error('下载失败：', err);
              Net.flag = false;
            },
          });
        }
      }else{
        console.log("pre fail")
        Net.flag = false;
      }
    }
  },
  other() {
    wx.request({
      url: 'http://localhost:3000/upload',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      data: [EnDis.rD[-1][0], EnDis.rD[-1][1], EnDis.rD[-1][2], EnDis.rD[-1][3], EnDis.rD],
      success(res) {
        if (res.statusCode === 200) {
          console.log('上传成功');
          console.log(res.data); // 这里假设服务器返回了JSON格式的数据
        } else {
          console.error('上传失败');
        }
      },
      fail(err) {
        console.error('请求失败', err);
      }
    });
  }
}