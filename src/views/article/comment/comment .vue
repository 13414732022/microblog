<template>
  <el-card class="box-card">
    <div>
      <el-table :data="commentList"
                style="width: 100%"
                v-loading="loading">
        <el-table-column prop="title"
                         label="标题">
        </el-table-column>
        <el-table-column prop="comment_status"
                         label="评论状态"
                         width="120">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.comment_status"
                    type="success">启用</el-tag>
            <el-tag v-if="!scope.row.comment_status"
                    type="info">禁用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total_comment_count"
                         label="总评论数"
                         width="120">
        </el-table-column>
        <el-table-column prop="fans_comment_count"
                         label="粉丝评论数"
                         width="120">
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text">修改</el-button>
            <el-button type="text"
                       @click="offComment(scope.row)">{{scope.row.comment_status?'关闭评论': '开启评论'}} </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <el-pagination @current-change="currentChange"
                   background
                   :current-page="page"
                   layout="total, prev, pager, next, jumper"
                   :total="count">
    </el-pagination>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      channels: [],
      commentList: [],
      count: 0,
      loading: false,
      page: 1

    }
  },
  methods: {
    offComment (row) {
      let str = row.id.toString()
      console.log(str)
      this.$http({
        url: `/mp/v1_0/comments/status?article_id=${str}`,
        method: 'PUT', // 请求方式
        data: {
          allow_comment: !row.comment_status
        } // post请求参数写这
      })
        .then(res => {
          this.getCommentList()
        })
        .catch(() => { })
    },
    currentChange (val) {
      this.page = val
      this.getCommentList()
    },
    getCommentList () {
      this.loading = true
      this.$http({
        url: '/mp/v1_0/articles',
        method: 'get', // 请求方式
        params: {
          page: this.page,
          response_type: 'comment'
        } // get请求参数写这
      })
        .then(res => {
          console.log(res)
          this.count = res.total_count
          this.commentList = res.results
          this.loading = false
        })
    }
  },
  created () {
    this.getCommentList()
  }
}
</script>

<style lang="less" scoped>
</style>
