// pages/dhdetail/dhdetail.js
var aesUtil = require('../../utils/aesUtil.js')
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    date: '2018-12-01',
    date2: '2019-05-30',
    resultInfo: [],
    nextPageNum:1,
    pageSize:10,
    isLastPage:false,
    showListModal:false,
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
	var result = app.getDate();
	this.setData({
        date: result.substring(0,result.lastIndexOf("-")+1)+"01",
        date2:result
     })
    this.recruitDetail();
  },
  /**
   * 获取招募明细
   */
  recruitDetail: function () {
    var that = this;
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    var param = "hfxsesionid="+sessionId+"&createStartDate="+that.data.date+"&createEndDate="+that.data.date2;
    wx.request({
    	url: app.globalData.contentPath + '/personal/recruitDetail.shtml',
    	method: "POST",
    	data: param+"&nextPageNum="+that.data.nextPageNum+"&pageSize="+that.data.pageSize,
    	header: {
    		'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
    	},
    	success: function (res) {
    		if (res.data.resultCode == "0003") {
    			wx.switchTab({
		          url: '../index/index',
		        })
    	 	} else {
    		   var list = res.data.huiFxUserList;
    		   var isLastPage =false;
    		   if(list != null && list.length > 0){
    			  var length = list.length;
    			  for(var i in list){
    				  if(i==0 ||　i < (length-1)){
    					  list[i].createTime = app.getDate(list[i].createTime);
    				  }
    			  }
    			  if(length-1 == list[length-1].totalNum){
    				  isLastPage = true;
    			  }
    			  var asList = length == 1 ? list : list.slice(0,list.length-1);
    			  that.setData({
    				  resultInfo: asList,
    				  isLastPage:isLastPage
    			  })
             that.hideListTips();
    		   }else {
             that.showListTips();
           }
    	 	}
    	}
    })     
  },
  
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	  //最后一页，取消下拉功能
	  if(this.data.isLastPage){
      console.log("last page ");
	      return
	  };
	  this.setData({
		  pageSize: this.data.pageSize + 10,
	  })
	  this.recruitDetail();
  },

  /**
   * 详细
   */
  navigateToMyywl:function(e){
    var fxCode = e.currentTarget.dataset.fxcode;
    wx.navigateTo({
      url: '../ywl/ywl?fxCode=' + aesUtil.decrypt(fxCode),
    })
  }
})