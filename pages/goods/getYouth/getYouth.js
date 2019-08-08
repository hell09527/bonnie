const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    Base: '',
    defaultImg: {},
    brand_adv: {},
    goods_brand_list: {},
    brand_id: 0,
    // brand_select_index: 0,
    // goods_list: {},
    img_height: '156px',
    page: 1,
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    aClickFlag: 0,
    brind_id:'',
    brind_image:'',    //品牌顶部图片
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    if (options.uid) {
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
      console.log(options.breakpoint);
    }

    app.sendRequest({
      url: 'api.php?s=/goods/demoGoodsList',
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let goods_list = data.data;
          console.log(res);
          console.log(goods_list);

          let brand_name = data.brand_name;
          let  brand_video_address=data.brand_video_address;
          let brand_pic = data.brand_pic;
          // console.log(brand_pic)
          // wx.setNavigationBarTitle({
          //   title:brand_name
          // })
        
          for(let index in goods_list){
            let img = goods_list[index].pic_cover_small;
            goods_list[index].pic_cover_small = app.IMG(img);
                //  品牌列表显示规格最小的sku的价格
            for (let i = 0; i < goods_list[index].sku_list.length; i++) {
               goods_list[index].lowest=[];
              goods_list[index].lowest.push(goods_list[index].sku_list[i].promote_price); 
              console.log(Math.min(...goods_list[index].lowest).toFixed(2));
          }
          }

          that.setData({
            page: 2,
            goods_list: goods_list,
            // brand_name: brand_name,
            // brand_pic,
            // brand_video_address
          })
        }
        // console.log(res);
      }
    });
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.PP_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.PP_reuse();
        }
      }
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // this.selectBrind();
  },
PP_reuse:function(){
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
        console.log(data.uid)
        app.globalData.uid = data.uid;
        app.globalData.vip_gift = data.vip_gift;
        app.globalData.vip_goods = data.vip_goods;
        app.globalData.vip_overdue_time = data.vip_overdue_time;
        let  updata = app.globalData.unregistered;
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
 
    let that = this;
    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.PP_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.PP_reuse();
        }
      }
    }
    app.restStatus(that, 'aClickFlag');
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
 * 用户点击右上角分享
 */
  onShareAppMessage: function () {
    let that=this;
   
    let uid = app.globalData.uid
    console.log(uid)
    let PP_share_url = '/pages/goods/getYouth/getYouth';
    if (app.globalData.distributor_type == 0){
      return {
        title: '小样申领',
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
        title: '小样申领',
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

 



  /**
   * 图片加载获取高度
   */
  imgLoad: function (e) {

    let res = wx.getSystemInfoSync();
    let height = e.detail.height;
    let width = e.detail.width;
    let rate = width / height;
    let swiper_height = res.windowWidth / rate;

    this.setData({
      swiperHeight: swiper_height
    })
    
  },

  /**
   * 图片加载失败
   */
  goodsImgError: function(e){
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 商品详情
   */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;
    let title = event.currentTarget.dataset.title;
    let types = event.currentTarget.dataset.types == 1 ? '大贸' : '跨境';
    let code = event.currentTarget.dataset.code;
    let goodId= event.currentTarget.dataset.good;
    console.log(goodId)
    
    

    if (aClickFlag == 1) {
      return false;
    }
    app.clicked(that, 'aClickFlag');

    app.aldstat.sendEvent('零元领取' + title + '(' + types + '-' + code + ')');


    wx.navigateTo({
      url: '/pages/goods/particulars/particulars?goods_id=' + goodId,
    })
  }
})