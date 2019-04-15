const app = getApp()
Page({
  data: {
    prompt: '',
    Base: '',  //库路径
    defaultImg: {},
    index_notice: {},  //公告ist.goods_list
    // goods_platform_list: {},  //标签板块
    // block_list: {},  //楼层板块
    top10_list: {},  //top10
    coupon_list: {},  //优惠券
    discount_list: {},  //限时折扣
    // current_time: 0,  //当前时间
    timer_array: {},  //限时折扣计时
    search_text: '',  //搜索内容
    mei_alls: '',  //某一个品牌的商品
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
    user_tel: '',//手机号码
    myTime:null,
    isHide:0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },

  UC: function () {
    // wx.navigateTo({
    //   url: '/pages/goods/shareRepertoire/shareRepertoire?share_li=90:1:0.01,89:1:0.01&tag=2&store=0',
    // })
    wx.navigateTo({
      url: "/pages/member/kolApply/kolApply",
      // url:  "/pages/member/supportCenter/supportCenter",
    //  url:    "/pages/goods/goodsclassificationlist/goodsclassificationlist",
    })

  },
  onLoad: function (options) {
    let that = this;
    let  activities; //往期话题数据 
    let   activities_list; //最新话题数据下的商品
    let  lastOne;//最新话题数据
    let shop;//新品推荐

    if (options.uid) {
      // 这个字段是转发过后承载uid     identifying
      app.globalData.identifying = options.uid;
      app.globalData.breakpoint = options.breakpoint;
      console.log('ui', options.breakpoint);
      console.log('u', options.uid);
    }
    if (options.scene) {
      // 扫码进入
      var scene = decodeURIComponent(options.scene);
      console.log("scene ", scene);
      let kol_id = scene.split('&')[0];
      app.globalData.kol_id = kol_id;
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

    // let isIphoneX = app.globalData.isIphoneX;
    // this.setData({
    //   isIphoneX: isIphoneX
    // })

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
        console.log('登陆成功')
        // that.setData({
        //   is_login: 1,  //加载。。。。
        //   maskStatus: 0
        // })
        clearInterval(load_timer);
      } else if (times == 15) {
        console.log('登录超时...')
        // app.showBox(that, '登录超时...');

        // that.setData({
        //   maskStatus: 0,
        //   is_login: 1,
        // })
        clearInterval(load_timer);
        return;
      }
    }, 1000);
    // that.webSiteInfo();

    //  获取往期话题
    app.sendRequest({
      url: "api.php?s=/activity/hotTopic",
      data: { limit: 3 },
      method: 'POST',
      success: function (res) {
        console.log(res.data.data);
       activities=res.data.data; 
       that.setData({
        activities,
      })
      
      }
    });

//  获取最新话题
   app.sendRequest({
  url: "api.php?s=/activity/hotTopic",
  data: { limit: 1 },
  method: 'POST',
  success: function (res) {
    console.log(res.data);
    lastOne=res.data.data;
  
    // 获取最新话题下面商品
    app.sendRequest({
      url: "api.php?s=/Activity/activityInfo",
      data: { master_id: res.data.data.id },
      success: function (res) {

        var new_actList = [];
        var actList = res.data.data
        for (var i = 0; i < actList.length; i++) {
          if (actList[i].goods_info) {
            new_actList.push(actList[i]);
          }
        }
       activities_list= new_actList;
       that.setData({
        activities_list,
      })
      
      }
    });
    that.setData({
      lastOne,
    })
  }
});

    app.sendRequest({
      url: "index.php?s=/api/index/getindeximglist",
      data: {},
      success: function (res) {
        for (let index in shop) {
          let img = shop[index].imgUrl;
          shop[index].imgUrl = app.IMG(img);
        }
        shop = res;
        that.setData({
          shop,
        })
      }
    });

 

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
      that.SY_reuse();
    } else {
      app.employIdCallback = employId => {
        if (employId != '') {
          //判断是否是付费会员的接口
          that.SY_reuse();
        }
      }
    }

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

    that.copyRightIsLoad();
    that.data.myTime= setTimeout(function () {
      that.setData({
        activities,
        lastOne,
        shop,
        
      })
    }, 1500);

  },

  onUnload () {
    //  关闭但页面清除单前页面的定时器
  clearInterval(this.data.myTime);
},

  //获取会员所有信息
  SY_reuse: function () {
    let that = this;
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let is_vip = data.is_vip;
          app.globalData.is_vip = data.is_vip;
          app.globalData.distributor_type = data.distributor_type;
          app.globalData.uid = data.uid;
          app.globalData.vip_gift = data.vip_gift;
          app.globalData.vip_goods = data.vip_goods;
          app.globalData.vip_overdue_time = data.vip_overdue_time;
          console.log(data.user_info.user_tel)
          app.globalData.user_tel = data.user_info.user_tel;
          //  console.log(app.globalData.is_vip)
          // that.setData({
          //   is_vip
          // })
        }
      }
    })
  },

  // 跳转top10页面
  toTopic: function () {
    wx.navigateTo({
      url: '/pages/index/topicCollection/topicCollection',
    })
  },

  // 跳转话题列表页
  toTopicList: function () {
    wx.navigateTo({
      url: '/pages/index/topicList/topicList',
    })
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
    //  极选师扫码12小时内有分销来源
    // if (app.globalData.distributor_type != 0) {

    // } else {
    //   let timestamp = Date.parse(new Date);
    //   let scanCodes = wx.getStorageSync('scanCode');
    //   console.log(scanCodes, 'scanCode')
    //   let kol_ids = wx.getStorageSync('kol_id')
    //   console.log(kol_ids, 'kol_id')
    //   let overtimes = wx.getStorageSync('overtime');
    //   if (timestamp < overtimes) {
    //     console.log(211111)
    //     app.globalData.kol_id= uids;
    //     app.globalData.scanCode = scanCode;
    //   } else {
    //     console.log(333333);

    //   }
    // }

    app.restStatus(that, 'listClickFlag');
    app.restStatus(that, 'noticeContentFlag');

  },
  // 小程序之间的跳转和携带参数；eg
  skip: function () {
    wx.navigateToMiniProgram({
      appId: 'wxd145d8a6e951dd1b',
      path: 'pages/goods/brandlist/brandlist?id=22',
      envVersion: 'trial',
      extraData: {
        traffic_acquisition_source : '小红书'
      },
    })
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
    console.log(x,hasTarget);

    //特殊点 跳转到黑科技商品
    if (x==0) {
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
    } else if(x == 1) {
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
    }else if (projectData.id) {
    // 跳转活动详情页
      app.aldstat.sendEvent('首页活动点击', {
        "活动名称":title
      });
      wx.navigateTo({
        url: '/pages/index/projectIndex/projectIndex?data=' + JSON.stringify(projectData),
      })
    }else if (hasTarget == 0) {
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
    let base = app.globalData.siteBaseUrl;
    let timeArray = {};

    app.sendRequest({
      url: 'api.php?s=index/getIndexData',
      data: {},
      success: function (res) {
        // console.log(res)
        let code = res.code;
        let indicatorDots = true;
        if (code == 0) {
          let data = res.data;
          //当前时间初始化
          let current_time = data.current_time;
          // that.setData({
          //   current_time: current_time
          // })

          //广告轮播初始化
          if (data.adv_list != undefined && data.adv_list.adv_index != undefined && data.adv_list.adv_index.adv_list != undefined) {
            let adv_index = data.adv_list.adv_index;
            let adv_list = adv_index.adv_list;

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
            that.setData({
              imgUrls: adv_list,
              swiperHeight: adv_index.ap_height
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

          let index_goods_list = data.index_goods_list;
          let new_pro = data.new_pro;
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

          for (let index in index_goods_list) {
            let img = index_goods_list[index].pic_cover_big;
            exponent = (parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].material_black) + parseInt(index_goods_list[index].effect_black)) / 3
            index_goods_list[index].pic_cover_small = that.IMG(img);
            index_goods_list[index].exponent = exponent
            // that.setData({
            //   exponent: exponent
            // })
          }


          // for (let index in block_list) {
          //   for (let key in block_list[index].goods_list) {
          //     let img = block_list[index].goods_list[key].pic_cover_small;
          //     block_list[index].goods_list[key].pic_cover_small = that.IMG(img);
          //   }
          // }
          // let sqk_alls = data.block_list[0];


          //(某一个品牌的商品)
          // let mei_alls = data.block_list[2].goods_list;


          that.setData({
            // Base: base,
            indicatorDots: indicatorDots,
            index_notice: data.notice.data,
            // goods_platform_list: data.goods_platform_list,
            // sqk_alls: '',
            // block_list: block_list,
            // mei_alls: mei_alls,
            // top_list: top_list,  //Top10
            index_goods_list: index_goods_list,   //商品列表
            new_pro: new_pro,   //新品推荐
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
    // console.log(e.detail.current)
    this.setData({
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
      console.log(touchMove,event.touches[0].clientY)
      if (touchMove - event.touches[0].clientY<0){
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
  




})