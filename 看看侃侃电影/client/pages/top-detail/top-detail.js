// pages/top-detail/top-detail.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    userInfo: null,
  },
  setCollect(){
    let comment = this.data.comment
    wx.showLoading({
      title: '请等待...'
    })
    qcloud.request({
      url: config.service.setCollect,
      login: true,
      method: 'POST',
      data: {
        title: comment.title,
        image: comment.image,
        // avatar: comment.avatar,
        // username: comment.username,
        cmt: comment.cmt,
        video: comment.video,
        content: comment.content,
        movie_id: comment.id,
      },
      success: result => {
        wx.hideLoading()

        let data = result.data

        if (!data.code) {
          wx.showToast({
            title: '收藏成功'
          })

          // setTimeout(() => {
          //   wx.navigateBack()
          // }, 1500)
          // console.log(data)
        } else {
          wx.showToast({
            icon: 'none',
            title: '收藏失败'
          })
        }
      },
      fail: (error) => {
        wx.hideLoading()
        wx.showToast({
          icon: 'none',
          title: '收藏失败'
        })
      }
    })
  },
  writeComment(){
    let commentType = ""
    let mvdeailId = this.data.comment.id
    let mvdeailTitle = this.data.comment.title
    let mvdeailImage = this.data.comment.image
    let openId = this.data.comment.openId
    let curPageOpenId = this.data.userInfo.openId
    let mvdeailVideo = ""
    if (openId !== curPageOpenId){
      wx.showActionSheet({
        itemList: ["文字", "音频"],
        success: (res) => {
          if (!res.cannel) {
            if (res.tapIndex == 0) {
              commentType = "wz"
            } else {
              commentType = "yp"
            }
            wx.navigateTo({
              url: `/pages/add-comment/add-comment?id=${mvdeailId}&title=${mvdeailTitle}&image=${mvdeailImage}&video=${mvdeailVideo}&cmt=${commentType}`,
            })
          }
        },
        // fail:function(res){},
        // complete:function(res){}
      })
    }else{
      wx.showToast({
        title: '已经评论过了哦!',
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let comment = {
      id: options.id,
      title: options.title,
      image: options.image,
      avatar: options.avatar,
      username: options.username,
      content: options.content,
      openId: options.openId,
      cmt: options.cmt,
      video: options.video
    }

    // console.log("Object.keys(options).length=")
    // console.log(Object.keys(options).length<3)
    // console.log(!comment.content && !comment.video)
    // console.log(!comment.video)
    if (Object.keys(options).length > 3){
      this.setData({
        comment: comment
      })
    }else{
      // console.log(options.id)
      this.getCommDetails(options.id)
    }
  },
  getCommDetails(id){
    wx.showLoading({
      title: '数据加载中',
    })
    // console.log("options.id")
    // console.log(id)

    // console.log(config.service.moviesDetail+id)
    qcloud.request({
      url: config.service.getCommDetails,
      data:{
        comment_id:id
      },
      success: result => {
        wx.hideLoading()
        // console.log("result:")
        // console.log(result)
        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            comment: data.data,
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
      }
    })
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
    this.setData({
      locationAuthType: app.data.locationAuthType
    })
    app.checkSession({
      success: ({ userInfo }) => {
        this.setData({
          userInfo
        })
      }
    })
  },
})