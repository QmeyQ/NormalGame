//const imageBinary = require('image-binary');
var yyy = 3;
const
  File
    = '../handle/file';
//import '../js/libs/weapp-adapter'

const EnDis = {

  LF: 0,
  enD: {
    trans: 0xe0,
    da: 0xe1, //0xe1 数据长度共一个字节, 后面跟随rgba像素数据
    re: 0xe2, //0xe2 重复数量共一个字节, rgba 共4个字节
    transE: 0xe3, //0xe3 透明度相同长度共一个字节, a 共一个字节,后面跟随rgb像素数据
    transL: 0xe4, //0xe4 透明度相同长度共2个字节, a 共一个字节,后面跟随rgb像素数据
    daL: 0xe5, //0xe5 数据长度共2个字节, 后面跟随rgba像素数据
    reL: 0xe6, //0xe6 重复数量共2个字节, rgba 共4个字节
    transEL: 0xe7, //0xe7 透明度相同长度共2个字节, a 共一个字节,后面跟随rgb像素数据

  },
  oD: [],
  rD: [],
  mo: 0,
  Omo: 0,
  index: 0,
  oIndex: 0,
  sInd: 0,
  dInd: 0,

  bToS(byteArray) {
    return String.fromCharCode.apply(null, byteArray);
  }
  ,
  /**
   * 将编译的数据绘制在第一个编译数据中,对数据的rgba值进行叠加运算
   * 编译数据的格式:4字节宽高,[0xe0,长度]代表透明像素及个数,[0xe1,长度,r,g,b,a,r,g,b,a...]代表单个像素和个数,[0xe2,长度,r,g,b,a]代表重复像素及个数,
   * [0xe4,长度,a,r,g,b,r,g,b...]代表相同透明度的像素及个数
   */
  putData(mdatas, datas, x = 0, y = 0) {
    //let dataList = [];

    let tmp, tmp2 = [];
    let wid = datas[0][0] << 8 | datas[0][1];
    let hei = datas[0][2] << 8 | datas[0][3];
    var mwid = mdatas[0][0] << 8 | mdatas[0][1];
    var mhei = mdatas[0][2] << 8 | mdatas[0][3];
    let data, head;
    let tw = 0;
    let th = 0, v = 0, lensurp = 0, i = 0, moff = 0; let doff = 0, tl = 0;
    var code, dcode, md = [], dd = [], dlen = 0, len = 0, ind = 0, dind = 0, tlen = 0, tcode, tdata = [], tind = 0;
    let index = 0;
    let dlensurp = 0, dho = 0, dw = 0; let td = 0, tmd = 0; let loo = true; let mm = 0;

    for (let j = y; j < mhei && j < hei + y; j++) {
      if (j == 0) {
        tmp = [];
        tmp.push(mdatas[0][0]);
        tmp.push(mdatas[0][1]);
        tmp.push(mdatas[0][2]);
        tmp.push(mdatas[0][3]);
        ind = 4, dind = 4;
      } else {
        tmp = [];
      }
      while (tw < mwid) {
        /**对编译的图像数据进行合并处理,检查mdatas主图像和datas叠加图像的编译内容,并根据不同的编译代码进行不同的数据合并操作
         * datas:0xe0 将该数量的mdatas数据直接push到tmp中
         * mdatas:0xe0 将该数量的datas数据直接push到tmp中
         * datas:0xe1  将该数量的mdatas数据与相应的mdatas数据进整合
        */
        if (code.length < 1) {
          code = mdatas[j][ind++];
          if (code > 0xe3) {
            code -= 4;
            len = mdatas[j][ind++] << 8 | mdatas[j][ind++];
          } else {
            len = mdatas[j][ind++];
          }
          switch (code) {
            case 0xe0:
              md = [];
              break;
            case 0xe1:
              v = -1;
              while (++v < len * 4)
                md.push(mdatas[j][ind++]);
              break;
            case 0xe2:
              md.push(mdatas[j][ind++]);
              md.push(mdatas[j][ind++]);
              md.push(mdatas[j][ind++]);
              md.push(mdatas[j][ind++]);
              break;
            case 0xe3:
              tind = ind++;
              v = -1;
              while (++v < len) {
                md.push(mdatas[j][ind++]);
                md.push(mdatas[j][ind++]);
                md.push(mdatas[j][ind++]);
                md.push(mdatas[j][ind]);
              }
          }
        }
       
        /** decode datas piexi */
        if (dcode.length < 1) {
          dcode = datas[dho][dind++];
          if (dcode > 0xe3) {
            dcode -= 4;
            dlen = datas[dho][dind++] << 8 | datas[dho][dind++];
          } else {
            dlen = datas[dho][dind++];
          }
          switch (dcode) {
            case 0xe0:
              dd = [];
              break;
            case 0xe1:
              v = -1;
              while (++v < dlen * 4)
                dd.push(mdatas[j][ind++]);
              break;
            case 0xe2:
              dd.push(mdatas[j][ind++]);
              dd.push(mdatas[j][ind++]);
              dd.push(mdatas[j][ind++]);
              dd.push(mdatas[j][ind++]);
              break;
            case 0xe3:
              tind = ind++;
              v = -1;
              while (++v < len * 3) {
                dd.push(mdatas[j][ind++]);
              }
          }
        }
        
       

        tlen += len > dlen ? dlen : len;
        //**             main data trasparent 0  */
        if (code == 0xe0) {
          mm = 0;
          tcode = (datas[dho][dind++]);
          v = -1;

        } else if (dcode == 0xe0) {
          mm = 1;
          tcode = (mdatas[j][ind++]);
          /*** 处理相同的数据类别 */
        } else if (code == dcode && code != 0xe1) {
          mm = 2;
          tcode = (datas[dho][dind++]);
        } else if (code != dcode || code == 0xe1) {
          mm = 3;
          tcode = (0xe1);
        }




        if (tmp.length < 1 || tmp[tmp.length - 1] != tcode[tcode.length - 1]) {
          if (tlen > 255) {
            tmp.push(tlen >> 8)
            tmp.push(tlen & 0xff)
          } else {
            tmp.push(tlen);
          }
          v = -1;
          while (++v < tcode.length - 1) {
            tmp.push(tcode[v]);
          }
        } else {
          tcode.pop();
          v = -1;
          while (++v < tcode.length) {
            switch (tcode[0]) {
              case 0:
                tcode.push(datas[dho][dind++]);
                break;
            }
          }
        }



        if (tw < x) {
          code = mdatas[j][i++];
          tmp.push(code);
          if (code > 0xe3) {
            moff = 2;
            len = mdatas[j][i] << 8 | mdatas[j][i + 1];
          } else {
            len = mdatas[j][i];
            moff = 1;
          }
          lensurp = 0;
          if (len + tw > x) {
            lensurp = len - (x - tw);
            len = len - lensurp;
          }

          if (len > 255) {
            tmp.push(len >> 8)
            tmp.push(len & 0xff)
          } else {
            if (mdatas[j][i] > 0xe3)
              tmp.push(mdatas[j][i] - 4);
            tmp.push(len);
          }
          v = 0;
          if (code > 0xe3)
            code = code - 4;
          switch (code) {
            case 0xe1:
              while (v++ < len * 4)
                tmp.push(mdatas[j][i + moff + v]);
              break;
            case 0xe2:
              tmp.push(mdatas[j][i + moff]);
              tmp.push(mdatas[j][i + moff + 1]);
              tmp.push(mdatas[j][i + moff + 2]);
              tmp.push(mdatas[j][i + moff + 3]);
              break;
            case 0xe3:
              tmp.push(mdatas[j][i + moff]);
              while (v++ < len * 3)
                tmp.push(mdatas[j][i + moff + v]);
              break;
          }
          tw += len;
          i += len;

        } else {///////////////////////////////////////
          if (lensurp == 0) {
            if (mdatas[j][i] > 0xe3) {
              code = mdatas[j][i] - 4;
              len = mdatas[j][i + 1] << 8 | mdatas[j][i + 2];
              moff = 2;
            } else {
              code = mdatas[j][i];
              len = mdatas[j][i + 1];
              moff = 1;
            }
            lensurp = len;
          }

          if (dw < wid) {
            if (dlensurp == 0) {
              if (datas[dho][dw] > 0xe3) {
                dcode = datas[dho][dw] - 4;
                dlen = datas[dho][dw + 1] << 8 | datas[dho][dw + 2];
                doff = 2;
              } else {
                dcode = datas[dho][dw];
                dlen = datas[dho][dw + 1];
                doff = 1;
              }
              dlensurp = dlen;
            }
          } else {
            dcode = 0xe4;
            dlen = 0xffff;
          }


          /** 如果剩余未push字节数大于0，则计算剩余长度和datas数据的整合运算 */

          /*if (code > 0xe3)
            code -= 4;
          if (dcode > 0xe3)
            code -= 4;*/

          if (dlensurp >= lensurp) {
            tl = dlensurp - lensurp
            dlensurp = dlensurp - tl;
            lensurp = 0;
          } else {
            tl = lensurp - dlensurp
            lensurp = lensurp - tl;
            dlensurp = 0;
          }

          if (code == 0xe0) {
            mm = 0;
          } else if (dcode == 0xe0) {
            mm = 1;
            /*** 处理相同的数据类别 */
          } else if (code == dcode && code != 0xe1) {
            mm = 2;
          } else if (code != dcode || code == 0xe1) {
            mm = 3;
          }
          ////////
          if (head.length > 0) {
            if (head[0] != 0xe0 && head[0] != 0xe1 && len <= 65535) {
              if (len > 255) {
                tmp.push(0xe0 + 4);
                tmp.push(len >> 8 & 0xff)
                tmp.push(len & 0xff)
              } else {
                tmp.push(0xe1);
                tmp.push(len);
              }
            }
          }


          if (mm == 0) {

          }


          switch (mm) {
            case 0:

              break;
          }


          v = 0;
          while (v++ < len * 4) {
            if (loo) {
              tmd += mdatas[j][(i + moff + 1 + v)] * mdatas[j][(i + moff + 1) + ~~(v / 4) * 4] / 255;
            } else {
              tmd += datas[j][(dw + doff + 1 + v)] * mdatas[j][(i + doff + 1) + ~~(v / 4) * 4] / 255;
            }
            if (tmd > 255)
              tmd = 255;
            tmp.push(tmd);
          }

          /**v = 0
            while (v++ < len * 4) {
              loo = 0; tmd = 0;
              while (loo++ < 2) {
                td = loo ? code : dcode;
                switch (td) {
                  case 0xe2:
                    if (loo == 0) {
                      tmd += mdatas[j][(i + moff + 1 + v) % 4];
                    } else {
                      tmd += datas[j][(dw + doff + 1 + v) % 4];
                    }
                    tmp.push(tmd);
                    break;
                  case 0xe3:
                    if (loo == 0) {
                      tmd += mdatas[j][(i + moff + 1 + v) % 3] * mdatas[j][i + moff + 1] / 255;
                    } else {
                      tmd += datas[j][(dw + doff + 1 + v) % 3] * mdatas[j][i + doff + 1] / 255;
                    }
                    if (tmd > 255)
                      tmd = 255;
                    tmp.push(tmd);
                }
              }
            } */

          tw += len;

          if (mdatas[j][i] > 0xe3) {
            len = mdatas[j][i + 1] << 8 | mdatas[j][i + 2];
          } else {
            len = mdatas[j][i + 1];
          }

          if (datas[dho][dw] > 0xe3) {
            dlen = datas[dho][dw + 1] << 8 | datas[dho][dw + 2];
          } else {
            dlen = datas[dho][dw + 1];
          }

          if (lensurp == 0) {
            if (code == 0xe0) {
              i += moff + 1;
            } else if (code == 0xe1) {
              i += moff + 1 + len * 4;
            } else if (code == 0xe2) {
              i += moff + 1 + 4;
            } else if (code == 0xe3) {
              i += moff + 2 + len * 3;
            }
          }
          if (dlensurp == 0) {
            if (dcode == 0xe0) {
              dw += doff + 1;
            } else if (dcode == 0xe1) {
              dw += doff + 1 + dlen * 4;
            } else if (dcode == 0xe2) {
              dw += doff + 1 + 4;
            } else if (dcode == 0xe3) {
              dw += doff + 2 + dlen * 3;
            }
          }
        }

        //console.log(tw)
      }
      tw = 0;
      mdatas[j] = tmp;
    }
    console.log("put:", mdatas)
    return { width: mwid, height: mhei, datas: mdatas };
  },
  /** 创建指定宽高的空编译图像数据 */
  create(width, height) {
    let dataList = [];
    dataList.push([])
    dataList[0].push(width >> 8 & 0xff)
    dataList[0].push(width & 0xff)
    dataList[0].push(height >> 8 & 0xff)
    dataList[0].push(height & 0xff)
    for (let i = 0; i < height; i++) {
      if (width > 255) {
        dataList[i].push(0xe4);
        dataList[i].push(width >> 8 & 0xff);
      } else {
        dataList[i].push(0xe0);
      }
      dataList[i].push(width & 0xff);
      dataList.push([]);
    }
    /**移除最后一组空数组 */
    dataList.pop();
    console.log("craete:" + window.innerWidth + "//" + window.innerHeight, dataList)
    return dataList;
  },
  /**
   * 加载编译后的数据成一个具有[height]列的二维数组,每行包含一行的编译数据,解析格式位前4个字节位宽高,
   * 后根据[0xe0,长度],[0xe1,长度,r,g,b,a],[0xe2,长度,a,r,g,b,r,g,b...]格式解析每一列的数据并放入数组中,其长度和应等于width.
   */
  initData(datas) {

    //console.log(datas, "source:")
    let i = 0, l = 0, v = 0, w = 0, mo = 0; let len = 0;
    let dataList = [];
    let width = datas[0] << 8 | datas[1];
    let height = datas[2] << 8 | datas[3];
    ///console.log(width, height);
    let dataLen = datas.length - 4;
    dataList.push([]);
    dataList[0].push(datas[0]);
    dataList[0].push(datas[1]);
    dataList[0].push(datas[2]);
    dataList[0].push(datas[3]);
    i = 4;
    while (l < height) {
      if (w < width) {
        while (true) {
          mo = datas[i]
          if (mo == undefined)
            return dataList;
          if (mo > 0xe3) {
            mo -= 4;
            len = datas[i + 1] << 8 | datas[i + 2];
          } else {
            len = datas[i + 1]
          }
          if (mo >= 0xe0 && mo < 0xe8)
            dataList[l].push(datas[i++]);
          if (len > 255) {
            dataList[l].push(datas[i++]);
          }
          dataList[l].push(datas[i++]);
          if (mo == 0xe0)
            ;
          else if (mo == 0xe1) {//data
            v = len * 4;
            while (v-- > 0) {
              dataList[l].push(datas[i++]);
            }
          } else if (mo == 0xe2) {//repeat
            dataList[l].push(datas[i++]);
            dataList[l].push(datas[i++]);
            dataList[l].push(datas[i++]);
            dataList[l].push(datas[i++]);
          } else if (mo == 0xe3) {        //repate transparent format:e3 quantity transparent r g b r g b...
            dataList[l].push(datas[i++]);
            v = len * 3;
            while (v-- > 0) {
              dataList[l].push(datas[i++]);
            }
          } else {
            //console.log(datas, i);
            i++;
            break;
          }
          w += len;
          break;
        }
      } else {
        l++;
        w = 0;
        dataList.push([]);
      }
    }
    //console.log(dataList);
    return dataList;//{ width: width, height: height, datas:dataList };
  },

  /**
   * 
   * @param {*} datas 
   * @returns 
   */
  deData(datas, line) {
    //console.log(datas)
    var code = 0, len = 0, ind = 0, tind = 0, v;
    if (line != undefined) {
      EnDis.rD = [];
      if (datas[0] < 0xe0 || datas[0] > 0xe7) {
        ind += 4;
      }
      while (ind < datas.length) {
        code = datas[ind++];
        if (code > 0xe3) {
          len = datas[ind++] << 8 | datas[ind++];
          code -= 4;
        } else {
          len = datas[ind++];
        }
        switch (code) {
          case 0xe0:
            v = -1;
            while (++v < len * 4) {
              EnDis.rD.push(0);
            }
            break;
          case 0xe1:
            v = -1;
            while (++v < len * 4) {
              EnDis.rD.push(datas[ind++]);
            }
            break;
          case 0xe2:
            v = -1;
            while (++v < len) {
              EnDis.rD.push(datas[ind]);
              EnDis.rD.push(datas[ind + 1]);
              EnDis.rD.push(datas[ind + 2]);
              EnDis.rD.push(datas[ind + 3]);
            }
            ind += 4;
            break;
          case 0xe3:
            tind = ind++;
            v = -1;
            while (++v < len) {
              EnDis.rD.push(datas[ind++]);
              EnDis.rD.push(datas[ind++]);
              EnDis.rD.push(datas[ind++]);
              EnDis.rD.push(datas[tind]);
            }
            break;
          default:
            console.log(code)
            break;
        }
      }
      return EnDis.rD;
    }

    yyy = 3;
    const wid = datas[0][0] << 8 | datas[0][1];
    const hei = datas[0][2] << 8 | datas[0][3];
    if (wid < 0 || hei < 0) {
      return;
    }
    EnDis.rD = [];
    for (var l = 0; l < datas.length; l++) {
      for (var i = 0; i < datas[l].length;) {
        this.mo = datas[l][i];
        if (this.mo >= EnDis.enD.trans + 4) {
          this.mo -= 4;
          len = datas[l][i + 1] << 8 | datas[l][i + 2];
        } else
          len = datas[l][i + 1];
        if (this.mo == EnDis.enD.trans) {
          this.mo = 1;
          i++;
          for (var trans = 0; trans < len; trans++) {
            EnDis.rD.push(0);
            EnDis.rD.push(0);
            EnDis.rD.push(0);
            EnDis.rD.push(0);
          }
          i++;
        } else if (datas[l][i] == EnDis.enD.re) {
          this.mo = 2;
          i++;
          if (len > 255)
            i++;
          for (var trans = 0; trans < len; trans++) {
            EnDis.rD.push(datas[l][i + 1]);
            EnDis.rD.push(datas[l][i + 2]);
            EnDis.rD.push(datas[l][i + 3]);
            EnDis.rD.push(datas[l][i + 4]);
          }
          i += 5;
        } else if (datas[l][i] == EnDis.enD.transE) {
          this.mo = 3;
          i++;
          if (len > 255)
            i++;
          this.index = i;
          i += 2;

          for (var trans = 0; trans < len; trans++) {
            EnDis.rD.push(datas[l][i]);
            EnDis.rD.push(datas[l][i + 1]);
            EnDis.rD.push(datas[l][i + 2]);
            EnDis.rD.push(datas[l][this.index + 1]);
            i += 3;
          }

        } else if (datas[l][i] == EnDis.enD.da) {
          this.mo = 4;
          i++;
          if (len > 255)
            i++;
          i++;

          for (var trans = 0; trans < len; trans++) {
            EnDis.rD.push(datas[l][i]);
            EnDis.rD.push(datas[l][i + 1]);
            EnDis.rD.push(datas[l][i + 2]);
            EnDis.rD.push(datas[l][i + 3]);
            i += 4;
          }

        } else {
          i++;
        }
      }

    }
    return { width: wid, height: hei, datas: EnDis.rD };
    const imageData = EnDis.ctx.createImageData(wid, hei);
    imageData.data.set(EnDis.rD);
    EnDis.ctx.putImageData(imageData, 0, 108);

  }
  , enData(filePath, suc) {

    const loader = new THREE.ImageLoader();
    loader.load(filePath, (image) => {
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load(filePath, (texture) => {
        // 将常规纹理转换为 DataTexture
        const dataTexture = new THREE.DataTexture(
          texture.image.data,
          texture.image.width,
          texture.image.height,
          texture.format,
          texture.type
        );
        suc({ width: dataTexture.imageData.width, height: dataTexture.imageData.height, datas: dataTexture.imageData.data });
      }, undefined, (error) => {

      });
    });

    // `dataTexture.image.data` 是图像的原始像素数据
    return;
    File.readFile(path, function (datas, path) {
      if (datas == undefined) {
        console.log(path)
        return;
      }
      const png = new PNG();
      png.parse(datas, function (error, data) {
        if (error) throw error;
        console.log("paser:", x)
        suc({ width: data.width, height: data.height, datas: data.data });


      });
    })

    return;
    const img = new Image();
    img.src = path;
    img.onload = function () {
      EnDis.ctx.drawImage(img, 0, 0, img.width, img.height);
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
          } else if (EnDis.oD[i + l * img.width * 4] == EnDis.oD[i + l * img.width * 4 + 4] && EnDis.oD[i + l * img.width * 4 + 1] == EnDis.oD[i + l * img.width * 4 + 5] && EnDis.oD[i + l * img.width * 4 + 2] == EnDis.oD[i + l * img.width * 4 + 6] && EnDis.oD[i + l * img.width * 4 + 3] == EnDis.oD[i + l * img.width * 4 + 7] && i < img.width * 4 - 4) {
            EnDis.mo = 2;
          } else if (EnDis.oD[i + l * img.width * 4 + 3] == EnDis.oD[i + l * img.width * 4 + 7] && i < img.width * 4 - 4) {
            EnDis.mo = 3;
          } else {
            EnDis.mo = 4;
          }

          ////------------------ 具有重复属性的空补位 repeat patch
          if ((EnDis.Omo == 3 && EnDis.mo != 3) || (EnDis.Omo == 2 && EnDis.mo != 2)) {
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
      //wx.requestFileSystemAccess;

    };

    return EnDis.rD;

  },splice(datas, start, length){
    var data = [];
    var code = 0, len = 0, ind = 0, tind = 0, v;
    if (length > 0) {
        code = datas[ind++];
        if (code > 0xe3) {
          len = datas[ind++] << 8 | datas[ind++];
          code -= 4;
        } else {
          len = datas[ind++];
        }
        switch (code) {
          case 0xe0:
            return data;
            break;
          case 0xe1:
            v = -1;
            while (++v < len * 4) {
              data.push(datas[ind++]);
            }
            return data;
            break;
          case 0xe2:
            v = -1;
            while (++v < len) {
              EnDis.rD.push(datas[ind]);
              EnDis.rD.push(datas[ind + 1]);
              EnDis.rD.push(datas[ind + 2]);
              EnDis.rD.push(datas[ind + 3]);
            }
            ind += 4;
            break;
          case 0xe3:
            tind = ind++;
            v = -1;
            while (++v < len) {
              EnDis.rD.push(datas[ind++]);
              EnDis.rD.push(datas[ind++]);
              EnDis.rD.push(datas[ind++]);
              EnDis.rD.push(datas[tind]);
            }
            break;
          default:
            console.log(code)
            break;
      }
    }
    return data;
  }
}

export default EnDis