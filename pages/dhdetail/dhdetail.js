// pages/myjfmx/myjfmx.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '2019-05-10',
    date2: '2019-05-30',
    resultInfo:[],
    exchangeFlag:"",
  },
  bindDateChange: function (e) {
    this.setData({
      date: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    this.setData({
      date2: e.detail.value
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
	  var result = app.getDate();
	  this.setData({
	     date: result.substring(0,result.lastIndexOf("-")+1)+"01",
	     date2:result
	  })
	  this.getHistory();
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  /**
   * 查询兑换明细
   */
  getHistory:function(){
    var that = this;
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    wx.request({
      url:  app.globalData.contentPath + '/personal/getHistory.shtml',
      method: "POST",
      data: {
        hfxsesionid: sessionId,
        beginTime:that.data.date,
        endTime: that.data.date2
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        if (res.data.code == "0003") {
        	wx.switchTab({
	          url: '../index/index',
	        })
        } else {
        	if (res.data.resultInfo.resultCode == "00000") {
        		var list = res.data.resultInfo.result.resultList;
        		if (list != null && list.length > 0 ) {
        			for(var i in list){
        				list[i].createDate = app.getDate(list[i].createDate);
        			}
        			that.setData({
        				resultInfo: list,
        				exchangeFlag:true
        			})
        		}else{
        			that.setData({exchangeFlag:false})
        		}
        	}else{
        		wx.showToast({title: res.data.message,icon: 'none'})
        	}
         }
       }
    })
  },
})

