<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="registerActive">
        <el-steps :space="200" :active="userStatus" align-center finish-status="success">
          <el-step title="用户注册"></el-step>
          <el-step title="邮箱激活"></el-step>
          <el-step title="注册成功"></el-step>
        </el-steps>
      </div>
      <div class="dialog dialog-shadow" style="display: block; margin-top: -400px;">
        <div class="registered">
          <h4>注册 HiShop 账号</h4>
          <div class="content" style="margin-top: 20px;">
            <ul class="common-form">
              <li class="username border-1p">
                <div style="margin-top: 40px;" class="input">
                  <input type="text"
                         v-model="registered.userName" placeholder="用户名"
                         @keyup="registered.userName=registered.userName.replace(/[^\w\.\/]/ig,'')">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model="registered.userPwd"
                         placeholder="密码">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model="registered.userPwd2"
                         placeholder="重复密码">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="email"
                         v-model="registered.email"
                         placeholder="邮箱">
                </div>
              </li>
              <li>
                <div id="captcha">
                  <p id="wait">正在加载验证码...</p>
                </div>
              </li>
            </ul>
            <el-checkbox class="agree" v-model="agreement">
              我已阅读并同意遵守
              <a @click="open('法律声明','此仅为个人练习开源模仿项目，仅供学习参考，承担不起任何法律问题')">法律声明</a> 和
              <a @click="open('隐私条款','本网站将不会严格遵守有关法律法规和本隐私政策所载明的内容收集、使用您的信息')">隐私条款</a>
            </el-checkbox>
            <div style="margin-bottom: 30px;">
              <y-button
                :classStyle="registered.email&&registered.userPwd&&registered.userPwd2&&registered.userName&&registxt==='注册'?'main-btn':'disabled-btn'"
                :text="registxt"
                style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
                @btnClick="regist"
              >
              </y-button>
            </div>
            <div class="border" style="margin-bottom: 10px;"></div>
            <ul class="common-form pr">
              <!-- <li class="pa" style="left: 0;top: 0;margin: 0;color: #d44d44">{{registered.errMsg}}</li> -->
              <li style="text-align: center;line-height: 48px;margin-bottom: 0;font-size: 12px;color: #999;">
                <span>如果您已拥有 HiShop 账号，则可在此</span>
                <a href="javascript:;"
                   style="margin: 0 5px"
                   @click="toLogin">登录</a>
                <span>或</span>
                <a href="javascript:;"
                   style="margin: 0 5px"
                   @click="toHome">去购物</a>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="../../../static/geetest/gt.js"></script>
<script>
import YFooter from '/common/footer'
import YButton from '/components/YButton'
import { register, geetest } from '/api/index.js'
require('../../../static/geetest/gt.js')
var captcha
export default {
  data () {
    return {
      cart: [],
      loginPage: true,
      userStatus: 0,
      ruleForm: {
        userName: '',
        userPwd: '',
        errMsg: ''
      },
      registered: {
        userName: '',
        userPwd: '',
        userPwd2: '',
        email: '',
        errMsg: ''
      },
      agreement: false,
      registxt: '注册',
      statusKey: ''
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
    empty () {
      this.registered.userName = ''
      this.registered.userPwd = ''
      this.registered.userPwd2 = ''
      this.registered.email = ''
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
    regist () {
      this.registxt = '注册中...'
      let userName = this.registered.userName
      let userPwd = this.registered.userPwd
      let userPwd2 = this.registered.userPwd2
      let email = this.registered.email
      if (!userName || !userPwd || !userPwd2 || !email) {
        this.message('用户名、密码、邮箱不能为空!')
        this.registxt = '注册'
        return false
      }
      if (userPwd2 !== userPwd) {
        this.message('两次输入的密码不相同!')
        this.registxt = '注册'
        return false
      }
      if (!this.isEmail(email)) {
        this.message('邮箱格式不正确')
        this.registxt = '注册'
        return false
      }
      if (!this.agreement) {
        this.message('您未勾选同意我们的相关注册协议!')
        this.registxt = '注册'
        return false
      }
      let result = captcha.getValidate()
      if (!result) {
        this.message('请完成验证')
        this.registxt = '注册'
        return false
      }
      register({
        userName,
        userPwd,
        email,
        challenge: result.geetest_challenge,
        validate: result.geetest_validate,
        seccode: result.geetest_seccode,
        statusKey: this.statusKey }).then(res => {
          if (res.success === true) {
            this.messageSuccess('邮件已发送，请去邮箱激活')
            this.empty()
            this.registxt = '注册'
            captcha.reset()
            this.userStatus = 1
            // this.toLogin()
          } else {
            this.registxt = '注册'
            this.message(res.message)
            captcha.reset()
            return false
          }
        })
    },
    isEmail (v) {
      let rex = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
      let re = new RegExp(rex)
      if (re.test(v)) {
        return true
      }
      return false
    },
    init_geetest () {
      geetest().then(res => {
        this.statusKey = res.statusKey
        window.initGeetest({
          gt: res.gt,
          challenge: res.challenge,
          new_captcha: res.new_captcha,
          offline: !res.success,
          product: 'popup',
          width: '100%'
        }, function (captchaObj) {
          captcha = captchaObj
          captchaObj.appendTo('#captcha')
          captchaObj.onReady(function () {
            document.getElementById('wait').style.display = 'none'
          })
        })
      })
    }
  },
  mounted () {
    this.init_geetest()
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
.registerActive{
  margin-left: 36%;
  position: absolute;
  top: 5%;
}
.registerActiveSuc{
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
