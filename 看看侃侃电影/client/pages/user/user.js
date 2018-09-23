// pages/user/user.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    liststoremv:[],
    curNav: 0
  },
  // 展示收藏
  clickShowT:function(){
    this.setData({
      curNav: 1
    })
  },
  // 不展示收藏
  clickShowF: function () {
    this.setData({
      curNav: 0
    })
  },
  onPullDownRefresh() {
    this.getCollectList(() => {
      wx.stopPullDownRefresh()
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCollectList()
  },
  topDetail:function(e){

    let getId = e.target.dataset.id
    if (!getId) return
    let getTitle = e.target.dataset.title
    let getImage = e.target.dataset.image

    let comment = this.data.liststoremv[getId - 1]
    let getCommentHead = comment.avatar
    let getCommentName = comment.username
    let getCommentContent = comment.content
    let getCommentOpenId = comment.user
    let getCmt = comment.cmt
    let getVideo = comment.video
    if (getId) {
      wx.navigateTo({
        url: `/pages/top-detail/top-detail?id=${getId}&title=${getTitle}&image=${getImage}&avatar=${getCommentHead}&username=${getCommentName}&content=${getCommentContent}&openId=${getCommentOpenId}&cmt=${getCmt}&video=${getVideo}`,
      })
    } else {
      wx.showToast({
        title: '页面失效',
      })
    }

    // console.log("跳转到影评详情...")
  },

  getCollectList(callback){
    wx.showLoading({
      title: '加载中...',
    })
    // console.log(config.service.moviesDetail+id)
    qcloud.request({
      url: config.service.getCollectList,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            liststoremv: data.data,
          })
        } else {
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.hideLoading()

        setTimeout(() => {
          wx.navigateBack()
        }, 2000)
      },
      complete:()=>{
        callback && callback()
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // 同步授权状态
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },
})