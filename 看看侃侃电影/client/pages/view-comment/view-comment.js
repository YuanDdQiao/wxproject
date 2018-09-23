// client/pages/view-comment/view-comment.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    comment: {},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let comment = {
      id: options.id,
      title: options.title,
      image: options.image,
      recomments: options.erecomments,
      video: options.video,
      cmt: options.cmt
    }
    this.setData({
      comment: comment
    })
  
  // this.postMovieDetailsComment(options.id)
  },
  reEditCom(){
     wx.navigateBack()
  },
  // addComment(event) {
  addComment() {
    // console.log("发布影评：")
    // console.log(this.data.comment.video)
    // console.log("this.data.comment.recomments:")
    // console.log(this.data.comment)
    let content = this.data.comment.recomments
    // if (!content) return
    // console.log(content)
    wx.showLoading({
      title: '正在发表评论'
    })

    // this.uploadVideo(video => {
      qcloud.request({
        url: config.service.addComment,
        login: true,
        method: 'POST',
        data: {
          video: this.data.comment.video,
          content,
          movie_id: this.data.comment.id,
          cmt: this.data.comment.cmt
        },
        success: result => {
          wx.hideLoading()

          let data = result.data

          if (!data.code) {
            wx.showToast({
              title: '发表评论成功'
            })
            wx.navigateTo({
              url: `/pages/comment/comment?id=${this.data.comment.id}&view=${1}`,
            })
          } else {
            wx.showToast({
              icon: 'none',
              title: '发表评论失败'
            })
          }
        },
        fail: (error) => {
          wx.hideLoading()
          console.log("error:")
          console.log(error)

          wx.showToast({
            icon: 'none',
            title: '发表评论失败'
          })
        }
      })
    // })
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