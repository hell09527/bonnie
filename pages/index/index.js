const app = getApp();
const core = require('../../utils/core.js');
const SERVERS = require('../../utils/servers.js');
Page({
  data: {
    prompt: '',
    Base: '',  //库路径
    defaultImg: {},
    index_notice: {},  //公告ist.goods_list
    top10_list: {},  //top10
    coupon_list: {},  //优惠券
    discount_list: {},  //限时折扣
    // current_time: 0,  //当前时间
    timer_array: {},  //限时折扣计时
    search_text: '',  //搜索内容
    mei_alls: '',  //某一个品牌的商品
    swiperCurrent: 0,
    // webSiteInfo: {},//小程序基本配置
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    //轮播图属性
    imgUrls: [],
    indicatorDots: true,
    autoplay: true,
    interval: 3000,
    duration: 1000,
    circular: true,
    indicatorColor: '#AAA',
    indicatorActiveColor: '#FFF',
    copyRight: {
      is_load: 1,
      default_logo: '/images/index/logo_copy.png',
      technical_support: '',
    },
    // is_login: 0,
    // maskStatus: 0,
    listClickFlag: 0,
    noticeContentFlag: 0,
    exponent: '',
    model: false,
    is_vip: 0,  //是否是vip
    brand: [],//品牌数据
    isFix: 0,  //顶部导航固定否
    swiperIndex: 0,//这里不写第一次启动展示的时候会有问题
    title: '',//页面名
    tel: '',//手机号码
    myTime: null,
    isHide: 0,
    currentTab: 0, //预设当前项的值
    swperStatu: 1,   //判断几张轮播图
    j: 1,
    page_index: 1,
    floorstatus: false, //回到顶部按钮
    isInput: 1,
  
      
    

  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
 //测试数据
  UC: function () {
    // wx.scanCode({ // });  //扫描二维码；
    wx.navigateTo({ url: "/pages/goods/particulars/particulars" })
    // /pages/index/discount/discount
   
  },
  UK:function(){
    wx.navigateTo({ url: "/pages/goods/getYouth/getYouth" })
    // /pages/index/discount/discount
   
  },
   

 

  onLoad: function (options) {
    let that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    });
      // 极选师分润
    if (options.uid) {
      // 这个字段是转发过后承载uid     identifying
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
      console.log('breakpoint', options.breakpoint);
      console.log('uid', options.uid);
    }
    if (options.scene) {
      // 扫码进入
      var scene = decodeURIComponent(options.scene);
      console.log("scene ", scene);
      let kol_id = scene.split('&')[0];
      let store_id = scene.split('&')[1];
      app.globalData.store_id = store_id;
      app.globalData.kol_id = kol_id;
      console.log("********内详情页store_id", store_id);
      console.log("********kol_id", kol_id);

    }
    //  极选师扫码12小时内有分销来源
    // let timestamp = Date.parse(new Date);
    // if (app.globalData.kol_id != 0) {
    //   // 43200000
    //   let overtime = timestamp + 43200000;  
    //   console.log(timestamp)
    //   let kol_id = app.globalData.kol_id;
    //   let scanCode = app.globalData.scanCode
    //   wx.setStorageSync('scanCode', scanCode);
    //   wx.setStorageSync('kol_id', kol_id)
    //   wx.setStorageSync('overtime', overtime);
    // }

    // IphoneX齐刘海
    
    let netWorkType  = app.globalData.netWorkType ;
    let isIphoneX = app.globalData.isIphoneX;
    this.setData({
      isIphoneX: isIphoneX,
      netWorkType 
    })


    let category_alias = "";
    wx.setNavigationBarTitle({
      title: category_alias,
    })


    let times = 0;
    let load_timer = setInterval(function () {
      times++;
      let token = app.globalData.token;
      if (token != '') {
        // app.showBox(that, '登陆成功');
        that.SY_reuse();
        console.log('登陆成功')
        clearInterval(load_timer);
      } else if (times == 15) {
        console.log('登录超时...')
        // app.showBox(that, '登录超时...');
        clearInterval(load_timer);
        return;
      }
    }, 1000);

  

  },

  /**触发*/
  Cross: function () {
    let _that = this;
    console.log('Cross')
    let Tel = _that.data.tel;
    if (app.globalData.unregistered == 1 || Tel == '') {
      wx.navigateTo({
        url: '/pages/member/resgin/resgin',
      })
    }
  },

  onUnload() {
    //  关闭但页面清除单前页面的定时器
    clearInterval(this.data.myTime);
  },

 

  // 首页轮播跳转
  toSwiperDetail: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.navigateTo({
      url: '/' + url,
    })
  },

  onShow: function () {
    let that = this;
    SERVERS.HOME.getindeximglist.post(res=>{

    }).then(res=>{
      let shop = res.map(item => {
        let img = item.imgUrl;
        item.imgUrl = app.IMG(img);
        return item;
      })
      console.log(shop)
      that.setData({
        shop,
      })
    }).catch(e=>console.log(e));
  
    // 品牌获取
    app.sendRequest({
      url: "api.php?s=/index/getGoodsBrandListRecommend",
      data: {},
      method: 'POST',
      success: function (res) {
        let brand = res.data
        console.log(res.data);
        let  Indexdata= 
        {
          topsrc:'https://static.bonnieclyde.cn/bc.png',
          kesrc:'https://static.bonnieclyde.cn/icon111.jpg',
          top1:'https://static.bonnieclyde.cn/brnds.png',
          top2:'https://static.bonnieclyde.cn/%20class.png',
          top3:'https://static.bonnieclyde.cn/newtop10.png',
          
      
      }
      let isIphoneX = app.globalData.isIphoneX;
        that.setData({
          brand: brand,
          Indexdata,
          isIphoneX 
        })
      }
    });
    app.sendRequest({
      url: "api.php?s=goods/getDefaultImages",
      data: {},
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          that.data.defaultImg = data;
          that.indexInit(that);
        }
      }
    });


  
  

    let updata = app.globalData.unregistered;
  
    that.setData({
      unregistered: updata,
     
    })


    that.TC_reuse();
    app.restStatus(that, 'listClickFlag');
    app.restStatus(that, 'noticeContentFlag');

  },
    //获取会员所有信息
    SY_reuse: function () {
      let that = this;
      SERVERS.MEMBER.getMemberDetail.post().then(res => {
        let data = res.data
        if (res.code == 0) {
          let is_vip = data.is_vip;
          app.globalData.is_vip = data.is_vip;
          app.globalData.distributor_type = data.distributor_type;
          app.globalData.uid = data.uid;
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          // console.log(data.user_info.user_tel)
          app.globalData.user_tel = data.user_info.user_tel;
          //  console.log(app.globalData.is_vip)
          that.setData({
            is_vip,
            tel: data.user_info.user_tel,
            is_login: 0
          })
        }
      }).catch(e => console.log(e));
    },
  // 测试数据   小程序之间的跳转和携带参数；eg
  skip: function () {
    wx.navigateTo({ url: '/pages/member/electronic/electronic', })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    let title = 'BonnieClyde';
    let uid = app.globalData.uid;
    if (app.globalData.distributor_type == 0) {
      return {
        title: 'BonnieClyde',
        path: '/pages/index/index',
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');
        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
      wx.showShareMenu({
        title: title
      })
    }
    else {
      return {
        title: 'BonnieClyde',
        path: '/pages/index/index?uid=' + uid,
        // imageUrl: imgUrl,
        success: function (res) {
          app.showBox(that, '分享成功');

        },
        fail: function (res) {
          app.showBox(that, '分享失败');
        }
      }
      wx.showShareMenu({
        title: title
      })
    }

  },
  /**
   * 商品楼层图片加载失败
   */
  errorBlockImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let key = e.currentTarget.dataset.key;
    // console.log(key)
    let block_list = that.data.block_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = block_list[index].goods_list[key].pic_cover_big;
    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "block_list[" + index + "].goods_list[" + key + "].pic_cover_small";
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
  /**
   * 限时折扣图片加载失败
   */
  errorDiscountImg: function (e) {
    let that = this;
    let index = e.currentTarget.dataset.index;
    let discount_list = that.data.discount_list;
    let defaultImg = that.data.defaultImg;
    let base = that.data.Base;
    let parm = {};
    let img = discount_list[index].picture.pic_cover_small;
    if (defaultImg.is_use == 1) {
      let default_img = defaultImg.value.default_goods_img;
      if (img.indexOf(default_img) == -1) {
        let parm_key = "discount_list[" + index + "].picture.pic_cover_small";
        parm[parm_key] = default_img;
        that.setData(parm);
      }
    }
  },
  /**
   * 页面跳转
   */
  listClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let title = event.currentTarget.dataset.title;
    let spc = 0;
    console.log(title)
    if (title != undefined) {
      if (title.indexOf("&") != -1) {
        spc = -1;
      }
    }


    // title.replace("&", "%26")
    // console.log(title.replace("&", "%26"));

    let hasTarget = event.currentTarget.dataset.has;
    let x = event.currentTarget.dataset.x;
    // let goodsId = event.currentTarget.dataset.goodsid;
    let types = event.currentTarget.dataset.types == 1 ? '大贸' : '跨境';
    let code = event.currentTarget.dataset.code;
    let projectData = {
      id: event.currentTarget.dataset.id,
      title: event.currentTarget.dataset.title,
    }
    let listClickFlag = that.data.listClickFlag;
    console.log(x, hasTarget);

    //特殊点 跳转到黑科技商品
    if (x == 0) {
      console.log('首页黑科技商品点击', {
        "商品标题": title,
        "商品类型": types,
        "物料编码": code
      });
      app.aldstat.sendEvent('首页黑科技商品点击', {
        "商品标题": title,
        "商品类型": types,
        "物料编码": code
      });
      wx.navigateTo({
        url: '/pages' + url,
      })
    } else if (x == 1) {
      console.log('首页新品推荐点击', {
        "商品标题": title,
        "商品类型": types,
        "物料编码": code
      });
      app.aldstat.sendEvent('首页新品推荐点击', {
        "商品标题": title,
        "商品类型": types,
        "物料编码": code
      });
      wx.navigateTo({
        url: '/pages' + url,
      })
    } else if (projectData.id) {
      if (spc == -1) {
        console.log('111')
        projectData = JSON.stringify(projectData);

        // 跳转活动详情页
        app.aldstat.sendEvent('首页活动点击', {
          "活动名称": title
        });
        wx.navigateTo({
          url: '/pages/index/projectIndex/projectIndex?data=' + encodeURIComponent(projectData),
        })
      } else {
        console.log('222')
        // 跳转活动详情页
        app.aldstat.sendEvent('首页活动点击', {
          "活动名称": title
        });
        wx.navigateTo({
          url: '/pages/index/projectIndex/projectIndex?data=' + JSON.stringify(projectData),
        })
      }




    } else if (hasTarget == 0) {
      //判断这个图片是否跳转
      return false;
    } else if (listClickFlag == 1) {
      //防止多次点击
      return false;
    } else {
      console.log('wo')
      console.log('首页BC精选商品点击', {
        "商品标题": title,
        "商品类型": types,
        "物料编码": code
      });
      app.aldstat.sendEvent('首页BC精选商品点击', {
        "商品标题": title,
        "商品类型": types,
        "物料编码": code
      });

      wx.navigateTo({
        url: '/pages' + url,
      })
    }
    app.clicked(that, 'listClickFlag');
  },

  tabBar: function (event) {
    let url = event.currentTarget.dataset.url;
    wx.switchTab({
      url: '/pages' + url,
    })
  },
  /**
   * 输入框绑定事件
   */
  // searchInput: function (event) {
  //   let search_text = event.detail.value;
  //   this.setData({
  //     search_text: search_text
  //   })
  // },
  /**
   * 领取优惠券
   */
  toReceivePopup: function (e) {
    let that = this;
    let coupon_type_id = e.currentTarget.dataset.id;
    let index = e.currentTarget.dataset.index;
    let flag = true;
    let status = 1;
    if (flag) {
      app.sendRequest({
        url: 'api.php?s=goods/receiveGoodsCoupon',
        data: {
          coupon_type_id: coupon_type_id
        },
        success: function (res) {
          // console.log(res)
          let code = res.code;
          let data = res.data;
          if (code == 0) {
            if (data > 0) {
              app.showBox(that, '领取成功');
            } else if (data == -2011) {
              app.showBox(that, '来迟了，已经领完了');
              status = 0;
            } else if (data == -2019) {
              app.showBox(that, '领取已达到上限');
              status = 0;
            } else {
              app.showBox(that, '未获取到优惠券信息');
              status = 0;
            }
            let d = {};
            let key = "coupon_list[" + index + "].status";
            d[key] = 0;
            that.setData(d);
          }
        }
      });
    }
    if (!flag) {
      let d = {};
      let key = "coupon_list[" + index + "].status";
      d[key] = 0;
      that.setData(d);
    }
  },

  /**
   * 计时
   */
  timing: function (that, timer_array, index) {
    let current_time = that.data.current_time;
    let count_second = (timer_array[index].end_time * 1000 - current_time) / 1000;
    //首次加载
    if (count_second > 0) {
      count_second--;
      //时间计算
      let day = Math.floor((count_second / 3600) / 24);
      let hour = Math.floor((count_second / 3600) % 24);
      let minute = Math.floor((count_second / 60) % 60);
      let second = Math.floor(count_second % 60);
      //赋值
      timer_array[index].day = day;
      timer_array[index].hour = hour;
      timer_array[index].minute = minute;
      timer_array[index].second = second;
      timer_array[index].end = 0;

      that.setData({
        timer_array: timer_array
      })
    } else {
      timer_array[index].end = 1;

      that.setData({
        timer_array: timer_array
      })
    }
    //开始计时
    let timer = setInterval(function () {
      if (count_second > 0) {
        count_second--;
        //时间计算
        let day = Math.floor((count_second / 3600) / 24);
        let hour = Math.floor((count_second / 3600) % 24);
        let minute = Math.floor((count_second / 60) % 60);
        let second = Math.floor(count_second % 60);
        //赋值
        timer_array[index].day = day;
        timer_array[index].hour = parseInt(hour) < 10 ? 0 + '' + hour : hour;
        timer_array[index].minute = parseInt(minute) < 10 ? 0 + '' + minute : minute;;
        timer_array[index].second = parseInt(second) < 10 ? 0 + '' + second : second;;
        timer_array[index].end = 0;

        that.setData({
          timer_array: timer_array
        })
      } else {
        timer_array[index].end = 1;

        that.setData({
          timer_array: timer_array
        })
        clearInterval(timer);
      }
    }, 1000)
  },

  /**
   * 首页初始化
   */
  indexInit: function (that) {

    app.sendRequest({
      url: "index.php?s=/api/index/getindeximglist",
      data: {},
      success: res => {
        let shop = res.map(item => {
          let img = item.imgUrl;
          item.imgUrl = app.IMG(img);
          return item;
        })
        console.log(shop)
        that.setData({
          shop,
        })
      }
    });
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




    let base = app.globalData.siteBaseUrl;
    let timeArray = {};



    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.TC_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.TC_reuse();
        }
      }
    }


  },

  TC_reuse: function () {
    let that = this;
    let timeArray = {};
    app.sendRequest({
      url: 'api.php?s=index/getIndexData',
      data: {
      },
      success: function (res) {
        // console.log(res)
        let code = res.code;
        let indicatorDots = true;
        if (code == 0) {
          let data = res.data;
          //当前时间初始化
          let current_time = data.current_time;
          var assist = {};
          // that.setData({
          //   current_time: current_time
          // })

          //广告轮播初始化
          if (data.adv_list != undefined && data.adv_list.adv_index != undefined && data.adv_list.adv_index.adv_list != undefined) {
            let adv_index = data.adv_list.adv_index;
            let adv_list = adv_index.adv_list;
            console.log(adv_list);
            if (adv_list.length == 1) {
              indicatorDots = false;
            }
            if (adv_index.is_use != 0) {
              for (let index in adv_list) {
                let img = adv_list[index].adv_image;
                adv_list[index].adv_image = that.IMG(img);
              }
            } else {
              adv_list = [];
            }
            console.log(adv_list.length);
            // 首页轮播图为一张的时候
            if (adv_list.length == 1) {
              console.log(adv_list[0].adv_image);
              console.log(adv_list[0].adv_url);
              console.log(adv_list[0].adv_title);
              that.setData({
                Derimgs: adv_list[0].adv_image,
                Der_url: adv_list[0].adv_url,
                advs_title: adv_list[0].adv_title,
              })
              // adv_list[0].adv_image= adv_list;
            } else {
              that.setData({
                swperStatu: 2
              })
            }
            assist.adv_image = data.adv_list.adv_index_two.adv_list[0].adv_image
            assist.url = adv_list[0].adv_url;

            // console.log(adv_list)
            that.setData({
              imgUrls: adv_list,
              swiperHeight: adv_index.ap_height,
              assist,
            })
          } else {
            that.setData({
              imgUrls: [],
            })
          }
          //优惠券初始化
          for (let index in data.coupon_list) {
            data.coupon_list[index].status = 1;
          }
          //限时折扣初始化
          let discount_list = data.discount_list.data;
          for (let index in discount_list) {
            let img = discount_list[index].picture.pic_cover_small;
            discount_list[index].picture.pic_cover_small = that.IMG(img);
            timeArray[index] = {};
            timeArray[index].end = 0;
            timeArray[index].end_time = discount_list[index].end_time;
            that.timing(that, timeArray, index);
          }
          //商品楼层图片处理
          // console.log(data);
          // let four_list = data.four_list;
          // let block_list = data.block_list;
          // let top_list = data.top_goods_list;

          // let index_goods_list = data.index_goods_list;
          let new_pro = data.new_pro;
          let video_index = data.adv_list.video_index;
          let small_sample_list = data.small_sample_list;
          let exponent = "";

          for (let index in small_sample_list) {
            let img = small_sample_list[index].pic_cover_big;
            small_sample_list[index].pic_cover_small = that.IMG(img);
            small_sample_list[index].exponent = exponent;
          }

          // for (let index in top_list) {
          //   let img = top_list[index].pic_cover_big;
          //   exponent = (parseInt(top_list[index].material_black) + parseInt(top_list[index].material_black) + parseInt(top_list[index].effect_black)) / 3
          //   top_list[index].pic_cover_small = that.IMG(img);
          //   top_list[index].exponent = exponent;
          //   that.setData({
          //     exponent: exponent
          //   })
          // }

          // for (let index in index_goods_list) {
          //   let img = index_goods_list[index].pic_cover_big;
          //   exponent = (parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].effect_black)) / 3
          //   index_goods_list[index].pic_cover_small = that.IMG(img);
          //   index_goods_list[index].exponent = exponent
          //   // that.setData({
          //   //   exponent: exponent
          //   // })
          // }


          // for (let index in block_list) {
          //   for (let key in block_list[index].goods_list) {
          //     let img = block_list[index].goods_list[key].pic_cover_small;
          //     block_list[index].goods_list[key].pic_cover_small = that.IMG(img);
          //   }
          // }
          // let sqk_alls = data.block_list[0];
          console.log(data.goods_category_first);

          //(某一个品牌的商品)
          // let mei_alls = data.block_list[2].goods_list;

          console.log(data.adv_list.adv_index_two.adv_list);
          console.log(video_index, 'video_index')


          that.setData({
            // Base: base,
            adv_category: data.adv_list.adv_category,// 首页手机分类广告位
            adv_index_two: data.adv_list.adv_index_two.adv_list, //首页轮播副图
            goods_category_first: data.goods_category_first,//首页分类列表
            indicatorDots: indicatorDots,
            index_notice: data.notice.data,
            // goods_platform_list: data.goods_platform_list,
            // sqk_alls: '',
            // block_list: block_list,
            // mei_alls: mei_alls,
            // top_list: top_list,  //Top10
            // index_goods_list: index_goods_list,   //商品列表
            new_pro: new_pro,   //新品推荐
            video_index
            // topShopsIcon: data.icon,
            // coupon_list: data.coupon_list,
            // discount_list: discount_list,
            // small_sample_list: small_sample_list,
            // four_list: four_list,
          });
        }
        // console.log(res);
      }
    })



    let page_index = that.data.page_index;

    app.sendRequest({
      url: "api.php?s=index/getIndexPro",
      data: {
        page_index,
      },
      success: function (res) {
        console.log(res)
        let code = res.code;
        let index_goods_list = res.data;

        page_index++;
        if (code == 0) {
          that.setData({
            index_goods_list: index_goods_list,   //商品列表
            page_index
          })
        }
        // console.log(res);
      }
    })




  },

  All_shop: function (page_index) {
    let that = this;
    // let index_goods_list=that.data.index_goods_list;
    app.sendRequest({
      url: "api.php?s=index/getIndexPro",
      data: {
        page_index,
      },
      success: function (res) {
        console.log(res)
        let code = res.code;
        let index_goods_list = res.data;
        // if (new_index_goods_list[0] != undefined) { }
        page_index++;
        // index_goods_list=index_goods_list.concat(new_index_goods_list)
        if (code == 0) {
          that.setData({
            index_goods_list: index_goods_list,   //商品列表
            page_index
          })
        }
        // console.log(res);
      }
    })
  },





  /**
   * 底部加载
   */
  copyRightIsLoad: function (e) {
    let that = this;
    app.sendRequest({
      url: "api.php?s=task/copyRightIsLoad",
      data: {},
      success: function (res) {
        // console.log(res)
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let copyRight = data;
          copyRight.technical_support = 'ushopal技术支持';
          copyRight.default_logo = '/images/index/logo_copy.png';

          if (copyRight.is_load == 0) {
            let img = copyRight.bottom_info.copyright_logo;
            copyRight.default_logo = that.IMG(img);
            copyRight.technical_support = copyRight.bottom_info.copyright_companyname;
          }

          that.setData({
            copyRight: copyRight
          })
        }
        // console.log(res);
      }
    })
  },

  /**
   * 公告内容
   */
  noticeContent: function (e) {
    let that = this;
    let noticeContentFlag = that.data.noticeContentFlag;
    let id = e.currentTarget.dataset.id;
    if (noticeContentFlag == 1) {
      return false;
    }
    app.clicked(that, 'noticeContentFlag');
    if (!id > 0) {
      return false;
    }
    wx.navigateTo({
      url: '/pages/index/noticecontent/noticecontent?id=' + id,
    })
  },

  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    let that = this;
  },

  /**
   * 图片路径处理
   */
  IMG: function (img) {
    let base = app.globalData.siteBaseUrl;
    img = img == undefined ? '' : img;
    img = img == 0 ? '' : img;
    if (img.indexOf('http://') == -1 && img.indexOf('https://') == -1 && img != '') {
      img = base + img;
    }
    return img;
  },

  /**
   * 基础配置
   */
  // webSiteInfo: function () {
  //   let that = this;
  //   app.sendRequest({
  //     url: "api.php?s=login/getWebSiteInfo",
  //     data: {},
  //     success: function (res) {
  //       // console.log(res)
  //       let code = res.code;
  //       let data = res.data;
  //       if (code == 0) {
  //         that.setData({
  //           webSiteInfo: data
  //         })
  //         if (data.title != '' && data.title != undefined) {
  //           wx.setNavigationBarTitle({
  //             title: data.title,
  //           })
  //         }
  //       }
  //       // console.log(res);
  //     }
  //   })
  // },

  // 获取滚动条当前位置
  onPageScroll: function (e) {
    if (e.scrollTop > 1900) {
      this.setData({
        floorstatus: true
      });
    } else {
      this.setData({
        floorstatus: false
      });
    }
  },
  all_error: function () {
    console.log('视频播放出错时触发');

  },
  all_waiting: function () {
    console.log('视频出现缓冲时触发');

  },
  all_pause: function () {
    console.log('当暂停播放时触发 pause 事件');

  },
  all_ded: function () {

    console.log('当播放到末尾时触发 ended 事件');

  },
  /* 
      回到顶部
   */
  goTop: function () {
    let that = this;
    let scrollTop = that.data.floorstatus;
    if (floorstatus) {
      wx.scrollTop({
        scrollTop: 0
      })

    }

  },

  /* 
   首页轮播图跳转以及阿拉丁统计
  */
  toGood: function (e) {
    var that = this;
    var id = e.currentTarget.dataset.id;
    var fob = e.currentTarget.dataset.x;
    var title = e.currentTarget.dataset.title;
    var url = e.currentTarget.dataset.url;
    let assist = that.data.assist;

    if (fob == 'x') {
      if (url) {
        console.log('首页轮播图商品点击', {
          "商品标题": title,

        });
        app.aldstat.sendEvent('首页轮播图商品点击', {
          "商品标题": title,
        });
        wx.navigateTo({
          url: '/' + url,
        })
      } else {
        wx.navigateTo({
          url: '/pages/goods/goodsdetail/goodsdetail?goods_id=' + id,
        })
      }
    } else if (fob == 'y') {

      if (that.data.swperStatu == 1) {
        let Der_url = that.data.Der_url;
        wx.navigateTo({
          url: '/' + Der_url,
        })
      } else {
        console.log(assist.url)
        wx.navigateTo({
          url: '/' + assist.url,
        })
      }


    }

  },

  /**
  * 收藏
  */
  collect: function (e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    let page_index = that.data.page_index;
    console.log('老师傅');
    console.log(id)
    let index_goods_list = that.data.index_goods_list;
    console.log(index_goods_list)
    let goods_name;
    let is_fav;

    for (let i in index_goods_list) {
      if (index_goods_list[i].goods_id == id) {
        is_fav = index_goods_list[i].is_member_fav_goods;
        goods_name = index_goods_list[i].goods_name;
      }
    }
    let method = is_fav == 0 ? 'FavoritesGoodsorshop' : 'cancelFavorites';
    let message = is_fav == 0 ? '收藏' : '取消收藏';
    is_fav = is_fav == 0 ? 1 : 0;

    app.sendRequest({
      url: 'api.php?s=member/' + method,
      data: {
        fav_id: id,
        fav_type: 'goods',
        log_msg: goods_name
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          if (data > 0) {
            app.showBox(that, message + '成功');
            that.All_shop(page_index)
            // that.indexInit(that)
            that.setData({
              index_goods_list
            })
          } else {
            app.showBox(that, message + '失败');
          }
        }
      }
    });
  },

  songGift: function (event) {
    let that = this
    // let out_trade_no = that.data.out_trade_no
    wx.request({
      url: app.globalData.siteBaseUrl + 'api.php?s=order/getTrialGoodsTemplate',
      data: {
        openid: app.globalData.openid,
        formid: event.detail.formId,
      },
      method: 'POST',
      header: {
        'content-type': 'application/x-www-form-urlencoded;'
      },
      success: function (res) {
        // console.log(res);
      }
    })
  },



  swiperChange: function (e) {
    var that = this;
    let assist = {};
    let imgUrls = that.data.imgUrls;
    let E = e.detail.current;
    // console.log(E)
    let data = that.data.adv_index_two;
    for (let index in data) {
      assist.adv_image = data[index].adv_image;
      assist.url = imgUrls[E].adv_url;
      if (E == index) {
        that.setData({
          assist,
          swperStatu: 2,
        })
      }
    }

    that.setData({
      swiperCurrent: e.detail.current
    })
  },
  // 页面滚动事件//滑动开始事件
  handletouchtart: function (event) {
    var touchMove = this.data.touchMove;
    touchMove = event.touches[0].pageY;
    // console.log(event.touches[0])
    this.setData({
      isHide: 1,
      touchMove
    })
  },
  // 滑动移动事件
  handletouchmove: function (event) {
    var touchMove = this.data.touchMove;
    console.log(touchMove, event.touches[0].clientY)
    if (touchMove - event.touches[0].clientY < 0) {
      // console.log("向下滑了");
      this.setData({
        isFix: 0,
      })
    } else {
      this.setData({
        isFix: 1,
      })
    }
    touchMove = event.touches[0].clientY;
    this.setData({
      isHide: 1,
      touchMove
    })
  },
  //滑动结束事件
  handletouchend: function (event) {
    this.setData({
      isHide: 0
    })
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
      app.aldstat.sendEvent('品牌点击事件', {
        "品牌名称": title
      });
      wx.navigateTo({
        url: '/pages/goods/brandlist/brandlist?id=' + id,   //+'&store_id=1'
      })
    } else {
      return false;
    }
  },
  toList(e) {
    let that = this;
    let id = e.currentTarget.dataset.id;
    console.log(id)

    wx.navigateTo({
      url: '/pages/index/Categorylist/Categorylist?id=' + id,
    })


  },

  onPullDownRefresh: function () {
    var that = this;
    this.indexInit(that);
    that.TC_reuse();
    wx.stopPullDownRefresh()
    // if(this.data.currentTab>1){

    // }




  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    let that = this;
    let page_index = that.data.page_index;
    that.All_shop(page_index)
    wx.showNavigationBarLoading();
    // that.Ashop();
    wx.stopPullDownRefresh;
  },
  //渐入，渐出实现 
  show: function (that, param, opacity) {
    var animation = wx.createAnimation({
      //持续时间800ms
      duration: 800,
      timingFunction: 'ease',
    });
    //var animation = this.animation
    animation.opacity(opacity).step(

    )
    //将param转换为key
    var json = '{"' + param + '":""}'
    // console.log(json);
    json = JSON.parse(json);
    // console.log(json);
    json[param] = animation.export()
    //设置动画
    that.setData(json)
  },
  Fadein: function () {
    this.show(this, 'slide_up1', 0)
  },



})