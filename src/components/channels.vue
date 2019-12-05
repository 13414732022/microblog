<template>
  <el-select v-model="channel_id"
             clearable
             placeholder="请选择">
    <el-option v-for="(item, index) in channels"
               :key="index"
               :label="item.name"
               :value="item.id"></el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      channel_id: undefined,
      channels: []
    }
  },
  props: {
    channelId: null
  },
  created () {
    this.$http.get('/mp/v1_0/channels')
      .then(res => {
        // console.log(res.data.data.channels)
        this.channels = res.channels
      })
      .catch(() => {})
  },
  watch: {
    channel_id (newVal) {
      // 监听频道id 发生改变时 将新值传递给父组件使用
      this.$emit('setChannel', newVal)
    },
    channelId (newVal) {
      this.channel_id = newVal
    }
  }
}
</script>

<style lang="less" scoped>
</style>
