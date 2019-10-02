//index.js
//获取应用实例
var interval = null //倒计时函数
var aesUtil = require('../../utils/aesUtil.js')
var QRCode = require('../../utils/qrcode.js')
const app = getApp()

Page({
  data: {
    pageTab: {
      curHdIndex: 0,
      curBdIndex: 0
    },
    showModal: false,
    showInput: false,
    showpicModal: false,
    showqunModal: false,
    showFxModal: false,
    //手机号
    phone: "",
    realPhone: "",
    //可兑换积分
    exchangeTotalPoints: "0",
    //业务量
    totalOrder: "0",
    //我的订单
    recruitNum: "0",
    //总积分
    totalPoints: "0",
    //兑换数量
    exchangeNum: '0',
    //验证码登录手机号
    inputPhone: "",
    cmPhone: "",
    //弹出和隐藏登录框flag
    showandhideflag: true,
    //验证码
    smsyzm: "",
    //密码登录手机号
    inputPhone1: "",
    //跳转活动中心加密手机号
    aesPhone: "",
    //密码
    smsyzm1: "",
    
    // 提示语
    tip: "",
    shopName: "我",
    cityName: "",
    // 提示语样式，隐藏或展示
    show: "hide",
    inputValue: null,
    date: '请选择日期',
    fun_id: 2,
    time: '获取验证码',
    currentTime: 60,
    bgpic: '../../images/hfxpic1.png',
    wxpic: '',
    imagePath: '',
    allowlogin: '0',
    //业务列表相关参数 ---------
    resultInfo: [],
    nextPageNum: 1,
    pageSize: 10,
    isLastPage: false,
    showpicModal: false,
    sourceShareUrl: "https://ah.10086.cn/mpad/scShare/",
    //当前弹出框背景图片
    bgpic: '',
    //当前弹出框二维码图片路径
    imagePath: '',
    //当前弹出二维码最终链接
    lastShareUrl: '',
    //当前弹出的获取海报类型 1 2 4 
    imgType: '',
    //当前弹出二维码信息  在背景图的位置（长宽）+自己长宽
    imgLocation: '',
    //二维码在背景图位置
    qrWidth: '28',
    //二维码在背景图位置
    qrHig: '60',
    //导出二维码路径
    imagePath1: '',
    //存入本地的海报背景
    localQrCodeUrl: '',
    //当前海报位置高度
    currentHeight: '',
    //当前海报位置宽度
    currentWidth: '',
    //当前手机宽度
    windowWidth: "",
    //当前手机高度
    windowHeight: "",
    //750*1334尺寸大小的图片，用作保存到手机之前的一次过渡
    realImage: "",
    showMsg: "",
    tshareTitile: "",
    shareDesc: "",
    shareImgPath: "",
    shareUrl: "",
  },
  registFxUser: function() {
    wx.navigateTo({
      url: '../register/register'
    })
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function() {
    var that = this
    console.log("onLoad start")
    //登录
    this.isLogin();

  },

  //点击导航
  pageHdtap: function(e) {
    //点击子元素
    var _datasetId = e.target.dataset.id;
    var _leftObj = {};
    _leftObj.curHdIndex = _datasetId;
    _leftObj.curBdIndex = _datasetId;
    this.setData({
      pageTab: _leftObj
    });
  },

  showFx: function() {
    this.setData({
      showFxModal: true
    })
  },
  hideFx: function() {
    this.setData({
      showFxModal: false
    })
  },

  showDialogBtn: function() {
    this.setData({
      showModal: true
    })
  },

  hideModal: function() {
    this.setData({
      showModal: false
    });
    this.setData({
      showandhideflag: false
    });
  },

  hideInputBtn: function() {
    this.setData({
      showInput: false,
      inputValue: ' '
    })
  },
  showInputBtn2: function() {
    this.setData({
      showInput2: true
    })
  },
  hideInputBtn2: function() {
    this.setData({
      showInput2: false,
      inputValue: ''
    })
  },
  showInputBtn3: function() {
    this.setData({
      showInput3: true
    })
  },
  hideInputBtn3: function() {
    this.setData({
      showInput3: false,
      inputValue: ''
    })
  },
  showInputBtn4: function() {
    this.setData({
      showInput4: true
    })
  },
  hideInputBtn4: function() {
    this.setData({
      showInput4: false,
      inputValue: ''
    })
  },

  showPic: function() {
    this.setData({
      showpicModal: true
    })
  },

  hidepicModal: function() {
    this.setData({
      showpicModal: false
    });
  },

  showQun: function() {
    this.setData({
      showqunModal: true
    })
  },

  hidequnModal: function() {
    this.setData({
      showqunModal: false
    });
  },


  /**
   * 设置为不可登录状态
   */
  logindisabled: function() {
    this.setData({
      allowlogin: '1'
    })
  },
  /**
   * 设置为可登录状态
   */
  loginnotdisabled: function() {
    this.setData({
      allowlogin: '0'
    })
  },

  //-----------------------------hfx login -----------------------------
  /**
   * 用户是否登录
   */
  isLogin: function() {
    var that = this
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID")
   // var wxcode = app.globalData.wxcode;
    
    wx.showLoading({
      title: '加载中…',
    })
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        var wxcode = res.code;
        if (wxcode) {
          console.log("first wxcode222:" + wxcode)
         
        }
        console.log('获取到sessionId：' + sessionId + '==wxcode：' + wxcode)
        wx.request({
          url: app.globalData.contentPath + '/wxFxLogin/isLogin.shtml',
          data: {
            hfxsesionid: sessionId,
            code: wxcode,
          },
          header: {
            'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
          },
          success: function (res) {
            console.log(res);
            if (res.data) {
              //已登录
              if (res.data.resultCode == "0") {
                console.log("已登录");
                //关闭弹框
                that.hideModal();
                //是否有店铺名称
                that.isUserName();
                //未登录
              } else if (res.data.resultCode != "0") {
                console.log("刷新session为：" + res.data.hfxsesionid)
                if (res.data.hfxsesionid) {
                  wx.setStorageSync("SC_HFX_SESSIONID", res.data.hfxsesionid);
                  console.log("未登录,刷新session为：" + res.data.hfxsesionid)
                  //打开弹框
                  that.showDialogBtn();
                }
              }
            }
            wx.hideLoading();
          },
          fail: function (e) {
            wx.hideLoading();
            app.showTankuang('网络连接异常，请检查您的网络！', "")
          }
        })
      }
    })
  
   
  },
  /**
   * 获取短信验证码
   */
  getSms: function() {
    var that = this
    var fxphone = that.data.inputPhone
    if (!checkPhone(fxphone, that)) {
      console.log("111");
      return;
    }
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    fxphone = aesUtil.encrypt(fxphone);
    console.log("getSms:" + sessionId + "=fxphone:" + fxphone)
    wx.request({
      url: app.globalData.contentPath + '/wxFxLogin/psmsWx.shtml?t=' + new Date().getTime(),
      data: {
        phone: fxphone,
        hfxsesionid: sessionId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function(res) {
        if (!res.data) {
          return
        }
        if (res.data.result == '0') {
          console.log("sms send  sucess")
          setFxData("验证码下发成功", that);
        } else {
          console.log("sms send fail")
          setFxData("验证码下发失败", that);
        }
      },
      fail: function(e) {
        app.showTankuang('网络连接异常，请检查您的网络！', '/pages/mymain/mymain')
      }
    })
  },
  /**
   * 1手机短信验证码登录
   * 2手机密码登录
   */
  hfxWxLogin: function(e) {
    var that = this
    var type = e.currentTarget.dataset.logintwo;
    var fxphone = '';
    var fxpassword = '';
    var allowrequest = that.data.allowlogin;
    if (allowrequest == '1') {
      setFxData("请勿频繁登录", that);
      return false;
    }
    //验证码登录
    if (type == '2') {
      fxphone = that.data.inputPhone
      fxpassword = that.data.smsyzm
      //密码登录
    } else if (type == '1') {
      fxphone = that.data.inputPhone1
      fxpassword = that.data.smsyzm1
    }
    console.log(fxphone + "==" + fxpassword + "==" + type);
    if (!checkPhone(fxphone, this)) {
      return;
    }
    if (!checkSms(fxpassword, this)) {
      return;
    }
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    fxphone = aesUtil.encrypt(fxphone);
    fxpassword = aesUtil.encrypt(fxpassword);
    console.log("loginSession:" + sessionId + "loginfxphone:" + fxphone + "=fxpassword:" + fxpassword)

    //按钮设置为不可登录5秒
    that.logindisabled();

    //不可登录状态 5秒后自动放开
    setTimeout(function() {
      console.log("login btn is ok  ")
      that.loginnotdisabled();
    }, 5000)

    wx.request({
      url: app.globalData.contentPath + '/wxFxLogin/hLoginFxnWx.shtml',
      data: {
        phone: fxphone,
        password: fxpassword,
        passtype: type,
        hfxsesionid: sessionId
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function(res) {
        if (res.data) {
          //登录成功
          if (res.data.resultCode == "0") {
            console.log("login success ")
            wx.setStorageSync("SC_HFX_SESSIONID", res.data.hfxsesionid);
            //关闭弹框
            that.hideModal();
            //处理登录数据
            var userInfo = res.data.userDto;
            if (userInfo) {
              console.log(userInfo.cityCode);
              console.log(app.getCityName(userInfo.cityCode));
              var shopUserName = userInfo.userName;
              if (shopUserName == null || shopUserName == "" || shopUserName == undefined) {
                shopUserName = '我的'
              }
              that.setData({
                shopName: shopUserName,
                cityName: app.getCityName(userInfo.cityCode),
              });
            }
            //是否有店铺名称
            that.isUserName();

            //登录失败
          } else {
            console.log("login fail ");
            var msg = res.data.message;
            setFxData(msg, that);
          }
        }
      },
      fail: function(e) {
        app.showTankuang('网络连接异常，请检查您的网络！', '/pages/mymain/mymain')
      }
    })
  },
  /**
   * 输入手机号校验
   */
  phoneInput: function(e) {
    var phoneIn = e.detail.value
    if ((!/^[0-9]\d*$/.test(phoneIn))) {
      phoneIn = ""
    }
    this.setData({
      inputPhone: phoneIn
    })

  },
  /**
   * 输入验证码校验
   */
  smsInput: function(e) {
    var smsyzmIn = e.detail.value
    if ((!/^[0-9]\d*$/.test(smsyzmIn))) {
      smsyzmIn = ""
    }
    this.setData({
      smsyzm: smsyzmIn
    })

  },
  /**
   * 输入手机号校验
   */
  phoneInputA: function(e) {
    var phoneIn = e.detail.value
    if ((!/^[0-9]\d*$/.test(phoneIn))) {
      phoneIn = ""
    }
    this.setData({
      inputPhone1: phoneIn
    })

  },
  /**
   * 输入随机码校验
   */
  smsInputA: function(e) {
    var smsyzmIn = e.detail.value
    if ((!/^[0-9]\d*$/.test(smsyzmIn))) {
      smsyzmIn = ""
    }
    this.setData({
      smsyzm1: smsyzmIn
    })
  },
  /**
   * 输入总金额校验
   */
  amountInput: function(e) {
    var amountIn = e.detail.value
    if (amountIn) {
      this.setData({
        exchangeNum: amountIn
      })
    }


  },
  /**
   * 跳转H5注册页面
   */
  registFxUser: function(options) {
    var that = this;
    app.toWebUrl('https://ah.10086.cn/mpad/pad/fxperson/registered.html');
  },

  /**
   * 获取验证码具体方法
   */
  getCode: function(options) {
    var that = this;
    var currentTime = that.data.currentTime;
    that.setData({
      time: currentTime + '秒'
    })
    interval = setInterval(function() {
      that.setData({
        time: (currentTime - 1) + '秒'
      })
      currentTime--;
      if (currentTime <= 0) {
        clearInterval(interval)
        that.setData({
          time: '重新获取',
          currentTime: 60,
          disabled: false
        })
      }
    }, 1000)
  },
  /**
   * 通过手机号获取验证码
   */
  getVerificationCode: function() {
    var that = this
    var fxphone = that.data.inputPhone
    if (!checkPhone(fxphone, that)) {
      console.log("手机号异常");
      return;
    }
    that.getCode();
    that.setData({
      disabled: true
    })
    this.getSms();
  },

  /**
   * 业务推广列表
   */
  getFxPersonPage: function() {
    wx.showLoading({
      title: '加载中…',
    })
    var that = this;
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    wx.request({
      url: app.globalData.contentPath + '/personal/getFxPersonPage.shtml',
      method: "POST",
      data: {
        hfxsesionid: sessionId,
        totalNum: "10",
        nextPageNum: that.data.nextPageNum,
        pageSize: that.data.pageSize,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function(res) {
        wx.hideLoading();
        console.log("RET:" + res.data.result.returnCode);
        //success 
        if (res.data.result.returnCode == "0") {
          var list = res.data.data.resultList;
          var totalNum = res.data.data.totalNum;
          var isLastPage = false;
          for (var i = 0; i < list.length; i++) {
            list[i].shareLinkImg = app.globalData.imgPath + list[i].shareLinkImg;
          }
          if (list.length == totalNum) {
            isLastPage = true;
          }
          that.setData({
            resultInfo: list,
            isLastPage: isLastPage
          })
        }
      },
      fail: function(e) {
        wx.hideLoading();
        app.showTankuang('网络连接异常，请检查您的网络！', '/pages/mymain/mymain')
      },
    })
  },
  /**
   * 上拉加载下一页
   */
  onReachBottom: function() {
    //最后一页，取消下拉功能
    if (this.data.isLastPage) {
      return
    };
    this.setData({
      pageSize: this.data.pageSize + 10
    })
    this.getFxPersonPage();
  },
  /**
   *为区分双二维码单独查询短地址
   */
  getShortUrl: function(kfAgent, batchNo, type, imgPath) {
    var that = this;

    that.setData({
      showpicModal: true
    })
    //获取不同手机对应的海报区大小的宽度和高度

    //创建节点选择器
    var query = wx.createSelectorQuery();
    //选择id

    query.select('.tcpic1').boundingClientRect(function(rect) {
      console.log("===================================" + rect.width);
      that.setData({
        currentHeight: rect.height,
        currentWidth: rect.width
      })
    }).exec();

    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    console.log("kfAgent" + kfAgent);
    console.log("batchNo" + batchNo);
    wx.request({
      url: app.globalData.contentPath + "/fxPerson/getShortUrl.shtml?t=" + new Date().getTime(),
      method: "POST",
      data: {
        hfxsesionid: sessionId,
        kfAgent: kfAgent,
        batchNo: batchNo,
      },
      header: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
      },
      success: function(res) {
        if (res.data.shortUrl) {
          var shortUrl = res.data.shortUrl;
          if (shortUrl) {
            console.log("index:" + shortUrl.indexOf(","));
            if (shortUrl.indexOf(",") == 1) {
              //画图双二维码和海报
              // that.showDoubleHaibao(shortUrl, type, imgPath)
            } else {
              //画图单二维码和海报
              that.showHaibao(shortUrl, type, imgPath)
            }
          }

        }
      }
    })
  },
  /**
   * 隐藏海报
   */
  hidepicModal: function() {
    this.setData({
      showpicModal: false
    });
  },
  /**
   * 查询二维码信息并展示海报
   */
  showPic: function(e) {
    var that = this;
    that.setData({
      showMsg: false,
    })



    //查询二维码信息 
    //console.log(e);
    var kfAgent = e.currentTarget.dataset.obj.kfAgent;
    var batchNo = e.currentTarget.dataset.obj.batchNo;
    var backImgType = e.currentTarget.dataset.obj.backImgType;
    var backImg = e.currentTarget.dataset.obj.backImg;
    console.log("kfAgent:" + kfAgent);
    console.log("batchNo:" + batchNo);
    console.log("backImgType:" + backImgType);
    console.log("backImg:" + backImg);
    //获取短地址并生成二维码
    that.getShortUrl(kfAgent, batchNo, backImgType, backImg)
    this.setData({
      bgpic: app.globalData.imgPath + backImg,
      //bgpic:"../../images/aaaaa.png",
      showpicModal: true
    })
  },

  /**
   * 绘制二维码图片
   */
  createQrCode: function(url, canvasId, cavW, cavH) {
    //调用插件中的draw方法，绘制二维码图片
    QRCode.api.draw(url, canvasId, cavW, cavH);
    setTimeout(() => {
      this.canvasToTempImage(canvasId);
    }, 300);
  },
  /**
   * 获取临时缓存照片路径，存入data中
   */
  canvasToTempImage: function(canvasId) {
    var that = this;
    //把当前画布指定区域的内容导出生成指定大小的图片，并返回文件路径。
    wx.canvasToTempFilePath({
      canvasId: canvasId,
      success: function(res) {
        var tempFilePath = res.tempFilePath;
        console.log("0000:" + tempFilePath);
        console.log("canvasId:" + canvasId);
        that.setData({
          imagePath: tempFilePath,
        });
        //获取网络图片本地路径
        wx.getImageInfo({
          src: that.data.bgpic, //服务器返回的图片地址
          success: function(res) {
            //res.path是网络图片的本地地址
            let Path = res.path;
            console.log("===Path===" + Path);
            that.setData({
              localQrCodeUrl: Path,
              //bgpic: Path
            })
            //获取当前海报位置的宽度和高度
            var ctx = wx.createCanvasContext('canvas');
            ctx.setFillStyle('#ffffff')
            var currentWidth = that.data.currentWidth;
            var currentHeight = that.data.currentHeight;
            console.log("currentWidth=" + currentWidth + "currentHeight=" + currentHeight);
            ctx.fillRect(0, 0, currentWidth, currentHeight)
            //画背景图
            ctx.drawImage(that.data.localQrCodeUrl, 0, 0, currentWidth, currentHeight)
            console.log("that.data.imgLocation.x=" + that.data.imgLocation.x);
            var codeType = that.data.imgType;
            var x = "";
            var y = "";
            var w = "";
            var h = "";
            console.log("codeType=" + codeType);
            //对于不同的二维码位置
            if (codeType == '3') {
              x = currentWidth / 1.53;
              y = currentHeight / 1.28;
              w = currentWidth / 3.48;
              h = currentWidth / 3.48;
            } else if (codeType == "2") {
              x = currentWidth / 3.04;
              y = currentHeight / 1.58;
              w = currentWidth / 2.80;
              h = currentWidth / 2.80;
            } else if (codeType == "1") {
              x = currentWidth / 2.99;
              y = currentHeight / 2.54;
              w = currentWidth / 2.83;
              h = currentWidth / 2.83;
            }

            console.log("x=" + x + "&y=" + y + "&w=" + w + "&h=" + h);
            //画二维码
            ctx.drawImage(that.data.imagePath, x, y, w, h)
            ctx.draw();
            that.setData({
              showMsg: true,
            })
          },
          fail: function(res) {
            //失败回调
          }
        });

      },
      fail: function(res) {
        console.log(res);
      }
    }, that);
  },


  /**
   * 保存图片
   */
  save() {
    //获取手机屏幕高度和宽度
    var windowHeight = wx.getSystemInfoSync().windowHeight
    var windowWidth = wx.getSystemInfoSync().windowWidth
    windowHeight = windowWidth * 1334 / 750;
    console.log("手机屏幕高度=" + windowHeight + "手机屏幕宽度=" + windowWidth);

    var that = this;
    that.setData({
      windowHeight: windowHeight,
      windowWidth: windowWidth,
    })
    var ctx = wx.createCanvasContext('mycanvas1');
    ctx.fillRect(0, 0, windowWidth, windowHeight);
    var lastShareUrl = this.data.lastShareUrl;
    var imgType = this.data.imgType;
    var imgLocation = this.data.imgLocation;
    var imagePath = this.data.imagePath;
    var bgpic = this.data.localQrCodeUrl;
    console.log(' download localQrCodeUrl:' + bgpic)
    console.log('download imgType:' + imgType)
    console.log('download imgLocation:' +
      imgLocation.x + "--" + imgLocation.y +
      "--" + imgLocation.w + "--" + imgLocation.h)
    console.log('download imagePath1:' + imagePath)

    //画背景图
    ctx.drawImage(bgpic, 0, 0, windowWidth, windowHeight);

    //画二维码
    var x = "";
    var y = "";
    var w = "";
    var h = "";

    //var x = imgLocation.x;
    // var y = imgLocation.y ;
    // var w = imgLocation.w;
    // var h = imgLocation.h ;
    console.log("imgType=" + imgType);
    if (imgType == '3') {
      x = windowWidth / 1.53;
      y = windowHeight / 1.28;
      w = windowWidth / 3.48;
      h = windowWidth / 3.48;
    } else if (imgType == "2") {
      x = windowWidth / 3.04;
      y = windowHeight / 1.58;
      w = windowWidth / 2.83;
      h = windowWidth / 2.83;
    } else if (imgType == "1") {
      x = windowWidth / 2.99;
      y = windowHeight / 2.54;
      w = windowWidth / 2.83;
      h = windowWidth / 2.83;
    }
    console.log("save------->   x=" + x + "y=" + y + "w=" + w + "h=" + h);
    ctx.drawImage(imagePath, x, y, w, h);
    ctx.draw();
    //保存 
    setTimeout(() => {
      that.saveImageLast();
    }, 1500);
    //that.saveImageLast();

  },
  saveImageLast() {
    console.log('--9999900--')
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas1',
      success(res) {
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success(res) {
            wx.showToast({
              title: '保存成功',
              icon: 'success'
            })
          }
        })
      }
    })
  },

  showHaibao: function(fxurl, type, imgPath) {
    console.log('bgpic:' + this.data.bgpic)
    var share_url = "https://ah.10086.cn/mpad/scShare/" + fxurl;
    console.log('share_url:' + share_url)
    var temp_qr_1 = {
      x: "155",
      y: "390",
      w: "340",
      h: "340"
    };
    var temp_qr_2 = {
      x: "255",
      y: "856",
      w: "240",
      h: "240"
    };
    var temp_qr_3 = {
      x: "490",
      y: "1054",
      w: "200",
      h: "200"
    };
    var temp_qr_4 = {
      x: "516",
      y: "1028",
      w: "185",
      h: "185"
    };

    var temp = {};
    if (type == 1) {
      temp = temp_qr_1;
    } else if (type == 2) {
      temp = temp_qr_2;
    } else if (type == 4) {
      temp = temp_qr_4;
    } else {
      temp = temp_qr_3;
    }
    //缓存当前背景图片等信息
    this.setData({
      lastShareUrl: share_url,
      imgType: type,
      imgLocation: temp,
    });

    console.log('type:' + type)
    console.log('lastShareUrl:' + this.data.lastShareUrl)
    console.log('imgType:' + this.data.imgType)
    console.log('imgLocation:' + this.data.imgLocation)
    //画二维码生成cavas 缩放的二维码
    this.createQrCode(share_url, "mycanvas", temp.w, temp.h);
    //画二维码生成cavas   导出的二维码
    // this.createQrCode(share_url, "mycanvas1", temp.w , temp.h); 
  },

  saveFirst: function() {
    var that = this;
    var ctx = wx.createCanvasContext('mycanvas2');
    //测试
    ctx.fillRect(0, 0, 750, 1334);
    var lastShareUrl = that.data.lastShareUrl;
    var imgType = that.data.imgType;
    var imgLocation = that.data.imgLocation;
    var imagePath = that.data.imagePath;
    var bgpic = that.data.localQrCodeUrl;
    //测试
    ctx.drawImage(bgpic, 0, 0, 750, 1334);
    //画二维码
    var x = imgLocation.x;
    var y = imgLocation.y;
    var w = imgLocation.w;
    var h = imgLocation.h;
    console.log("saveFirst------->   x=" + x + "y=" + y + "二维码宽度w=" + w + "二维码高度h=" + h);
    ctx.drawImage(imagePath, x, y, w, h);
    ctx.draw();

    setTimeout(() => {
      that.aaa();
    }, 1000);
  },

  aaa: function() {
    var that = this;
    console.log("aaa === start===");
    wx.canvasToTempFilePath({
      canvasId: 'mycanvas2',
      success: function(res) {
        var realImage = res.tempFilePath;
        console.log("realImage=" + realImage);
        that.setData({
          realImage: realImage,
        })
        var windowHeight = wx.getSystemInfoSync().windowHeight
        var windowWidth = wx.getSystemInfoSync().windowWidth
        console.log("手机屏幕高度=" + windowHeight + "手机屏幕宽度=" + windowWidth);


        that.setData({
          windowHeight: windowHeight,
          windowWidth: windowWidth,
        })
        var ctxone = wx.createCanvasContext('mycanvas1');
        ctxone.fillRect(0, 0, windowWidth, windowHeight);
        ctxone.drawImage(that.data.realImage, 0, 0, windowWidth, windowHeight);
        ctxone.draw();
        setTimeout(() => {
          that.saveImageLast();
        }, 1000);
      }
    })
  },
  //跳转签到页面
  toSignIn: function() {
    var that = this;
    var sourceUrl = "https://act.ahydnet.com/h/d/ah/2019/sign/index.html?aesPhone=" + that.data.aesPhone;
    console.log(sourceUrl);
    app.toWebUrl(sourceUrl);
  },
  //判断用户是否存在用户名（用于展示和排序的）
  isUserName: function() {
    var that = this;
    var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
    console.log("sessionId" + sessionId);
    var url = app.globalData.contentPath + "/wxFxJhController/isUserName.shtml";
    wx.request({
      header: {
        'content-type': 'application/x-www-form-urlencoded'
      },
      data: {
        hfxsesionid: sessionId
      },
      dataType: "json",
      method: "POST",
      url: url,
      success: function(res) {
        console.log("isUserName success" + res);
        var resultCode = res.data.resultCode;
        if (resultCode == "0") {
          var user = res.data.dto;
          var userName = user.userName;
          console.log("userName :" + userName);
          if (userName == null || userName == "" || userName == undefined) {
            //跳转店铺名称补全页面
            wx.navigateTo({
              url: '../wsxx/wsxx'
            })
          } else {
            console.log("user phone:" + user.phone);  
            var telPhone = user.phone;      
            telPhone= telPhone.substring(0, 3) + "****" + telPhone.substring(telPhone.length - 4, telPhone.length);
            console.log("user telphone1:" + telPhone);
            that.setData({
              phone: telPhone,
              cmPhone: user.phone,
              aesPhone: res.data.aesPhone,
              shopName: userName,
              cityName: app.getCityName(user.cityCode),
            });
            that.getFxPersonPage();
          }

          //弹出提示用户微信号绑定提示
          //已绑定的和用户不允许绑定的不弹出提示

        } else {
          that.howDialogBtn();
        }
      }
    })

  },


  /**
   * 主动分享
   * 1分享店铺
   * 2邀请合伙人
   * 3分享商品
   */
  toShareAll: function(e) {
    var that = this;
    var obj = e.currentTarget.dataset.sharetwo;
    var name = "";
    var desc = "";
    var fxurl = "";
    var img = "";
    console.log("------" + obj);
    var userName = that.data.shopName;
    var userPhone = that.data.userPhone;
    var cityName = that.data.cityName;
    if (obj == "1") {
      //分享我的店铺
      name = "惠分享移动小店";
      desc = "这是你的好友" + userName + "的移动小店，快来看看吧";
      fxurl = "https://ah.10086.cn/mpad/pad/fxperson/shareIndex.html?userPhone=" + aesUtil.encrypt(userPhone) + "&userName=" + aesUtil.encrypt(userName) + "&userCity=" + aesUtil.encrypt(cityName);
      var img = "https://ah.10086.cn/mpad/pad/fxperson/images/hui.png";
      console.log("-1--name---" + name);
      console.log("-1--desc---" + desc);
      console.log("-1--fxurl---" + fxurl);
      console.log("-1--img---" + img);
      //设置动态参数
      that.setData({
        tshareTitile: name,
        shareDesc: desc,
        shareUrl: fxurl,
        shareImgPath: img,
      });
      //弹出遮罩层提示语
      that.showFx();

    } else if (obj == "2") {
      //邀请注册
      name = "惠分享注册";
      desc = "你的好友邀请你注册成为移动业务推广人，“码”上赚钱";
      fxurl = "https://ah.10086.cn/mpad/pad/fxperson/shareRegistered.html?enPhone=" + aesUtil.encrypt(userPhone);
      img = "https://ah.10086.cn/mpad/pad/fxperson/images/hui.png";
      console.log("-2--name---" + name);
      console.log("-2--desc---" + desc);
      console.log("-2--fxurl---" + fxurl);
      console.log("-2--img---" + img);
      //设置动态参数
      that.setData({
        tshareTitile: name,
        shareDesc: desc,
        shareUrl: fxurl,
        shareImgPath: img,
      });
      //弹出遮罩层提示语
      that.showFx();

    } else if (obj == "3") {
      //产品分享 
      name = e.currentTarget.dataset.obj.name;
      desc = e.currentTarget.dataset.obj.batchDesc;
      img = e.currentTarget.dataset.obj.shareLinkImg;

      var kfAgent = e.currentTarget.dataset.obj.kfAgent;
      var batchNo = e.currentTarget.dataset.obj.batchNo;
      console.log("batchNo---" + batchNo + "---kfAgent---" + kfAgent);
      //获取二维码
      var sessionId = wx.getStorageSync("SC_HFX_SESSIONID");
      console.log("sessionId" + sessionId);
      wx.request({
        url: app.globalData.contentPath + "/fxPerson/getShortUrl.shtml",
        method: "POST",
        data: {
          hfxsesionid: sessionId,
          kfAgent: kfAgent,
          batchNo: batchNo,
        },
        header: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8'
        },
        success: function(res) {
          if (res.data.shortUrl) {
            var shortUrl = res.data.shortUrl;
            fxurl = that.data.sourceShareUrl + res.data.shortUrl;
            console.log("-3--name---" + name);
            console.log("-3--desc---" + desc);
            console.log("-3--fxurl---" + fxurl);
            console.log("-3--img---" + img);
            //设置动态参数
            that.setData({
              tshareTitile: name,
              shareDesc: desc,
              shareUrl: fxurl,
              shareImgPath: img,
            });
            //弹出遮罩层提示语
            that.showFx();
          }
        }
      })
    }
  },

  /**
   * 用户点击分享按钮或右上角分享
   */
  onShareAppMessage: function(res) {
    var that = this;
    return {
      title: that.data.shareTitile,
      desc: that.data.shareDesc,
      path: that.data.shareUrl,
      imageUrl: that.data.shareImgPath,
      success: function(res) {
        // 转发成功
      },
      fail: function(res) {
        // 转发失败
      }
    }
  },






})

//---------------------------------function-------------------

/*
 * 检查手机号格式是否正确
 */
function checkPhone(checkPhone, that) {
  console.log("checkPhone:" + checkPhone);
  if (checkPhone == "") {
    setFxData("请输入手机号码", that);
    return false;
  } else if (checkPhone.length != 11) {
    setFxData("手机号码位数不对!", that);
    return false;
  } else if (!/^\d{11}$/.test(checkPhone)) {
    setFxData("手机号码格式不对!", that);
    return false;
  } else {
    return true;
  }
}

/*
 *检查验证码格式是否正确
 */
function checkSms(checkSms, that) {
  console.log("checkSms:" + checkSms)
  if (checkSms == "") {
    setFxData("请输入短信验证码!", that);
    return false;
  } else if (checkSms.length != 6) {
    setFxData("短信验证码位数不对!", that);
    return false;
  } else if (!/^\d{6}$/.test(checkSms)) {
    setFxData("短信验证码格式不对!", that);
    return false;
  } else {
    return true;
  }
}

/**
 * 设置提示语，三秒后清除提示语
 */
function setFxData(msg, that) {
  console.log("settime out ")
  that.setData({
    tip: msg,
    show: "show"
  });

  setTimeout(function() {
    that.setData({
      tip: '',
      show: "show"
    });
  }, 5000)
}