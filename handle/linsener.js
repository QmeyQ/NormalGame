import Display from "../display/display";
import Process from "./process";

const Linsener = {
    onLable: false,
    onList: {},
    onMap: {map:{}},
    init() {
        //wx.onWindowResize((result) => {

        //})

        wx.onTouchStart((event) => {
            console.log(event)
            let v = 0;
            for (let onStart in this.onList) {
                this.onList[onStart](event);
            }
        })

        wx.onTouchMove((event) => {
            console.log(event)
            for (let onMove in this.onList) {
                this.onList[onMove](event);
            }
        })

        wx.onTouchEnd((event) => {
            console.log(Display.disMap)
            console.log(event)
            let v = 0;
            for (let onStart in this.onList) {
                console.log("evetn", event);
                this.onList[onStart](event);
            }
        });

        this.onLable = true;
    },
    click(event, x, y, wid, hei, zone) {
        if (!this.onLable) {
            this.init();
        }
        var v = 0;
        while (this.onList["main" + v] != undefined) {
            v++;
        }
        const onName = "main" + v;
        var func = (eve) => {
            if (eve.type === 'touchstart') {
                let v = -1;
                while(++v < eve.touches.length){
                    if (eve.touches[v].clientX >= x && eve.touches[v].clientX <= x + wid 
                        && eve.touches[v].clientY >= y && eve.touches[v].clientY <= y + hei) {
                        this.process.end(onName, eve.touches[v].identifier);
                    }
                }
                
            }
            if (event.type === 'touchend') {
                let v = -1;
                while(++v < eve.changedTouches.length){
                if (this.process.is(onName) == eve.changedTouches[v].identifier && eve.timeStamp < 300 ) {
                    if(eve.changedTouches[v].clientX >= x && eve.changedTouches[v].clientX <= x + wid 
                        && eve.changedTouches[v].clientY >= y && eve.changedTouches[v].clientY <= y + hei){
                        event();
                        return;
                    }
                }
                if(eve.changedTouches[v].identifier == this.process.is(onName))
                    this.process.clear(onName);
            }
           
            }
        };

        if(zone == undefined){
            this.onList[onName] = func
        }else{

            this.onMap.map[zone][onName] = func
        }


        return "main" + v;
    },
    delOn(eName, zone) {
        if(zone != undefined){
            if (this.onMap[eName] != undefined) {
                delete this.onMap[zone][eName];
            }
            return;
        }
        if (this.onList[eName] != undefined) {
            delete this.onList[eName];
        }
    },
    login(suc) {
        let button = wx.createUserInfoButton({
            type: 'text',
            text: '点击任意位置登录',
            style: {
                width: Display.screenWidth,
                height: Display.screenHeight,
                lineHeight: Display.screenHeight,
                backgroundColor: '#00ff0000',
                color: '#ffffff',
                textAlign: 'center',
                fontSize: 16,
                top: Display.screenHeight // Adjust this value as needed to position the text at the bottom
            }
        })
        button.onTap((res) => {
            button.destroy();
            suc(res.userInfo);
        })

    }
}

export default Linsener;