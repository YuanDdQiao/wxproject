const DB = require('../utils/db.js')
module.exports={
  /**
   * 提交电影评论
   * 
   */
  addComment: async ctx => {
    let user = ctx.state.$wxInfo.userinfo.openId
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl

    let moviestId = +ctx.request.body.movie_id
    let content = ctx.request.body.content || null
    let cmt = ctx.request.body.cmt

    let videofile = ctx.request.body.video || null
    
    if (!isNaN(moviestId)) {
      
      await DB.query('INSERT INTO mov_comment(user, username, avatar, content, video, movie_id,cmt) VALUES (?, ?, ?, ?, ?, ?,?)', [user, username, avatar, content, videofile, moviestId, cmt])
    }else{
      ctx.state.data = {}
    }

  },
  addCollect: async ctx => {
    let username = ctx.state.$wxInfo.userinfo.nickName
    let avatar = ctx.state.$wxInfo.userinfo.avatarUrl
    let user = ctx.state.$wxInfo.userinfo.openId

    let image = ctx.request.body.image
    let content = ctx.request.body.content || null
    let cmt = ctx.request.body.cmt
    let video = ctx.request.body.video || null
    let title = ctx.request.body.title

    await DB.query('INSERT INTO mov_collect(user,username, avatar,image, content,cmt, video, title) VALUES (?,?, ?, ?, ?, ?, ?,?)', [user,username, avatar, image, content, cmt, video, title])
  },
  getColls: async ctx => {
    ctx.state.data = await DB.query("select * from mov_collect;")
  },
  getUserComs: async ctx => {
    let moviesId = + ctx.request.query.moviesId
    if (!isNaN(moviesId)) {
      ctx.state.data = await DB.query("select * from mov_comment where movies_id = ?;", [moviesId])
    }else{
      ctx.state.data = []
    }
  },
}