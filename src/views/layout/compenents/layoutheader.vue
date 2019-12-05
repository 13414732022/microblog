<template>
  <el-row class="my-row">
    <!-- 关键-- 设置收起菜单的 图标按钮 -->
    <i class="menu-icon"
       :class="$store.state.isCollapse?'el-icon-s-unfold':'el-icon-s-fold'"
       @click="setIsc"></i>
    <el-col :span="14">
      <span>江苏传智播客教育科技股份有限公司</span>
    </el-col>
    <el-col :span="10"
            class="col2">
      <el-dropdown trigger="click"
                   class="my-dropdown"
                   @command="doCmd">
        <span class="el-dropdown-link">
          <img class="uesr-icon"
               :src="$store.state.userInfo.photo">
          <span class="username">{{ $store.state.userInfo.name }}</span>
          <i class="el-icon-arrow-down el-icon--right"></i>
        </span>
        <el-dropdown-menu slot="dropdown">
          <el-dropdown-item command="info">个人信息</el-dropdown-item>
          <el-dropdown-item command="git">git地址</el-dropdown-item>
          <el-dropdown-item command="logout">退出</el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </el-col>

  </el-row>
</template>

<script>
export default {
  data () {
    return {
    }
  },
  created () {
    this.$store.commit('setUserInfo') // 组件加载刷新vuex用户信息
  },
  methods: {
    doCmd (val) {
      if (val === 'logout') {
        window.localStorage.removeItem('userInfo')
        this.$router.push('/login')
      }
    },
    setIsc () {
      // 执行 store.js中的方法 setisCollapse
      this.$store.commit('setisCollapse')
    }
  }
}
</script>

<style lang="less" scoped>
.my-row {
  height: 100%;
  display: flex;
  align-items: center;
  .menu-icon {
    font-size: 24px;
    margin-right: 20px;
    cursor: pointer;
  }
  .col2 {
    display: flex;
    flex-direction: row-reverse;

    .my-dropdown {
      cursor: pointer;
      .uesr-icon {
        height: 40px;
        width: 40px;
        border-radius: 50%;
      }
      .username {
        padding: 0 10px;
      }
    }
  }
}
</style>
