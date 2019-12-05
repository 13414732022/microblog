<template>
  <el-card class="box-card">
    <div slot="header"
         class="clearfix">
      <span>发布文章</span>
    </div>
    <div>
      <el-form ref="form"
               :model="form"
               label-width="80px"
               :rules="rules">
        <el-form-item label="文章标题"
                      prop="title">
          <el-input v-model="form.title"></el-input>
        </el-form-item>
        <el-form-item label="内容"
                      prop="content">
          <quill-editor v-model="form.content"
                        class="cc"
                        ref="myQuillEditor"
                        :options="editorOption">
          </quill-editor>
        </el-form-item>
        <el-form-item label="封面图片">
          <el-radio-group v-model="form.cover.type">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div class="imgSelectBox"
               v-if="form.cover.type > 0">
            <div class="imgItem"
                 v-for="(item, index) in form.cover.type"
                 @click="getImgUrl(index)"
                 :key="index">
              <img v-if="form.cover.images[index]"
                   :src="form.cover.images[index]"
                   style="width:100%;height:100%">
              <img v-else
                   src="@/assets/img/下载.jpg"
                   alt=""
                   style="width:100%;height:100%">
            </div>
          </div>
        </el-form-item>
        <el-form-item label="频道列表"
                      prop="channel_id">
          <!-- 频道下拉菜单 组件 -->
          <channels-list @setChannel="getChannel"
                         :channelId="form.channel_id"></channels-list>
        </el-form-item>
        <el-form-item>
          <el-button type="primary"
                     @click="submitForm('false')">发布文章</el-button>
          <el-button @click="submitForm('true')">存为草稿</el-button>
        </el-form-item>
      </el-form>
    </div>
    <el-dialog title="选中图片"
               class="select"
               :visible.sync="imgVisible">
      <el-tabs type="border-card">
        <el-tab-pane label="用户管理">
          <el-radio-group v-model="btnVal">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <el-row :gutter="20">
            <el-col :span="6"
                    v-for="(item, index) in imgList"
                    :key="index"
                    class="my-col">
              <el-card class="my-card">
                <img :src="item.url"
                     alt=""
                     class="img"
                     @dblclick="setimgUrl"
                     @click="activeUrl = item.url">
                <div class="my-card-icon"
                     v-show="activeUrl == item.url">
                  <i class="el-icon-check"></i>
                </div>
              </el-card>
            </el-col>
          </el-row>
          <el-pagination @current-change="currentChange"
                         background
                         :page-size="per_page"
                         :current-page="page"
                         layout="total, prev, pager, next, jumper"
                         :total="count">
          </el-pagination>
        </el-tab-pane>
        <el-tab-pane label="图片上传">
          <el-upload class="avatar-uploader"
                     action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
                     :headers="headers"
                     name="image"
                     :show-file-list="true"
                     :on-success="handleAvatarSuccess">
            <img v-if="activeUrl"
                 :src="activeUrl"
                 class="avatar">
            <i v-else
               class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <div slot="footer"
           class="dialog-footer">
        <el-button type="primary"
                   @click="imgVisible = false">关 闭</el-button>
        <el-button @click="setimgUrl">确 认</el-button>
      </div>
    </el-dialog>
  </el-card>
</template>

<script>
import channelsList from '@/components/channels'
let obj = null
try { //
  obj = JSON.parse(window.localStorage.getItem('userInfo'))
} catch (error) {
  obj = null
}
export default {
  data () {
    return {
      headers: { // el头像上传组件需要使用的参数
        Authorization: `Bearer ${obj.token}`
      },
      activeUrl: '', // 素材中选中图片的 url
      index: null, // 图片选择框的下标
      btnVal: false, // 图片素材列表是否为收藏
      imgVisible: false, // 控制弹窗
      count: 0, // 图片素材总条数
      page: 1, // 图片素材页码
      per_page: 6, // 图片素材页容量
      imgList: [], // 图片素材列表
      form: { // 文章信息
        title: '',
        content: '',
        // imgType: 'single',
        channel_id: undefined,
        cover: {
          type: 1,
          images: []
        }
      },
      articleID: '', // 编辑文章时使用: 文章id
      editorOption: { // 富文本编辑器的一些选项
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'], // toggled buttons
            ['blockquote', 'code-block'],
            [{ 'list': 'ordered' }, { 'list': 'bullet' }]
          ]
        }
      },
      rules: { // el表单验证规则
        title: [
          { required: true, message: '请输入文章标题', trigger: 'blur' },
          { min: 5, message: '不能小于5个字符', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '请输入文章内容', trigger: 'blur' },
          { min: 12, message: '不能小于5个字符', trigger: 'blur' }
        ],
        channel_id: [
          { required: true, message: '请选择文章频道', trigger: 'change' }
        ]
      }
    }
  },
  components: { // 注册子组件: 文章频道下拉菜单
    channelsList
  },
  methods: {
    getChannel (val) { // 频道下拉列表子组件传值
      this.form.channel_id = val
    },
    submitForm (bool) { // 表单提交触发 传入发布状态: false=发布 true=草稿
      this.$refs['form'].validate((valid) => { // 表单验证
        if (valid) { // 验证通过执行下面的的代码
          let urlStr = ''
          let methodStr = ''
          if (this.$route.path.indexOf('edit') !== -1) {
            // 根据路由设置请求参数
            // 编辑文章请求
            urlStr = `/mp/v1_0/articles/${this.$route.params.id}?draft=${bool}`
            methodStr = 'PUT'
          } else {
            // 发表文章请求参数
            urlStr = `/mp/v1_0/articles?draft=${bool}` // true 就存入草稿
            methodStr = 'POST'
          }
          if (this.form.cover.images.length < this.form.cover.type) {

          }
          if (this.form.cover.type <= 0) {
            this.form.cover.images = []
          } else if (this.form.cover.images.length < this.form.cover.type) {
            this.$message.error('缺少图片,请选择图片')
          }
          if (this.form.cover.type === 1) {
            this.form.cover.images = [this.form.cover.images[0]]
          }
          this.$http({
            url: urlStr, // 请求路径: 对象赋值语法简写
            method: methodStr, // 请求方式
            data: this.form
          }).then(res => {
            if (this.$route.path.indexOf('edit') !== -1) {
              this.$message.success('编辑成功')
            } else {
              this.$message.success('发布成功')
            }
            this.$router.push('/article/list')
          })
        }
      })
    },
    getImgList (collect) { // 获取素材列表
      this.$http({
        url: '/mp/v1_0/user/images',
        method: 'GET', // 请求方式
        params: {
          collect: collect,
          page: this.page,
          per_page: this.per_page
        } // get请求参数写这
      })
        .then(res => {
          console.log(res)
          this.imgList = res.results
          this.count = res.total_count
        })
        .catch(() => { })
    },
    currentChange (page) { // 图片素材列表 的页码改变时触发
      this.page = page
      this.getImgList(this.btnVal)
    },
    setimgUrl () {
      this.imgVisible = false
      if (this.activeUrl === '') {
        return
      }
      this.form.cover.images[this.index] = this.activeUrl
      this.activeUrl = ''
    },
    getImgUrl (index) { // 点击图片选择框时 显示素材列表, 将id 保存
      this.imgVisible = true
      this.index = index
    },
    handleAvatarSuccess (res, file) { // ele组件上传头像成功回调
      console.log(res)
      this.activeUrl = URL.createObjectURL(file.raw)
      this.form.cover.images[this.index] = URL.createObjectURL(file.raw)
      this.$message({
        message: '上传成功',
        type: 'success'
      })
    }
  },
  created () {
    if (this.$route.path.indexOf('edit') !== -1) {
      this.articleID = this.$route.params.id
      this.$http({
        url: `/mp/v1_0/articles/${this.$route.params.id}`,
        method: 'get' // 请求方式
      })
        .then(res => {
          this.form.title = res.title
          this.form.content = res.content
          this.form.channel_id = res.channel_id
          this.form.cover = res.cover
        })
    }
    this.getImgList(false) // 获取图片素材列表
  },
  watch: {
    imgVisible (newv) { // 显示素材列表对话框 时 清除 之前选择的图片
      if (newv === true) {
        this.activeUrl = ''
      }
    },
    btnVal (newv) { // 点击 全部 或 收藏 时重新 获取素材列表
      this.page = 1
      this.getImgList(newv)
    },
    '$route.path' (newVal) { // 跳转路由为 发表文章 时, 重置 表单数据
      if (newVal.indexOf('publish') > 0) {
        this.form = {
          title: '',
          content: '',
          imgType: 'single',
          channel_id: undefined,
          cover: {
            type: 1,
            images: ['http://toutiao.meiduo.site/FgATv_9kol6oGqguUMWOEmQ8JjXo']
          }
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.imgSelectBox {
  display: flex;
  .imgItem {
    margin: 10px;
    padding: 10px;
    width: 200px;
    height: 200px;
    border: 1px dashed rgb(200, 219, 132);
    text-align: center;
  }
}
.my-card {
  width: 120px;
  height: 120px;
  position: relative;
  .img {
    display: block;
    width: 100%;
    height: 80px;
  }
  .my-card-icon {
    font-size: 20px;
    color: rgb(124, 230, 103);
  }
}
.my-col {
  margin: 20px;
  min-width: 120px;
  height: 120px;
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
.select {
  -webkit-user-select: none;
  -moz-user-select: none;
  -o-user-select: none;
  user-select: none;
}
</style>
