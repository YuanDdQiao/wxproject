
Page({
  // wxml 参数
  data:{
    newsItemsMap: [
      {
        title_m: "国内",
        title_id:1,
        title_n:"gn"
      },
      {
        title_m: "国际",
        title_id: 2,
        title_n: "gj"

      },
      {
        title_m: "财经",
        title_id: 3,
        title_n: "cj"

      },
      {
        title_m: "娱乐",
        title_id: 4,
        title_n: "yl"

      },
      {
        title_m: "军事",
        title_id: 5,
        title_n: "js"

      },
      {
        title_m: "体育",
        title_id: 6,
        title_n: "ty"

      },
      {
        title_m: "其他",
        title_id: 7,
        title_n: "other"

      }
    ],
    newsItems: [],
    curNav: 1,
    curIndex: 0,
    xmlType:"gn"
  },
  // 下拉刷新
  onPullDownRefresh() {
    this.getNow(()=>{
      wx.stopPullDownRefresh()
    })
  },
  // 调用api获取数据
  getNow(callback){
    wx.request({
      url: 'https://test-miniprogram.com/api/news/list',
      data: {
        type: this.data.xmlType
      },
      success: res => {
        let result= res.data.result
        let resultLen = res.data.result.length
        let resultTatle = []
        // console.log(res)
        resultTatle.push({
          ishaveContextx: resultLen,
          contextx: result
        })
        this.setData({
          newsItems: resultTatle
        })
      },
      complete:()=>{
        callback && callback()
      }
    })
  },
  // 日期处理
  // getDate(opdate){
  //   opdate
  // }
  // 加载数据
  onLoad(){
    this.getNow()
  },
  //事件处理函数
  switchDownTab: function (e) {
    // 获取item项的id，和数组的下标值  
    let id = e.target.dataset.id,
    index = parseInt(e.target.dataset.index);
    let tn=e.target.dataset.name;
    // 把点击到的某一项，设为当前index  
    this.setData({
      curNav: id,
      curIndex: index,
      xmlType:tn,
    })
    this.getNow()

  }
})
