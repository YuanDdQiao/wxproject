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
    viewUserComments: []
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // console.log("评论信息来了：")
    // console.log(options.id)
    // console.log(options.erecomments)
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
  getUserComments(id){
    console.log("id:=")
    console.log(id)
    qcloud.request({
      url: config.service.getUserComments,
      data: {
        moviesId: id
      },
      success: result => {

        let data = result.data
        let viewUserComments = data.data
        if (!data.code && !!data.data) {
          this.setData({
            viewUserComments: viewUserComments,
          })
          console.log("result:=")
          console.log(result)
          wx.navigateTo({
            url: `/pages/comment/comment?comments=${viewUserComments}&view=${1}`,
          })

        } else {
          wx.showToast({
            title: '跳转失败'
          })
          setTimeout(() => {
            wx.navigateBack()
          }, 2000)
        }
      },
      fail: () => {
        wx.showToast({
          title: '页面跳转失败'
        })
      }
    })
  },
  reEditCom(){
     wx.navigateBack()
  },
  // addComment(event) {
  addComment() {
    let content = this.data.comment.recomments
    if (!content) return
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
            console.log("this.data.comment:=")
            console.log(this.data.comment)
            this.getUserComments(this.data.comment.id)
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
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
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