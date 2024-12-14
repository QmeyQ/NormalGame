import Display from "../display/display";



var v;

var udp;
const Net = {
  id: "#0",
  strList: [],
  onList: [],
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
        wx.getUserInfo({
          success: function (res) {
            console.log(res);
            var userInfo = res.userInfo;
            var nickName = userInfo.nickName;
            var avatarUrl = userInfo.avatarUrl;
            var gender = userInfo.gender;
            var province = userInfo.province;
            suc(res)
          }
        })
      }
    })
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

  /**
   * 向公共stun服务器发送udp请求获取udp打洞ip和端口
   */
  getIp(suc) {
    //请求quest
    var quest = new Uint8Array([0, 1, 0, 0, 0x21, 0x12, 0xA4, 0x42, 0x12, 0x34, 0x56, 0x78, 0x9A, 0xBC, 0xDE, 0xF0, 0x12, 0x34, 0x56, 0x78])
    /**为quest后12位设置随机值 */
    for (let i = 8; i < quest.length; i++) {
      quest[i] = Math.floor(Math.random() * 256);
    }
    this.udpSend(quest, "stun.l.google.com", 19302, (res) => {
      /**解STUN 服务器返回的内容解析如下：
        * 响应消息解析
       * 1. 消息类型
     * 01 01：表示绑定响应（Binding Response）。
     * 2. 消息长度
     * 00 0C：表示消息体的长度为 12 字节。
     * 3. 魔幻饼干
     * 21 12 A4 42：魔幻饼干，固定值。
     * 4. 事务ID
     * 12 34 56 78 9A BC DE F0 12 34 56 78：事务ID，用于匹配请求和响应。
     * 5. 属性
     * 00 20 00 08：属性头，表示属性类型和长度。
     * 00 20：属性类型，0x0020 表示 XOR-MAPPED-ADDRESS。
     * 00 08：属性长度，表示属性值的长度为 8 字节。
     * 00 01 99 BD 51 72 87 A4：属性值。
     * 00 01：地址族，0x0001 表示 IPv4。
     * 99 BD：端口号，0x99BD 转换为十进制为 39357。
     * 51 72 87 A4：XORed IP 地址。
     * 解析 XORed IP 地址
     * XORed IP 地址需要与魔幻饼干和事务ID进行异或运算，以恢复原始的 IP 地址。
     * 
     * 魔幻饼干：0x2112A442。
     * 事务ID：12 34 56 78 9A BC DE F0 12 34 56 78。
     * 我们只需要前 4 个字节的事务ID来进行异或运算。
     * 
     * 51 72 87 A4：XORed IP 地址。
     * 21 12 A4 42：魔幻饼干。
     * 12 34 56 78：事务ID 的前 4 个字节。
     * 进行异或运算：
     * 将结果转换为点分十进制表示：
       */

      var datas = new Uint8Array(res.message);
      //v = -1;
      /*Display.testTest = Display.testTest.slice(0, 150) + "\n";
      while(++v<datas.length){
        Display.testTest +=  datas[v] + ","
        if(v % 15 == 14)
          Display.testTest += "\n"
      }
      //Display.testTest += "\n"  */
      if (datas[0] != 1 || datas[1] != 1) {
        return;
      }
      //4-7 [8]-[12] things id xor  00 20 00 08 xor-mapped-address-xor 00 08 xor-port-xor
      var things = [datas[8], datas[9], datas[10], datas[11]]
      var addMode = datas[20] << 8 | datas[21];
      var ipMode = datas[24] << 8 | datas[25];
      var port = (datas[26]) << 8 | (datas[27])//(datas[26] ^ datas[4]) << 8 | (datas[27]^ datas[5])
      var ip = ""
      ip += ((datas[28]) ^ (datas[4])) + "."
      ip += ((datas[29]) ^ (datas[5])) + "."
      ip += ((datas[30]) ^ (datas[6])) + "."
      ip += ((datas[31]) ^ (datas[7]) & 0xff);

      if (ip != Net.ip || Net.port != port) {
        this.flag = true;
        Net.ip = ip;
        Net.port = port;
      }

      console.log("ip:" + ip + ":" + port, (datas[26]) << 8 | (datas[27]));

    }, "getip");

    /*wx.request({
      url: 'https://ip9.com.cn/get',
      success: function (res) {
        console.log(res);
        if(res.data.ip == undefined || res.data.postal == undefined)
          return;
        if(Net.ip != res.data.ip || Net.port != res.data.postal){
          this.flag = true;
          Net.ip = res.data.ip;
          Net.port = res.data.postal;
          console.log("ip:" + Net.ip + ":" + Net.port);
        }
        if(suc!= undefined)
          suc();
      },
      fail: function (err) {
        console.log(err);
      }
    })*/
  },

  /**启动udp循环线程 */
  udpLoop() {

    setTimeout(function () {

      for (let i = 0; i < Net.udpList.length; i++) {
        if (Net.udpList[i][0] == Net.id || Net.udpList[i][0] == Net.id + '0') {
          if (Net.flag || (Net.xx++ % 100) == 0) {
            Display.testTest += Net.udpList[i][1] + ':' + Net.udpList[i][2] + "本机id:" + Net.id + "\n"
          }
          continue;
        }
        //console.log(this.udpList[i][1], this.udpList[i][2], "本机id:" + this.id);
        Net.udpSend('@' + Net.id + ":" + Net.ip + ":" + Net.port, Net.udpList[i][1], Net.udpList[i][2])
        Net.udpSend("@" + Net.id + ":" + Net.ip + ":" + Net.port, "47.119.120.119", 50132);

      }
      if (Net.flag || (Net.xx++ % 500) == 0) {
        //this.getIp();
        //console.log('to server:', Net.id + ":" + Net.ip + ":" + Net.port, this.id);
        Net.udpSend(Net.id + ":" + Net.ip + ":" + Net.port, "47.119.120.119", 50132);
        Net.flag = false;
      }
      Net.udpLoop();
    }, 10);
  },
  /**解析字符串为二元数组,源格式:#0-100:ip:端口\n#0-100:ip:端口...
   * 解析为[[#0-100,ip,端口],[...]]
  */
  Uip(data) {
    if (data == undefined || data == null || data.length < 1) {
      return;
    }
    this.udpList = [];
    var datas = data.split("\n");
    if (datas[datas.length - 1][1] == undefined)
      datas.pop();
    var v = -1;
    var tmp = null;
    while (++v < datas.length) {
      tmp = datas[v].split(":");
      this.udpList.push([]);
      this.udpList[this.udpList.length - 1].push(tmp[0])
      this.udpList[this.udpList.length - 1].push(tmp[1])
      this.udpList[this.udpList.length - 1].push(tmp[2])
      this.udpList[this.udpList.length - 1].push(tmp[3])
      this.udpList[this.udpList.length - 1].push(tmp[4])
      this.udpList[this.udpList.length - 1].push(tmp[5])
    }
    this.udpLoop();
    return this.udpList;
  },
  /** datas:arraybuffer/string , ip, port, on*/
  udpSend(datas, ip, port, on, onStr) {
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
          while (++v < this.onList.length) {
            Net.onList[v](res);
          }
        });
      }
      if (on != undefined) {
        v = this.strList.length;
        while (v-- > 0) {
          if (this.strList[v] == onStr) {
            break;
          }
        }
        if (v <= 0) {
          this.strList.push(onStr);
          this.onList.push(on);
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
  /**
   * 
   * @param {*} link 
   * @param {*} suc 
   */
  down(link, suc) {
    try {
      wx.downloadFile({
        url: link,
        success: (res) => {
          // 可以在这里将临时文件路径保存到持久化存储中
          // 例如：wx.saveFile
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
      url: 'http://localhost:3000/upload',
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