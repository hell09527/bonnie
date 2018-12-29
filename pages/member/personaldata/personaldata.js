const app = new getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    Base: '',
    defaultImg: '',
    user_info: {},
    listClickFlag: 0,
    isInside:0,   //是否有内购活动
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
      defaultImg: defaultImg,
    })

    app.sendRequest({
      url: "api.php?s=/goods/checkNeiGou",
      method: "POST",
      success: function (res) {
        console.log(res);
        if (res.data.code != -10) {
          that.setData({
            isInside: 1,
          })
        }
      }
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
    app.restStatus(that, 'listClickFlag');
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      data: {},
      method: "POST",
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let user_info = data.user_info;
          user_info.user_headimg = app.IMG(user_info.user_headimg); //图片路径处理
          that.setData({
            user_info: user_info,
            is_employee: data.is_employee
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
   * 头像加载失败
   */
  errorHeadImg: function (e) {
    let that = this;
    let user_info = that.data.user_info;
    let defaultImg = that.data.defaultImg;
    let img = user_info.user_headimg;
    let base = that.data.Base;
    let parm = {};
    let parm_key = "user_info.user_headimg";

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_headimg;
      if (img.indexOf(default_img) == -1) {
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 返回上一页
   */
  backPrevPage: function(){
    wx.switchTab({
      url: '/pages/member/member/member',
    });
  },
  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    let data_url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;

    if (listClickFlag == 1){
      return false;
    }
    app.clicked(that, 'listClickFlag');
    wx.navigateTo({ url: '/pages/' + data_url });
  },


  toInpurchasing:function(){
    wx.navigateTo({ url: '/pages/member/inpurchasing/inpurchasing'});
  }
})