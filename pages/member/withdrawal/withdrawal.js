// pages/member/withdrawal/withdrawal.js
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datetime: '',  //选中的年月
    detailtime:'',    //账单明细的时间
    nowData: '',  //当前年月
    prompt:'',    //提示语
    remainPrice:'',  //分润余额
    rewardPrice:'',    //奖励余额
    price:'',     //输入金额
    isBindInput:true,    //输入框没输入时符号显示
    remain:true,    //提现方式
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function () {

  },

  // 可用余额 以及账单明细
  orders: function (start_date, end_date) {
    let that = this;
    // console.log(start_date, end_date)
    app.sendRequest({
      url: "api.php?s=distributor/getDistributorAccountDetail",
      data: {
        start_date: start_date,
        end_date: end_date
      },
      success: function (res) {
        console.log(res.data)
        var separationRecords = res.data.accountRecordsDate;
        for (var i = 0; i < separationRecords.length;i++){
          var item = separationRecords[i].accountRecords;
          for (var j = 0; j < item.length;j++){
            var index = item[j].settlement_time.indexOf(" ");
            // console.log(index);
            item[j].settlement_time = item[j].settlement_time.substr(index + 1, item[j].settlement_time.length);
            if (parseFloat(item[j].money)>0){
              item[j].money = '+' + item[j].money;
              item[j].isGreen=true;
            }
          }
        }
        that.setData({
          remainPrice: res.data.account.balance,  //分润余额
          rewardPrice: res.data.account.bonus,  //奖励余额
          separationRecords,   //账单明细
        })
      }
    })
  },

  // 日期选择
  bindDateChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    var str = e.detail.value;
    var index = str.split('-');
    console.log(index)
    var nowYear = index[0];
    console.log(nowYear)
    var nowMonth = index[1];
    console.log(nowMonth)

    var detailtime = nowYear + '年' + nowMonth + '月';
    this.setData({
      datetime: e.detail.value,
      detailtime,
    })

    var endDate = this.getMonthDays(nowMonth - 1);
    console.log(endDate)
    var monthStartDate = str + '-01';
    var monthEndDate = str + '-' + endDate;
    console.log(monthStartDate, monthEndDate);
    this.orders(monthStartDate, monthEndDate)
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

  // 提现分润金额
  isRemain:function(){
    this.setData({
      remain: true,
    })
  },

  // 提现奖励金额
  isReward: function () {
    this.setData({
      remain: false,
    })
  },

  // 填写价格
  priceValue: function (e) {
    var price = e.detail.value;
    var that=this;
    var remainPrice = this.data.remainPrice;
    var rewardPrice = this.data.rewardPrice;
    if (this.data.remain){
      if (price > parseFloat(remainPrice)) {
        this.setData({
          prompt: '金额不能超过余额',
          price: parseFloat(remainPrice)
        })
      }
      else if (price < 1) {
        this.setData({
          prompt: '金额不能小于1'
        })
      } else {
        this.setData({
          price,
        })
      }
    } else{
      if (price > parseFloat(rewardPrice)) {
        this.setData({
          prompt: '金额不能超过余额',
          price: parseFloat(rewardPrice)
        })
      }
      else if (price < 1) {
        this.setData({
          prompt: '金额不能小于1'
        })
      } else {
        this.setData({
          price,
        })
      }
    }
    setTimeout(function () {
      that.setData({
        prompt: ''
      })
    }, 1500)
  },

  // 申请提现
  toApply: function (event){
    var price=this.data.price;
    var that=this;
    var account_type = this.data.remain?1:2;
    // console.log(price, account_type)
    if (!price){
      that.setData({
        prompt: '请输入提现金额',
      })
      setTimeout(function () {
        that.setData({
          prompt: ''
        })
      }, 1500)
    } else {
      app.sendRequest({
        url: "api.php?s=distributor/toWithdraw",
        data: {
          cash: price,
          account_type: account_type,     //(账户类型：1分润余额；2：奖金）
        },
        success: function (res) {
          var data=res.data;
          if(data=='-2015'){
            that.setData({
              prompt: '提现功能未启用',
            })
          } else if (data == '-2017') {
            that.setData({
              prompt: '申请提现小于单笔最低提现',
            })
          } else if (data == '-2020') {
            that.setData({
              prompt: '今日申请提现大于单日最高提现',
            })
          } else if (data == '-4008') {
            that.setData({
              prompt: '用户余额不足',
            })
          } else {
            console.log(event.detail.formId, app.globalData.openid, res.data);
            app.sendRequest({
              url: "api.php?s=distributor/createWithdrawTemplate",
              data: {
                open_id: app.globalData.openid,
                form_id: event.detail.formId,
                data_id:res.data,
              },
              success: function (result) {
                wx.navigateTo({
                  url: '/pages/member/withdrawalSuccess/withdrawalSuccess',
                })
              },
            });
          }
          setTimeout(function () {
            that.setData({
              prompt: ''
            })
          }, 2000)
        }
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
    var date = new Date;
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" + month : month);
    var mydate = (year.toString() + '-' + month.toString());
    var detailtime = (year.toString() + '年' + month.toString() + '月');
    this.setData({
      datetime: mydate,
      detailtime: detailtime,
      nowData: mydate,
      isBindInput: true,
      price:''
    })
    var endDate = this.getMonthDays(date.getMonth());
    console.log(endDate)
    var monthStartDate = mydate + '-01';
    var monthEndDate = mydate + '-' + endDate;
    this.orders(monthStartDate, monthEndDate)
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