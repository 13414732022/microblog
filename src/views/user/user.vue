<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>用户信息</span>
    </div>
    <el-row :gutter="40">
      <el-col :span="12">
        <el-form :model="user"
                 status-icon
                 label-width="100px"
                 class="demo-ruleForm">

          <el-form-item label="帐号id">
            <el-input type="text"
                      v-model="user.id"
                      autocomplete="off"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号">
            <el-input type="text"
                      v-model="user.mobile"
                      autocomplete="off"
                      disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input type="text"
                      v-model="user.name"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input type="text"
                      v-model="user.intro"
                      autocomplete="off"></el-input>
          </el-form-item>

          <el-form-item label="邮箱">
            <el-input type="text"
                      v-model="user.email"
                      autocomplete="off"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button @click="updateUser">修改</el-button>
          </el-form-item>
        </el-form>

      </el-col>
      <el-col :span="12">
        <div class="avatar-uploader">
          <img v-if="imageUrl"
               :src="imageUrl"
               class="avatar">
          <i v-else
             class="el-icon-plus avatar-uploader-icon"></i>
        </div>
        <el-upload class="avatar-uploader"
                   ref="upload"
                   :on-change="changeFile"
                   action="https://jsonplaceholder.typicode.com/posts/"
                   :show-file-list="false"
                   :auto-upload="false">
          <el-button slot="trigger"
                     size="small"
                     type="primary">选取文件</el-button>
          <el-button style="margin-left: 10px;"
                     size="small"
                     type="success"
                     @click="submitUpload">上传到服务器</el-button>
        </el-upload>
        <div>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      imgFile: null,
      imageUrl: this.$store.state.userInfo.photo,
      user: this.$store.state.userInfo // 通过vuex获取数据
    }
  },
  methods: {
    updateUser () { // 修改用户资料
      this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'PATCH', // 请求方式
        data: {
          name: this.user.name,
          intro: this.user.intro,
          email: this.user.email
        }
      })
        .then(res => {
          this.$store.commit('setUserInfo')
          this.$message.success('编辑成功')
        })
        .catch(err => {
          console.log(err)
          this.$message.error('用户名不能超过7个字符')
        })
    },
    submitImg (file) { // 上传图片file
      let fd = new FormData()
      fd.append('photo', file)
      // console.log(fd.get('photo')) // get : 获取formdata参数
      this.$http({
        url: '/mp/v1_0/user/photo',
        method: 'PATCH', // 请求方式
        headers: {
          'Content-Type': 'multipart/form-data'
        },
        data: fd
      })
        .then(res => {
          this.$message.success('上传成功')
          this.$store.commit('setUserInfo') // 更新vuex中的 userInfo
        })
    },
    submitUpload () { // 提交修改用户头像
      this.submitImg(this.imgFile)
    },
    changeFile (file) { // 图片选择框选择图片时触发
      console.log('图片文件修改', file)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.imgFile = file.raw
    },
    getUserInfo () { // 获取用户信息
      this.$http({
        url: '/mp/v1_0/user/profile',
        method: 'GET'
      })
        .then(res => {
          this.user = res
          this.imageUrl = res.photo
        })
    }
  },
  created () {
    this.getUserInfo()
    this.$store.commit('setUserInfo')
  },
  watch: {

  }
}
</script>

<style lang="less" scoped>
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 184px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  border: 1px dashed #d9d9d9;
  width: 184px;
  height: 178px;
  display: block;
  padding: 10px;
  box-sizing: border-box;
  margin: 10px auto;
}
</style>
