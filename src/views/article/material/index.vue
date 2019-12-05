<template>
  <el-card>
    <div slot="header">
      <span>素材管理</span>
    </div>
    <!-- 头部按钮区域 -->
    <div class="btn-item">
      <div class="left-btn">
        <el-radio-group v-model="btnVal"
                        @change="setbtnVal"
                        id="btn">
          <el-radio-button :label="false">全部</el-radio-button>
          <el-radio-button :label="true">收藏</el-radio-button>
        </el-radio-group>
      </div>
      <div class="right-btn">
        <el-button @click="dialogFormVisible = true">上传图片</el-button>
      </div>
    </div>
    <!-- 素材展示区域 -->
    <div style="margin-top: 20px">
      <el-row :gutter="20">
        <el-col :span="6"
                v-for="(item, index) in imgList"
                :key="index"
                class="my-col"
                style="min-width: 220px;gargin: 20px auto">
          <el-card class="my-card">
            <img :src="item.url"
                 alt="">
            <div>
              <i :class="item.is_collected?'el-icon-star-on': 'el-icon-star-off'"
                 @click="setImgCollect(item.is_collected,item.id)"></i>
              <i class="el-icon-delete"
                 @click="removeImg(item.id)"></i>
            </div>
          </el-card>
        </el-col>
      </el-row>
    </div>
    <el-pagination @current-change="currentChange"
                   background
                   :page-size="4"
                   :current-page="page"
                   layout="total, prev, pager, next, jumper"
                   :total="count">
    </el-pagination>
    <!-- 上传素材区域 -->
    <el-dialog title="上传素材"
               :visible.sync="dialogFormVisible">
      <el-upload class="avatar-uploader"
                 action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                 :headers="headers"
                 name="image"
                 :show-file-list="true"
                 :on-success="handleAvatarSuccess">
        <img v-if="imageUrl"
             :src="imageUrl"
             class="avatar">
        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
      </el-upload>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="dialogFormVisible = false">关 闭</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
let obj = null
try { //
  obj = JSON.parse(window.localStorage.getItem('userInfo'))
} catch (error) {
  obj = null
}
export default {
  data () {
    return {
      imageUrl: '',
      dialogFormVisible: false,
      btnVal: false,
      imgList: [],
      count: 0,
      page: 1,
      headers: { // el头像上传组件需要使用的参数
        Authorization: `Bearer ${obj.token}`
      }
    }
  },
  methods: {
    currentChange (curPage) {
      this.page = curPage
      this.getImgs(this.btnVal)
    },
    setbtnVal (val) { // 点击筛选按钮 收藏或全部 触发
      this.page = 1
      this.getImgs(val)
    },
    handleAvatarSuccess (res, file) { // ele组件上传头像成功回调
      console.log(res)
      this.imageUrl = URL.createObjectURL(file.raw)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    },
    getImgs (collect) { // 获取素材列表
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'get', // 请求方式
        params: {
          per_page: 4,
          page: this.page,
          collect: collect // 是否为收藏 'true'为收藏
        }
      })
        .then(res => {
          console.log(res)
          this.imgList = res.results
          this.count = res.total_count
        })
    },
    setImgCollect (bool, imgId) { // 设置图片是否为收藏
      this.$http({
        url: `/mp/v1_0/user/images/${imgId}`,
        method: 'PUT', // 请求方式
        data: {
          collect: !bool
        } // get请求参数写这
      })
        .then(res => {
          console.log(res)
          this.$message.success(res.collect ? '收藏成功' : '取消收藏成功')
          this.getImgs(this.btnVal)
        })
    },
    removeImg (imgId) { // 删除图片素材
      this.$http({
        url: `/mp/v1_0/user/images/${imgId}`,
        method: 'DELETE', // 请求方式
        data: {}, // post请求参数写这
        params: {} // get请求参数写这
      })
        .then(res => {
          this.$message.success('删除成功')
          this.getImgs(this.btnVal) // 刷新列表
        })
    }
  },
  created () {
    this.getImgs(false)
  },
  watch: {
    dialogFormVisible (newVal) { // 关闭上传图片对话弹窗
      if (newVal === false) {
        this.imageUrl = ''
        this.getImgs(this.btnVal)
      }
    }
  }
}
</script>

<style lang="less" scoped>
.my-card {
  width: 200px;
  height: 210px;
  img {
    width: 100%;
    height: 140px;
  }
  div {
    display: flex;
    justify-content: space-around;
    margin-top: 12px;
    i {
      font-size: 20px;
    }
  }
}
.my-col {
  margin: 20px 0;
}
.btn-item {
  display: flex;
  justify-content: space-between;
  text-align: center;
}
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
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>
