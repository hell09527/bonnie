const app = new getApp();
var time = require("../../../utils/util.js");
var _wxcharts = require('../../mars/plugins/wxcharts')
Page({
  data: {
    ck: 1,//区分数据本月或者本周
    _no: '0',//区分切换项
    isTopClick: 1,  //商品排行标题点击
    datetime: '',
    nowData: '',  //当前月
    isCode: 1,   //小程序码切换
    user_headimg: '',   //头像
    star_num: '',   //星级
    member_name: '',   //kol名字
    DatCue: {},
    page_index: 1,
    key: 0
  },
  onLoad: function () {
    // console.log('onLoad')
    let that = this;
    // console.log(that.getWeekStartDate());
    // console.log(that.getWeekEndDate());
    // console.log(that.getMonthStartDate());
    // console.log(that.getMonthEndDate());
    let page_index = that.data.page_index;
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var mydate = (year.toString() + '-' + month.toString());
    // console.log(mydate);
    this.setData({
      datetime: mydate,
      nowData: mydate
    })

    //小程序码图片
    app.sendRequest({
      url: "api.php?s=distributor/getWxCode",
      success: function (res) {
        // console.log(res.data)
        that.setData({
          imgU: res.data
        })
      }
    })

    //申请极选师二维码
    app.sendRequest({
      url: "api.php?s=distributor/getApplyCode",
      success: function (res) {
        // console.log(res.data)
        that.setData({
          applyCode: res.data
        })
      }
    })
    let DatCue = that.data.DatCue;
    DatCue = {
      page_index
    }

    that.TWportion(DatCue);

    // app.sendRequest({
    //   url: "api.php?s=/distributor/kolProducts",
    //   success: function (res) {
    //     let listData = res.data
    //     console.log(listData )       
    // for (let index in listData){
    //   listData[index].fraction = Number(listData[index].fraction*100).toFixed() + "%";
    // }
    // console.log(listData)
    // that.setData({
    //   listData
    // })
    //   }
    // })


    //商品排行榜
    // app.sendRequest({
    //   url: "api.php?s=goods/getGoodsRecommendList",
    //   success: function (res) {
    //     let listData = res.data
    //     for (let index in listData){
    //       listData[index].fraction = Number(listData[index].fraction*100).toFixed() + "%";
    //     }
    //     console.log(listData)
    //     that.setData({
    //       listData
    //     })
    //   }
    // })

    //商品排行榜
    // app.sendRequest({
    //   url: "api.php?s=goods/getGoodsSalesList",
    //   success: function (res) {
    //     let saveData = res.data
    //     that.setData({
    //       saveData
    //     })
    //   }
    // })

    // 
    app.sendRequest({
      url: "api.php?s=member/getMemberDetail",
      success: function (res) {
        let data = res.data
        if (res.code == 0) {
          let member_info = data;
          let img = member_info.user_info.user_headimg;
          let user_headimg = app.IMG(img); //图片路径处理
          let member_name = member_info.member_name
          that.setData({
            user_headimg,
            member_name
          })
        }
      }
    })

  },
  TWportion: function (DatCue) {
    let that = this;
    app.sendRequest({
      url: "api.php?s=/distributor/kolProducts",
      data: DatCue,
      success: function (res) {
        let head_list = res.data.head_list;
        let product_list = res.data.product_list;
        for (let index in product_list) {
          product_list[index].fraction = Number(product_list[index].fraction * 100).toFixed() + "%";
        }
        console.log(head_list);
        that.setData({
          head_list,
          product_list
        })
      }
    })

  },
  toRulePage: function (e) {
    let that = this;
    let type = e.currentTarget.dataset.type;
    let Num = type == 'x' ? 1 : 2;
    wx.navigateTo({
      url: '/pages/member/supportCenter/supportCenter?stu=' + Num
    })



  },
  /**
  * 顶部导航选中
  */
  selectCate: function (event) {
    let that = this;
    let DatCue = that.data.DatCue;
    let page_index = that.data.page_index;
    let scrollTop = that.data.scrollTop;
    let head_list = that.data.head_list;
    let key = event.currentTarget.dataset.id;

    for (let index in head_list) {
      head_list[index].is_check = false;
      if (head_list[index].key == key) {
        head_list[index].is_check = true;
      }
    }

    DatCue = { key, page_index: 1 };
    app.sendRequest({
      url: "api.php?s=/distributor/kolProducts",
      data: DatCue,
      success: function (res) {
        let product_list = res.data.product_list;
        for (let index in product_list) {
          product_list[index].fraction = Number(product_list[index].fraction * 100).toFixed() + "%";
        }
        console.log(head_list);
        if (scrollTop > 100) {
          wx.pageScrollTo({
            scrollTop: 0
          });
        }
        that.setData({
          key,
          page_index: 1,
          head_list,
          product_list
        })
      }
    })

  },
  onReady: function () {
    // 页面渲染完成
    this.getDeviceInfo()
  },
  onShow: function () {
    let that = this;

    app.sendRequest({
      url: "api.php?s=order/getKolAchievementStatistics",
      success: function (res) {
        that.setData({
          separation_sum: res.data.separation_sum.toFixed(2),    //累计赚取
          quarter_goods_money_sum: res.data.quarter_goods_money_sum.toFixed(2),//本季度完成金额
          quarter_order_number_count: res.data.quarter_order_number_count, //本季度完成订单笔数
          star_grade: res.data.star_grade, //极选师等级
          member_count: res.data.member_count, //绑定会员总数
          order_number_count: res.data.order_number_count, //累计成交订单笔数
          goods_money_sum: res.data.goods_money_sum.toFixed(2), //累计成交金额
          balance: res.data.account_sum.toFixed(2),  //账户余额
          unsettled_separation_sum: res.data.unsettled_separation_sum.toFixed(2), //待结算金额
        })
      }
    })

    let start_date = that.getMonthStartDate();
    let end_date = that.getMonthEndDate();
    app.sendRequest({
      url: 'api.php?s=order/getKolOrderList',
      data: {
        page: 1,
        start_date: start_date,
        end_date: end_date
      },
      success: function (res) {

        let code = res.code;

        if (code == 0) {
          let order_list = res.data.data;
          // console.log(order_list )
          for (let index in order_list) {
            order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D');

            // 卖家发货时间加上14天
            if (order_list[index].consign_time != 0 && order_list[index].sign_time == 0) {
              order_list[index].consign_time = time.formatTime(order_list[index].consign_time, 'Y-M-D');
              order_list[index].expect_time = that.expectTime(order_list[index].consign_time, 14);
            } else if (order_list[index].consign_time != 0 && order_list[index].sign_time != 0) {
              // 买家签收时间加上7天
              order_list[index].sign_time = time.formatTime(order_list[index].sign_time, 'Y-M-D');
              order_list[index].expect_time = that.expectTime(order_list[index].sign_time, 7);
            }

            //图片处理
            for (let key in order_list[index].order_item_list) {
              let img = order_list[index].order_item_list[key].picture.pic_cover_small;
              order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);

              order_list[index].order_item_list[key].fraction = order_list[index].order_item_list[key].fraction * 100 + "%";

              let shareBenefit = (order_list[index].order_item_list[key].goods_money) * parseInt(order_list[index].order_item_list[key].fraction)

              order_list[index].order_item_list[key].shareBenefit = (shareBenefit / 100).toFixed(2)
            }
          }
          // console.log(parseInt(0.1))

          let page = order_list.length > 0 ? 2 : 1;
          that.setData({
            order_list: order_list,
            page: page
          })
        }

      }
    })


  },

  /**
   * @Explain：获取设备信息
   */
  getDeviceInfo: function () {
    let that = this
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          deviceW: res.windowWidth,
          deviceH: res.windowHeight
        })
      }
    })
  },
  onPageScroll: function (e) { // 获取滚动条当前位置
    let that = this;
    that.setData({
      scrollTop: e.scrollTop
    })
    console.log(e.scrollTop)//获取滚动条当前位置的值
  },

  topNav: function (event) {
    let that = this;
    let key = that.data.key;
    let status = event.currentTarget.dataset.id;
    let order_status = status == 0 ? 'all' : status - 1;
    let scrollTop = that.data.scrollTop;

    that.setData({
      _no: status,
      status: order_status,
    })

    if (scrollTop > 100) {
      wx.pageScrollTo({
        scrollTop: 0
      });
    }


  },
  orders: function (start_date, end_date) {
    let that = this;
    app.sendRequest({
      url: 'api.php?s=order/getKolOrderList',
      data: {
        page: 1,
        start_date: start_date,
        end_date: end_date
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let order_list = res.data.data;
          // console.log(order_list )
          for (let index in order_list) {
            order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D');

            // 卖家发货时间加上14天
            if (order_list[index].consign_time != 0 && order_list[index].sign_time == 0) {
              order_list[index].consign_time = time.formatTime(order_list[index].consign_time, 'Y-M-D');
              order_list[index].expect_time = that.expectTime(order_list[index].consign_time, 14);
            } else if (order_list[index].consign_time != 0 && order_list[index].sign_time != 0) {
              // 买家签收时间加上7天
              order_list[index].sign_time = time.formatTime(order_list[index].sign_time, 'Y-M-D');
              order_list[index].expect_time = that.expectTime(order_list[index].sign_time, 7);
            }

            //图片处理
            for (let key in order_list[index].order_item_list) {
              let img = order_list[index].order_item_list[key].picture.pic_cover_small;
              order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
              order_list[index].order_item_list[key].fraction = order_list[index].order_item_list[key].fraction * 100 + "%";
              let shareBenefit = (order_list[index].order_item_list[key].goods_money) * parseInt(order_list[index].order_item_list[key].fraction)
              // console.log(order_list[index].order_item_list[key].goods_money);                    // console.log(order_list[index].order_item_list[key].fraction);
              // console.log(shareBenefit)
              order_list[index].order_item_list[key].shareBenefit = (shareBenefit / 100).toFixed(2)
              // console.log(order_list[index].order_item_list[key].fraction)
            }
          }
          console.log(parseInt(0.1));
          let page = order_list.length > 0 ? 2 : 1;
          that.setData({
            order_list: order_list,
            page: page
          })
        }
      }
    })
  },

  // 预计分润到账时间
  expectTime: function (time, days) {
    var dt = time;
    dt = dt.replace(/-/g, '/');//js不认2011-11-10,只认2011/11/10
    var t1 = new Date(new Date(dt).valueOf() + days * 24 * 60 * 60 * 1000);// 日期加上指定的天数
    var month;
    var day;
    if ((t1.getMonth() + 1) < 10) {
      // alert("0"+(t1.getMonth() + 1));
      month = "0" + (t1.getMonth() + 1);
    }
    else {
      month = t1.getMonth() + 1;
    }
    if (t1.getDate() < 10) {
      day = "0" + t1.getDate();
    }
    else {
      day = t1.getDate();
    }
    // var ttt= t1.getFullYear() + "-" + (t1.getMonth() + 1) + "-" + t1.getDate();
    var ttt = t1.getFullYear() + "-" + month + "-" + day;
    return ttt;
  },

  listClick: function () {
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "kolbill/kolbill"
    })
  },

  //获得本周的开始日期
  getWeekStartDate: function () {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var weekStartDate = new Date(nowYear, nowMonth, nowDay - nowDayOfWeek);

    return this.formatDate(weekStartDate);
  },
  //获得本周的结束日期
  getWeekEndDate: function () {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return this.formatDate(weekEndDate);
  },

  getQuarterStartMonth: function () {
    var now = new Date(); //当前日期
    var nowMonth = now.getMonth(); //当前月
    var quarterStartMonth = 0;
    if (nowMonth < 3) {
      quarterStartMonth = 0;
    }
    if (2 < nowMonth && nowMonth < 6) {
      quarterStartMonth = 3;
    }
    if (5 < nowMonth && nowMonth < 9) {
      quarterStartMonth = 6;
    }
    if (nowMonth > 8) {
      quarterStartMonth = 9;
    }
    return quarterStartMonth;
  },

  //获得本月的开始日期
  getMonthStartDate: function () {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    var monthStartDate = new Date(nowYear, nowMonth, 1);
    return this.formatDate(monthStartDate);
  },
  //获得本月的结束日期
  getMonthEndDate: function () {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowMonth = now.getMonth(); //当前月
    // console.log(nowMonth)
    var nowYear = now.getYear(); //当前年
    nowYear += (nowYear < 2000) ? 1900 : 0; //
    // console.log(nowYear, nowMonth, nowMonth - 1);
    var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    return this.formatDate(monthEndDate);
  },
  //获得某月的天数
  getMonthDays: function (myMonth) {
    var now = new Date(); //当前日期
    var nowDayOfWeek = now.getDay(); //今天本周的第几天
    var nowDay = now.getDate(); //当前日
    var nowYear = now.getYear(); //当前年
    var monthStartDate = new Date(nowYear, myMonth, 1);
    var monthEndDate = new Date(nowYear, myMonth + 1, 1);
    var days = (monthEndDate - monthStartDate) / (1000 * 60 * 60 * 24);
    return days;
  },
  //格式化日期：yyyy-MM-dd
  formatDate: function (date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if (mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if (myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return (myyear + "-" + mymonth + "-" + myweekday);
  },
  /**
  * 页面跳转
  */
  skipClick: function (event) {
    let that = this;
    let url = event.currentTarget.dataset.url;
    let listClickFlag = that.data.listClickFlag;
    // if (listClickFlag == 1) {
    //   return false;
    // }
    // app.clicked(that, 'listClickFlag');
    wx.navigateTo({
      url: '/pages' + url,
    })
  },
  /**
   * 图片预览
   */
  preivewImg: function (e) {
    let imgUrls = e.currentTarget.dataset.img;
    let urls = [];

    urls.push(imgUrls);
    wx.previewImage({
      current: urls[0],
      urls: urls,
    })
  },

  open: function (e) {
    let that = this;
    let Tyle = e.currentTarget.dataset.type;
    if (Tyle == 'two') {
      if (that.data.temp != 'open') {
        that.setData({
          temp: 'open',
          rotate: 'rotate'
        })
      } else {
        that.setData({
          temp: '',
          rotate: ''
        })
      }

    } else {
      wx.navigateTo({
        url: "/pages/member/supportCenter/supportCenter",
      })
    }





  },

  // 商品排行标题点击
  isTopClick: function (e) {
    let index = e.currentTarget.dataset.index;
    if (index == 2) {
      this.setData({
        isTopClick: 2
      })
    } else {
      this.setData({
        isTopClick: 1
      })
    }
  },

  // 小程序码切换
  isCode: function (e) {
    let index = e.currentTarget.dataset.index;
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

  // 跳转提现页面
  toTiXian: function () {
    // if (this.data.balance>0) {
    wx.navigateTo({
      url: '/pages/member/withdrawal/withdrawal',
    })
  },


  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var str = e.detail.value;
    this.setData({
      datetime: e.detail.value
    })
    var index = str.split('-');
    console.log(index)
    var nowYear = index[0];
    console.log(nowYear)
    var nowMonth = index[1];
    console.log(nowMonth)
    var endDate = this.getMonthDays(nowMonth - 1);
    console.log(endDate)
    var monthStartDate = str + '-01';
    var monthEndDate = str + '-' + endDate;
    console.log(monthStartDate, monthEndDate);
    this.orders(monthStartDate, monthEndDate)
  },
  /**
 * 页面上拉触底事件的处理函数
 */
  onReachBottom: function () {
    let that = this;
    let key = that.data.key;
    let product_list = that.data.product_list;
    let page_index = that.data.page_index;

    page_index = page_index >= 2 ? page_index : 2;
    app.sendRequest({
      url: 'api.php?s=/distributor/kolProducts',
      data: {
        key,
        page_index
      },
      success: function (res) {
        let code = res.code;
        let data = res.data;
        if (code == 0) {
          let parm = {};
          let parm_key = '';
          let new_product_list = data.product_list;
          console.log(new_product_list)

          if (new_product_list[0] != undefined) {

            page_index++;
            for (let index in new_product_list) {
              new_product_list[index].fraction = Number(new_product_list[index].fraction * 100).toFixed() + "%";
              let key = parseInt(new_product_list.length) + parseInt(index);
              let img = new_product_list[index].pic_cover_small;
              new_product_list[index].pic_cover_small = app.IMG(img);
            }
            product_list = product_list.concat(new_product_list);

            that.setData({
              product_list,
            });
          }

          that.setData({
            page_index: page_index,
          })
        }
        console.log(res);
      }
    });







  },
})

