// pages/mv-detail/mv-detail.js
const app = getApp()
const qcloud = require('../../vendor/wafer2-client-sdk/index.js')
const config = require('../../config.js')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mvdetail:{},
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    if(!!options.id){
      // console.log("电影详情页")
      this.getMovieDetails(options.id)

    }else{
      // setTimeout(() => {
      //   wx.navigateBack()
      // }, 2000)
        wx.navigateBack()
    }
  },
  getMovieDetails(id){
    wx.showLoading({
      title: '数据加载中',
    })
    // console.log(config.service.moviesDetail+id)
    qcloud.request({
      url: config.service.moviesDetail + id,
      success: result => {
        wx.hideLoading()

        let data = result.data
        if (!data.code && !!data.data) {
          this.setData({
            mvdetail: data.data,
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
  // 展示影评列表
  displaycom(){
    let mvdeailId = this.data.mvdetail.id
    wx.navigateTo({
      url: `/pages/comment/comment?id=${mvdeailId}`,
      // success: function(res) {},
      // fail: function(res) {},
      // complete: function(res) {},
    })
  },

  // 添加影评
  // cmt:影评类型
  // isSucess:调用成功
  addcom(){
    let commentType =""
    let mvdeailId = this.data.mvdetail.id
    let mvdeailTitle = this.data.mvdetail.title
    let mvdeailImage = this.data.mvdetail.image
    let mvdeailVideo = ""
    wx.showActionSheet({
      itemList: ["文字","音频"],
      success:(res)=>{
        if(!res.cannel){
          if (res.tapIndex==0){
            commentType="wz"
          }else{
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