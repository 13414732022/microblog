<template>
  <div class="h100p home">
    <el-container class="h100p">
      <el-header class="home-head">
        <el-card class="h100p"></el-card>
      </el-header>
      <el-main class="home-main h100p">
        <el-row class="main-con"
                :gutter="10">
          <el-col :span="16">
            <div class="main-con-left"></div>
          </el-col>
          <el-col :span="8">
            <div class="main-con-right"></div>
          </el-col>
        </el-row>
      </el-main>
    </el-container>
  </div>
</template>

<script>

export default {
  data () {
    return {
    }
  },
  watch: {},
  created () { }
}
</script>
<style lang="less" scoped>
.home {
  background-color: #fff;
  .home-head {
    height: 66px;
    padding: 0;
  }
  .home-main {
    margin-top: 10px;
    padding: 0;
    height: 100%;
    .main-con {
      background: #aaa;
      .main-con-left {
        height: 100px;
        background-color: red;
      }
      .main-con-right {
        height: 100px;
        background-color: green;
      }
    }
  }
}
</style>
