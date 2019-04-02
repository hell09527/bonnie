// pages/member/supportCenter/supportCenter.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    jump:1,
    TistData: [
      { "code": "分润待结算状态", "text": "订单付款后，订单获得的分润" },
      { "code": "分润审核期", "text": "订单已收货后15天内的维权期" },
      { "code": "待入账金额", "text": "订单获得的分润处于审核期" },
      { "code": "可提现金额", "text": "订单获得的分润已入账到极选师账户，等待提现" },
      { "code": "考核期", "text": "每个季度为一个考核期" },
    ],
    CistData: [
      { star: '一星级', standard: '90000', proportion: '5%' },
      { star: '二星级', standard: '150000', proportion: '7%' },
      { star: '三星级', standard: '210000', proportion: '10%' },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    let jump;
    if(options.stu==1){
      jump=1;
      wx.setNavigationBarTitle({
        title: "极选师帮助中心",
      })
    }else{
      jump=2;
      wx.setNavigationBarTitle({
        title: "极选师规格说明",
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