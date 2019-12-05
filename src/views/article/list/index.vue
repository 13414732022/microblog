<template>
  <div>
    <el-card class="box-card">
      <el-form :model="form">
        <el-form-item label="文章状态">
          <el-radio-group v-model="form.status" id="btn">
            <el-radio-button :label="undefined">全部</el-radio-button>
            <el-radio-button label="0">草稿</el-radio-button>
            <el-radio-button label="1">待审核</el-radio-button>
            <el-radio-button label="2">审核通过</el-radio-button>
            <el-radio-button label="3">审核失败</el-radio-button>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道选择">
          <!-- <el-select v-model="form.channel_id"
                     clearable
                     placeholder="请选择">
            <el-option v-for="(item, index) in channels"
                       :key="index"
                       :label="item.name"
                       :value="item.id"></el-option>
          </el-select> -->
          <channels-list @setChannel="getVal"></channels-list>
        </el-form-item>

        <el-form-item label="时间选择">
          <el-date-picker v-model="form.date" type="daterange" range-separator="一" value-format="yyyy-MM-dd" start-placeholder="开始日期" end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card class="box-card">
      <div class="title" slot="header">
        <span>共找到{{count}}条符合条件的内容</span>
      </div>
      <el-table :data="dataList" v-loading="loading" stripe border style="width: 100%">
        <el-table-column label="头像" width="100">
          <template slot-scope="scope">
            <img :src="scope.row.cover.images[0]" class="head_pic" />
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题">
        </el-table-column>
        <el-table-column prop="status" label="状态" width="180">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 2">审核通过</span>
            <span v-if="scope.row.status === 0">草稿</span>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="时间" width="180">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="success" @click="upData(scope.row.id)">
              <i class="el-icon-edit"></i>编辑
            </el-button>
            <el-button @click="delArticle(scope.row.id)" :key="scope.row.id[0]">
              <i class="el-icon-delete"></i>删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination @size-change="sizeChange" @current-change="currentChange" background :current-page="form.page" :page-sizes="[10, 20, 30, 40]" :page-size="form.per_page" layout="total, sizes, prev, pager, next, jumper" :total="count">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
// 导入 频道列表下拉框
import channelsList from '@/components/channels'
export default {
  data () {
    return {
      channels: [],
      dataList: [],
      count: 0,
      loading: false,
      form: {
        per_page: 10,
        page: 1,
        status: undefined,
        channel_id: undefined,
        date: []
      }
    }
  },
  methods: {
    upData (id) {
      this.$router.push(`/article/edit/${id}`)
    },
    getVal (val) { // 获取子组件传过来的频道 id
      this.form.channel_id = val
    },
    add () {
      let num = 1
      let timer = setInterval(() => {
        num++
        this.$http({
          url: 'http://ttapi.research.itcast.cn/mp/v1_0/articles?draft=true',
          method: 'POST', // 请求方式
          data: {
            title: '重复草稿消息<' + num + '>,点我删除',
            content: '<p>123123123123</p>',
            imgType: 'single',
            channel_id: 2,
            cover: {
              type: 1,
              images: ['http://toutiao.meiduo.site/FgATv_9kol6oGqguUMWOEmQ8JjXo']
            }
          }
        })
          .then(res => {
            console.log(res)
          })
          .catch(() => { })
        if (num === 2) { // 设置需要重复的次数
          console.log('创建完毕')
          clearInterval(timer)
        }
      }, 100)
    },
    sizeChange (val) {
      console.log(val)
      this.form.per_page = val
    },
    currentChange (val) {
      console.log('change')
      this.form.page = val
    },
    getList () {
      this.loading = true // 进入加载状态
      this.$http.get('/mp/v1_0/articles', {
        params: {
          page: this.form.page,
          per_page: this.form.per_page,
          channel_id: this.form.channel_id || undefined,
          status: this.form.status,
          begin_pubdate: this.form.date ? this.form.date[0] : '',
          end_pubdate: this.form.date ? this.form.date[1] : ''
        }
      })
        .then(res => {
          this.dataList = res.results
          this.count = res.total_count
          this.loading = false // 退出加载状态
        })
        .catch(err => {
          console.log(err)
          this.loading = false // 退出加载状态
        })
    },
    // 删除文章
    delArticle (id) {
      // 点击删除使用element-ui  MessageBox 弹框
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => { // 点击确认执行的代码
        let idStr = id.toString() // 实参id经过 json-bigint 变成数组
        this.$http({
          url: '/mp/v1_0/articles/' + idStr,
          method: 'DELETE' // 请求方式
        })
          .then(res => {
            this.$message({ // // 请求删除成功处理
              message: '删除成功',
              type: 'success'
            })
            this.getList() // 重新获取数据
          })
          .catch(() => { // 请求删除失败处理
            this.$message({
              message: '只能删除自己的发布的文章',
              type: 'error'
            })
          })
      }).catch(() => { // 点击取消执行的代码
        this.$message({
          type: 'info',
          message: '已取消删除'
        })
      })
    }
  },
  watch: {
    'form.status' () {
      this.form.page = 1
      this.getList()
    },
    'form.date' () {
      this.form.page = 1
      this.getList()
    },
    'form.channel_id' (newVal) {
      this.form.page = 1
      this.getList()
    },
    'form.page' () {
      this.getList()
    },
    'form.per_page' () {
      this.getList()
    }
  },
  created () {
    this.getList()
    this.$http.get('/mp/v1_0/channels')
      .then(res => {
        // console.log(res.data.data.channels)
        this.channels = res.channels
      })
      .catch(() => { })
  },
  components: {
    channelsList
  }
}

</script>

<style lang="less" scoped>
.head_pic {
  width: 70px;
  height: 60px;
}
.box-card {
  &:nth-child(1) {
    margin-bottom: 10px;
  }
}
</style>
