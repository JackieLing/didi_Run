// pages/login/login.js
const app = getApp()
//获取数据库的引用
const db = wx.cloud.database()
//const db = wx.cloud.database().collection("callNumber")
let callNumber="";



Page({

  /**
   * 页面的初始数据
   */
  data: {
    nextBtnDisabled: true,
    nextBtnBc: '#bcbcbc',
    phone: ''
  },

  testPhone: function (s) {
    if (s != null && s) {
      var length = s.length
      if (length = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/.test(s)) {
        return true
      } else {
        return false
      }
    }
  },
  // 输入手机号事件
  phoneInput: function (e) {
    /*获取电话输入值*/ 
    //console.log(e.detail.value)
    callNumber = e.detail.value;

    var _self = this
    _self.setData({phone: e.detail.value})
    var isPhone = _self.testPhone(e.detail.value)
    if (isPhone) {
      _self.setData({
        nextBtnDisabled: false,
        nextBtnBc: '#4a4c5b'
      })
    } else {
      _self.setData({
        nextBtnDisabled: true,
        nextBtnBc: '#bcbcbc'
      })
    }
  },
  // 清空手机号
  deletePhone: function () {
    console.log("a")
    this.setData({phone: ''})
  },
  // 登录
  login: function () {
  
      // 调用云函数
      wx.cloud.callFunction({
        name: 'callNumber',
        data: {},
        success: res => {
          console.log('[云函数] [login] user openid: ', res.result.openid)
        },
        fail: err => {
          console.error('[云函数] [login] 调用失败', err)
        }
      }),

      //传送数据到数据库
      db.collection('callNumber').add({
        data: {
          name: "令狐",
          phonenumber: callNumber
        },
        success: function (res) {
          // res.data 是包含以上定义的两条记录的数组
          console.log(res)
        }, fail(res) {
          console.log(res);
        }
      }
      )
    

    

    app.globalData.userInfo = {phone: this.data.phone}
    wx.navigateTo({
      url: '/pages/index/index',
    })
  }

})