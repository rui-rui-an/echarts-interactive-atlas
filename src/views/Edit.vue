<template>
  <div class="Relation">
    <!-- <div class="Relation-PageHeader">
      <PageHeader :cusStyle="{ margin: 0 }">
        <template>
          <list-title class="headerTop" title="弱关系网络"></list-title>

          <div @click="$router.go(-1)">
            <nav-title :title="routerName"></nav-title></div
        ></template>
      </PageHeader>
    </div> -->

    <el-container class="Relation-elContainer">
      <el-main class="Relation-Charts">
        <Charts
          ref="charts"
          v-if="chartsList && chartsList.length"
          :chartList="chartsList"
          @handleClickOut="handleCancel"
          @handleClickNode="handleClickNode"
          @handleClickEdge="handleClickEdge"
        />
      </el-main>

      <el-aside width="500px" v-if="!isShow">
        <el-container class="Relation-form" v-if="formType === 'attr'">
          <el-header class="Relation-form-elHeader">
            <CusTitle
              :title="`${personId > 0 || nodeId > 0 ? '修改' : '新增'}${
                attrTypeCode === 'entity_person_type' ? '人物' : '数据'
              }`"
              :curStyle="{ 'margin-bottom': '0' }"
            ></CusTitle>

            <div>
              节点类型：
              <el-select
                v-model="attrTypeCode"
                :disabled="personId > 0 || nodeId > 0 || !RelationId"
              >
                <el-option
                  v-for="(item, index) in usefulRelationTypeList"
                  :value="item.typeCode"
                  :label="item.typeName"
                  :key="index"
                ></el-option>
              </el-select>
            </div>
          </el-header>
          <el-main class="Relation-form-elMain">
            <div class="Relation-form-elMain-form">
              <Form
                ref="attrForm"
                :attrTypeCode="attrTypeCode"
                :nodeId="nodeId"
                :personId="personId"
                :formData="formData"
                :RelationId="RelationId"
                :nodeList="nodeList"
                @NodeChange="NodeChange"
                @handleCancel="handleCancel"
                @handleDel="handleDel"
              >
              </Form>
            </div>
          </el-main>
        </el-container>

        <el-container class="Relation-form" v-else>
          <el-header class="Relation-form-elHeader">
            <CusTitle
              title="修改关系"
              :curStyle="{ 'margin-bottom': '0' }"
            ></CusTitle>
          </el-header>
          <el-main class="Relation-form-elMain">
            <div class="Relation-form-elMain-form">
              <div class="Relation-form-elMain-form-relationShipName">
                <el-input
                  v-model.trim="Form.relationShipName"
                  placeholder="请输入描述"
                  :disabled="true"
                ></el-input>
              </div>

              <div class="Relation-form-elMain-form-row">
                <el-col :span="8">
                  <el-select v-model="Form.startNodeId" :disabled="true">
                    <el-option
                      v-for="i in nodeList"
                      :key="i.value"
                      :value="i.value"
                      :label="i.label"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col
                  class="Relation-form-elMain-form-row-rightArrow"
                  :span="7"
                  :offset="1"
                >
                  <img
                    class="Relation-form-elMain-form-row-rightArrow-icon"
                    src="@/assets/img/icon-rightArrow.png"
                  />
                </el-col>
                <el-col :span="8">
                  <el-select v-model="Form.endNodeId" :disabled="true">
                    <el-option
                      v-for="i in nodeList"
                      :key="i.value"
                      :value="i.value"
                      :label="i.label"
                    ></el-option>
                  </el-select>
                </el-col>
              </div>

              <div class="Relation-form-elMain-form-row-btn">
                <CusButton :btnList="btnList"></CusButton>
              </div>
            </div>
          </el-main>
        </el-container>
      </el-aside>
    </el-container>
  </div>
</template>
<script>
import PageHeader from '@/components/PageHeader'
import CusTitle from '@/components/CusTitle'
// import { mapGetters } from 'vuex'
import Charts from '@/components/Charts'
import Form from './Form'
// import { findRelation, deleteAttrs, deleteShip } from '@/api/relate'
import CusButton from '@/components/CusButton'
export default {
  components: {
    Charts,
    Form,
    PageHeader,
    CusButton,
    CusTitle
  },
  data () {
    return {
      nodeList: [],
      usefulRelationTypeList: [
        {
          "typeCode": "entity_community_car_type",
          "typeName": "车辆"
        },
        {
          "typeCode": "entity_probe_phone_type",
          "typeName": "手机"
        },
        {
          "typeCode": "entity_wechat_type",
          "typeName": "微信"
        },
        {
          "typeCode": "entity_qq_type",
          "typeName": "QQ"
        },
        {
          "typeCode": "entity_mac_type",
          "typeName": "MAC"
        },
        {
          "typeCode": "entity_network_account_type",
          "typeName": "虚拟账号"
        },
        {
          "typeCode": "entity_credit_card_type",
          "typeName": "银行卡/信用卡"
        },
        {
          "typeCode": "entity_person_type",
          "typeName": "人员"
        }
      ],
      formType: 'attr',
      RelationId: '', // canvas 画板id
      personId: 0, //人物id
      attrTypeCode: 'entity_person_type', //表单类型 'entity_person_type'：人员表单  1：属性表单  2.车辆表单  3.imei表单
      chartsList: [], // 关系图谱显示
      nodeId: 0, //节点id
      formData: {}, //修改赋值
      defalutType: '', // 保存新建完成后跳转的表单
      btnList: [],
      FormCol: Object.freeze([
        { label: '关系描述', prop: 'relationShipName' },
        { label: '开始节点', prop: 'startNodeId', type: 'select' },
        { label: '结束节点', prop: 'endNodeId', type: 'select' }
      ]),
      Form: {
        relationShipName: '',
        startNodeId: '',
        endNodeId: ''
      }
    }
  },
  provide () {
    return {
      chartsList: this.chartsList, // 关系图谱显示
    }
  },
  computed: {
    canvas () {
      return this.$route.query?.id ?? ''
    },
    isShow () {
      return this.$route.query?.isShow ?? false
    },
    routerName () {
      return this.$route.query?.label ?? ''
    }
  },
  created () {
    const typeList = ['entity_community_car_type', 'entity_person_type', 'entity_probe_phone_type']
    this.defalutType = this.usefulRelationTypeList.find(
      _c => !typeList.includes(_c.typeCode)
    ).typeCode
    // if (this.canvas) {
    this.NodeChange(this.canvas)
    // }
  },
  methods: {
    // 跳转为关系设置
    handleShip () {
      this.formType = 'ship'
      this.resetShipForm()
    },

    handleAttr () {
      this.formType = 'attr'
    },

    // 清空节点关系表单
    resetShipForm () {
      this.Form = {
        relationShipName: '',
        startNodeId: '',
        endNodeId: ''
      }
    },

    // 删除关系
    del () {
      // deleteShip({
      //   nodeId: this.nodeId
      // }).then(res => {
      //   this.NodeChange()
      //   this.resetShipForm()
      //   this.formType = 'attr'
      // })
    },

    // 删除节点
    handleDel () {
      // deleteAttrs({
      //   attrTypeCode: this.attrTypeCode,
      //   nodeId: this.nodeId
      // }).then(res => {
      //   this.handleCancel()
      //   this.NodeChange()
      // })
    },

    // 取消清空
    handleCancel () {
      this.$nextTick(() => {
        this.nodeId = 0
        this.personId = 0
        this.attrTypeCode = this.defalutType
        this.formData = {}

        if (this.$refs.attrForm) {
          this.$refs.attrForm.handleClearRelation()

          const sIdx = this.FormCol.findIndex(_c => _c.label === '开始节点')
          this.nodeList = this.FormCol[sIdx].option?.filter(_c => _c.value != this.nodeId) ?? []
        }
      })
    },

    // 刷新节点显示
    NodeChange (canvas) {
      this.RelationId = '360728199604120853%2a1021111_eea8232e9992493896475b07a6637145'
      // findRelation(this.RelationId).then(res => {
      //   if (!res) return
      //   this.chartsList = [res.nodes, res.ships]
      //   sessionStorage.setItem('chartsList', JSON.stringify(this.chartsList))
      //   const sIdx = this.FormCol.findIndex(_c => _c.label === '开始节点')
      //   const eIdx = this.FormCol.findIndex(_c => _c.label === '结束节点')
      //   const list = res.nodes.map(_c => {
      //     return {
      //       // 加入后面两个,当手机号为空时,默认取imei和imsi
      //       label: _c.name || _c.typeValue || _c.imei || _c.imsi,
      //       value: _c.id,
      //       typeCode: _c.typeCode
      //     }
      //   })

      //   this.FormCol[sIdx].option = [...list]
      //   this.FormCol[eIdx].option = [...list]

      //   this.handleCancel()
      // })
      this.$axios('/echarts/editrelation').then((res) => {
        // console.log(res);
        if (!res) return
        this.chartsList = [res.data.data.nodes, res.data.data.ships]
        sessionStorage.setItem('chartsList', JSON.stringify(this.chartsList))
        const sIdx = this.FormCol.findIndex(_c => _c.label === '开始节点')
        const eIdx = this.FormCol.findIndex(_c => _c.label === '结束节点')
        const list = res.nodes.map(_c => {
          return {
            // 加入后面两个,当手机号为空时,默认取imei和imsi
            label: _c.name || _c.typeValue || _c.imei || _c.imsi,
            value: _c.id,
            typeCode: _c.typeCode
          }
        })

        this.FormCol[sIdx].option = [...list]
        this.FormCol[eIdx].option = [...list]

        this.handleCancel()
      })

    },

    // 点击节点
    handleClickNode (node) {
      this.handleAttr()
      this.attrTypeCode = node.typeCode
      if (node.typeCode === 'entity_person_type') {
        // TODO: 人物id为正代表 编辑节点
        this.personId = 1
        this.nodeId = node.id
      } else {
        this.nodeId = node.id
        this.personId = 0
      }

      this.formData = { ...node }
    },

    // 点击节点关系
    handleClickEdge (edge) {
      this.handleShip()
      this.nodeId = edge.id
      this.Form = { ...this.Form, ...edge }

      this.btnList = [
        {
          text: '删除',
          event: this.del,
          type: 'button'
        }
      ]
    }
  }
}
</script>
<style lang="less" scoped>
.Relation {
  height: 100%;
  .Relation-PageHeader {
    margin-bottom: 16px;
  }
  .Relation-elContainer {
    position: relative;
    height: calc(100vh - 175px);
    background-color: rgba(255, 255, 255, 0.04);
    overflow: hidden;
    .Relation-Charts {
      padding: 20px;
      height: 98%;
      overflow: hidden;
    }
    .Relation-form {
      height: 100%;
      background-color: rgba(255, 255, 255, 0.06);
      .Relation-form-elHeader {
        display: flex;
        align-items: center;
        justify-content: space-between;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
        padding: 16px 16px;
      }
      .Relation-form-elMain {
        padding: 0;
        .Relation-form-elMain-form {
          position: relative;
          padding: 30px 0;
          box-sizing: border-box;
          .Relation-form-elMain-form-relationShipName {
            position: absolute;
            left: 50%;
            top: 18px;
            transform: translateX(-60%);
            width: 110px;
            z-index: 99;
            /deep/.el-input__inner {
              border: none !important;
              text-align: center !important;
            }
          }
          .Relation-form-elMain-form-row {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 24px;
            padding: 0 24px;
            box-sizing: border-box;
            .Relation-form-elMain-form-row-rightArrow {
              .Relation-form-elMain-form-row-rightArrow-icon {
                width: 110px;
                height: 14px;
              }
            }
          }
          .Relation-form-elMain-form-row-btn {
            margin-right: 24px;
          }
        }
      }
    }
  }
}
</style>
