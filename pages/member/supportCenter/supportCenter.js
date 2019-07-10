// pages/member/supportCenter/supportCenter.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jump: 1,
    TistData: [
      { "code": "分润", "text": "极选师推广订单完成后，商品销售价格按比例返还给极选师的金额" },
      { "code": "分润待结算状态", "text": "订单付款后，订单获得的分润" },
      { "code": "分润审核期", "text": "订单已发货15天内的维权期" },
      { "code": "待入账金额", "text": "订单获得的分润处于审核期" },
      { "code": "可提现金额", "text": "订单获得的分润已入账到极选师账户，等待提现" },
      { "code": "考核期", "text": "每个季度为一个考核期" },
    ],
    // CistData: [
    //   { star: '一星级', standard: '90000', proportion: '5%' },
    //   { star: '二星级', standard: '150000', proportion: '7%' },
    //   { star: '三星级', standard: '210000', proportion: '10%' },
    // ],
    course:[
      { forward:' https://static.bonnieclyde.cn/course01.jpg'},
      { forward:' https://static.bonnieclyde.cn/course02.jpg'},
      { forward:' https://static.bonnieclyde.cn/course03.jpg'},
      { forward:' https://static.bonnieclyde.cn/course04.jpg'},
      { forward:' https://static.bonnieclyde.cn/course05.jpg'},
    ]
   
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let jump;
    if (options.stu == 1) {
      jump = 1;
      wx.setNavigationBarTitle({
        title: "极选师赚钱指南",
      })
    } else {
      jump = 2;
      wx.hideShareMenu();
      wx.setNavigationBarTitle({
        title: "极选师规则说明",
      })
    }

    that.setData({
      jump
    })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.XXS_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.XXS_reuse();

        }

      }
    }

  },
  XXS_reuse: function () {
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
          console.log(distributor_type ,'distributor_type')
          app.globalData.uid = data.uid;
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          let tel = data.user_info.user_tel;
          if (tel !== null || tel !== undefined || tel !== '') {
            console.log(111)
          } else if (tel == '') {
            console.log(223)
          }

          let updata = that.data.unregistered;
          updata = app.globalData.unregistered;
          console.log(updata, 'updata', '134', data.is_employee);
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            tel: tel,
            distributor_type,
            unregistered: updata,
            is_employee: data.is_employee,
          })



        }
      }
    })
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
    let that=this;
    let jump=that.data.jump;
    return {
      title: 'BonnieClyde',
      path: '/pages/member/supportCenter/supportCenter?stu=' + jump,
      success: function (res) {
        app.showBox(that, '分享成功');
      },
      fail: function (res) {
        app.showBox(that, '分享失败');
      }
    }
  }
})
