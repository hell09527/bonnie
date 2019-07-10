
const app = new getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    datetime: '',   //出生日期
    navList: [
      {
        name: '基本信息',
        select: true,
      },

      {
        name: '工作经历',
        select: false,
      },
    ],
    provinceArray:
      [
        {
          'province_id': 0,
          'province_name': '请选择省'
        },
      ],
    cityArray:
      [
        {
          'city_id': 0,
          'city_name': '请选择市'
        },
      ],
    districtArray:
      [
        {
          'district_id': 0,
          'district_name': '请选择区县'
        },
      ],        //地址选择数组
    provinceIndex: 0,
    cityIndex: 0,
    districtIndex: 0,
    isShow: 1,    //显示模块
    isModel: false,   //模态框
    prompt: '',  //提示语
    listData: {

    },    //全数据
    isKol: 0,    //是否是极选师
    kolText: '',    //文本
    recommend: '',   //推荐人
    showTitle: '', //展示文本
    showTitle: '推荐人',
    Naddress: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var listData = this.data.listData;
    listData = JSON.parse(options.listData);
    console.log(listData, "listData")

    that.setData({
      listData,
    })


    if (listData.recommend_user) {
      that.setData({
        kol_name: listData.kol_name,
      })
    }



    app.sendRequest({
      url: 'api.php?s=index/getProvince',
      data: {},
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let provinceArray = res.data;
          let province_array = [{
            area_id: 0,
            province_id: 0,
            province_name: '请选择省',
            sort: 0
          }];
          for (let i = 0; i < provinceArray.length; i++) {
            province_array[i + 1] = provinceArray[i];
          }
          that.setData({
            provinceArray: province_array
          })
          //console.log(that.data.provinceArray);
        }
      }
    })


  },




  // 判断输入的文字是否有表情
  isEmojiCharacter: function (substring) {
    for (var i = 0; i < substring.length; i++) {
      var hs = substring.charCodeAt(i);
      if (0xd800 <= hs && hs <= 0xdbff) {
        if (substring.length > 1) {
          var ls = substring.charCodeAt(i + 1);
          var uc = ((hs - 0xd800) * 0x400) + (ls - 0xdc00) + 0x10000;
          if (0x1d000 <= uc && uc <= 0x1f77f) {
            return true;
          }
        }
      } else if (substring.length > 1) {
        var ls = substring.charCodeAt(i + 1);
        if (ls == 0x20e3) {
          return true;
        }
      } else {
        if (0x2100 <= hs && hs <= 0x27ff) {
          return true;
        } else if (0x2B05 <= hs && hs <= 0x2b07) {
          return true;
        } else if (0x2934 <= hs && hs <= 0x2935) {
          return true;
        } else if (0x3297 <= hs && hs <= 0x3299) {
          return true;
        } else if (hs == 0xa9 || hs == 0xae || hs == 0x303d || hs == 0x3030
          || hs == 0x2b55 || hs == 0x2b1c || hs == 0x2b1b
          || hs == 0x2b50) {
          return true;
        }
      }
    }
  },

  /**
   * 省选择器
   */
  bindProvincChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let provinceArray = that.data.provinceArray;
    let province_id = provinceArray[index].province_id;
    app.clicked(that, 'listClickFlag');


    that.setData({
      provinceIndex: index,
      province: province_id,
      cityIndex: 0,
      districtIndex: 0
    })

    if (province_id == 0) {
      return;
    }
    app.sendRequest({
      url: 'api.php?s=index/getCity',
      data: {
        province_id: province_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let cityArray = res.data;
          let city_array = [{
            area_id: 0,
            city_id: 0,
            city_name: '请选择市',
            sort: 0
          }];
          for (let i = 0; i < cityArray.length; i++) {
            city_array[i + 1] = cityArray[i];
          }
          that.setData({
            cityArray: city_array
          })
        }
      }
    })
  },
  /**
   * 市选择器
   */
  bindCityChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let cityArray = that.data.cityArray;
    let city_id = cityArray[index].city_id;
    that.setData({
      cityIndex: index,
      city: city_id,
      districtIndex: 0
    })
    if (city_id == 0) {
      return;
    }
    app.sendRequest({
      url: 'api.php?s=index/getDistrict',
      data: {
        city_id: city_id
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let districtArray = res.data;
          let district_array = [{
            area_id: 0,
            district_id: 0,
            district_name: '请选择区县',
            sort: 0
          }];
          for (let i = 0; i < districtArray.length; i++) {
            district_array[i + 1] = districtArray[i];
          }
          that.setData({
            districtArray: district_array
          })
        }

      }
    })
  },
  /**
   * 区选择器
   */
  bindDistrictChange: function (e) {
    let that = this;
    let index = e.detail.value;
    let districtArray = that.data.districtArray;
    let district_id = districtArray[index].district_id;
    that.setData({
      districtIndex: index,
      district: district_id
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  // 姓名修改
  nameValue: function (e) {
    var name = e.detail.value;
    var listData = this.data.listData;
    if (name != listData.name) {
      listData.name = name;
      this.setData({
        listData,
      })
    } else {
      return;
    }
  },
  nameWrok: function (e) {
    var name = e.detail.value;
    var listData = this.data.listData;
    listData.name = name.replace(/\s+/g, '');
    this.setData({
      listData,
    })

  },




  nationWrok: function (e) {
    var nation = e.detail.value;
    var listData = this.data.listData;
    listData.nation = nation.replace(/\s+/g, '');
    this.setData({
      listData,
    })


  },



  // 手机号码修改
  phoneValue: function (e) {
    var tel = e.detail.value;
    var listData = this.data.listData;
    listData.tel = tel;
    this.setData({
      listData,
    })
  },


  // 申请极选师
  toApply: function (event) {
    var that = this;
    var listData = this.data.listData;
    var navList = this.data.navList;
    var provinceArray = this.data.provinceArray;
    var cityArray = this.data.cityArray;
    var provinceIndex = this.data.provinceIndex;
    var cityIndex = this.data.cityIndex;
    listData.province = provinceArray[provinceIndex].province_name;
    listData.city = cityArray[cityIndex].city_name;

    console.log(listData, '323istData')

    var myreg = /^1(3|4|5|7|8)\d{9}$/;
    var reg = /[~#^$@%&!?%*]/gi;

    if (!listData.name) {
      app.showBox(that, '请填写姓名');
    } else if (this.isEmojiCharacter(listData.name)) {
      app.showBox(that, '姓名不能含有表情');
    } else if (reg.test(listData.name)) {
      app.showBox(that, '姓名不能含有特殊字符');
    } else if (provinceIndex == 0) {
      app.showBox(that, '请选择省');
    } else if (cityIndex == 0) {
      app.showBox(that, '请选择市');
    } else if (!myreg.test(listData.tel)) {
      app.showBox(that, '请填写正确手机号码');
    } else {
      // 提交表格
      app.sendRequest({
        url: 'api.php?s=Distributor/applyDistributor',
        data: listData,
        success: function (res) {
          console.log(res, app.globalData.openid, event.detail.formId)
          app.sendRequest({
            url: 'api.php?s=distributor/sendKolTemplateCreated',
            data: {
              openid: app.globalData.openid,
              formid: event.detail.formId,
            },
            success: function (result) {
              console.log(res)
              if (res.code == 1) {
                setTimeout(function () {
                  wx.showToast({
                    title: res.message,
                    icon: 'success',
                    duration: 800,
                    success: function () {
                      setTimeout(function () {
                        wx.switchTab({
                          url: '/pages/index/index',
                        })
                      }, 1000)
                    }
                  })
                }, 800)
              }
            }
          })
        }
      })
    }

  },

  toIndex: function () {
    wx.switchTab({
      url: '/pages/index/index',
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var that = this;
    var listData = this.data.listData;
    wx.hideShareMenu();
    console.log(app.globalData.unregistered);

    if (app.globalData.token && app.globalData.token != '') {
      //判断是否是付费会员的接口
    } else {
      app.employIdCallback = employId => {
        console.log(employId)
        if (employId != '') {

        }
      }
    }
  },

  switcher: function (e) {
    let that=this;
    let status = e.currentTarget.dataset.ma;
    that.setData({isShow:status })
  
     
    

  },
  //成为极选师
  toBecome:function(){

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
  // onShareAppMessage: function () {

  // }
})
