// pages/comment/comment.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // userInfo: null,
    comments:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if (!options.view){
      this.getCommentsListItem(options.id)
    }
    if (!!options.view){
      this.getCommentsList(options.id)
    }
  },
  getCommentsList(id){
    qcloud.request({
      url: config.service.getUserComments,
      data: {
        moviesId: id
      },
      success: result => {

        let data = result.data
        let comments = data.data
        if (!data.code && !!data.data) {
          this.setData({
            comments: comments,
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
  getCommentsListItem(id){
    wx.showLoading({
      title: '评论数据加载中...',
    })
    qcloud.request({
      url: config.service.commentsListItem,
      data: {
        comment_id: id
      },
      success: result => {
        wx.hideLoading()
        if (!result.data.code) {
          this.setData({
            comments: result.data.data
          })
        } else {
          wx.showToast({
            title: '评论数据加载失败',
          })
        }
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '评论数据加载失败',
        })
      }
    })
  },
})