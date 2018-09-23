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
})