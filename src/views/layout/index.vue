<template>

  <el-container calss="">
    <el-aside class="my-aside"
              :width="$store.state.isCollapse?'60px':'200px'">
      <layoutaside></layoutaside>
    </el-aside>
    <el-main class='my-main'>
      <el-container class="my-main-con">
        <el-header class="my-head">
          <layoutheader></layoutheader>
        </el-header>
        <el-main class="h100p app-main">
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-main>
  </el-container>

</template>

<script>
import layoutaside from './compenents/layoutaside'
import layoutheader from './compenents/layoutheader'
export default {
  components: {
    layoutaside,
    layoutheader
  }
}

</script>

<style lang="less" scoped>
.my-aside {
  transition: all 300ms;
}
.my-main {
  padding: 0;
  background-color: #eee;
  .my-main-con {
    height: 100%;
    .my-head {
      background-color: #fff;
    }
    .app-main {
      padding: 10px;
    }
  }
}
</style>
