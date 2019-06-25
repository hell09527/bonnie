// pages/goods/lineParticulars/lineParticulars.js
var time = require("../../../utils/util.js");
const app = getApp();
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
    let that = this;
   
    // var scene = decodeURIComponent(options.scene)
    if (options.uid) {
      app.globalData.identifying = options.uid;
    }

    if (options.id){
      var id = options.id;
      var title = "门店活动";
      var data = {
        id:id,
        title: title
      };
    } else {
      var data = JSON.parse(decodeURIComponent(options.data));
      console.log(data )
      var id = data.id;
      console.log(id )
      var title = data.title;
    }
   
   
    // 专题页标题
    wx.setNavigationBarTitle({
      title: title,
    })

     // 获取门店活动详情
     app.sendRequest({
      url: "api.php?s=/activity/storeActivityInfo ",
      data: { master_id:id },
      success: function (res) {
        var actList= res.data;
        that.setData({
          actList:actList,
        })
      }
    });


  },
    // 跳转链接
    toLink: function (e) {
      let that=this;
      let url = e.currentTarget.dataset.url;
       let actList= that.data.actList;
   
      // console.log(appointment_pic);

      if(url=='' || url==null){
        return ;
      }
      else{
        wx.navigateTo({
          url: '/'+url
        })
      }
    
    },
    // 预约门店体验活动
    Appoint:function(e){
      let that=this;
      let actList= that.data.actList;
      let appointment_pic = e.currentTarget.dataset.sub;
      if(appointment_pic){
        let id=e.currentTarget.dataset.id;
        for (let i in actList) {
          if(actList[i].id==id){
          let start_time  = time.formatTime(actList[i].start_time, 'Y年M月D日 h:m:s');
           that.setData({
             start_time ,
             coupon_pic: actList[i].coupon_pic,
           });
            
          }
          }
         that.setData({
           showModel:true,
         });
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