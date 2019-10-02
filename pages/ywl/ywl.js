// pages/myywl/myywl.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
     date: '2019-05-10',
     date2: '2019-05-30',
     resultInfo: [],
     fxCode:"",
     nextPageNum:1,
     pageSize:10,
     isLastPage:false,
    showListModal: false,
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
    var that = this;
    var fxCode = options.fxCode;
    if (!app.isEmpty(fxCode)){
       that.setData({
          fxCode: fxCode,
       });
    }
    this.getDatail();
  },
  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
	  //最后一页，取消下拉功能
	  if(this.data.isLastPage){
	      return
	  };
	  this.setData({
		  pageSize: this.data.pageSize + 10
	  })
	  this.getDatail();
  },

  /**
   * 获取招募明细
   */
  getDatail: function () {
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    wx.request({
      url: app.globalData.contentPath + '/personal/getDatail.shtml',
      method: "POST",
      data: {
        hfxsesionid: sessionId,
        beginTime: that.data.date,
        endTime: that.data.date2,
        fxCode: that.data.fxCode,
        nextPageNum:that.data.nextPageNum,
        pageSize:that.data.pageSize
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function (res) {
        if (res.data.resultCode == "0003") {

        } else {
          if (res.data.resultInfo.resultCode == "00000") {
            var list = res.data.resultInfo.result.resultList;
            var totalNum = res.data.resultInfo.result.totalNum;
            var isLastPage = false;
            if (list != null) {
              for (var i = 0; i < list.length; i++) {
                list[i].updateTime = app.getDate(list[i].updateTime);
                //适配图片 暂用isDelete字段 
                list[i].isDelete = "../../images/productpic/" + app.getImg(list[i].pointRelateId);
                list[i].pointsOwner=app.getHiddenPhone(list[i].pointsOwner);
              }
              if (list.length == totalNum){
                isLastPage = true;
              }
            that.hideListTips();
          } else {
            that.showListTips();
          }
            that.setData({
              resultInfo: list,
              isLastPage: isLastPage
            })
          }
        }
        wx.hideLoading();
      }
    })
  },
})