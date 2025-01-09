import Time from './time';
import Display from '../display/display';

const Storage = {
    preloadedData: {},

    pro(keysToPreload) {
        if (keysToPreload) {
            if (!Array.isArray(keysToPreload)) {
                keysToPreload = Array.of(keysToPreload);
            }
            keysToPreload.forEach((key) => {
                this.getKey(key, (data) => {
                    this.preloadedData[key] = data;
                }, (err) => {
                    this.preloadedData[key] = null;
                });
            });
        }
    },

    get(keyName, suc) {
        if(this.preloadedData == null){
            this.preloadedData = {};
        }
        if(keyName == null)
            return;
        if (suc == undefined) {
            return;
        }

        this.pro(keyName);
        Time.start(-2);

        const tmpFunc = () => {
            if (this.preloadedData.propertyIsEnumerable(keyName)) {
                this.result = this.preloadedData[keyName];
                suc(this.preloadedData[keyName]);
                return;
            }

            if (Time.invoke(-2) > 5000) {
                console.log("Time out", this.preloadedData, this.preloadedData.length);
                this.result = null;
                suc(null);
                return;
            }
            Time.timer(100, () => {
                tmpFunc();
            });
        };
        tmpFunc();
    },

    store(keyName, datas) {
        wx.setStorage({
            key: keyName,
            data: datas,
            success(res) {
            },
            fail(err) {
                console.error('Failed to store data:', err);
            },
            complete(res) {
                //console.log(res);
            }
        });
    },

    delete(keyName) {
        wx.removeStorage({
            key: keyName,
            success: ()=> {
                if (this.preloadedData[keyName] != undefined) {
                    delete this.preloadedData[keyName];
                }
            },
            fail: function (error) {
                console.error(`删除 key: ${keyName} 失败：${error.errMsg}`);
            },
            complete: function () {
                //Display.testTest += "\n已删除 key: " + keyName;
            }
        });
    },

    getKey(keyName, successCallback, failCallback) {
        wx.getStorage({
            key: keyName,
            success(res) {
                successCallback(res.data);
            },
            fail(err) {
                failCallback(err);
            }
        });
    },

    getAllKeys(successCallback, failCallback) {
        wx.getStorageInfo({
            success(res) {
                successCallback(res.keys);
            },
            fail(error) {
                failCallback(error);
            }
        });
    }
};

export default Storage;
