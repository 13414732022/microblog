<template>
  <el-container class="app-aside h100p">
    <el-header>
      <img src="./logo_admin.png"
           alt="">
    </el-header>
    <el-main>
      <el-menu default-active="home"
               background-color="#353b4e"
               text-color="#fff"
               active-text-color="#ffd04b"
               :unique-opened="true"
               style="border: none"
               :collapse-transition="false"
               :collapse="$store.state.isCollapse"
               :router="true">
        <el-menu-item index="/home">
          <i class="el-icon-menu"></i>
          <span slot="title">首页</span>
        </el-menu-item>

        <el-submenu index="2">
          <template slot="title">
            <i class="el-icon-location"></i>
            <span>内容管理</span>
          </template>
          <el-menu-item index="/article/publish">发布文章</el-menu-item>
          <el-menu-item index="/article/list">内容列表</el-menu-item>
          <el-menu-item index="/comment">评论列表</el-menu-item>
          <el-menu-item index="/material">素材管理</el-menu-item>
        </el-submenu>

        <el-submenu index="3">
          <template slot="title">
            <i class="el-icon-food"></i>
            <span>粉丝管理</span>
          </template>

          <el-menu-item index="3-1">图文数据</el-menu-item>
          <el-menu-item index="3-2">粉丝概况</el-menu-item>
          <el-menu-item index="3-3">粉丝画像</el-menu-item>
          <el-menu-item index="3-4">粉丝列表</el-menu-item>
        </el-submenu>

        <el-menu-item index="/user/center">
          <i class="el-icon-setting"></i>
          <span slot="title">账户信息</span>
        </el-menu-item>
      </el-menu>
    </el-main>
  </el-container>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.app-aside {
  background-color: #323745;
  & > .el-header {
    background-color: #2e2f32;
    text-align: center;
    line-height: 60px;
    img {
      width: 120px;
    }
  }
  & > .el-main {
    padding: 0;
  }
}
</style>
