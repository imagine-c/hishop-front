# hishop-front
### 基于Vue开发的hishop商城前台页面
<p align="center">
  <a target="_blank" href="https://github.com/imagine-c/hishop">
    <img src="https://img.shields.io/badge/Author-imagine-orange" ></img>
    <img src="https://img.shields.io/badge/License-MIT-green" ></img>
    <img src="https://img.shields.io/badge/Nodejs-8.x-green" ></img>
    <img src="https://img.shields.io/badge/Vue-2.5.16-green" ></img>
    <img src="https://img.shields.io/badge/Vue--router-2.8.1-green" ></img>
    <img src="https://img.shields.io/badge/Vuex-2.5.0-green" ></img>
    <img src="https://img.shields.io/badge/ElementUI-1.4.13-green" ></img>    
    <img src="https://img.shields.io/badge/Axios-0.16.2-green" ></img>     
  </a>
</p>

### 感谢 [Exrick](https://github.com/Exrick) 的开源 [xmall-front](https://github.com/Exrick/xmall-front) 项目提供前端页面及框架支持
### 后端全部重新开发接口，后端接口项目请跳转至  [hishop](https://github.com/imagine-c/hishop) 项目仓库查看
### 项目部署为独立项目，请跳转至 [hishop-docker](https://github.com/imagine-c/hishop-docker) 项目仓库查看
## 项目介绍
**hishop-front购物系统**是基于**Vue** + **ElementUI**开发的**hishop**前台页面，通过调用**hishop后端的接口**，实现前后端分离。

![](https://github.com/imagine-c/hishop/raw/file/image/cart.png#pic_center "购物车")

![](https://github.com/imagine-c/hishop/raw/file/image/user-resgiter.png#pic_center "用户注册")

![](https://github.com/imagine-c/hishop/raw/file/image/search.png#pic_center "ES分词搜索")

![](https://github.com/imagine-c/hishop/raw/file/image/address.png#pic_center "收货地址")

## 相关技术
- [Notejs](https://nodejs.org/)：JavaScript运行环境
- [Vue.js](https://vuejs.org/)：前端框架
- [Vue-router](https://router.vuejs.org/)：路由框架
- [Vuex](https://vuex.vuejs.org/)：全局状态管理框架
- [ElementUI]( https://element.eleme.io)：前端UI框架
- [Axios](https://github.com/axios/axios)：前端HTTP框架
## 本地开发运行
启动后端 hishop 项目后，在 config/index.js 中修改成自己的后端接口地址配置
在项目根文件夹下先后执行命令 npm install 、 npm run dev
商城前台端口默认8888， http://localhost:8888

## 部署
先后执行命令 npm install 、 npm run build 将打包生成的 dist 静态文件放置服务器中，使用Nginx等涉及跨域请配置路由代理 
## 致谢
**hishop-front**参考了很多开源项目的解决方案，感谢大家的分享。

- 感谢 [Exrick](https://github.com/Exrick)的开源项目[xmall-front](https://github.com/Exrick/xmall-front)
## 开源协议
[MIT](https://mit-license.org/)
