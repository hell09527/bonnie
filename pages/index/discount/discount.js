const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    Base: '',
    defaultImg: [],
    current_time: 0,
    discount_adv: {},
    goods_category_list: {},
    goods_list: [],
    category_id: 0,
    page: 1,
    timer_array: {},
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    swiperHeight: 153,
    aClickFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    let category_id = options.category_id;
    let base = app.globalData.siteBaseUrl;
    let defaultImg = app.globalData.defaultImg;

    if(options.uid) {
      console.log('options.uid', options.uid)
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
    }

    if (category_id != undefined){
      that.setData({
        category_id: category_id
      })
    }
    that.setData({
      Base: base,
      defaultImg: defaultImg
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
    let base = that.data.Base;


    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
       that.XXS_reuse();


            } else {
app.employIdCallback = employId => {
if (employId != '') {
//判断是否是付费会员的接口
that.XXS_reuse();

}

}
}

    app.restStatus(that, 'aClickFlag');
    app.sendRequest({
      url: 'api.php?s=index/getDiscountData',
      data: {},
      success: function (res) {

        let code = res.code;
        let data = res.data;
        
        if (code == 0) {
          let discount_adv = data.discount_adv;
          for (let index in discount_adv.adv_list){
            let img = discount_adv.adv_list[index].adv_image;
            discount_adv.adv_list[index].adv_image = app.IMG(img);
          }

          
          let ap_intro= discount_adv.ap_intro;
             ap_intro==''?'限时体验':ap_intro;

                console.log(ap_intro)
             // 专题页标题
             wx.setNavigationBarTitle({
              title:  ap_intro,
          })
          
          

          that.setData({
            current_time: data.current_time,
            discount_adv: discount_adv,
            goods_category_list: data.goods_category_list,
            ap_intro
          })
          that.getGoodsList(that);
        }
        console.log(res);
      }
    });

  },
  XXS_reuse:function(){
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
          console.log(data.uid);
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          let tel = data.user_info.user_tel;
          if (tel !== null || tel !== undefined || tel  !== '') {
            console.log(111)
          } else if (tel==''){
            console.log(223)
          } 

          let updata = that.data.unregistered;
          updata = app.globalData.unregistered;
          console.log(updata, 'updata', '134', data.is_employee);
          // console.log(app.globalData.is_vip)
          that.setData({
            is_vip: is_vip,
            tel: tel,
            distributor_type,
            unregistered: updata,
            is_employee: data.is_employee,
          })
         
           console.log(that.data.distributor_type)
   
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
    let that = this;
    let goods_list = that.data.goods_list;
    let page = that.data.page;
    let category_id = that.data.category_id
    let timer_array = that.data.timer_array;

    app.sendRequest({
      url: 'api.php?s=index/getDiscountGoods',
      data: {
        category_id: category_id,
        page: page
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let new_goods_list = data.data;
          let parm = {};
          let parm_key = ''
          if (new_goods_list.length > 0){
            page++;
          }
          
          let new_timer_array = {};
          for (let index in new_goods_list) {
            //图片处理
            let img = new_goods_list[index].picture.pic_cover_small;
            new_goods_list[index].picture.pic_cover_small = app.IMG(img);

            let key = goods_list.length;
            new_timer_array[key] = {};
            new_timer_array[key].end_time = new_goods_list[index].end_time;
            
            that.timing(that, new_timer_array, key);
            parm_key = 'goods_list[' + key + ']';
            parm[parm_key] = new_goods_list[index];
            that.setData(parm);
          }

          that.setData({
            page: page
          })
          console.log(res)
        }
      }
    });
  },

  /**
   * 图片加载获取高度
   */
  imgLoad: function(e) {
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
   * 获取折扣商品
   */
  getGoodsList: function (that){
    let category_id = that.data.category_id;

    app.sendRequest({
      url: 'api.php?s=index/getDiscountGoods',
      data: {
        category_id: category_id,
        page: 1
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let goods_list = res.data.data;

          let timer_array = {};
          for (let index in goods_list){
            let img = goods_list[index].picture.pic_cover_small;
            goods_list[index].picture.pic_cover_small = app.IMG(img);

            timer_array[index] = {};
            timer_array[index].end_time = goods_list[index].end_time;
          }
          for (let key in timer_array){
            that.timing(that, timer_array, key);
          }
          that.setData({
            goods_list: goods_list,
            page: 2
          })
          console.log(res)
        }
      }
    });
  },

  /**
   * 限时折扣图片加载失败
   */
  errorDiscountImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let goods_list = that.data.goods_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = goods_list[index].picture.pic_cover_small;

    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "goods_list[" + index + "].picture.pic_cover_small";

        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },

  /**
   * 计时
   */
  timing: function (that, timer_array, index){
    let current_time = that.data.current_time;
    let count_second = (timer_array[index].end_time*1000 - current_time)/1000;

    if (count_second > 0) {
      count_second--;
      let day = Math.floor((count_second / 3600) / 24);
      let hour = Math.floor((count_second / 3600) % 24);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);
      let parm = {};
      let parm_key = 'timer_array[' + index + '].nowtime';
      parm[parm_key] = day + '天' + hour + '小时' + minute + '分' + second + '秒';

      that.setData(parm);
    } else {
      timer_array[index].nowtime = '活动已结束 !';

      that.setData({
        timer_array: timer_array
      })
    }
    let timer = setInterval(function(){
      if (count_second > 0){
        count_second--;
        let day = Math.floor((count_second / 3600) / 24);
        let hour = Math.floor((count_second / 3600) % 24);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);
        let parm = {};
        let parm_key = 'timer_array[' + index + '].nowtime';
        parm[parm_key] = day + '天' + hour + '小时' + minute + '分' + second + '秒';

        that.setData(parm);
      }else{
        let parm = {};
        let parm_key = 'timer_array[' + index + '].nowtime';
        parm[parm_key] = '活动已结束！';

        that.setData(parm);
        clearInterval(timer);
      }
    },1000)
  },
  
  /**
   * 商品详情
   */
  aClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let aClickFlag = that.data.aClickFlag;

    if (aClickFlag == 1){
      return false;
    }
    app.clicked(that, 'aClickFlag');

    wx.navigateTo({
      url: '/pages'+url,
    })
  },
      /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (){
    let _yhm=this;
    let uid = app.globalData.uid;
    console.log(uid);
    let XS_share_url = "/pages/index/discount/discount";
        if(_yhm.data.distributor_type==0){
      return {
        title: _yhm.data.ap_intro,
        path: XS_share_url,
        imageUrl: '',
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
    }else{
     return {
        title: _yhm.data.ap_intro,
        path: XS_share_url + "?uid=" + uid,
        imageUrl: '',
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