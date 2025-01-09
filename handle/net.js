import Display from "../display/display";



var v;

var udp;
const Net = {
  id: "#0",
  onList: {},
  udpList: [],
  ip: "",
  port: "-1",
  flag: false, //更新地址标记
  fileList: [],
  Run: false,
  xx: 0,
  /**
   * 登录并获取微信登录信息
   */
  login(suc) {
    wx.login({
      success: function (res) {
        console.log(res);
        wx.getUserProfile({
          desc: '微信登录将获取微信名和图片等信息用于注册和登录',
          success: function (res) {
            console.log(res);
            suc(res);
            /*wx.getUserInfo({
              success: function (res) {
                console.log(res);
                /*var userInfo = res.userInfo;
                var nickName = userInfo.nickName;
                var avatarUrl = userInfo.avatarUrl;
                var gender = userInfo.gender;
                var province = userInfo.province;
                suc(res)
              }
            })*/
          }
        })
      }
  });
  },

  downInfo(url) {
    wx.request({
      url: url,
      // 替换为你的文件URL 
      method: 'HEAD', success: function (res) {
        console.log('文件信息:', res);
        if (res.header['Content-Length']) {
          console.log('文件大小:', res.header['Content-Length']);
        } if (res.header['Content-Type']) {
          console.log('文件类型:', res.header['Content-Type']);
        } // 确定是否下载文件 
      }, fail: function (err) { console.error('获取文件信息失败:', err); }
    });
  },
  /** datas:arraybuffer/string , ip, port, on*/
  udpSend(datas, ip, port, onStr, on) {
    if (ip == undefined) {
      return;
    }
    try {
      if (this.udp == undefined) {
        this.udp = wx.createUDPSocket();
        /** 判断对象是否为数字*/
        if (!Number.isFinite(this.udp.bind())) {
          console.log(this.udp.bind(50137));
        }
        this.udp.onMessage((res) => {
          //console.log(res, this.onList);
          v = -1;
            for (let key in this.onList) {
            try{
            if (this.onList[key]) {
              this.onList[key](res);
            }
            }catch(e){
              console.log(e);
            }
            }
        });
      }
      if (on != undefined) {
        if (this.onList[onStr] == undefined) {
          this.onList[onStr] = on;
        }
      }
      this.udp.send({
        address: ip,
        port: port,
        message: datas
      });
    } catch (e) {
      console.log(e);
    }

  },
  delLisen(onName) {
    if (this.onList[onName]) {
      delete this.onList[onName];
    }
  },
  /**
   * 
   * @param {*} link 
   * @param {*} suc 
   */
  down(link, suc) {
    try {
      console.log('donwload file:', link);
      wx.downloadFile({
        url: link,
        success: (res) => {
          if (suc !== undefined)
            suc(res);
        },
        fail: (err) => {
          console.error('下载失败：' + link, err);
        },
      });
    } catch (e) {
      console.log(e);
    }
  },
  upload(datas, path) {
    console.log(datas)
    wx.request({
      url: 'http://normalgame.cn:3000/upload',
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      name: path,
      data: [datas[-1][0], datas[-1][1], datas[-1][2], datas[-1][3], datas],
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

export default Net