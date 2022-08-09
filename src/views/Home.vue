<template>
  <div>
    <div class="tabs-container">
      <div class="tabs-container-Charts">
        <!-- 关系图 -->
        <Charts
          ref="charts"
          v-if="chartsList && chartsList.length !== 0 && chartsList[0].length"
          :chartList="chartsList"
        />

        <!-- <div class="empty_div" v-else>
          <EmptyData />
        </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import Charts from '@/components/Charts'
// import EmptyData from '@/components/EmptyData'
export default {
  components: {
    Charts,
    // EmptyData
  },
  data () {
    return {
      chartsList: []
    }
  },
  created () {
    this.getEchartsData()
  },
  methods: {
    getEchartsData () {
      this.$axios('/echarts/humanrelation').then((res) => {
        // console.log(res);
        this.chartsList = [res.data.data.nodes, res.data.data.ships]
      })

    }
  }
}
</script>

<style lang="less" scoped>
.tabs-container {
  height: calc(100vh - 233px);
  overflow-y: scroll;
}
.tabs-container-Charts {
  height: calc(100vh - 250px);
  background-color: rgba(192, 208, 231, 0.05);
  .empty_div {
    height: calc(100vh - 350px);
  }
}
</style>