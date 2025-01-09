const Time = {
    timeOffset: 0, // Offset between local time and network time
    startTime: {},
    getCurrentTime() {
        return new Date().getTime() + this.timeOffset;
    },
    start(label) {
        if (this.startTime == undefined) {
            this.startTime = {};
        }
        if (label == undefined) {
            let v = 0;
            while (this.startTime[v] != undefined) {
                v++;
            }
            this.startTime[v] = this.startTime[label];
            return v;
        }
        this.startTime[label] = this.getLocalTime();
        return label;
    },
    invoke(label = '0') {
        if (this.startTime == undefined || this.startTime[label] == undefined) {
            this.start(label);           
            return 1;
        }

        let currentTime = this.getLocalTime();
        let timeDifference = currentTime - this.startTime[label];

        return timeDifference;
    },
    timer(ms, func, vv) {
        if(vv == undefined){
            let v = 0;
            while (this.startTime[v] != undefined) {
                v++;
            }
            this.start(v);
            vv = v;
        }
        var ti = () => {
            if (this.invoke(vv) < ms) {
                this.timer(ms - this.invoke(vv), func, vv);
                return;
            }
            delete this.startTime[vv];
            func();
        };
        if (ms <= 99) {
            setTimeout(ti, 10);
        }else if (ms <= 100) {
            setTimeout(ti, 100);
        }else if (ms <= 1000) {
            setTimeout(ti, 1000);
        } else if (ms <= 2000) {
            setTimeout(ti, 2000);
        } else if (ms <= 3000) {
            setTimeout(ti, 3000);
        } else if (ms <= 4000) {
            setTimeout(ti, 4000);
        } else if (ms <= 5000) {
            setTimeout(ti, 5000);
        } else if (ms <= 6000) {
            setTimeout(ti, 6000);
        } else if (ms <= 7000) {
            setTimeout(ti, 7000);
        } else if (ms <= 8000) {
            setTimeout(ti, 8000);
        } else if (ms <= 9000) {
            setTimeout(ti, 9000);
        } else {
            setTimeout(ti, 10000);
        }
    },
    calibrateTime() {
        const acceleration = 0.1; // Adjust this value as needed
        const maxAttempts = 10;
        let attempts = 0;
        var temFun = () => {
            wx.request({
                url: 'https://timeapi.io/api/Time/current/zone?timezone=Asia/Shanghai',
                success: (res) => {
                    this.timeOffset = (attempts * this.timeOffset + new Date(res.data.dateTime).getTime() - new Date().getTime()) / (attempts + 1);
                    attempts++;
                    if (attempts >= 10) {
                        return;
                    }
                    setTimeout(() => {
                        temFun();
                    }, 0);
                },
                fail: (err) => {
                    console.error('Failed to fetch network time:', err);
                    setTimeout(() => {
                        temFun();
                    }, 0);
                }
            });
        };
        temFun();
    },
    getLocalTime() {
        return new Date().getTime() + this.timeOffset;
    }
};

 export default Time;
