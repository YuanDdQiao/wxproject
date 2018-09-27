// pages/top-detail/top-detail.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
const innerAudioContext = wx.createInnerAudioContext()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    comment: {},
    userInfo: null,
    checkEx:-1,
    checkOk:0,
  },
  // 播放声音
  replay: function () {
    innerAudioContext.autoplay = true
    innerAudioContext.src = this.data.comment.video,
      innerAudioContext.onPlay(() => {
        console.log('开始播放')
      })
    innerAudioContext.onError((res) => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
  },

  cancCollect(){
    let comment = this.data.comment
    wx.showLoading({
      title: '正在取消收藏...'
    })
    qcloud.request({
      url: config.service.cancCollect,
      data: {
        moviesId: comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          // console.log
          wx.showToast({
            icon: 'none',
            title: '取消成功'
          })
          this.setData({
            checkEx: -1,
            checkOk: 0,
          })
        } else {
          wx.showToast({
            icon: 'none',
            title: '取消失败'
          })
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '取消失败'
        })
      }
    })
  },
  noCollect(){
    let comment = this.data.comment
    let checkEx = this.data.checkEx
    // console.log("......2.....")
    // console.log(checkEx)
    // console.log(!(checkEx === -1))
    if (!(checkEx === -1) && !checkEx) {
      // 显示成取消收藏,并且做收藏处理
      // console.log("......3.....")
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
      this.setData({
        checkOk: 1,
      })

    } else {
      // 显示成收藏,
      this.setData({
        checkOk: 1,
      })
      // console.log("页面设置为取消操作")
    }
  },
  setCollect(){
    let comment = this.data.comment
    wx.showLoading({
      title: '请等待...'
    })
    qcloud.request({
      url: config.service.noCollect,
      data: {
        moviesId: comment.id
      },
      success: result => {
        wx.hideLoading()
        let data = result.data
        if (!data.code) {
          this.setData({
            checkEx: data.data,
          })
          // console.log(data.data)
          this.noCollect()
        } else {
          wx.showToast({
            icon: 'none',
            title: '数据获取失败'
          })
          // console.log("......1..err.....")
        }
      },
      fail: () => {
        wx.hideLoading()

        wx.showToast({
          icon: 'none',
          title: '数据获取失败'
        })
      }
    })
  },
  writeComment(){
    let commentType = ""
    let comment = this.data.comment
    let mvdeailId = comment.id
    let mvdeailTitle = comment.title
    let mvdeailImage = comment.image
    let openId = comment.openId
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
      // url = "/pages/top-detail/top-detail"
      // 获取静态的电影基本信息
      // let getMovieId = comment.id
      // let getMovieTitle = comment.title
      // let getMovieImage = comment.image

      // 因为当前用户没有对这个电影做评论 ，需求要求跳转到自己的 电影评论详情 页面
      /**
       * 设置已评价页面展示
       */

    //   wx.showLoading({
    //     title: '666666数据加载中',
    //   })
    //   console.log("666666数据加载中")
    //   qcloud.request({
    //     url: config.service.getCommDetails,
    //     data: {
    //       comment_id: getMovieId
    //     },
    //     success: result => {
    //       let data = result.data
    //       if (!data.code) {
    //         // 数据获取成功，马上跳转
    //         let getListComm = data.data
    //         let getCommentHead = getListComm.avatar
    //         let getCommentName = getListComm.username
    //         let getCommentContent = getListComm.content
    //         let getCommentOpenId = getListComm.user
    //         let getCmt = getListComm.cmt
    //         let getVideo = encodeURIComponent(getListComm.video)
    //         wx.navigateTo({
    //           url: `/pages/top-detail/top-detail?id=${getMovieId}&title=${getMovieTitle}&image=${getMovieImage}&avatar=${getCommentHead}&username=${getCommentName}&content=${getCommentContent}&openId=${getCommentOpenId}&cmt=${getCmt}&video=${getVideo}`,
    //         })

    //       } else {
    //         wx.showToast({
    //           icon: 'none',
    //           title: '数据获取失败'
    //         })
    //       }
    //       wx.hideLoading()

    //     },
    //     fail: () => {
    //       wx.hideLoading()

    //       wx.showToast({
    //         icon: 'none',
    //         title: '数据获取失败'
    //       })
    //     }
    //   })
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
      video: decodeURIComponent(options.video),
    }
    this.setData({
      checkEx: -1,
      checkOk: 0,
    })

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