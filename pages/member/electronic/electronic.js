// pages/member/electronic/electronic.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    isCode: 1,   //卡券
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that=this;
    // setTimeout(function(){ },2000)
      that.Letme(1);
   
   
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
    
   

  },
 // 卡券
 isCode: function (e) {
   let that = this;
  let index = e.currentTarget.dataset.index;
  that.Letme(index);

  if (index == 2) {
    this.setData({
      isCode: 2
    })
  } else {
    this.setData({
      isCode: 1
    })
  }
},
Letme:function(status){
  let that = this;
  app.sendRequest({
    url: "api.php?s=/activity/storeCardShow",
    data: {status},
    success: function (res) {
      var excoupon = res.data;

      if (typeof res.data === 'string'){
         var data = JSON.parse(res.data.trim());
      } 
     
      console.log(data,'kol');
    
      for(let i in excoupon){
        console.log(excoupon[i].coupon_pic,'66');
        console.log(encodeURI(excoupon[i].coupon_pic),'77');
      }
      console.log(res,'ooo')
      console.log(status,'hhhssh')
      console.log(excoupon,'hhhh')
      that.setData({
        excoupon,
      })
    },fail(res){
      console.log(res,'res')
    }
  });

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