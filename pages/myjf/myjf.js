// pages/myjf/myjf.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    count:"0",
    totalPoints:"0",
    resultInfo:[],
    signData:"",
    showListModal: false,

  },
  showListTips: function () {
    this.setData({
      showListModal: true,
    })
  },
  hideListTips: function () {
    this.setData({
      showListModal: false,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getTotalPd();
  },
  /**
   * 总积分查询
   */
  getTotalPd:function(){
    var that = this;
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    wx.request({
      url:  app.globalData.contentPath + '/personal/getTotalPd.shtml',
      method:"POST",
      data: {
        hfxsesionid: sessionId
      },
      header: { 'content-type': 'application/x-www-form-urlencoded' },
      success: function (res) {
         if (res.data.resultCode == "0003"){
        	 //  未登录跳转首页去登录
        	 wx.switchTab({
		        url: '../index/index',
		     })
         }else{
        	if (res.data.resultInfo.resultCode == "00000"){
        		var resultInfo = res.data.resultInfo.result.resultList;
        		resultInfo.push(res.data.recruitInfo);
        		var pointsState = 0;
        		var points = 0;
        		if (resultInfo != null && resultInfo.length > 0){
        			for(var i in resultInfo){
        				pointsState += parseInt(resultInfo[i].pointsState);
        				points += parseInt(resultInfo[i].points);
        			}
        		}else{

             
            }
        		// 添加签到
        		pointsState += res.data.sdto.totalNum;
        		points += res.data.sdto.points;
        		that.setData({
        			count: pointsState,
        			totalPoints: points,
        			resultInfo: resultInfo,
        			signData:res.data.sdto
        		})
        	}
         }
       },
    })
  }
})