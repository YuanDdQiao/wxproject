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
      video: decodeURIComponent(options.video),
      cmt: options.cmt
    }
    this.setData({
      comment: comment
    })
    // var uri_dec = decodeURIComponent(uri_enc);
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
    let content = this.data.comment
    // if (!content) return
    // console.log("content.video:=")
    // console.log(content.cmt)
    // console.log(!!content.recomments)
    // this.uploadVideo(video => {
    if (content.cmt === "yp") {
      this.putVideo()
    }else{
      this.postComm()
    }
    // })
  },
  postComm(commvideo){
    let content = this.data.comment
    qcloud.request({
      url: config.service.addComment,
      login: true,
      method: 'POST',
      data: {
        video: decodeURIComponent(commvideo),
        content: content.recomments,
        movie_id: content.id,
        cmt: content.cmt
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
  },
  putVideo(){
    let comment = this.data.comment

    wx.showLoading({
      title: '正在上传录音'
    })
    wx.uploadFile({
      url: config.service.uploadUrl,
      filePath: comment.video,
      name: 'file',

      success: (res) => {
        let response = JSON.parse(res.data);

        if (response.code === 0) {
          // console.log("response:");
          // console.log(response);

          // let albumList = this.data.albumList;
          // albumList.unshift(response.data.imgUrl);

          // this.setData({ albumList });
          // this.renderAlbumList();
          wx.showToast({
            icon: 'none',
            title: '上传成功'
          })
          this.postComm(encodeURIComponent(response.data.imgUrl))
        } else {
          console.log(response);
        }
      },

      fail: (res) => {
        console.log('fail', res);
      },

      complete: () => {
        wx.hideLoading();
      },
    });

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