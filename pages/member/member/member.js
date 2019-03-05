const app = new getApp();
var time = require("../../../utils/util.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: '',
    member_info: {},
    integralConfig: {}, //积分赠送配置
    isSign: 0, //是否签到
    unpaidOrder: 0, //待支付
    shipmentPendingOrder: 0, //待发货
    goodsNotReceivedOrder: 0, //待收货
    giftGiveOrder: 0, //待赠送
    refundOrder: 0, //退款
    is_verification: 0, //是否本店核销员
    is_open_virtual_goods: 0, //是否开启虚拟商品
    listClickFlag: 0,
    is_vip: 0,
    // unregistered: 1, //是否注册(1, 0)
    showModal: false,
    Choice: false,
    layout: false,
    tel: ''

  },
  REUSE_member: function () {
    let that = this;
    app.sendRequest({
      url: 'api.php?s=member/memberIndex',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.setData({
            unpaidOrder: data.unpaidOrder,
            shipmentPendingOrder: data.shipmentPendingOrder,
            goodsNotReceivedOrder: data.goodsNotReceivedOrder,
            giftGiveOrder: data.giftGiveOrder,
            refundOrder: data.refundOrder,
            integralConfig: data.integralConfig,
            isSign: data.isSign,
            is_verification: data.is_verification,
            is_open_virtual_goods: data.is_open_virtual_goods,
          })
        }
        // console.log(res)
      }
    })


    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let member_info = data;
          let distributor_type = data.distributor_type;
          console.log(distributor_type)
          let img = member_info.user_info.user_headimg;
          member_info.user_info.user_headimg = app.IMG(img); //图片路径处理
          let tel = data.user_info.user_tel;
          console.log(tel);
          that.setData({
            member_info: res.data,
            tel: tel,
            distributor_type
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    that.setData({
      Base: base,
      defaultImg: defaultImg
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // vip_overdue_time

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    //是否授权数据更新
    let updata = app.globalData.unregistered;
    console.log(updata)
    let vip_overdue_time = app.globalData.vip_overdue_time
    // console.log(vip_overdue_time)
    //会员有效期
    let vip_validity = time.formatTime(vip_overdue_time, 'Y年M月D日');
    // console.log(time.formatTime(vip_overdue_time, 'Y年M月D日'))
    let tab_parm = app.globalData.tab_parm;
    let tab_type = app.globalData.tab_type;
    let tab = app.globalData.tab;
    // console.log(tab)
    let is_vip = app.globalData.is_vip
    // console.log(is_vip, tab_type)

    that.setData({
      vip_validity: vip_validity,
      unregistered: updata,
      is_vip
    })

    if (tab_parm == 'cancle_pay') {
      if (tab == 2) {
        let url = tab_type == 2 ? '/pages/order/myvirtualorderlist/myvirtualorderlist' : '/pages/member/givingRecords/givingRecords?status=1';
        app.setTabParm('');
        app.setTabType('');

        wx.navigateTo({
          url: url,
        })
      } else {
        let url = tab_type == 2 ? '/pages/order/myvirtualorderlist/myvirtualorderlist' : '/pages/order/myorderlist/myorderlist?status=1';
        app.setTabParm('');
        app.setTabType('');
        wx.navigateTo({
          url: url,
        })
      }

    }


    let member_info = that.data.member_info;
    app.restStatus(that, 'listClickFlag');
    //回调解决执行的先后顺序的问题
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.REUSE_member();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.REUSE_member();

        }
      }
    }


  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let member_info = that.data.member_info;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let img = member_info.user_info.user_headimg;
    let parm = {};
    let parm_key = "member_info.user_info.user_headimg";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 签到
   */
  signIn: function (e) {
    let that = this;
    app.sendRequest({
      url: 'api.php?s=member/signIn',
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data == 0) {
            app.showBox(that, '签到失败');
          } else if (data == 1) {
            app.showBox(that, '签到成功');
            that.setData({
              isSign: 1
            })
          }
        }
        // console.log(res);
      }
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false,
      Choice: false,
      layout: false,
    })
  },
  /**登录分支点*/
  Branch: function (e) {
    let _that = this;
    let branch = e.currentTarget.dataset.status;
    if (branch == "mobile") {
      _that.setData({
        Choice: false,
        layout: false,
      })
      wx.navigateTo({
        url: '/pages/member/updatemobile/updatemobile?cho=1',
      })
    } else if (branch == "no") {
      _that.setData({
        Choice: false
      })
    }




  },
  /**触发*/
  Crossroad: function () {
    let _that = this;
    let Tel=_that.data.tel;
    if (app.globalData.unregistered == 1 || Tel=='') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
      }
  },

  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    console.log(app.globalData.token)

    if (app.globalData.token == '' || that.data.tel == '') {
      wx.showModal({
        title: '请登录...',
        content: '请您先登录成为会员,才可以同步个人数据.',
        showCancel: false,
      })
      return false;
    }
    let data_url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;
    if (listClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'listClickFlag');
    wx.navigateTo({ url: '/pages/' + data_url });
  },

  // 去会员专区
  toMemberZone: function () {
    let that = this
    wx.navigateTo({
      url: "/pages/payMembers/memberZone/memberZone",
    })
  },
  // 去注册会员
  toPayMember: function () {
    let that = this
    wx.navigateTo({
      url: "/pages/payMembers/payMember/payMember",
    })

    // wx.navigateTo({
    //   url: "/pages/payMembers/memberZone/memberZone",
    // })
  },

  //获取微信手机号
  getPhoneNumber: function (e) {
    let that = this;
    //判断是否容许获取微信手机号码
    if (e.detail.iv) {
      let setIv = e.detail.iv;
      let setEncryptedData = e.detail.encryptedData;
      that.setData({
        setIv: setIv,
        setEncryptedData
      })
      console.log(that.data.unregistered)
      //判断是否继续弹出获取个人信息弹窗
      if (that.data.unregistered == 0) {
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatMobile',
              data: {
                code: coco,
                mobileEncryptedData: e.detail.encryptedData,
                mobileIv: e.detail.iv
              },
              success: function (res) {
                if (res.code == 0) {
                  that.setData({
                    tel: res.data.user_tel,
                    Choice: false
                  })


                }

              }
            });
          }
        })



      } else {

        that.setData({
          showModal: true,
          Choice: false
        })
      }

    } else {

    }
  },
  //更新头像
  userinfo:function(res){
    let that=this;
    console.log(res.rawData);
    if (res.detail.iv) {
      let iv = res.detail.iv;
      let encryptedData = res.detail.encryptedData;
      app.globalData.iv = res.detail.iv;
      app.globalData.encryptedData = res.detail.encryptedData;
      app.globalData.unregistered = 0;
      console.log(res.detail.iv
      )}
      console.log(res.rawData);
      console.log(res.detail.userInfo.avatarUrl)
      console.log(res.detail.userInfo.nickName);
      app.sendRequest({
        url: 'api.php?s=member/updateMemberDetail',
        data: {
          avatarUrl:res.detail.userInfo.avatarUrl,
          nickName:res.detail.userInfo.nickName,
          wx_info:res.detail.rawData,
        },
        success: function (res) {
          if (res.code == 1) {

            that.setData({
              tel: res.data.user_tel,
              Choice: false
            })


          }

        }
      });
    let heder_img = res.detail.userInfo.avatarUrl
    let wx_name = res.detail.userInfo.nickName
    let branch = res.currentTarget.dataset.status;

    that.setData({
      wx_name: wx_name,
      heder_img
    })
  },
  //获取头像
  bindgetuserinfo: function (res) {
    let that = this;
    console.log(res)

    if (res.detail.iv) {
      let iv = res.detail.iv;
      let encryptedData = res.detail.encryptedData;
      app.globalData.iv = res.detail.iv;
      app.globalData.encryptedData = res.detail.encryptedData;
      app.globalData.unregistered = 0;
      console.log(res.detail.iv
      )

      console.log(res.detail.userInfo.avatarUrl)
      console.log(res.detail.userInfo.nickName)
      let heder_img = res.detail.userInfo.avatarUrl
      let wx_name = res.detail.userInfo.nickName
      let branch = res.currentTarget.dataset.status;
      this.setData({
        showModal: false,
        Choice: false
      })
      console.log(branch, 'branch ')
      if (branch == "mobile") {
        this.setData({
          layout: true,

        })

        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatEncryptInfo',
              data: {
                code: coco,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                if (res.code == 0) {
                  let lpl = res.data.token;
                  app.globalData.openid = res.data.openid;
                  app.globalData.token = res.data.token;
                  that.setData({
                    unregistered: 0,
                    wx_name: wx_name,
                    heder_img
                  })

                  that.REUSE_member();

                }

              }
            });
          }
        })





      } else {
        wx.login({
          success: function (res) {
            let coco = res.code;
            app.sendRequest({
              url: 'api.php?s=Login/getWechatEncryptInfo',
              data: {
                code: coco,
                encryptedData: encryptedData,
                iv: iv
              },
              success: function (res) {
                if (res.code == 0) {
                  let lpl = res.data.token;
                  app.globalData.openid = res.data.openid;
                  app.globalData.token = res.data.token;
                  that.setData({
                    unregistered: 0,
                    wx_name: wx_name,
                    heder_img
                  })
                  wx.login({
                    success: function (res) {
                      let coco = res.code;
                      app.sendRequest({
                        url: 'api.php?s=Login/getWechatMobile',
                        data: {
                          code: coco,
                          mobileEncryptedData: that.data.setEncryptedData,
                          mobileIv: that.data.setIv,
                          token: lpl
                        },
                        success: function (res) {

                          that.REUSE_member();
                          if (res.code == 0) {
                            that.setData({
                              unregistered: 0,
                              wx_name: wx_name,
                              tel: res.data.user_tel,
                              heder_img
                            })

                          }
                        }
                      });
                    }
                  })



                }

              }
            });
          }
        })
      }






    } else {
      this.setData({
        showModal: false,

      })
    }





  },




})