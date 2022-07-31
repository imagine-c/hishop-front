<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="Active">
        <el-steps :space="200" :active="userStatus" align-center finish-status="success">
          <el-step title="用户注册"></el-step>
          <el-step title="邮箱激活"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
      </div>
      <div class="dialog dialog-shadow" style="display: block; margin-top: -199px; position: fixed" v-if="this.userStatus===2">
        <div class="content" style="margin-top: 188px;">
          <div style="font-size: 18px; text-align: center; line-height: 38px; position:relative; bottom:138px;" v-if="activeStatus==0">
            您好，<br/>
            感谢您使用HiShop商城。<br/>
            <div style="color: #ff0000">
              操作错误
            </div>
            <div style="position:relative; top:49px;">
              <el-button type="primary" @click="toLogin">去 购 物</el-button>
              <el-button type="primary" @click="toLogin">立即登录</el-button>
            </div>
          </div>
          <div style="font-size: 18px; text-align: center; line-height: 38px; position:relative; bottom:138px;" v-if="activeStatus==1">
            您好，<br/>
            感谢您使用HiShop商城。<br/>
            <div style="color: #ff0000">
              邮箱已经激活，请不要重复操作
            </div>
            <div style="position:relative; top:49px;">
              <el-button type="primary" @click="toLogin">去 购 物</el-button>
              <el-button type="primary" @click="toLogin">立即登录</el-button>
            </div>
          </div>
          <div style="font-size: 18px; text-align: center; line-height: 38px; position:relative; bottom:138px;" v-if="activeStatus==2">
            您好，<br/>
            感谢您使用HiShop商城。<br/>
            <div style="color: #ff0000">
              用户激活已经超过24小时，请重新注册
            </div>
            <div style="position:relative; top:49px;">
              <el-button type="primary" @click="toLogin">去购物</el-button>
              <el-button type="primary" @click="toRegister">去注册</el-button>
            </div>
          </div>
          <div style="font-size: 18px; text-align: center; line-height: 38px; position:relative; bottom:138px;" v-if="activeStatus==3">
            您好，<br/>
            感谢您使用HiShop商城。<br/>
            <div style="color: #ff0000">
              激活出现错误
            </div>
          </div>
        </div>
      </div>
      <div class="dialog dialog-shadow" style="display: block; margin-top: -199px; position: fixed" v-if="this.userStatus===3">
        <div class="content" style="margin-top: 188px; ">
          <div style="font-size: 18px; text-align: center; line-height: 38px; position:relative; bottom:138px;">
            您好，<br/>
            感谢您使用HiShop商城。<br/>
            用户注册成功，点击下方按钮登录
            <div style="position:relative; top:49px;">
              <el-button type="primary" @click="toLogin">去 购 物</el-button>
              <el-button type="primary" @click="toLogin">立即登录</el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="../../../static/geetest/gt.js"></script>
<script>
  import { active } from '/api/index.js'
  import YFooter from '/common/footer'
  import YButton from '/components/YButton'
  require('../../../static/geetest/gt.js')
  export default {
    data () {
      return {
        cart: [],
        loginPage: true,
        userStatus: 3,
        activeStatus: 0,
        agreement: false
      }
    },
    computed: {
      count () {
        return this.$store.state.login
      }
    },
    methods: {
      open (t, m) {
        this.$notify.info({
          title: t,
          message: m
        })
      },
      messageSuccess (m) {
        this.$message({
          message: m,
          type: 'success'
        })
      },
      message (m) {
        this.$message.error({
          message: m
        })
      },
      emailActive (name) {
        active({params: {name}}).then(res => {
          if (res.result.state === 3) {
            this.messageSuccess('激活成功')
            this.userStatus = 3
          }
          if (res.result.state === 2) {
            // 激活失败
            this.userStatus = 2
          }
          if (res.result.state === 1) {
            // 已经激活
            this.activeStatus = 1
            this.userStatus = 2
          }
          if (res.result.state === 0) {
            // 激活超时
            this.activeStatus = 2
            this.userStatus = 2
          }
        })
      },
      toLogin () {
        this.$router.push({
          path: '/login'
        })
      },
      toHome () {
        this.$router.push({
          path: '/home'
        })
      },
      toRegister () {
        this.$router.push({
          path: '/register'
        })
      }
    },

    created () {
      let name = this.$route.query.idName
      if (name === undefined) {
        this.userStatus = 2
        this.activeStatus = 0
      } else {
        this.emailActive(name)
      }
    },
    components: {
      YFooter,
      YButton
    }
  }
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
  * {
    box-sizing: content-box;
  }
  .Active{
    margin-left: 36%;
    position: fixed;
    top: 25%;
  }
  .loginDiv{
    margin-left: 540px;
    position: fixed;
    top: 30%;
  }
  .login {
    overflow-x: hidden;
    overflow-y: hidden;
    .input {
      height: 50px;
      display: flex;
      align-items: center;
      input {
        font-size: 16px;
        width: 100%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    }
    .wrapper {
      background: url(/static/images/bg_9b9dcb65ff.png) repeat;
      background-size: 100px;
      min-height: 800px;
      min-width: 630px;
    }
  }

  .v2 .dialog {
    width: 450px;
    border: 1px solid #dadada;
    border-radius: 10px;
    top: 65%;
    left: 50%;
    margin-left: -225px;
    position: absolute;
    .title {
      background: linear-gradient(#fff, #f5f5f5);
      height: auto;
      overflow: visible;
      box-shadow: 0 1px 4px rgba(0, 0, 0, 0.08);
      position: relative;
      background-image: url(/static/images/smartisan_4ada7fecea.png);
      background-size: 140px;
      background-position: top center;
      background-repeat: no-repeat;
      height: 92px;
      margin: 23px 0 50px;
      padding: 75px 0 0;
      box-shadow: none;
      h4 {
        padding: 0;
        text-align: center;
        color: #666;
        border-bottom: 1px solid #dcdcdc;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        font-weight: 700;
        position: absolute;
        bottom: 0;
        width: 100%;
        text-align: center;
        margin: 0;
        padding: 0;
        border-bottom: 0;
        -webkit-box-shadow: none;
        -moz-box-shadow: none;
        box-shadow: none;
        line-height: 1em;
        height: auto;
        color: #333;
        font-weight: 400;
      }
    }
    .content {
      padding: 0 40px 22px;
      height: auto;
      .common-form {
        li {
          clear: both;
          margin-bottom: 15px;
          position: relative;
        }
      }
    }
  }

  .dialog-shadow,
  .v2 .bbs .dialog-shadow,
  .v2 .dialog-shadow {
    -webkit-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
    -moz-box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
    box-shadow: 0 9px 30px -6px rgba(0, 0, 0, 0.2),
    0 18px 20px -10px rgba(0, 0, 0, 0.04), 0 18px 20px -10px rgba(0, 0, 0, 0.04),
    0 10px 20px -10px rgba(0, 0, 0, 0.04);
  }

  @media screen and (min-width: 737px),
  screen and (-webkit-max-device-pixel-ratio: 1.9) and (max-width: 736px) and (min-device-width: 737px) {
    .wrapper {
      background: url(/static/images/con-bg_04f25dbf8e.jpg) repeat-x;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;
    }
    .dialog {
      background: url(/static/images/dialog-gray-bg.png) #fff bottom repeat-x;
      border-radius: 12px;
      display: none;
      margin: -163px 0 0 -218px;
      width: 436px;
      position: fixed;
      left: 50%;
      top: 50%;
    }
    .dialog .title h4 {
      border-bottom: #d1d1d1 solid 1px;
      box-shadow: 0 2px 6px #d1d1d1;
      color: #666;
      font-size: 20px;
      height: 61px;
      line-height: 61px;
      padding: 0 0 0 35px;
    }
    .common-form li {
      clear: both;
      margin-bottom: 15px;
      position: relative;
    }
    .auto-login {
      position: absolute;
      top: 0px;
      left: 2px;
      color: #999;
    }
    .register {
      padding: 1px 10px 0;
      border-right: 1px solid #ccc;
    }
    .border {
      margin-top: 10px;
      border-bottom: 1px solid #ccc;
    }
    .other {
      margin: 20px 5px 0 0;
      width: auto;
      color: #bbb;
      font-size: 12px;
      cursor: default;
      color: #999;
    }
    .footer {
      display: flex;
      flex-direction: row;
    }
    .agree {
      margin-bottom: 30px;
      color: #999;
    }
  }
  .registered {
    h4 {
      padding: 0;
      text-align: center;
      color: #666;
      border-bottom: 1px solid #dcdcdc;
      -webkit-box-shadow: none;
      -moz-box-shadow: none;
      box-shadow: none;
      font-weight: 700;
      font-size: 18px;
      height: 60px;
      line-height: 60px;
    }
  }

  #wait {
    text-align: left;
    color: #999;
    margin: 0;
  }
</style>
