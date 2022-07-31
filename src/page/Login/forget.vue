<template>
  <div class="login v2">
    <div class="wrapper">
      <div class="dialog dialog-shadow" style="display: block; margin-top: -362px;">
        <div class="registered">
          <h4>修 改 密 码</h4>
          <div class="content" style="margin-top: 20px;">
            <ul class="common-form">
              <li class="username border-1p">
                <div style="margin-top: 40px;" class="input">
                  <input type="text"
                         v-model="forgotten.userName" placeholder="账号"
                         @keyup="forgotten.userName=forgotten.userName.replace(/[^\w\.\/]/ig,'')">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model="forgotten.userPwd"
                         placeholder="密码">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="password"
                         v-model="forgotten.userPwd2"
                         placeholder="重复密码">
                </div>
              </li>
              <li>
                <div class="input">
                  <input type="email"
                         v-model="forgotten.email"
                         placeholder="邮箱">
                </div>
              </li>
              <li>
                <div class="code">
                  <input type="text"
                         v-model="forgotten.code"
                         placeholder="验证码">&nbsp;
                  <div>
                    <el-button :style="isDisabled?'line-height: 2; width:90px; color: #5079d9':'line-height: 2; width:90px'"
                                @click="sendCode(forgotten.userName,forgotten.email)"
                                type="primary" :disabled="isDisabled">{{ codeMsg }}
                    </el-button>
                  </div>
                </div>
              </li>
              <li style="text-align: center;line-height: 48px;margin-bottom: 0;font-size: 12px;color: #999;">
                <span>如果您登录HiShop账号，则可在此</span>
                <a href="javascript:;"
                   style="margin: 0 5px"
                   @click="toLogin">登录</a>
              </li>
            </ul>
            <div style="margin-bottom: 30px;">
              <y-button
                :classStyle="forgotten.userPwd&&forgotten.userPwd2&&
                forgotten.userName&&forgotten.email&&
                forgotten.code&&forgettxt==='修改密码'?'main-btn':'disabled-btn'"
                :text="forgettxt"
                style="margin: 0;width: 100%;height: 48px;font-size: 18px;line-height: 48px"
                @btnClick="_forget"
              >
              </y-button>
            </div>
            <div class="border" style="margin-bottom: 10px;"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script src="../../../static/geetest/gt.js"></script>
<script>
  import { code, forget } from '/api/index.js'
  import YFooter from '/common/footer'
  import YButton from '/components/YButton'
  require('../../../static/geetest/gt.js')
  export default {
    data () {
      return {
        isDisabled: false,
        codeMsg: '获取验证码',
        // 倒计时秒数
        totalTime: 60,
        // timer: null,
        ruleForm: {
          userName: '',
          userPwd: '',
          email: '',
          errMsg: ''
        },
        forgotten: {
          userName: '',
          userPwd: '',
          userPwd2: '',
          email: '',
          code: '',
          errMsg: ''
        },
        agreement: false,
        forgettxt: '修改密码',
        statusKey: ''
      }
    },
    methods: {
      empty () {
        this.forgotten.userName = ''
        this.forgotten.userPwd = ''
        this.forgotten.userPwd2 = ''
        this.forgotten.email = ''
        this.forgotten.code = ''
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
      isEmail (v) {
        let rex = /^[a-z0-9]+([._\\-]*[a-z0-9])*@([a-z0-9]+[-a-z0-9]*[a-z0-9]+.){1,63}[a-z0-9]+$/
        let re = new RegExp(rex)
        if (re.test(v)) {
          return true
        }
        return false
      },
      defaultCode () {
        this.totalTime = 60
        this.isDisabled = false
      },
      timing () {
        this.isDisabled = true
        this.codeMsg = this.totalTime + 's后重新发送'
        let clock = window.setInterval(() => {
          this.totalTime--
          this.codeMsg = this.totalTime + 's后重新发送'
          if (this.totalTime < 0) {
            window.clearInterval(clock)
            this.codeMsg = '重新发送验证码'
            this.defaultCode()
          }
        }, 1000)
      },
      sendCode (username, email) {
        if (!username) {
          this.message('请输入账号！')
          return
        }
        if (!email) {
          this.message('请输入邮箱！')
          return
        }
        if (!this.isEmail(email)) {
          this.message('邮箱格式不正确！')
          return
        }
        code({params: {username, email}}).then(res => {
          if (res.success === true) {
            this.messageSuccess('验证码发送成功。')
            this.timing()
          } else {
            this.message(res.message)
          }
        })
      },
      _forget () {
       // 修改密码
        this.forgettxt = '修改密码中...'
        let userName = this.forgotten.userName
        let userPwd = this.forgotten.userPwd
        let userPwd2 = this.forgotten.userPwd2
        let email = this.forgotten.email
        let code = this.forgotten.code
        if (!userName) {
          this.message('请输入账号！')
          this.forgettxt = '修改密码'
          return false
        }
        if (!userPwd) {
          this.message('请输入密码！')
          this.forgettxt = '修改密码'
          return false
        }
        if (userPwd2 !== userPwd) {
          this.message('两次输入的密码不相同!')
          this.forgettxt = '修改密码'
          return false
        }
        if (!this.isEmail(email)) {
          this.message('邮箱格式不正确')
          this.forgettxt = '修改密码'
          return false
        }
        if (!code) {
          this.message('请输入验证码！')
          this.forgettxt = '修改密码'
          return false
        }
        forget({
          userName,
          userPwd,
          email,
          code
        }).then(res => {
          if (res.success === true) {
            this.messageSuccess('密码修改成功')
            this.toLogin()
          } else {
            this.forgettxt = '修改密码'
            this.message(res.message)
            return false
          }
        })
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

  .login {
    overflow-x: hidden;
    overflow-y: hidden;
    .code {
      height: 50px;
      display: flex;
      align-items: center;
      input {
        font-size: 16px;
        width: 75%;
        height: 100%;
        padding: 10px 15px;
        box-sizing: border-box;
        border: 1px solid #ccc;
        border-radius: 6px;
      }
    }
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
    top: 50%;
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
      font-size: 20px;
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
