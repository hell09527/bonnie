// pages/goods/lineParticulars/lineParticulars.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     showModel:false,
     showAppoint:false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
   * 预约时间
   */
  subscribe:function(){
    let that=this;
    that.setData({
      showModel:true,
    });

  },
    /**
     * 隐藏模态对话框
     */
    hideModal: function () {
      this.setData({
        showModel:false,
        showAppoint:false,
      });
    },
    onChoice:function(e){
      let that=this;
      let status= e.currentTarget.dataset.status;
      let  showTo=status=="cancel"?false:true;
    
     
      that.setData({
        showModel:false,
        showAppoint:showTo,
      });
      

    },
    goLeap:function(e){
      let that=this;
      let status= e.currentTarget.dataset.status;
      // navigateTo
      if(status=='arch'){
        // wx.navigateTo({
        //   url: ''
        // })

      }else if(status=='more'){
        console.log('111111');
        // switchTab
        wx.navigateTo({
          url: "/pages/goods/lineActivity/lineActivity",
        })
      }

    } , 
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