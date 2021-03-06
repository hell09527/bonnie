const app = new getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    prompt: '',
    realname: '',
    mobile: '',
    account_type: 0,
    account_type_name: '',
    account_number: '',
    branch_bank_name: '',
    account_type_list: [], //账号类型
    account_type_index: 0, //select KEY
    addAccountFlag: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;

    app.sendRequest({
      url: 'api.php?s=member/getBalanceConfig',
      data: {},
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          let account_type_list = [];
          let i = 0;
          for(let index in res.data){
            if (res.data[index].is_checked == 1){
              account_type_list[i] = res.data[index];
              i++;
            }
          }
          let account_type = account_type_list[0].value;
          let account_type_name = account_type_list[0].name;
          
          that.setData({
            account_type_list: account_type_list,
            account_type: account_type,
            account_type_name: account_type_name,
          })
        }
        console.log(res)
      }
    });
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
   * 输入事件
   */
  inputEvent: function(e){
    let that = this;
    let id = e.currentTarget.dataset.id;
    let value = e.detail.value;

    if (id == 'realname'){
      that.setData({
        realname: value
      })
    } else if (id == 'mobile'){
      that.setData({
        mobile: value
      })
    } else if (id == 'branch_bank_name'){
      that.setData({
        branch_bank_name: value
      })
    } else if (id == 'account_number'){
      that.setData({
        account_number: value
      })
    }
  },

  /**
   * 选择账号类型
   */
  bindAccountTypeChange: function (event){
    let that = this;

    let account_type_index = event.detail.value;
    let account_type_list = that.data.account_type_list;
    let account_type = account_type_list[account_type_index].value;
    let account_type_name = account_type_list[account_type_index].name;

    that.setData({
      account_type_index: account_type_index,
      account_type: account_type,
      account_type_name: account_type_name
    })
  },

  /**
   * 添加账户
   */
  addAccount: function(){
    let that = this;
    let addAccountFlag = that.data.addAccountFlag;
    let realname = that.data.realname;
    let mobile = that.data.mobile;
    let account_type = that.data.account_type;
    let account_type_name = that.data.account_type_name;
    let account_number = that.data.account_number;
    let branch_bank_name = that.data.branch_bank_name;

    if (addAccountFlag == 1){
      return false;
    }
    app.clicked(that, 'addAccountFlag');
    if (realname == ''){
      app.showBox(that, '姓名不能为空');
      app.restStatus(that, 'addAccountFlag');
      return false;
    }

    if(mobile == ''){
      app.showBox(that, '手机号不能为空');
      app.restStatus(that, 'addAccountFlag');
      return false;
    }

    let myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
    if (mobile.length != 11 || !myreg.test(mobile)) {
      app.showBox(that, '手机号格式不正确');
      app.restStatus(that, 'addAccountFlag');
      return false;
    }
    
    if (account_type == 1){
      if (branch_bank_name == '') {
        app.showBox(that, '支行信息不能为空');
        app.restStatus(that, 'addAccountFlag');
        return false;
      }

      if (account_number == '') {
        app.showBox(that, '银行账号不能为空');
        app.restStatus(that, 'addAccountFlag');
        return false;
      }
    }
    
    app.sendRequest({
      url: 'api.php?s=member/addAccount',
      data: {
        realname: realname,
        mobile: mobile,
        account_type: account_type,
        account_type_name: account_type_name,
        account_number: account_number,
        branch_bank_name: branch_bank_name
      },
      success: function (res) {
        let code = res.code;
        if (code == 0) {
          if(res.data > 0){
            wx.navigateBack({
              delta: 1,
            })
          }else{
            app.showBox(that, '操作失败');
            app.restStatus(that, 'addAccountFlag');
          }
        }
      }
    });
  }
})