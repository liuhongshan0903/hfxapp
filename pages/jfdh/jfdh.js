// pages/jfdh/jfdh.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    pageTab: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    llTab: {
      llcurHdIndex: 0,
    },
    // 页面加载 page页面对象的数据源
    userData:"",
    //  具体兑换奖品对象的数据源
    prizeData:"",
    // 根据兑换奖品不同，页面展示不同标识
    showPrizeModal:true,
    // 奖品类型切换，内容切换判断依据
    prizeType:0,
    // 是否配置兑换奖品标识
    prizeList:true,
    // 兑换奖品类型标识  eg:ll,hf,hbq
    prizeFlag:"",
    // 字典类中对应类型的值
    prizeCode:"",
    exchangeNum:0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      console.log("onLoad start ……");
      this.init();
  },
  
  init:function(){
	  // this 指的是这个页面page对象,that 变量
	  var that = this
      var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
      console.log('获取到sessionId：' + sessionId);
	  wx.showLoading({
          title: '加载中…',
      })
      wx.request({
        url: app.globalData.contentPath + '/personal/init.shtml',
        method: 'POST',
        data: {
          hfxsesionid: sessionId
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function(res) {
           if (res.data) {
             //已登录
             if (res.data.resultCode != "0003") {
               console.log("已登录");
               // 处理数据
               res.data.typeList.reverse();
               res.data.grpm.points = app.isEmpty(res.data.grpm.points)?"——":res.data.grpm.points;
               res.data.grpm.id = app.isEmpty( res.data.grpm.id)?"——":res.data.grpm.id;
               var list = res.data.rankList.resultList;
               if(list != null && list.length > 0){
            	   for(var i in list){
            		   list[i].pointsType = app.isEmpty(list[i].pointsType)?"——":list[i].pointsType;
            	   }
               }
               that.setData({userData: res.data});
               // 数据加载完，取节点默认点击第一个
               wx.createSelectorQuery().select('.tab.active').boundingClientRect().exec(function (res) {
            	   // 组装需要的事件源参数
            	   var dataset = {"id":res[0].dataset.id};
            	   var target = {"id":res[0].id};
            	   target["dataset"]=dataset;
            	   var e = {"target":target};
            	   that.change(e);
               })
             }else{
	             console.log("刷新session为：" + res.data.hfxsesionid)
	             if (res.data.hfxsesionid) {
	                wx.setStorageSync("SC_HFX_SESSIONID", res.data.hfxsesionid);
	                console.log("未登录,刷新session为：" + res.data.hfxsesionid);
	                wx.switchTab({
			          url: '../index/index',
			        })
	             }
             }
          }
          wx.hideLoading();
        },
        fail: function(e) {
           wx.hideLoading();
           app.showTankuang('网络连接异常，请检查您的网络！', "/pages/index/index")
        }
     })
  },
  /**
   * 更换奖品类型
   */
  change:function(e){
	  var ss = e.target.id;
	  var id = ss.substring(0,ss.indexOf("@"));
	  if(id == '1'){
		  this.setData({
	          showPrizeModal: false
          })
	  }else{
		  this.setData({
	          showPrizeModal: true
          }) 
	  }
	  this.setData({
		  prizeType:e.target.dataset.id,
		  prizeCode:id,
		  prizeFlag:ss.substring(ss.indexOf("@")+1)
	  })
	  if(parseInt(id)!=1){
		  this.getExchangeType(id);
	  }
  },
  /**
   * 根据奖品类型获取兑换奖品
   */
  getExchangeType:function(obj){
	  // this指的是page对象
	  var that = this
      var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
      console.log('获取到sessionId：' + sessionId);
      var param = "hfxsesionid="+ sessionId+"&desc="+obj;
      wx.request({
        url: app.globalData.contentPath + '/personal/getExchangeType.shtml',
        method: 'POST',
        data:param,
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function(res) {
           // 如果这里面用this====表示的是success()返回的对象
           if (res.data) {
             //已登录
             if (res.data.resultCode != "0003") {
                console.log("已登录");
                var list =res.data.typeList.resultList; 
                if( list != null && list.length > 0){
                	// 处理id 供页面data-id赋值
                	for(var i in list){
                		list[i].id = i;
                	}
                	that.setData({prizeList:true})
                }else{
                	that.setData({prizeList:false})
                }
                that.setData({ prizeData: list });
             }else{
	             console.log("刷新session为：" + res.data.hfxsesionid)
	             if (res.data.hfxsesionid) {
	                wx.setStorageSync("SC_HFX_SESSIONID", res.data.hfxsesionid);
	                console.log("未登录,刷新session为：" + res.data.hfxsesionid);
	                // tabBar 用switchTab
	                wx.switchTab({
			          url: '../index/index',
			        })
	             }
             }
          }
          wx.hideLoading();
        },
        fail: function(e) {
           wx.hideLoading();
           app.showTankuang('网络连接异常，请检查您的网络！', "/pages/index/index")
        }
     })
  }, 
  /**
   * 兑换规则
   */
  dhgz:function(){
	  app.toWebUrl(app.globalData.contentPath+"/pad/fxperson/jfgz.html");
  },
  /**
   * 选择兑换的奖品
   */
  selectPrize:function(e){
	  this.setData({prizeCode:e.currentTarget.dataset.tid})
  },
  /**
   * 和包券兑换数量减少
   */
  reduceExchangeNum:function(e){
	  var num = parseInt(this.data.exchangeNum);
	  num = num -10 < 0 ? 0 :(num-10);
	  console.log(num);
	  this.setData({exchangeNum:num})
  },
  /**
   * 和包券兑换数量增加
   */
  addExchangeNum:function(e){
	  var num = parseInt(this.data.exchangeNum);
	  num = num +10;
	  if(num > 10000){
		  wx.showToast({
	        title: '每次最多兑换10000个积分',
	        icon: 'none'
	      })
	      return;
	  }
	  this.setData({exchangeNum:num})
  },
  /**
   * 输入兑换积分数量
   */
  exchangeNum:function(e){
	  var num = e.detail.value;
	  console.log("兑换梳理"+num);
	  if (!(!/^(0+)|[^\d]+/g.test(num))) {
		  wx.showToast({
	        title: '请输入正确的兑换数量',
	        icon: 'none'
	      })
	      return;
	   }
	  this.setData({exchangeNum:num})
  },
  keyup:function(e){
	  var num = e.detail.value;
	  num = num.replace(/^(0+)|[^\d]+/g,'');
	  this.setData({exchangeNum:num})
  },
  /**
   * 输入数量后移除焦点触发事件
   */
  removeFocus:function(e){
	  var excNum = parseInt(e.detail.value);
	  if(excNum > 10000){
		  wx.showToast({
	        title: '每次最多兑换10000个积分',
	        icon: 'none'
	      })
	      this.setData({exchangeNum:0})
	      return;
	  }
  },
  /**
   * 点击兑换按钮
   */
  exchange:function(){
	  var that = this;
	  var exchangeNum = parseInt(that.data.exchangeNum);
	  var type = that.data.prizeFlag;
	  var param = "type="+type+"&amount="+exchangeNum+"&flag="+that.data.prizeCode;
	  if(type == 'hbq'){
		  if(exchangeNum <= 0){
			  wx.showToast({
		        title: '请输入需要兑换的数量',
		        icon: 'none'
		      })
		      return;
		  }else if (exchangeNum % 10 != 0) {
		      wx.showToast({
		          title: '兑换数量必须是10的倍数',
		          icon: 'none'
		      })
		      return;
	      }
		  if(that.data.userData.exchangeTotalPoints < exchangeNum){
			  wx.showToast({
				  title: '您的可兑换积分不足',
				  icon: 'none'
			  })
			  return;
		  }
	  }else{
		  var tid = "";
		  wx.createSelectorQuery().select('.jftxt2ll.active').boundingClientRect().exec(function (res) {
			  tid = res[0].dataset.tid;
			  console.log("tid====>"+tid);     
			  if(that.data.userData.exchangeTotalPoints < tid.substring(tid.indexOf("@")+1) ){
				  wx.showToast({
					  title: '您的可兑换积分不足',
					  icon: 'none'
				  })
				  return;
			  }
			  param += "&couponType="+tid.substring(0,tid.indexOf("@"));
		  })
	  }
	  // 定时器 是为了获取节点执行器返回的信息param
	  setTimeout(function(){
		  var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
	      console.log('获取到sessionId：' + sessionId);
	      param += "&hfxsesionid="+ sessionId;
	      wx.request({
		      url: app.globalData.contentPath + '/personal/exchange.shtml',
		      method: 'POST',
		      data:param,
		      header: {
		         'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
		      },
		      success: function(res) {
		    	  if(res.data){
		    		  if(res.data.resultCode=="00000"){
	    			  	  wx.showToast({
	    		            title: '兑换成功',
	    		            icon: 'success'
	    		          })
		    			  var userData = that.data.userData;
		    			  userData.exchangeTotalPoints = res.data.exchangeTotalPoints;
		    			  that.setData({userData:userData, exchangeNum: '0'})
		    		  }else{
		    			  wx.showToast({
		    		         title: '兑换失败',
		    		         icon: 'none'
		    		      })
		    		  }
		    	  }else{
		    		  console.log("刷新session为：" + res.data.hfxsesionid)
			             if (res.data.hfxsesionid) {
			                wx.setStorageSync("SC_HFX_SESSIONID", res.data.hfxsesionid);
			                console.log("未登录,刷新session为：" + res.data.hfxsesionid);
			                // tabBar 用switchTab
			                wx.switchTab({
					          url: '../index/index',
					        })
			            }
		    	  }
		      },
		      fail: function(e) {
		          wx.hideLoading();
		          app.showTankuang('网络连接异常，请检查您的网络！', "/pages/index/index")
		      }
	      })
	  },500);
  },
  /**
   * 总积分
   */
  totalPoint:function(){
	 wx.navigateTo({
		 url:"../myjf/myjf"
	 })
  },
  /**
   * 业务总量
   */
  totalOrder:function(){
	  wx.navigateTo({
		 url:"../ywl/ywl"
	  })
  },
  /**
   * 招募明细
   */
  recruitNum:function(){
	  wx.navigateTo({
		 url:"../zmmx/zmmx"
	  })
  },
  /**
   * 积分兑换明细
   */
  dhdetail:function(){
	  wx.navigateTo({
		  url:"../dhdetail/dhdetail"
	  })
  },
  //点击导航
  pageHdtap: function (e) {
    //点击子元素
    var _datasetId = e.target.dataset.id;
    var _leftObj = {};
    _leftObj.curHdIndex = _datasetId;
    _leftObj.curBdIndex = _datasetId;
    this.setData({
      pageTab: _leftObj
    });
  },

 llHdtap: function (e) {
   //点击子元素
   var _datasetId = e.target.dataset.id;
   var _leftObj = {};
   _leftObj.llcurHdIndex = _datasetId;
   this.setData({
     llTab: _leftObj
   });
  }, 
})