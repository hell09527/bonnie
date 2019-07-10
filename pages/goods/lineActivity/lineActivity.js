
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activity: '',    //活动列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log('whjbjhvbjhjbwvhjbebwhjvbhjbvh');
    //  获取活动列表
    app.sendRequest({
      url: "api.php?s=/activity/storeActivityList",
      data: {},
      success: function (res) {
        for (let index in res.data) {
          let img = res.data[index].pic;
          res.data[index].pic = app.IMG(img);
        }

        that.setData({
          activity: res.data
        })
      }
    });

  },

  AA: function () {
    console.log('xxxxxxxx');
    var that = this;

    app.sendRequest({
      url: "api.php?s=/activity/storeActivityList",
      data: {},
      success: function (res) {
        console.log('yyyyyyy');
        for (let index in res.data) {
          let img = res.data[index].pic;
          res.data[index].pic = app.IMG(img);
        }
        console.log(res.data, 'res.data')
        that.setData({
          activity: res.data
        })
      }
    });




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
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            distributor_type
          })
        }
      }
    })
  },

  // 跳转活动详情页
  toDetail: function (event) {
    let that = this;
    let title = event.currentTarget.dataset.title;
    let spc = 0;
   
    let projectData = {
      id: event.currentTarget.dataset.id,
      title,
    }
    if (spc == -1) {
      projectData = JSON.stringify(projectData);
      wx.navigateTo({
        url: '/pages/goods/lineParticulars/lineParticulars?data=' + encodeURIComponent(projectData),
      })
    } else {
      wx.navigateTo({
        url: '/pages/goods/lineParticulars/lineParticulars?data=' + JSON.stringify(projectData),
      })
    }

    that.setData({
      projectData
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
    console.log('jkjjjjjj')
    var that = this;
    // wx.showNavigationBarLoading();
    that.AA();
    wx.stopPullDownRefresh();





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
    let that = this;
    let data = this.data.data;
    let uid = app.globalData.uid;
    let projectData = that.data.projectData;
    let TWO_share_url = '/pages/goods/lineActivity/lineActivity?data=' + JSON.stringify(projectData)
    console.log(data);
    if (that.data.distributor_type == 0) {
      return {
        title: 'BonnieClyde',
        path: TWO_share_url,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }
    else {
      return {
        title: 'BonnieClyde',
        path: TWO_share_url + '&uid=' + uid,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }





  },
})