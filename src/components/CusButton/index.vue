<template>
  <div class="CusButton">
    <ul class="btns-r">
      <li v-for="i in btnList" :key="i.text">
        <!-- 无颜色按钮 -->
        <div v-if="!i.type" class="p-button" @click="i.event">
          {{ i.text }}
        </div>

        <!-- loading状态按钮 -->
        <el-button
          v-else-if="i.type === 'button'"
          type="primary"
          class="btn"
          :loading="i.loading ? true : false"
          @click="i.event"
          >{{ i.loading ? i.loading : i.text }}</el-button
        >
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: 'CusButton',
  props: {
    btnList: {
      type: Array
    }
  }
}
</script>

<style lang="less" scoped>
.btns-r {
  display: flex;
  justify-content: flex-end;
  & > li {
    margin-right: 16px;
  }
  & > li:last-child {
    margin-right: 0px;
  }
}
.p-button {
  padding: 5px 27px;
  border: 1px solid #177ddc;
  box-sizing: border-box;
}

/deep/.el-button {
  padding: 6px 27px !important;
}
</style>
