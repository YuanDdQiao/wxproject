// pages/user/user.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: null,
    locationAuthType: app.data.locationAuthType,
    getComment:{},
    gethotmovie:{}
    // gethotmovie: {
    //   id: 1,
    //   title: "复仇者联盟3：无限战争",
    //   category: "动作 / 科幻 / 奇幻 / 冒险",
    //   image: "https://movies-1257217617.cos.ap-shanghai.myqcloud.com/p2517753454.jpg",
    //   description: '《复仇者联盟3：无限战争》是漫威电影宇宙10周年的历史性集结，将为影迷们带来史诗版的终极对决。面对灭霸突然发起的闪电袭击，复仇者联盟及其所有超级英雄盟友必须全力以赴，才能阻止他对全宇宙造成毁灭性的打击。',
    //   create_time: "2018-08-26 21:39:25"
    // }
  },
  onPullDownRefresh(){
    this.getMovieLists(()=>{
      wx.stopPullDownRefresh()
    })
  },
  homeHot() {
    // url = "/pages/hot/hot" 
    wx.navigateTo({
      url: '/pages/hot/hot',
    })
  },
  homeUser() {
    // url = "/pages/user/user" 
    wx.navigateTo({
      url: '/pages/user/user',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let getCurrUserInfo = this.data.userInfo
    if (!!!getCurrUserInfo) {
      this.getMovieLists()
    }
  },
  topDetail(){
    // url = "/pages/top-detail/top-detail"
    let getMovieId = this.data.gethotmovie.id
    let getMovieTitle = this.data.gethotmovie.title
    let getMovieImage = this.data.gethotmovie.image

    let getListComm = this.data.getComment
    let getCommentHead = getListComm.avatar
    let getCommentName = getListComm.username
    let getCommentContent = getListComm.content
    let getCommentOpenId = this.data.userInfo.openId
    let getCmt = getListComm.cmt
    let getVideo = getListComm.video
    if (!!getListComm){
      if (getMovieId) {
        wx.navigateTo({
          url: `/pages/top-detail/top-detail?id=${getMovieId}&title=${getMovieTitle}&image=${getMovieImage}&avatar=${getCommentHead}&username=${getCommentName}&content=${getCommentContent}&openId=${getCommentOpenId}&cmt=${getCmt}&video=${getVideo}`,
        })

      } else {
        wx.showToast({
          title: '页面失效',
        })
      }
    }else{
      console.log(getListComm)
    }
  },
  hometap(){
    let getMovieId= this.data.gethotmovie.id
    let getMovieTitle = this.data.gethotmovie.title
    let getMovieCategory = this.data.gethotmovie.category
    let getMovieImage = this.data.gethotmovie.image
    let getMovieDescription = this.data.gethotmovie.description
    wx.navigateTo({
      url: `/pages/mv-detail/mv-detail?id=${getMovieId}&title=${getMovieTitle}&category=${getMovieCategory}&image=${getMovieImage}&description=${getMovieDescription}`,
    })
  },
  getComment(id){
    qcloud.request({
      url: config.service.getComment,
      data: {
        comment_id: id
      },
      success: result2 => {
        if (!result2.data.code) {
          this.setData({
            getComment: result2.data.data
          })
        }
      },
      fail: result2 => {
        wx.showToast({
          title: '评论数据加载失败',
        })
      }
    })
  },
  getMovieLists(callback){
    wx.showLoading({
      title: '数据加载中',
    })
    qcloud.request({
      url: config.service.hotMovies,
      success:result=>{
        wx.hideLoading()
        if (!result.data.code && !!result.data.data){
          this.setData({
            gethotmovie: result.data.data[0]
          })
          this.getComment(result.data.data[0].id)

        }else{
          wx.showToast({
            title: '热门电影加载失败',
          })
        }
        // console.log("首页数据：")
        // console.log(result.data.data[0].id)
      },
      fail: result => {
        wx.hideLoading()
        wx.showToast({
          title: '数据加载失败',
        })
        console.log(result)
      },
      complete: () => {
        callback && callback()
      }
    })
  },
  onTapLogin: function () {
    app.login({
      success: ({ userInfo }) => {
        this.setData({
          userInfo,
          locationAuthType: app.data.locationAuthType
        })
      },
      error: () => {
        this.setData({
          locationAuthType: app.data.locationAuthType
        })
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

  // /**
  //  * 页面相关事件处理函数--监听用户下拉动作
  //  */
  // onPullDownRefresh: function () {

  // },

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