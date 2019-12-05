<template>
  <div class="h100p">
    <div class="form-warp">
      <el-form :model="form"
               :rules="rules"
               ref="form"
               class="demo-ruleForm">
        <div class="logo">
          <img src="../../assets/img/logo_index.png"
               alt="">
        </div>
        <el-form-item prop="mobile">
          <el-input v-model="form.mobile"></el-input>
        </el-form-item>
        <el-form-item prop="code">
          <el-row>
            <el-col :span="14">
              <el-input v-model="form.code"></el-input>
            </el-col>
            <el-col :span="8"
                    :offset="2">
              <el-button class="w100p"
                         @click="getCode">{{sec==60?'获取验证码': `${sec} 秒`}}</el-button>
            </el-col>
          </el-row>
        </el-form-item>
        <el-form-item prop="ischecked"
                      class="user-agreement">
          <el-checkbox v-model="form.ischecked"></el-checkbox> 我已阅读并同意
          <a href="javescript:void(0)">用户协议</a>与
          <a href="javescript:void(0)">隐私条款</a>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     class="w100p"
                     :loading="false"
                     @click="submitForm">登录</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      sec: 60,
      form: {
        mobile: '13911111111',
        code: '246810',
        ischecked: true
      },
      rules: {
        mobile: [
          { required: true, message: '请输入手机号', trigger: 'blur' },
          { min: 11, max: 11, message: '请输入正确的11位手机号', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '请输入6位验证码', trigger: 'blur' }
        ],
        ischecked: [
          { pattern: /true/, message: '请先确认并阅读用户协议', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    submitForm () {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$http({
            url: '/mp/v1_0/authorizations',
            method: 'post',
            data: {
              mobile: this.form.mobile,
              code: this.form.code
            }
          }).then(res => {
            this.$message({
              message: '登录成功',
              type: 'success',
              duration: 1000
            })
            console.log(res)
            window.localStorage.setItem('userInfo', JSON.stringify(res))
            this.$router.push('/home')
          }).catch(err => {
            console.log(err)
            this.$message({
              message: '账户或密码错误',
              type: 'error'
            })
          })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getCode () {
      this.$refs['form'].validateField('mobile', err => {
        if (err === '') {
          this.sec--
          let timer = setInterval(() => {
            this.sec--
            if (this.sec === 55) {
              clearInterval(timer)
              this.sec = 60
            }
          }, 800)
        }
      })
    }
  }
}
</script>

<style lang="less" scoped>
.w100p {
  width: 100%;
}
.h100p {
  background: url("../../assets/img/login_bg.jpg") no-repeat center / cover;
  display: flex;
  justify-content: center;
  align-items: center;
  .form-warp {
    width: 400px;
    padding: 40px;
    background-color: #eee;
    .logo {
      text-align: center;
      margin-bottom: 20px;
      img {
        width: 80%;
      }
    }
    .user-agreement {
      a {
        color: #0094ff;
      }
    }
  }
}
</style>
