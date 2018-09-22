// pages/add-comment/add-comment.js
const app = getApp()
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userType: "",
    commentValue: '',
    // tempFilePath:"",
    // 两个变量控制页面 完成按钮是否变色可点击
    setRecordSwitch:0,
    setRecordOrAudio:0,//抛出这个控制变量到页面

    addcomments: {},
    //   id: 1,
    //   title: "复仇者联盟3：无限战争",
    //   category: "动作 / 科幻 / 奇幻 / 冒险",
    //   image: "https://movies-1257217617.cos.ap-shanghai.myqcloud.com/p2517753454.jpg",
    //   description: '《复仇者联盟3：无限战争》是漫威电影宇宙10周年的历史性集结，将为影迷们带来史诗版的终极对决。面对灭霸突然发起的闪电袭击，复仇者联盟及其所有超级英雄盟友必须全力以赴，才能阻止他对全宇宙造成毁灭性的打击。',
    //   create_time: "2018-08-26 21:39:25"
    // }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options.cmt :影评类型
    // options.isSucess :调用成功
    // console.log("来自电影详情的id：")
    // console.log(options.id)
    // console.log("来自电影详情的影评类型cmt：")
    // console.log(options.cmt)
    // console.log("来自电影详情的录音video：")
    // console.log(options.video)
    let addcomments = {
      id: options.id,
      title: options.title,
      image: options.image,
      video: options.video
    }
    this.setData({
      userType: options.cmt,
      addcomments: addcomments
    })
  },

  onInput(event) {
    this.setData({
      commentValue: event.detail.value.trim(),
      setRecordOrAudio: 1
    })
    if(!this.data.commentValue){
      this.setData({
      setRecordOrAudio: 0
      })
    }
  },

  finishedHideShow(){
    let eid = this.data.addcomments.id
    let etitle = this.data.addcomments.title
    let eimage = this.data.addcomments.image
    let erecomments = this.data.commentValue
    let commemtType = this.data.userType
    let commemtVideo = this.data.addcomments.video
    // if (commemtType = 'wz' || erecomments != '') {
    wx.navigateTo({
      url: `/pages/view-comment/view-comment?id=${eid}&title=${etitle}&image=${eimage}&erecomments=${erecomments}&cmt=${commemtType}&video=${this.tempFilePath}`,
      })
    // }
  },
  //开始录音的时候
  start: function () {
    const options = {
      duration: 10000,//指定录音的时长，单位 ms
      sampleRate: 16000,//采样率
      numberOfChannels: 1,//录音通道数
      encodeBitRate: 96000,//编码码率
      format: 'mp3',//音频格式，有效值 aac/mp3
      frameSize: 50,//指定帧大小，单位 KB
    }
    //开始录音
    recorderManager.start(options);
    recorderManager.onStart(() => {
      console.log('开始录音')
      this.setData({
        setRecordSwitch: 1,
      })
    });
    //错误回调
    recorderManager.onError((res) => {
      console.log(res);
      wx.showModal({
        title: '提示',
        content: '录音失败',
        showCancel: false
      })
      this.setData({
        setRecordSwitch: 0,
      })
    })
  },
  //停止录音
  stop: function () {
    recorderManager.stop();
    recorderManager.onStop((res) => {
      this.tempFilePath = res.tempFilePath;
      console.log('停止录音', res.tempFilePath)
      const { tempFilePath } = res
    })
    this.setData({
      setRecordOrAudio: this.data.setRecordSwitch,
    })
  },
  //播放声音
  // play: function () {
  //   innerAudioContext.autoplay = true
  //   innerAudioContext.src = this.tempFilePath,
  //     innerAudioContext.onPlay(() => {
  //       console.log('开始播放')
  //     })
  //   innerAudioContext.onError((res) => {
  //     console.log(res.errMsg)
  //     console.log(res.errCode)
  //   })
  // },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // // 同步授权状态
    // app.checkSession({
    //   success: ({ userInfo }) => {
    //     this.setData({
    //       userInfo
    //     })
    //   }
    // })
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