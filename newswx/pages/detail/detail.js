// pages/detail/detail.js
Page({
  data:{
    id:"",
    newsDetails:[],
    newsDate:""
  },
  // 每个新闻详情加载以及获取新闻的 id
  onLoad(options){
    // console.log("hellow world...." + options.detailId)
    this.setData({
      id: options.detailId,
    }),
    this.getDetail()
  },
  onPullDownRefresh(){
    this.getDetail(()=>{
      wx.stopPullDownRefresh()
    })
  },
  getDetail(callback2){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/detail',
      data: {
        id: this.data.id
      },
      success: res => {
        let resultn=res.data.result;
        // 时间格式化 年月日时分秒
        let detialDate = new Date(Date.parse(res.data.result.date))
        var hour = detialDate.getHours();
        var minute = detialDate.getMinutes();

        // 临时变量存储返回结果
        let temp =[];
        temp.push({
          resultn
        })
        // 初始化 渲染变量
        this.setData({
          newsDetails: temp,
          newsDate: hour + ":" + minute
        })
      },
      complete:()=>{
        callback2 && callback2()
      }
    })
  }
})