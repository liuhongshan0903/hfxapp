var imgNames = new Array("家庭网", "咪咕视频", "任我看视频", "特惠流量", "抖音", "音频畅享包", "移动惠生活APP")
var imgPath = new Array("ywpic1.jpg", "ywpic2.jpg", "ywpic3.jpg", "ywpic4.jpg", "ywpic5.jpg", "ywpic6.jpg", "ywpic7.png");
//app.js
App({
  onLaunch: function() {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    // // 登录
    // wx.login({
    //   success: res => {
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     var wxcode = res.code;
    //     if (wxcode) {
    //       console.log("first wxcode:" + wxcode)
    //       this.globalData.wxcode = wxcode;
    //     }
    //   }
    // })
    // 获取用户信息
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              // 可以将 res 发送给后台解码出 unionId
              this.globalData.userInfo = res.userInfo

              // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
              // 所以此处加入 callback 以防止这种情况
              if (this.userInfoReadyCallback) {
                this.userInfoReadyCallback(res)
              }
            }
          })
        }
      }
    })
  },
  getHeader: function() {
    var header = {
      'content-type': 'application/x-www-form-urlencoded'
    }
    var session_id = wx.getStorageSync('SC_HFX_SESSIONID'); //本地取存储的sessionID
    if (session_id != "" && session_id != null) {
      header = {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'Cookie': 'SC_HFX_SESSIONID=' + session_id
      }
    }
    console.log('set header:' + session_id);
    return header;
  },
  globalData: {
    userInfo: null,
   // contentPath: "https://ah.10086.cn/mpad",
    //contentPath: "http://152.55.249.16:8001/mpad",
    contentPath: "http://localhost:8080/mpad",
    imgPath: "https://ah.10086.cn/upfile/shop/",
    //imgPath: "http://152.55.249.16:8001/mpad/",
    //imgPath: "http://localhost:8080/mpad/",
    offName: "",
    cityId: "",
    kfAgent: "",
    opNo: "",
    //是否登录 0已登录 1未登录
    isLogin: "1",
    //wx.login返回的code
    wxcode:"",
  },
  //跳转h5页面
  toWebUrl: function(webUrl) {
    console.log(webUrl);
    webUrl = webUrl.replace("?", "&");
    var url = "../web/web?webUrl=" + webUrl;
    wx.navigateTo({
      url: url,
      success: function() {
        console.log("to html success")
      },
      fail: function() {
        console.log("to html failed")
      },
    })
  },
  /**
   * 调用后台接口失败时
   * 统一弹框提示网络异常
   * msg：提示语
   * localUrl：适用页面
   */
  showTankuang: function(msg, localUrl) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false,
      success: function(res) {
        wx.switchTab({
          url: localUrl,
          success: function(e) {}
        })
      }
    })
  },
  /**
  * msg：提示语
  */
  showTankuang: function (msg) {
    wx.showModal({
      title: '提示',
      content: msg,
      showCancel: false
    })
  },
  /**
   * 获取时间及其转换
   */
  getDate:function(t){
	  var date;
	  if(t){
		  date = new Date(parseInt(t)); 
		  var h = date.getHours();
		  h = this.timeFormat(h);
	      var minute = date.getMinutes();
	      var second = date.getSeconds();
	      minute = this.timeFormat(minute);
	      second = this.timeFormat(second);
	  }else{
		  date = new Date();
	  }
      var y = date.getFullYear();
      var m = date.getMonth() + 1;
      m = this.timeFormat(m);
      var d = date.getDate();
      d = this.timeFormat(d);
      var result = y + '-' + m + '-'+d;
      if(t){
    	  return  result + ' ' + h + ':' + minute + ":" + second;  
      }else{
    	  return result;
      }
  },
  /**
   * 时间格式转换
   */
  timeFormat:function(n){
	  return n<10?'0'+n:n;
  },
  /**
   * 隐藏号码
   */
  getHiddenPhone :function (phone){
		return phone.substring(0,3)+"****"+phone.substring(7,11);
  },
  /** 
   * 通过业务名称获取业务图片名称路径 
   * 图片统一放在  
   */
  getImg: function(proName) {
    for (var i = 0; i < imgNames.length; i++) {
      if (proName.indexOf(imgNames[i]) != -1) {
        return imgPath[i]
      }
    }
    return "txt3pic2.jpg"
  },
  
  getCityName: function(cityCode){
    var map = new Map();
    map.set("111000000", "合肥市");
    map.set("112000000", "芜湖市");
    map.set("113000000", "蚌埠市");
    map.set("114000000", "淮南市");
    map.set("115000000", "马鞍山市");
    map.set("116000000", "淮北市");
    map.set("117000000", "铜陵市");
    map.set("118000000", "安庆市");
    map.set("119000000", "黄山市");
    map.set("120000000", "阜阳市");
    map.set("121000000", "宿州市");
    map.set("122000000", "滁州市");
    map.set("123000000", "六安市");
    map.set("124000000", "宣城市");
    map.set("126000000", "池州市");
    map.set("127000000", "亳州市");
    map.set("1001712", "安徽移动");
    var cityName = "";
    if(cityCode!= null && cityCode != undefined && cityCode != ""){
	   cityName = map.get(cityCode);
	   cityName = cityName == undefined ? "" : cityName;
	}
	return cityName;
  },
  isEmpty:function(val){
	  if (val=='undefined'||val==null||val==''||parseInt(val.length) <= 0) {
		    return true;
		}
		return false;
  }

})