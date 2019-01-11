// pages/member/posterList/posterList.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    category_goods:[],
    reveal:false,
    id :''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        let windowWidth= res.windowWidth - 40;
        let windowHeight = res.windowHeight ;
        console.log(windowHeight);
        that.setData({
          windowWidth: windowWidth,
          windowHeight
        })
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
    var that = this;
    that.postList();
  },


   /**
   * 跳转到制定海报页面
   */
  Addposter:function(){
    wx.navigateTo({
      url: '/pages/member/createImage/createImage',
    })
  },
    /**
   * 放大图片
   */
  listClick:function(e){
    let that = this;
    let i = e.currentTarget.dataset.index;
    let id = e.currentTarget.dataset.id;
    console.log(that.data.category_goods[i].code_pic)
    that.setData({
      Imgs :that.data.category_goods[i].code_pic,
      reveal: true,
      id
    })
    
  },
  postList:function(){
    let that = this;
    // 获取海报列表
    app.sendRequest({
      url: "api.php?s=Distributor/wxcodeList",
      method: 'POST',
      success: function (res) {
        console.log(res.data.data)
        that.setData({
          category_goods: res.data.data,
        })
      }
    });
  },
    /**
   * 删除图片
   */
  delImgs:function(){
    let that = this;
    let id = that.data.id;
    app.sendRequest({
      url: "api.php?s=Distributor/wxcodeDelete",
      data:{
        id:id
      },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data);
        that.setData({
          category_goods: res.data.data,
        })
        that.popupClose(); 
        that.postList();
      }
    });
  
   

  },
  /**
* 下载到相册
*/
  Savelocal: function () {
  let that = this;
    wx.downloadFile({
      url: that.data.Imgs, 
      success(res) {
        // 只要服务器有响应数据，就会把响应内容写入文件并进入 success 回调，业务需要自行判断是否下载到了想要的内容
        if (res.statusCode === 200) {
          console.log(res.tempFilePath)
          that.setData({
            filePath: res.tempFilePath
          })
          // wx.playVoice({
          //   filePath: res.tempFilePath
          // })
        }
      }
    })
      wx.getSetting({
        success(res) {
          if (!res.authSetting['scope.writePhotosAlbum']) {
            wx.authorize({
              scope: 'scope.writePhotosAlbum',
              success() {

              },
              fail() {
                that.file()
                // wx.switchTab({
                //   url: "/pages/member/member/member",
                // })
              }
            });
          } else {
            that.file();
          }
        }
      });

   
  },
  /**
* 退出
*/
  exitMoswl: function () {
    let that = this;
    that.popupClose(); 
  },

  popupClose: function () {
    let that = this;
    that.setData({
      reveal: false,
    })
  },


  file: function () {
    console.log('进来了')
    let that = this;
    wx.saveImageToPhotosAlbum({
      filePath: that.data.filePath,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail(res) {
        console.log('进来了2324')
        wx.showToast({
          title: '保存失败',
          icon: 'fail',
          duration: 2000
        });

        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
            res.authSetting = {
              "scope.writePhotosAlbum": true,
            }
          }
        })


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

  }
})