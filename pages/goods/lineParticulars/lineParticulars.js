// pages/goods/lineParticulars/lineParticulars.js
var time = require("../../../utils/util.js");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showModel: false,
    showAppoint: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    let updata = app.globalData.unregistered;
    that.setData({
      unregistered: updata,
    })


    // var scene = decodeURIComponent(options.scene)
    if (options.uid) {
      app.globalData.identifying = options.uid;
    }

    if (options.id) {
      var id = options.id;

      var title = "门店活动";
      var data = {
        id: id,
        title: title
      };
      that.setData({
        id: id,
        title: title
      })
    } else {
      var data = JSON.parse(decodeURIComponent(options.data));
      console.log(data)
      var id = data.id;
      console.log(id)
      var title = data.title;
      that.setData({
        id: id,
        title: title
      })

    }


    // 专题页标题
    wx.setNavigationBarTitle({
      title: title,
    })



    // 获取门店活动详情
    app.sendRequest({
      url: "api.php?s=/activity/storeActivityInfo",
      data: { master_id: id },
      success: function (res) {
        var actList = res.data.data;
        console.log(actList,'actList')
        that.setData({
          actList: actList,
        })
      },fail(res){
        console.log(res,'res')

      }
    });


  },
  // 跳转链接
  toLink: function (e) {
    let that = this;
    let url = e.currentTarget.dataset.url;
    let actList = that.data.actList;



    if (url == '' || url == null) {
      return;
    }
    else {
      wx.navigateTo({
        url: '/' + url
      })
    }


  },
  // 预约门店体验活动
  Appoint: function (e) {
    let that = this;
    let actList = that.data.actList;
    let click_id = e.currentTarget.dataset.id;
    let appointment_pic = e.currentTarget.dataset.sub;
    if (appointment_pic) {
      let id = e.currentTarget.dataset.id;
      for (let i in actList) {
        if (actList[i].id == id) {
          let start_time = time.formatTime(actList[i].start_time, 'Y年M月D日 h:m:s');
          that.setData({
            start_time,
            coupon_pic: actList[i].coupon_pic,
            click_id
          });

        }
      }
      that.setData({
        showModel: true,
      });
    }
  },
  TWO_reeuse: function () {
    let that = this;
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let is_vip = data.is_vip;
          app.globalData.is_vip = data.is_vip;
          app.globalData.distributor_type = data.distributor_type;
          let distributor_type = data.distributor_type;
          app.globalData.uid = data.uid;
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          let tel = data.user_info.user_tel;
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          let updata = that.data.unregistered;
          updata = app.globalData.unregistered;
          

          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            distributor_type,
            unregistered: updata,
            tel
          })
        }
      }
    })
  },
  /**触发*/
  Crossdetails: function () {
    let _that = this;
    let Tel = _that.data.tel;
    console.log(213)
    let suffix = _that.data.goods_id;
    if (app.globalData.unregistered == 1 || Tel == '') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    }
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function (e) {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.TWO_reeuse();
    } else {

      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.TWO_reeuse();
        }



      }
    }

  },
  /**
  * 预约时间
  */
  subscribe: function () {
    let that = this;
    that.setData({
      showModel: true,
    });

  },
  /**
   * 隐藏模态对话框
   */
  hideModal: function () {
    this.setData({
      showModel: false,
      showAppoint: false,
    });
  },
  onChoice: function (e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    console.log(status)
    let showTo = status == "cancel" ? false : true;
    console.log(showTo)
    let click_id = that.data.click_id;

    let uid = app.globalData.uid;
    if (showTo) {
      app.sendRequest({
        url: "api.php?s=/activity/storeActivityAppointment",
        data: { id: click_id },
        success: function (res) {
          let code = res.code;
          let message = res.message;
          if (code > 0) {
            that.setData({
              showAppoint: showTo,
            });

            app.sendRequest({
              url: "api.php?s=/activity/getStoreActivityAppointmentModel",
              data: {
                openid: app.globalData.openid,
                formid: e.detail.formId,
                appointment_id: click_id
              },
              success: function (res) {
                console.log(res)

              }
            });


          } else {

            app.showModal({
              content: message,
            })
          }


        },fail(e){
          console.log(e,'eeee')

        }
      });
      that.setData({
        showModel: false,
      });

    } else {


      that.setData({
        showModel: false,
      });


    }





  },
  goLeap: function (e) {
    let that = this;
    let status = e.currentTarget.dataset.status;
    // navigateTo
    if (status == 'arch') {
      wx.navigateTo({
        url: '/pages/member/electronic/electronic'
      })

    } else if (status == 'more') {
      console.log('111111');
      // switchTab
      wx.navigateTo({
        url: "/pages/goods/lineActivity/lineActivity",
      })
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
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})