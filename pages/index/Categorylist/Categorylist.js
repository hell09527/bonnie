// pages/index/Categorylist/Categorylist.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
   page:1,
   category_goods:[],  //分类商品
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let  that=this;

    if (options.uid) {
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
      console.log(options.breakpoint);
    }
    console.log(options.id)
    if(options.id){
    that.setData({
      id:options.id
    })
    }

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.FL_reuse();
      // console.log('11111')
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          // console.log('222')
          //判断是否是付费会员的接口
          that.FL_reuse();
        }
      }
    }
    let id = that.data.id;
    let page = that.data.page;

    app.sendRequest({
      url: "api.php?s=/index/branchPro",
      data: {
        category_id: id,
        page_index: 1,
      },
      method: 'POST',
      success: function (res) {
        let category_goods = res.data.pro.data;
        // let new_category_goods = res.data.pro.data;
        if (category_goods[0] != undefined) {
          page++;
        }
        let category_pic = res.data.category_pic;
        let category_name = res.data.category_name;

        // category_goods=category_goods.concat(new_category_goods)
        // console.log(category_goods)

        // 专题页标题
        wx.setNavigationBarTitle({
          title: res.data.category_name,
        })
        that.setData({
          category_goods: category_goods,
          category_name: category_name,
          category_pic: category_pic,
          page: page,
        })


      }
    });





  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  FL_reuse:function(){
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
          console.log(app.globalData.uid )
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          let  updata = app.globalData.unregistered;
          console.log('11111')
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            distributor_type
          })
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that=this;
    // this.toGoods(id, 1)
  },
  toGoods:function(id,page){
    var that = this;
    var category_goods = that.data.category_goods;
    console.log(category_goods)
    var page = that.data.page;
    // 获取商品分类标题点击的商品
    app.sendRequest({
      url: "api.php?s=/index/branchPro",
      data: {
        category_id: id,
        page_index:page,
      },
      method: 'POST',
      success: function (res) {
        let new_category_goods = res.data.pro.data;
        if (new_category_goods[0] != undefined) {
          page++;
        }
        let category_pic = res.data.category_pic;
        category_goods=category_goods.concat(new_category_goods)
        console.log(category_goods);
        that.setData({
          category_goods: category_goods,
          category_pic: category_pic,
          page:page,
        })
      }
    });
  },
   // 商品详情
   listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let title = event.currentTarget.dataset.title;
    wx.navigateTo({
      url: '/pages' + url,
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
    console.log('wqw')

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    console.log('xialaila')
    let that=this;
    let page = that.data.page;
    console.log(page)
    let category_id = that.data.id;
    this.toGoods(category_id, page);
  },

    /**
 * 用户点击右上角分享
 */
onShareAppMessage: function () {
  let that=this;
  let category_name=that.data.category_name;
  let id = that.data.id;
  console.log(category_name);
  console.log(id);
  console.log(app.globalData.uid)
  let uid=app.globalData.uid;
  console.log(uid)
  
  let PP_share_url = '/pages/index/Categorylist/Categorylist?id=' + id;
  if (app.globalData.distributor_type == 0){
    return {
      title: category_name,
      path: PP_share_url,
      // imageUrl: imgUrl,
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
      title: category_name,
      path: PP_share_url + '&uid=' + uid,
      // imageUrl: imgUrl,
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