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
    let movie_id = ctx.request.body.movie_id

    await DB.query('INSERT INTO mov_collect(user,username, avatar,image, content,cmt, video, title,movie_id) VALUES (?,?, ?, ?, ?, ?, ?,?,?)', [user, username, avatar, image, content, cmt, video, title, movie_id])
  },
  getColls: async ctx => {
    ctx.state.data = await DB.query("select * from mov_collect;")
  },
  getUserComs: async ctx => {
    let moviesId = + ctx.request.query.moviesId
    if (!isNaN(moviesId)) {
      ctx.state.data = await DB.query("select * from mov_comment where movie_id = ?;", [moviesId])
    }else{
      ctx.state.data = []
    }
  },
  getUserReported: async ctx => {
    let openId = ctx.state.$wxInfo.userinfo.openId
    ctx.state.data = await DB.query("select a.title,a.image,b.avatar,b.content,b.movie_id,b.username,b.cmt,b.video from movies a join mov_comment b on a.id=b.movie_id where user = ?;", [openId])
  },
}