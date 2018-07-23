// pages/detail/detail.js
Page({
  data:{
    id:"",
    newsDetails:[]
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
        console.log(res)
        let resultn=res.data.result;
        let temp =[];
        temp.push({
          resultn
        })
        this.setData({
          newsDetails: temp,
        })
        console.log(this.data.newsDetails)
      },
      complete:()=>{
        callback2 && callback2()
      }
    })
  }
})