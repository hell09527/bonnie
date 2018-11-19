// pages/index/brand/brand.js
const app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    brand:'',
    isActive:1,   //商品品牌按钮点击
    category_list:[],   //分类
    category_goods:[],  //分类商品
    searchVal:'',  //输入框的值
    isFixed:0,    //导航固定
    category_id:'',    //分类id
    page:1,   //页数
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;

    if (options.uid) {
      app.globalData.identifying = options.uid;
      console.log('options.uid', options.uid)
    }



    // 品牌获取
    app.sendRequest({
      url: "api.php?s=/index/getGoodsBrandListRecommend",
      data: {},
      method: 'POST',
      success: function (res) {
        let brand = res.data
        console.log(res.data)
        that.setData({
          brand: brand
        })
      }
    });

    //商品标题 
    app.sendRequest({
      url: "api.php?s=/index/categoryLists",
      data: {},
      method: 'POST',
      success: function (res) {
        let category_list = res.data
        // console.log(res.data)

        for (let index in category_list) {
          category_list[index].select = 1;
        }
        category_list[0].select = 2;
        that.setData({
          category_list: category_list
        })
      }
    });
    this.toGoods(0, 1)
  },

  // 跳转品牌专区
  toBrand(e) {
    "use strict";
    let is_show = e.currentTarget.dataset.show
    let id = e.currentTarget.dataset.id
    let title = e.currentTarget.dataset.title
    console.log(is_show)
    console.log(id)
   
   
    if (is_show == 0) {
      app.aldstat.sendEvent(title + '品牌');
      wx.navigateTo({
        url: '/pages/goods/brandlist/brandlist?id=' + id,   //+'&store_id=1'
      })
    } else {
      return false;
    }
  },

  // 商品品牌点击
  toCheckActive:function(e){
    var id = e.currentTarget.dataset.id
    if (id == 1 ) {
      this.setData({
        isActive: 1
      })
    } else {
      this.setData({
        isActive: 2
      })
    }
  },

  toGoods:function(id,page){
    var that = this;
    var category_goods = that.data.category_goods;
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
        // console.log(category_goods)
        that.setData({
          category_goods: category_goods,
          category_pic: category_pic,
          page:page,
        })
      }
    });
  },

  // 商品标题点击
  selectCheck: function (e) {
    var id = e.currentTarget.dataset.id
    var category_list = this.data.category_list;
    for (var i = 0; i < category_list.length;i++){
      category_list[i].select=1;
      if (category_list[i].category_id==id){
        category_list[i].select=2;
      }
    }
    this.setData({
      category_list: category_list,
      category_goods:[],
      category_id: id,
      page: 1,
    })
    this.toGoods(id,1)
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

  // 搜索
  searchInput:function(e){
    var val = e.detail.value;
    console.log(e.detail.value);
    this.setData({
      searchVal:val
    })
  },

  // 跳转搜索页
  toSearch:function(){
    if (this.data.searchVal!=''){
      wx.navigateTo({
        url: '/pages/goods/goodssearchlist/goodssearchlist?search_text=' + this.data.searchVal,
      }) 
    }
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
    this.setData({
      searchVal: '',
      // isActive: 1,
      // isFixed: 0
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
    if(this.data.isActive==2){
      let that = this;
      let category_id = that.data.category_id;
      let category_goods = that.data.category_goods;
      let page = that.data.page;
      this.toGoods(category_id, page);
    }
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let uid = app.globalData.uid;
    if (app.globalData.distributor_type == 0) {
      return {
        title: '品牌专区',
        path: '/pages/index/brand/brand',
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    } else {
      return {
        title: '品牌专区',
        path: '/pages/index/brand/brand?uid=' + uid ,
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


  // 页面滚动监听事件
  onPageScroll: function (event) {
    if (this.data.isActive == 2) {
      // console.log(event.scrollTop)
      var scrollTop = event.scrollTop;
      if (scrollTop > 91){
        this.setData({
          isFixed:1
        })
      }else{
        this.setData({
          isFixed: 0
        })
      }
    }
  },
})