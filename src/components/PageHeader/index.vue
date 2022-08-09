<template>
  <div class="PageHeader" :style="$attrs.cusStyle">
    <div class="sides">
      <slot name="headerTop"></slot>
    </div>
    <div class="sides PageHeader_main">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PageHeader'
}
</script>

<style scoped>
.PageHeader {
  position: relative;
  box-sizing: border-box;
  margin: 12px 16px 0 16px;
  padding: 12px 16px;
  background-color: rgba(255, 255, 255, 0.04);
  box-sizing: border-box;
}

.sides {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
