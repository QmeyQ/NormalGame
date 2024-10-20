var yyy = 3;

export const EnDis = {
  LF: 0,
  enD: {
    trans: 0xe0,
    da: 0xe1,
    re: 0xe2,
    transE: 0xe3,
  },
  oD: [],
  rD: [],
  mo: 0,
  Omo: 0,
  index: 0,
  oIndex: 0,
  sInd: 0,
  dInd: 0,
  ctx: canvas.getContext('2d'),
  enData(path) {
    const img = new Image();
    img.src = path;
    img.onload = function () {
      EnDis.ctx.drawImage(img, 0, 0, img.width, img.height);
      console.log(EnDis.oD = EnDis.ctx.getImageData(0, 0, img.width, img.height).data)
      EnDis.rD = []
      EnDis.rD[-1] = [img.width >> 8 & 0xff, img.width & 0xff, img.height >> 8 & 0xff, img.height & 0xff]
      var j = -1;
      EnDis.index = EnDis.oIndex = EnDis.mo = EnDis.Omo = 0;
      console.log("h:" + img.height + "  w:" + img.width)
      for (var l = 0; l < img.height; l++) {
        EnDis.rD.push([]);
        j = 0;
        EnDis.mo = EnDis.Omo = 0;
        EnDis.index = 0;
        for (var i = 0; i < img.width * 4;) {

          if (EnDis.oD[i + l * img.width * 4 + 3] == 0) {
            EnDis.mo = 1;
            //重复值判断 && 超行截至 repeated value judgment
          } else if (EnDis.oD[i + l * img.width * 4] == EnDis.oD[i + l * img.width * 4 + 4] && EnDis.oD[i + l * img.width * 4 + 1] == EnDis.oD[i + l * img.width * 4 + 5] && EnDis.oD[i + l * img.width * 4 + 2] == EnDis.oD[i + l * img.width * 4 + 6] && EnDis.oD[i + l * img.width * 4 + 3] == EnDis.oD[i + l * img.width * 4 + 7]&& i < img.width * 4 - 4) {
            EnDis.mo = 2;
          } else if (EnDis.oD[i + l * img.width * 4 + 3] == EnDis.oD[i + l * img.width * 4 + 7]&& i < img.width * 4 - 4) {
            EnDis.mo = 3;
          } else {
            EnDis.mo = 4;
          }

          ////------------------ 具有重复属性的空补位 repeat patch
          if ((EnDis.Omo == 3 && EnDis.mo != 3) || (EnDis.Omo == 2 && EnDis.mo != 2)){
            i += 4;
            EnDis.mo = 0;
          }

          if (EnDis.mo != EnDis.Omo) {
            EnDis.index = 0; //-----------start new 

            if (EnDis.mo == 1) {
              EnDis.rD[l].push(EnDis.enD.trans);
              ++j
              EnDis.rD[l].push(0);
              EnDis.dInd = j++;
            } else if (EnDis.mo == 2) {
              EnDis.rD[l].push(EnDis.enD.re);
              ++j
              EnDis.rD[l].push(0);
              EnDis.dInd = EnDis.oIndex;
              EnDis.dInd = j++;
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4]);
              ++j,
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 1]);
              ++j,
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 2]);
              ++j,
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 3]);
              ++j
              EnDis.index++;
            } else if (EnDis.mo == 3) { //   transparent rep
              EnDis.rD[l].push(EnDis.enD.transE); //---- flag 
              ++j,
              EnDis.rD[l].push(0); ///--length
              EnDis.dInd = j++; /// ---  address flag
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 3]); // -- patch first data black
              ++j
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4]);
              ++j,
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 1]);
              ++j,
              EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 2]);
              ++j
              EnDis.index++;
            } else if (EnDis.mo == 4) {
              EnDis.rD[l].push(EnDis.enD.da);
              ++j;
              EnDis.rD[l].push(0);
              EnDis.dInd = j++;
            }

            EnDis.Omo = EnDis.mo;

          }
          ///////////////// programing.....
          if (EnDis.mo == 3) { //   transparent rep
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 4]); //--- second data black
            ++j,
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 5]);
            ++j,
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 6]);
            ++j
          } else if (EnDis.mo == 4) { //   data
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4]);
            ++j,
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 1]);
            ++j,
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 2]);
            ++j,
            EnDis.rD[l].push(EnDis.oD[i + l * img.width * 4 + 3]);
            ++j
          }
          if (EnDis.mo != 0) {
            i = i + 4;
            EnDis.index++;
            EnDis.rD[l][EnDis.dInd] = EnDis.index;
          }
        }
         
      }
      EnDis.LF = 1;


      wx.request({
        url: 'http://localhost:3000/upload',
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        data: EnDis.rD,
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

      console.log(EnDis.rD)
      console.log(EnDis.oD.length)
      //wx.requestFileSystemAccess;
      wx.setStorage({
        key: 'keyName', // 存储的 key 名称
        data: EnDis.rD, // 要存储的数据
        success(res) {
          console.log('Data stored successfully');
        },
        fail(err) {
          console.error('Failed to store data:', err);
        },
        complete(res) {
          // 存储完成后的回调函数
        }
      });
    };

    return EnDis.rD;

  },
  deData(datas) {
    yyy = 3;
    const wid = datas[-1][0] << 8 | datas[-1][1];
    const hei = datas[-1][2] << 8 | datas[-1][3];
    if (wid < 0 || hei < 0) {
      return;
    }
    EnDis.rD = [];
    for (var l = 0; l < datas.length ; l++) {
      for (var i = 0; i < datas[l].length;) {
        if (datas[l][i] == EnDis.enD.trans) {
          this.mo = 1;
          i++;
          for (var trans = 0; trans < datas[l][i]; trans++) {
            EnDis.rD.push(0);
            EnDis.rD.push(0);
            EnDis.rD.push(0);
            EnDis.rD.push(0);
          }
          i++;
        } else if (datas[l][i] == EnDis.enD.re) {
          this.mo = 2;
          i++;
          for (var trans = 0; trans < datas[l][i]; trans++) {
            EnDis.rD.push(datas[l][i + 1]);
            EnDis.rD.push(datas[l][i + 2]);
            EnDis.rD.push(datas[l][i + 3]);
            EnDis.rD.push(datas[l][i + 4]);
          }
          i += 5;
        } else 
        if (datas[l][i] == EnDis.enD.transE) {
          this.mo = 3;
          i++;
          this.index = i;
          i += 2;
         
          for (var trans = 0; trans < datas[l][this.index]; trans++) {
            EnDis.rD.push(datas[l][i]);
            EnDis.rD.push(datas[l][i + 1]);
            EnDis.rD.push(datas[l][i + 2]);
            EnDis.rD.push(datas[l][this.index + 1]);
            i += 3;
          }
         
        } else if (datas[l][i] == EnDis.enD.da) {
          this.mo = 4;
          i++;
          this.index = i;
          i++;

          for (var trans = 0; trans < datas[l][this.index]; trans++) {
            EnDis.rD.push(datas[l][i]);
            EnDis.rD.push(datas[l][i + 1]);
            EnDis.rD.push(datas[l][i + 2]);
            EnDis.rD.push(datas[l][i + 3]);
            i += 4;
          }

        } else {
          console.log(l + "/////" + i);
          console.log(this.mo + "/////" + datas[l][i]);
          console.log(datas[l]);
          i++;
        }
      }

      if(this.rD.length > (l + 1) * wid * 4){
        if(yyy > 0){
          console.log(l + "/////" + wid);
          console.log(this.mo + "/////" + (this.rD.length - (l + 1) * wid * 4));
          
          console.log(datas[l]);
          yyy --;
          }
      }

    }
    console.log(EnDis.rD.length + "////" + 4 * wid * hei)
    console.log(EnDis.rD)
    const imageData = EnDis.ctx.createImageData(wid, hei);
    imageData.data.set(EnDis.rD);
    EnDis.ctx.putImageData(imageData, 0, 108);

  }

}