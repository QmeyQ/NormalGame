// Description: 云服务
import Net from "./net";
import Time from "./time";
import '@agconnect/function';
import "@hw-agconnect/instance";
import agc from '@agconnect/api';
import EnDis from "../display/enDis";

export default class serve {
    constructor(select) {
        this.agcFlag = false;
        let vv = 0;
        while (Net.onList["un" + vv] != undefined) {
            vv++;
        }
        this.onName = "un" + vv;
        //this.select(select);
    }

    select(sel, port) {
        if (sel == undefined) {
            this.waitBack = false;
            Time.timer(3000, () => {
                if (this.waitBack == false) {
                    this.select(1);
                }
            });
            Net.udpSend("@v", "normalgame.cn", 50132, this.onName, (data) => {
                this.waitBack = true;
                this.ser = 0;
				console.log("server to version:" ,data);
                this.version = EnDis.bToS(new Uint8Array(data.message));
            });
        } else if (sel == 1) {
           this.iniCloud();
            this.call("version", (data) => {
                console.log("server to version:" ,data);
                this.ser = 1;
				this.version = data;
            });
        }else {
            /*Time.timer(3000, () => {
                if (this.waitBack == false) {
                    this.select(1);
                }
            });*/

            this.serName = sel;
            if(port == undefined){
                port = 50132;
            }
            console.log("select:" , this.serName);
            Time.start(-2);
            Net.udpSend("@v", this.serName, port, this.onName, (data) => {
                this.RTT = Time.invoke(-2);
                this.waitBack = true;
                this.ser = 0;
                this.version = new TextDecoder().decode(new Uint8Array(data.message));
                console.log("server to version:" ,this.version);
            });
        }
    }

    iniCloud(){
        agc.instance().configInstance(agConnectConfig);
        this.agcFlag = true;
        console.log("初始化AGC");
    }
    call(comd,suc, req) {
        if(this.agcFlag != true){
            this.iniCloud();
        }
        if(req == undefined){
            req = {xxx:""};
        }

        const cloudFun = agc.function().wrap(comd + "-$latest")
        cloudFun.timeout = 2000;
        console.log("调用cloud云函数")
        cloudFun.call(req).then(functionResult => {
        suc(functionResult.getValue());
        }).catch(error => {
            console.log("调用cloud云函数失败", error)
        });
        
           
            /* console.log("return dasta:", functionResult);
            if (suc != undefined) {
                suc(functionResult.getValue());
            }
        /*}).catch(error => {
            console.error("Error calling function:", error);
            if (suc != undefined) {
                suc(error);
            }
        });*/
    }

}

var agConnectConfig = {
    //应用配置信息
  "agcgw":{
		"backurl":"connect-drcn.hispace.hicloud.com",
		"url":"connect-drcn.dbankcloud.cn",
		"websocketbackurl":"connect-ws-drcn.hispace.dbankcloud.com",
		"websocketurl":"connect-ws-drcn.hispace.dbankcloud.cn"
	},
	"agcgw_all":{
		"CN":"connect-drcn.dbankcloud.cn",
		"CN_back":"connect-drcn.hispace.hicloud.com",
		"DE":"connect-dre.dbankcloud.cn",
		"DE_back":"connect-dre.hispace.hicloud.com",
		"RU":"connect-drru.hispace.dbankcloud.ru",
		"RU_back":"connect-drru.hispace.dbankcloud.cn",
		"SG":"connect-dra.dbankcloud.cn",
		"SG_back":"connect-dra.hispace.hicloud.com"
	},
	"websocketgw_all":{
		"CN":"connect-ws-drcn.hispace.dbankcloud.cn",
		"CN_back":"connect-ws-drcn.hispace.dbankcloud.com",
		"DE":"connect-ws-dre.hispace.dbankcloud.cn",
		"DE_back":"connect-ws-dre.hispace.dbankcloud.com",
		"RU":"connect-ws-drru.hispace.dbankcloud.ru",
		"RU_back":"connect-ws-drru.hispace.dbankcloud.cn",
		"SG":"connect-ws-dra.hispace.dbankcloud.cn",
		"SG_back":"connect-ws-dra.hispace.dbankcloud.com"
	},
	"client":{
		"cp_id":"370086000102577847",
		"product_id":"388421841221717430",
		"client_id":"1263859182919011264",
		"client_secret":"8D99CCC71D57DD3DFF0F1C4EB5A800E527AB122C9580D781E6BEB18C917AE277",
		"project_id":"388421841221717430",
		"app_id":"111959123",
		"api_key":"DAEDAEgyO1a1go/zGeCVti95r4HYopjHKDgxBWmnZGi3yO6UrPVvu03LGVYRqXfMN4p7r3Ep4NoYGArzWwLr5jpheh8OEgLeigSBKQ==",
		"package_name":"mey.normal.game"
	},
	"oauth_client":{
		"client_id":"111959123",
		"client_type":30
	},
	"app_info":{
		"app_id":"5765880207855344723",
		"package_name":"mey.normal.game"
	},
	"code":{
		"code1":"DCFAB4E9226E044C756F8A988E117FFB",
		"code2":"CF6D2EB9BD18EF3BFB33B6CAAF3B9926",
		"code3":"0C4C3B6F57A701D1C0E09F2604924A69",
		"code4":"FA813DB09E2EAA5D2FCF1BD39986B931"
	},
	"service":{
		"analytics":{
			"collector_url":"datacollector-drcn.dt.hicloud.com,datacollector-drcn.dt.dbankcloud.cn",
			"collector_url_ru":"datacollector-drru.dt.dbankcloud.ru,datacollector-drru.dt.hicloud.com",
			"collector_url_sg":"datacollector-dra.dt.hicloud.com,datacollector-dra.dt.dbankcloud.cn",
			"collector_url_de":"datacollector-dre.dt.hicloud.com,datacollector-dre.dt.dbankcloud.cn",
			"collector_url_cn":"datacollector-drcn.dt.hicloud.com,datacollector-drcn.dt.dbankcloud.cn",
			"resource_id":"p1",
			"channel_id":""
		},
		"edukit":{
			"edu_url":"edukit.cloud.huawei.com.cn",
			"dh_url":"edukit.cloud.huawei.com.cn"
		},
		"search":{
			"url":"https://search-drcn.cloud.huawei.com"
		},
		"cloudstorage":{
			"storage_url_sg_back":"https://agc-storage-dra.cloud.huawei.asia",
			"storage_url_ru_back":"https://agc-storage-drru.cloud.huawei.ru",
			"storage_url_ru":"https://agc-storage-drru.cloud.huawei.ru",
			"storage_url_de_back":"https://agc-storage-dre.cloud.huawei.eu",
			"storage_url_de":"https://ops-dre.agcstorage.link",
			"storage_url":"https://agc-storage-drcn.platform.dbankcloud.cn",
			"storage_url_sg":"https://ops-dra.agcstorage.link",
			"storage_url_cn_back":"https://agc-storage-drcn.cloud.huawei.com.cn",
			"storage_url_cn":"https://agc-storage-drcn.platform.dbankcloud.cn",
			"default_storage":"sgf-rhq1y"
		},
		"ml":{
			"mlservice_url":"ml-api-drcn.ai.dbankcloud.com,ml-api-drcn.ai.dbankcloud.cn"
		}
	},
	"region":"CN",
	"configuration_version":"3.0",
	"appInfos":[
		{
			"package_name":"com.atomicservice.5765880207855528997",
			"client":{
				"client_secret":"[!00BB50C0BA4D625C4453BCB03D4341E8C3E4F81A935732BADE0ECE20D756B5ED83AB2DA606E7DB5EC6E5D7A0F939C6AAA861ADB72B6125FB218EE65AF640E68E7D7A2C7634E23F2B810DC69713A153CC9E0880EDA482D030E689D92E654073149C]",
				"app_id":"5765880207855528997",
				"api_key":"[!0087AEB0A8FC6AF5A301A60619D606908851DDCF0DEBB237B953589BBDEDBB6D2732506BB068DEF0931147A94554B1C83DAF588B2C6E5BC84A40FC76098F32098DE0695ED1370C95225E22F2B37D1C9BFD7231C7ED55C20FE928148ABFEB6CE068F64266A65DB63C4F8C39B702E863E7A2138A4A0A237DD3A382581653C5671211]"
			},
			"code":{
				"code1":"4115FC860BF9A89A6F831220AA5BC6176D58703DFE2C33BD1E3135C88305D546",
				"code2":"ACFCC1E3787732C656F7CFB1A022B71F4A008413EB3055AFAE8BD259F8FD78F1",
				"code3":"F48EA8BC266AB8660D237A7478D9F9CC9051E8DFF299E9B2A194519A9D4424EE",
				"code4":"C3E2D299FBDB2C5C8ACBA5C7DB0A796F"
			}
		},
		{
			"package_name":"mey.normal.game",
			"client":{
				"client_secret":"[!00BB50C0BA4D625C4453BCB03D4341E8C3E4F81A935732BADE0ECE20D756B5ED83AB2DA606E7DB5EC6E5D7A0F939C6AAA861ADB72B6125FB218EE65AF640E68E7D7A2C7634E23F2B810DC69713A153CC9E0880EDA482D030E689D92E654073149C]",
				"app_id":"5765880207855344723",
				"api_key":"[!0087AEB0A8FC6AF5A301A60619D606908851DDCF0DEBB237B953589BBDEDBB6D2732506BB068DEF0931147A94554B1C83DAF588B2C6E5BC84A40FC76098F32098DE0695ED1370C95225E22F2B37D1C9BFD7231C7ED55C20FE928148ABFEB6CE068F64266A65DB63C4F8C39B702E863E7A2138A4A0A237DD3A382581653C5671211]"
			},
			"code":{
				"code1":"4115FC860BF9A89A6F831220AA5BC6176D58703DFE2C33BD1E3135C88305D546",
				"code2":"ACFCC1E3787732C656F7CFB1A022B71F4A008413EB3055AFAE8BD259F8FD78F1",
				"code3":"F48EA8BC266AB8660D237A7478D9F9CC9051E8DFF299E9B2A194519A9D4424EE",
				"code4":"C3E2D299FBDB2C5C8ACBA5C7DB0A796F"
			}
		}
	]
}