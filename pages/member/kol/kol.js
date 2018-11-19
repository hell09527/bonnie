const app = new getApp();
var time = require("../../../utils/util.js");
var _wxcharts = require('../../mars/plugins/wxcharts')
Page({
  data: {
    ck:1,//区分数据本月或者本周
    _no: '0',//区分切换项
    isTopClick:1,  //商品排行标题点击
    datetime: '',
    nowData:'',  //当前月
    TistData: [
      { "code": "分润待结算状态", "text": "订单付款后，订单获得的分润"},
      { "code": "分润审核期", "text": "订单已收货/已完成后15天内的维权期"},
      { "code": "分润待出账状态", "text": "订单获得的分润已过了审核期，在下一个出账日可以出账"},
      { "code": "分润已出账状态", "text": "订单获得的分润已入账到极选师账户"},
      { "code": "出账日", "text": "分润入账到极选师账户的日期"},
      { "code": "考核期", "text": "每个季度为一个考核期" },
    ],
    CistData:[
      { star: '一星级', standard: '90000', proportion: '5%'},
      { star: '二星级', standard: '150000', proportion: '7%' },
      { star: '三星级', standard: '210000', proportion: '10%' },
            ] ,     
     

    isCode:1,   //小程序码切换
  },

  onLoad: function () {
    // console.log('onLoad')
    let that=this;
    
    // console.log(that.getWeekStartDate());
    // console.log(that.getWeekEndDate());
    // console.log(that.getMonthStartDate());
    // console.log(that.getMonthEndDate());
    
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var mydate = (year.toString() +'-'+ month.toString());
    console.log(mydate);
    this.setData({
      datetime: mydate,
      nowData: mydate
    })

    app.sendRequest({
      url: "api.php?s=/order/getKolFractionSum",
      success: function (res) {
        console.log(res.data.star_name_start)
        let star_reward = res.data.star_reward * 100 + "%";
        let standard_rate = res.data.standard_rate * 100;
        
        let star_name_start =  res.data.star_name_start == '' ? '0星' : res.data.star_name_start;
        console.log(standard_rate)
        that.setData({
          sum_one: res.data.sum_one.toFixed(2),
          sum_two: res.data.sum_two.toFixed(2),
          sum_three: res.data.sum_three.toFixed(2),
          sum_four: res.data.sum_four.toFixed(2),
          star_reward: star_reward,
          member_count: res.data.member_count,
          order_number_count: res.data.order_number_count,
          goods_money_sum: res.data.goods_money_sum.toFixed(2),
          star_name_start: star_name_start,
          star_name_end: res.data.star_name_end,
          quarter_goods_money_sum: res.data.quarter_goods_money_sum.toFixed(2),
          standard_rate: standard_rate,
          // sum_five: res.data.sum_five.toFixed(2)
        })
      }
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


   //商品排行榜
    app.sendRequest({
      url: "api.php?s=goods/getGoodsRecommendList",
      success: function (res) {
      let  listData=res.data
        // console.log(listData)


        for (let index in listData){
          console.log(listData[index].fraction)
          listData[index].fraction
          listData[index].fraction = listData[index].fraction * 100 + "%"
        }
        that.setData({
          listData
        })
      }
    })

    //商品排行榜
    app.sendRequest({
      url: "api.php?s=goods/getGoodsSalesList",
      success: function (res) {
        let saveData = res.data
        console.log(saveData)


        // for (let index in listData) {
        //   listData[index].fraction = listData[index].fraction * 100 + "%"
        // }
        that.setData({
          saveData
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
              order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D h:m:s');
            
          
             
              //图片处理
              for (let key in order_list[index].order_item_list) {
                let img = order_list[index].order_item_list[key].picture.pic_cover_small;
                order_list[index].order_item_list[key].picture.pic_cover_small = app.IMG(img);
                order_list[index].order_item_list[key].fraction = order_list[index].order_item_list[key].fraction * 100 + "%";
                let shareBenefit = (order_list[index].order_item_list[key].goods_money) * parseInt(order_list[index].order_item_list[key].fraction)
                // console.log(order_list[index].order_item_list[key].goods_money);
                // console.log(order_list[index].order_item_list[key].fraction);

                // console.log(shareBenefit)

                order_list[index].order_item_list[key].shareBenefit = (shareBenefit/100).toFixed(2)
          
                // console.log(order_list[index].order_item_list[key].fraction)
              }
            }
            console.log(parseInt(0.1))
            
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
 
  topNav: function (event) {
    let that = this;
    let status = event.currentTarget.dataset.id;
    let order_status = status == 0 ? 'all' : status - 1;
    that.setData({
      _no: status,
      status: order_status,
    })
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
            order_list[index].create_time = time.formatTime(order_list[index].create_time, 'Y-M-D h:m:s');
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
 
  listClick:function(){
    wx.navigateTo({    //保留当前页面，跳转到应用内的某个页面（最多打开5个页面，之后按钮就没有响应的）
      url: "kolbill/kolbill"
    })
  },

  //获得本周的开始日期
  getWeekStartDate:function () {
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
 getWeekEndDate:function () {
   var now = new Date(); //当前日期
   var nowDayOfWeek = now.getDay(); //今天本周的第几天
   var nowDay = now.getDate(); //当前日
   var nowMonth = now.getMonth(); //当前月
   var nowYear = now.getYear(); //当前年
   nowYear += (nowYear < 2000) ? 1900 : 0; //
    var weekEndDate = new Date(nowYear, nowMonth, nowDay + (6 - nowDayOfWeek));
    return this.formatDate(weekEndDate);
  },

  getQuarterStartMonth:function () {
    var now = new Date(); //当前日期
    var nowMonth = now.getMonth(); //当前月
    var quarterStartMonth = 0;
    if(nowMonth < 3) {
      quarterStartMonth = 0;
    }
  if(2 <nowMonth && nowMonth < 6) {
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
getMonthEndDate:function () {
  var now = new Date(); //当前日期
  var nowDayOfWeek = now.getDay(); //今天本周的第几天
  var nowDay = now.getDate(); //当前日
  var nowMonth = now.getMonth(); //当前月
  console.log(nowMonth)
  var nowYear = now.getYear(); //当前年
  nowYear += (nowYear < 2000) ? 1900 : 0; //
  console.log(nowYear, nowMonth, nowMonth - 1);
    var monthEndDate = new Date(nowYear, nowMonth, this.getMonthDays(nowMonth));
    return this.formatDate(monthEndDate);
  },
  //获得某月的天数
  getMonthDays:function (myMonth) {
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
  formatDate:function (date) {
    var myyear = date.getFullYear();
    var mymonth = date.getMonth() + 1;
    var myweekday = date.getDate();
    if(mymonth < 10) {
      mymonth = "0" + mymonth;
    }
    if(myweekday < 10) {
      myweekday = "0" + myweekday;
    }
    return(myyear + "-" + mymonth + "-" + myweekday);
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

open:function(){
  let that=this;
  if (that.data.temp != 'open'){

    
    that.setData({
      temp: 'open',
      rotate: 'rotate'
    })
 }else{
    that.setData({
      temp: '',
      rotate: ''
    })
 }
 
},

// 商品排行标题点击
  isTopClick: function (e) {
    let index = e.currentTarget.dataset.index;
    if(index==2){
      this.setData({
        isTopClick:2
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
    var monthStartDate = str+'-01';
    var monthEndDate = str + '-' + endDate;
    console.log(monthStartDate, monthEndDate);
    this.orders(monthStartDate, monthEndDate)
  },
})
  