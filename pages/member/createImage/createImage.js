const app = new getApp();
Page({
  /**
   * 页面的初始数据
   */
  data: {
    imgUrl: "", //图片链接
    codeUrl: 'https://static.bonnieclyde.cn/WechatIMG11111.jpeg', // 二维码内容用于生成二维码
    ts: 0, //变换合成图片
    saveImg: '', //合成图片
    lucency: false, //模态框
    category_list: [], //分类
    category_goods: [], //分类商品
    page: 2,
    tempFiles: '',
    convert: '', //转换
    gooSid: '',
    windUp: false
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    let that = this;
    wx.getSystemInfo({
      success(res) {
        console.log(res.model)
        console.log(res.pixelRatio)
        console.log(res.windowWidth)
        console.log(res.windowHeight)
        console.log(res.language)
        console.log(res.version)
        console.log(res.platform)
        let windowWidth = res.windowWidth - 30;
        let windowHeight = res.windowHeight - 50;
        console.log(windowWidth )
        console.log(windowHeight)
        that.setData({
          windowWidth: windowWidth ,
          windowHeight
        })
      }

    })
  },
  //绘画
  Drawing: function() {
    let that = this;
    console.log(that.data.imgUrl)
    // 获取图片信息
    wx.getImageInfo({
      src: that.data.imgUrl,
      success: function(res) {
        console.log(res)
        const ctx = wx.createCanvasContext('shareCanvas');
        let setfixW = that.data.windowWidth ;
        let imgUrlW = setfixW / res.width;
        let imgUrlH = res.height * imgUrlW;
        console.log(imgUrlW)
        let W = setfixW - 20 - setfixW / 5;
        let H = imgUrlH  - 20- setfixW / 5;
    
        let codeH = H + ((setfixW / 5)/2)+12;
        console.log(W)
        console.log(H)
        console.log(setfixW / 5)
        console.log(imgUrlH);
     
        that.setData({
          setfixW: setfixW ,
          imgUrlH
        })
        ctx.drawImage(res.path, 0, 0, setfixW , imgUrlH)
        ctx.drawImage(res.path, 0, 0, setfixW , imgUrlH)
        // 作者名称
        ctx.setTextAlign('center') // 文字居中
        ctx.setFillStyle('#000') // 文字颜色：白色
        ctx.setFontSize(12) // 文字字号：12px
        // ctx.fillText("作者:薛定谔了猫", 50, codeH )
        // ctx.draw()

        console.log(that.data.codeUrl)
        wx.getImageInfo({
          src: that.data.codeUrl,
          success: function(res) {
            console.log(res)
            let codeUrlW=1.05*res.width;
            console.log(codeUrlW);
            console.log(setfixW);
            // let codeUrlH = 1.05 * res.width;
            // setfixW / 5,
            ctx.drawImage(res.path, W, H,  60,60)
            // ctx.drawImage(res.path, 60, 60,  80,80)
            console.log(res);
            ctx.stroke()
            ctx.draw();

            setTimeout(function() {
              wx.canvasToTempFilePath({
                x: 0,
                y: 0,
                width: setfixW ,
                height: imgUrlH,
                destWidth: setfixW ,
                destHeight: imgUrlH,
                canvasId: 'shareCanvas',
                success(res) {
                  console.log(res.tempFilePath, '11saveImg');
                  let Imgs = res.tempFilePath;

                  that.setData({
                    ts: 2,
                    saveImg: res.tempFilePath
                  })
                  console.log(res.tempFilePath, 'saveImg');
                  
                }
              });
            }, 100)

          }
        })
      }
    });
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },
  // 合成并下载图片
  Casedown: function() {
    let that = this;
    // console.log(11111111)
  },
  saVe: function() {
    let that = this;
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
            },
            fail() {
              that.file()
            }
          });
        } else {
          that.file();
          // that.popupClose();
        }
      }
    });
  },
  file: function() {
    console.log(888888)
    let that = this;
    console.log(that.data.saveImg, 'saveImg')
    wx.saveImageToPhotosAlbum({
      filePath: that.data.saveImg,
      success(res) {
        wx.showToast({
          title: '保存成功',
          icon: 'success',
          duration: 2000
        });
      },
      fail(res) {
        wx.showToast({
          title: '保存失败',
          icon: 'fail',
          duration: 2000
        });
        wx.openSetting({
          success(res) {
            console.log(res.authSetting)
            res.authSetting = {
              "scope.writePhotosAlbum": true,
            }
          }
        })


      }

    })

  },
  popupClose: function() {
    let that = this;
    console.log(12121)
    that.setData({
      lucency: false,
      windUp: false,
    })

  },
  // 选择商品
  commodity: function() {
    let that = this;
    that.setData({
      lucency: true
    })

  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    let that = this;

    if (that.data.ts == 3) {
      that.Casedown
    } else {

    }

    // const wxGetImageInfo = promisify(wx.getImageInfo)
    // console.log(wxGetImageInfo)
    // wxGetImageInfo({
    //   src: 'https://static.bonnieclyde.cn/youhuiquan-1.jpg'
    // }).then(res => {
    //   const ctx = wx.createCanvasContext('shareCanvas')
    //   ctx.drawImage(res.path, 0, 0, 600, 900)
    //   ctx.draw();
    // })

    //商品标题 
    app.sendRequest({
      url: "api.php?s=/index/categoryLists",
      data: {},
      method: 'POST',
      success: function(res) {
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

  // 商品标题点击
  selectCheck: function(e) {
    var id = e.currentTarget.dataset.id
    var category_list = this.data.category_list;
    for (var i = 0; i < category_list.length; i++) {
      category_list[i].select = 1;
      if (category_list[i].category_id == id) {
        category_list[i].select = 2;
      }
    }
    this.setData({
      category_list: category_list,
      category_goods: [],
      category_id: id,
      // page: 1,
    })
    this.toGoods(id, 2)
  },
  toGoods: function(id, page) {
    var that = this;
    var category_goods = that.data.category_goods;
    var page = that.data.page;
    // 获取商品分类标题点击的商品
    app.sendRequest({
      url: "api.php?s=/index/branchPro",
      data: {
        category_id: id,
        // page_index: page,
      },
      method: 'POST',
      success: function(res) {
        let new_category_goods = res.data.pro.data;
        if (new_category_goods[0] != undefined) {
          page++;
        }
        let category_pic = res.data.category_pic;
        category_goods = category_goods.concat(new_category_goods)
        // console.log(category_goods)
        that.setData({
          category_goods: category_goods,
          category_pic: category_pic,
          page: page,
        })
      }
    });
  },

  // 选中商品
  Chooseshop: function(e) {
    console.log(e.currentTarget.dataset.i)
    if (e.currentTarget.dataset.i) {
      // 选中的礼物的下标
      let index = e.currentTarget.dataset.i;
      // 先改变全部礼物都为不选中
      let category_goods = this.data.category_goods;
      console.log(category_goods)
      for (let i = 0; i < category_goods.length; i++) {
        if (category_goods[i].goods_id == index) {
          category_goods[i].selected = true;
        } else {
          category_goods[i].selected = false;
        }
      }
      console.log(category_goods)
      this.setData({
        category_goods: category_goods,
        gooSid: index
      })
    }

  },
  showBox: function(title, icon) {
    if (!icon) {
      wx.showToast({
        title: title,
        icon: 'none',
        duration: 1000
      })
    } else {
      wx.showToast({
        title: title,
        icon: icon,
        duration: 1000
      })
    }


  },
  //取消
  countermand: function() {
    let that = this;
    if (that.data.ts!=2){
      that.popupClose();
    }else{
      that.popupClose();
      // wx.navigateBack({
      //   delta: 1
      // })
    }
   
 
      //刷新当前页面的数据
    getCurrentPages()[getCurrentPages().length - 1].data
   
  },
  Close: function() {
    let that = this;
    that.popupClose();
  },
  //公共
  Commonality: function() {
    let that = this;
    that.Drawing();
    that.popupClose();
    that.setData({
      ts: 3,
      windUp: true
    })
  },
  //完成
  achieve: function() {

    let that = this;
    console.log(that.data.gooSid);
    if (!that.data.imgUrl) {
      // console.log(1111)
      that.showBox('您还没有上传图片')
    } else if (!that.data.gooSid) {
      //小程序码图片
      app.sendRequest({
        url: "api.php?s=distributor/getWxCode",
        success: function(res) {
          // console.log(res.data)
          var data = res.data
          var array = wx.base64ToArrayBuffer(res.data)
          var base64 = wx.arrayBufferToBase64(array)
          if (res.statusCode == 200) {
            that.setData({
              codeUrl: 'data:image/png;base64,' + base64,  // data 为接口返回的base64字符串  
            })
          }




          // that.setData({
          //   codeUrl: res.data
          // })

        }
      })
      that.Commonality();
    } else {
      that.Commonality();
    }


  },

  // 上传图片
  uploading: function() {
    let that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: 'compressed',
      // sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      // sourceType : 可以指定来源是相册还是相机，默认二者都有
      // sourceType: ['album'], // 此为相册 
      // sourceType: ['camera'], // 此为相机
      success: function(res) {
        let tempFiles = res.tempFilePaths[0];
        let filePath = res.tempFiles[0];
        console.log(filePath)
        console.log(tempFiles);
        that.setData({
          imgUrl: tempFiles,
          ts: 1
        })
      },
      fail: function(res) {
        that.showBox('无法获取本地图片');
      }
    })
  },
  /**
   * 图片预览
   */
  preivewImg: function(e) {
    let imgUrls = e.currentTarget.dataset.img;
    let urls = [];

    urls.push(imgUrls);
    wx.previewImage({
      current: urls[0],
      urls: urls,
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})