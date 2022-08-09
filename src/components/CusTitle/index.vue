<template>
  <div class="card-title" :style="curStyle">
    <span class="title">{{ title }}</span>
    <img class="title-suffix" src="@/assets/img/icon-title-square.png" alt="" />
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '这是标题'
    },
    curStyle: {
      type: Object,
      default: () => {
        return {
          'margin-bottom': '16px'
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
.card-title {
  .title {
    display: inline-block;
    margin-right: 10px;
    color: #c0d0e7;
    font-weight: bold;
  }
  .title-suffix {
    display: inline-block;
  }
}
</style>
