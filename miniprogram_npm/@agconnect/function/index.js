module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1736350118819, function(require, module, exports) {
Object.defineProperty(exports,"__esModule",{value:!0});var e=require("@agconnect/api"),t=require("@agconnect/core"),r=require("@agconnect/instance");require("@agconnect/network"),require("@agconnect/baseservice");var n=require("bignumber.js"),o=require("@agconnect/log");function i(e){return e&&"object"==typeof e&&"default"in e?e:{default:e}}var s=i(e),c=i(n),a=function(e,t){return(a=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])})(e,t)};function u(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}a(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}function h(e,t,r,n){return new(r||(r=Promise))((function(o,i){function s(e){try{a(n.next(e))}catch(e){i(e)}}function c(e){try{a(n.throw(e))}catch(e){i(e)}}function a(e){var t;e.done?o(e.value):(t=e.value,t instanceof r?t:new r((function(e){e(t)}))).then(s,c)}a((n=n.apply(e,t||[])).next())}))}function d(e,t){var r,n,o,i,s={label:0,sent:function(){if(1&o[0])throw o[1];return o[1]},trys:[],ops:[]};return i={next:c(0),throw:c(1),return:c(2)},"function"==typeof Symbol&&(i[Symbol.iterator]=function(){return this}),i;function c(i){return function(c){return function(i){if(r)throw new TypeError("Generator is already executing.");for(;s;)try{if(r=1,n&&(o=2&i[0]?n.return:i[0]?n.throw||((o=n.return)&&o.call(n),0):n.next)&&!(o=o.call(n,i[1])).done)return o;switch(n=0,o&&(i=[2&i[0],o.value]),i[0]){case 0:case 1:o=i;break;case 4:return s.label++,{value:i[1],done:!1};case 5:s.label++,n=i[1],i=[0];continue;case 7:i=s.ops.pop(),s.trys.pop();continue;default:if(!(o=s.trys,(o=o.length>0&&o[o.length-1])||6!==i[0]&&2!==i[0])){s=0;continue}if(3===i[0]&&(!o||i[1]>o[0]&&i[1]<o[3])){s.label=i[1];break}if(6===i[0]&&s.label<o[1]){s.label=o[1],o=i;break}if(o&&s.label<o[2]){s.label=o[2],s.ops.push(i);break}o[2]&&s.ops.pop(),s.trys.pop();continue}i=t.call(e,s)}catch(e){i=[6,e],n=0}finally{r=o=0}if(5&i[0])throw i[1];return{value:i[0]?i[1]:void 0,done:!0}}([i,c])}}}var l=function(e){function t(){var t=null!==e&&e.apply(this,arguments)||this;return t.responseBody=void 0,t}return u(t,e),t.prototype.constructResponse=function(e){this.responseBody=e},t.prototype.getValue=function(){return this.responseBody?this.responseBody:null},t}(r.BaseResponse),p=function(){function e(){}return e.FAIL_TO_GET_CREDENTIAL_SERVICE={code:11e3,message:"get agcCredential service failed"},e.FAIL_TO_GET_NETWORK_SERVICE={code:11001,message:"get agcNetwork service failed"},e.FAIL_TO_CALL_CLOUD_FUNCTION={code:11002,message:"call cloud function failed"},e}(),f=function(e){function t(r,n){var o=e.call(this,r,n,"function")||this;return o.__proto__=t.prototype,o}return u(t,e),t.constructExcpFromRet=function(e){return new t({code:e.getCode(),message:e.getMsg()})},t}(r.AGCError),g=function(){function e(){}return e.prototype.doRequest=function(t,r,n,o){return h(this,void 0,void 0,(function(){var i,c,a,u,g,v,T=this;return d(this,(function(_){switch(_.label){case 0:return i=t.getHeader(),(c=s.default.instance().getService("AuthProviderService"))?[4,c.getToken(!1).then((function(e){e&&(i.accessToken=e.getToken())}))]:[3,2];case 1:_.sent(),_.label=2;case 2:return(a=s.default.instance().getService("CredentialsService"))?(u="",[4,a.getToken().then((function(e){u=e.tokenString}))]):(y.error("get credentialProvider service failed."),[2,Promise.reject(new f(p.FAIL_TO_GET_CREDENTIAL_SERVICE))]);case 3:return _.sent(),i.Authorization="Bearer "+u,g=void 0,r&&(g={timeout:r,timeoutErrorMessage:"CloudFunction run out of time"}),v=new l,[4,this.doNetworkOption(t,i,v,g).catch((function(i){return h(T,void 0,void 0,(function(){var s;return d(this,(function(u){switch(u.label){case 0:return i.response&&i.response.status&&i.response.data&&i.response.data.ret&&i.response.data.ret.code?i.response.status!==e.TOKEN_INVALID?[3,6]:(s=i.response.data.ret.code)==e.CLIENT_TOKEN_EXPIRED&&n?[4,a.removeToken()]:[3,3]:[3,6];case 1:return u.sent(),[4,a.getToken(!0)];case 2:return u.sent(),[2,this.doRequest(t,r,!1,o)];case 3:return s==e.ACCESS_TOKEN_EXPIRED&&o?c?[4,c.getToken(!0)]:[3,5]:[3,6];case 4:u.sent(),u.label=5;case 5:return[2,this.doRequest(t,r,n,!1)];case 6:return i.message&&-1!=i.message.indexOf("Network Error")&&!t.useBackUrl?(t.useBackUrl=!0,[2,this.doRequest(t,r,n,o)]):[2,Promise.reject(i)]}}))}))}))];case 4:return _.sent(),[2,Promise.resolve(v)]}}))}))},e.prototype.doNetworkOption=function(t,r,n,o){return h(this,void 0,void 0,(function(){var i;return d(this,(function(c){switch(c.label){case 0:return(i=s.default.instance().getService("AGCNetworkService"))?[4,i.post(t.getUrl(),t.getBody(),r,o).then((function(t){return t.status&&t.status===e.HTTP_OK?(n.ret.setCode(0),n.ret.setMsg("OK"),n.constructResponse(t.data),Promise.resolve()):Promise.reject(t)})).catch((function(e){return Promise.reject(e)}))]:(y.error("get agcNetwork service failed."),[2,Promise.reject(new f(p.FAIL_TO_GET_NETWORK_SERVICE))]);case 1:return c.sent(),[2]}}))}))},e.CLIENT_TOKEN_EXPIRED=205524993,e.ACCESS_TOKEN_EXPIRED=205524994,e.TOKEN_INVALID=401,e.HTTP_OK=200,e}(),v=function(){function e(){this.sdkServiceName="",this.sdkVersion="",this.sdkPlatform="",this.sdkPlatformVersion="",this.sdkType="JS",this.packageName="",this.appVersion="",this.headerClientId="",this.authorization="",this.headerProductId="",this.headerAppId="",this.agcgwUrl="",this.agcgwBackUrl=""}return e.prototype.init=function(){this.sdkServiceName="agconnect-function",this.sdkVersion="1.3.2";var e=s.default.instance().getService("AGCPlatformInfoService");e&&(this.sdkPlatform=e.getPlatform(),this.sdkPlatformVersion=e.getPlatformVersion(),this.packageName=e.getPackageName(),this.appVersion=e.getAppVersion()),this.authorization="",this.agcConfig=s.default.instance().config(),this.headerProductId=this.agcConfig.client.product_id,this.headerClientId=this.agcConfig.client.client_id,this.headerAppId=this.agcConfig.client.app_id,this.agcgwUrl=this.addHttpToUrl(this.agcConfig.agcgw.url),this.agcgwBackUrl=this.addHttpToUrl(this.agcConfig.agcgw.backurl)},e.prototype.addHttpToUrl=function(e){return e&&!e.startsWith("https://")?"https://"+e:e},e}(),T="0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",_=function(){function e(){}return e.hash=function(t,r){var n="agc:"+t+"@"+r,o=e.MD5Hash(n);o="0x"+o;var i=new c.default(o);return e.encode(i)},e.encode=function(e){for(var t="";e.isGreaterThan(61);){var r=e.modulo(62);t=T.charAt(r.toNumber())+t,e=e.dividedToIntegerBy(62)}return t=T.charAt(e.toNumber())+t},e.MD5Hash=require("js-md5"),e}(),k=function(e){function t(t,r){var n=e.call(this)||this;return n.useBackUrl=!1,n.body=r,n.httpTriggerURI=t,n}return u(t,e),t.prototype.getUrl=function(){var e=this.agcConfig.client.cp_id,r=this.agcConfig.client.product_id,n=_.hash(e,r);return this.httpTriggerURI&&this.httpTriggerURI.length>0&&"/"!=this.httpTriggerURI.charAt(0)&&(this.httpTriggerURI="/"+this.httpTriggerURI),this.useBackUrl?this.agcgwBackUrl+t.SERVER_URL+"/"+n+this.httpTriggerURI:this.agcgwUrl+t.SERVER_URL+"/"+n+this.httpTriggerURI},t.prototype.getHeader=function(){return{sdkVersion:this.sdkVersion,sdkPlatform:this.sdkPlatform,sdkServiceName:this.sdkServiceName,sdkPlatformVersion:this.sdkPlatformVersion,sdkType:this.sdkType,packageName:this.packageName,appVersion:this.appVersion,appId:this.headerAppId,clientId:this.headerClientId,productId:this.headerProductId,Authorization:this.authorization,"Content-Type":"application/json;charset=UTF-8"}},t.prototype.getBody=function(){return this.body},t.SERVER_URL="/agc/apigw/wisefunction/functions",t}(v),m=function(){function e(e){this.httpTriggerURI="",this.timeout=void 0,this.functionBackend=new g,this.httpTriggerURI=e}return e.prototype.call=function(e){return h(this,void 0,void 0,(function(){var t,n;return d(this,(function(o){switch(o.label){case 0:return(t=new k(this.httpTriggerURI,e)).init(),[4,this.functionBackend.doRequest(t,this.timeout,!0,!0).catch((function(e){return e instanceof r.AGCError?Promise.reject(e):Promise.reject(new f(p.FAIL_TO_CALL_CLOUD_FUNCTION,e))}))];case 1:return n=o.sent(),[2,Promise.resolve(n)]}}))}))},e.prototype.clone=function(t){var r=new e(this.httpTriggerURI);return r.timeout=t,r},e}(),y=o.Logger.createLogger("function"),E=function(){function e(){}return e.prototype.wrap=function(e){return new m(e)},e}(),I=new t.Singleton((function(){return new E}));s.default.registerApiProvider("function",(function(){return I.get()})),exports.AGCFunctionException=f;

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1736350118819);
})()
//miniprogram-npm-outsideDeps=["@agconnect/api","@agconnect/core","@agconnect/instance","@agconnect/network","@agconnect/baseservice","bignumber.js","@agconnect/log","js-md5"]
//# sourceMappingURL=index.js.map