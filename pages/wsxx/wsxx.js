// pages/wsxx/wsxx.js
var aesUtil = require('../../utils/aesUtil.js')
var QRCode = require('../../utils/qrcode.js')
const app = getApp()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    showFlag: true,
    showMsg: "",
    userName:"",


  },
  /**
   * 返回首页
   */
  backToIndex: function () {
    console.log("------------")
    wx.navigateTo({
      url: '../index/index'
    })
  },

  showName: function(msg) {
    var that = this;
    this.setData({
      showMsg: msg,
      showFlag: false
    })
    //延迟关闭弹窗
    setTimeout(() => {
      that.hideName();
    }, 1500);

  },
  hideName: function() {
    this.setData({
      showFlag: true
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  },
  /**
      * 输入手机号校验
      */
  userNameInput: function (e) {
    var userNamea = e.detail.value
    this.setData({
      userName: userNamea
    })

  },

  //为之前的存量用户完善用户名
  perfectMsg: function() {
    var that = this;
    var userName = that.data.userName;
    console.log("userName--" + userName)
    if (userName == null || userName == "" || userName == undefined) {
      that.showName("请填写小店昵称");
      //app.showTankuang("请填写小店昵称");
      return;
    }
    if (userName.length < 2) {
      that.showName("请保证昵称在2-8个字符之间");
      return;
    }
    var reg = /^[\u4e00-\u9fa5_a-zA-Z0-9]+$/;
    if (!(reg.test(userName))) {
      that.showName("请填写正确的格式");
      return;
    }

    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("perfectMsg sessionId:" + sessionId);
    var url = app.globalData.contentPath + "/wxFxJhController/perfectMsg.shtml";
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        hfxsesionid: sessionId,
        userName: userName
      },
      dataType: "json",
      method: "POST",
      url: url,
      success: function (res) {
        var resultCode = res.data.resultCode;
        console.log("perfectMsg :" + resultCode);
        if (resultCode == "0") {
          that.showName( "小店昵称保存成功");
          wx.reLaunch({
            url: '../index/index'
          })


          wx.navigateTo({
            url: '../register/register'
          })
          
        } else {
          that.showName(res.data.resultMsg);
        }
      }
    })
  },


})