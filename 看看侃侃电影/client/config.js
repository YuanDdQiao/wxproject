/**
 * 小程序配置文件
 */

// 此处主机域名修改成腾讯云解决方案分配的域名
var host = 'https://xko0lahr.qcloud.la/';

var config = {

    // 下面的地址配合云端 Demo 工作
    service: {
        host,

        // 登录地址，用于建立会话
        loginUrl: `${host}/weapp/login`,

        // 测试的请求地址，用于测试会话
        requestUrl: `${host}/weapp/user`,

        // 当前热门电影接口
        // getCurrtHot:`${host}/weapp/getcurrt`

        // 拉取用户信息
        user: `${host}/weapp/user`,
    }
};

module.exports = config;
