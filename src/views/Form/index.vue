<template>
  <div class="right-Form">
    <!-- 人员表单 显示折叠按钮 -->
    <div
      class="puckerBtn"
      v-if="attrTypeCode === 'entity_person_type'"
      @click="hiddenInput = !hiddenInput"
    >
      <img class="puckerBtn-icon" src="@/assets/img/icon-pucker.png" />{{
        hiddenInput ? "展开" : "折叠"
      }}
    </div>

    <component
      :is="curComponent"
      ref="From"
      v-bind="$attrs"
      v-on="$listeners"
      :nodeId="nodeId"
      :attrTypeCode="attrTypeCode"
      :RelationId="RelationId"
      :hiddenInput="hiddenInput"
    >
      <!-- 自定义关系 -->
      <div class="Relation-ul-box" v-show="nodeList.length">
        <ul class="Relation-ul">
          <li class="Relation-ul-add">
            <div class="p-button-blue" @click.prevent="add">新增关系</div>
          </li>

          <li v-for="(item, index) in mapList" :key="index" class="Relation-li">
            <div class="Relation-li-relationShipName">
              <el-input
                v-model.trim="item.relationShipName"
                placeholder="请输入描述"
              ></el-input>
            </div>
            <div
              class="Relation-li-change"
              @click="handleChangeDirection(index)"
            >
              <i class="el-icon-sort"></i>
            </div>

            <div class="Relation-li-del" @click="remove(index)">
              <i class="el-icon-close"></i>
            </div>

            <div class="Relation-li">
              <el-col class="rightArrow" :span="8">
                <el-select v-model="item.startNodeId" :disabled="item.isRight">
                  <el-option
                    v-for="i in item.isRight ? nodeList : canChooseNodeList"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-col>
              <el-col class="rightArrow" :span="7" :offset="1">
                <img
                  class="rightArrow-icon"
                  src="@/assets/img/icon-rightArrow.png"
                />
              </el-col>
              <el-col :span="8" :offset="1">
                <el-select v-model="item.endNodeId" :disabled="!item.isRight">
                  <el-option
                    v-for="i in !item.isRight ? nodeList : canChooseNodeList"
                    :key="i.value"
                    :value="i.value"
                    :label="i.label"
                  ></el-option>
                </el-select>
              </el-col>
            </div>
          </li>
        </ul>
      </div>
    </component>
  </div>
</template>

<script>
import PersonFrom from './PersonFrom'
import AttrFrom from './AttrFrom'
import CarFrom from './CarFrom'
import IMSIFrom from './IMSIFrom'
// import { getNodeAndRelationList } from '@/api/relate/'

const formMap = {
  entity_person_type: PersonFrom,
  entity_community_car_type: CarFrom,
  entity_probe_phone_type: IMSIFrom
}

export default {
  components: {
    PersonFrom,
    AttrFrom,
    CarFrom,
    IMSIFrom
  },
  props: {
    attrTypeCode: String,
    nodeList: Array,
    nodeId: [String, Number],
    RelationId: [String, Number]
  },
  data () {
    return {
      value: '',
      curNodeName: '',
      curComponent: null,
      mapList: [],
      hiddenInput: false
    }
  },
  computed: {
    canChooseNodeList () {
      return this.nodeList?.filter(_c => _c.value != this.nodeId) ?? []
    }
  },
  watch: {
    attrTypeCode: {
      handler (val) {
        this.curComponent = formMap[val] || AttrFrom
        this.handleClearRelation()
      },
      deep: true,
      immediate: true
    },
    curNodeName (val) {
      this.mapList = this.mapList.map(_c => {
        if (_c.isRight) {
          _c.startNodeId = val
        } else {
          _c.endNodeId = val
        }
        return _c
      })
    },
    // 根据nodeId生成关系列表
    nodeId (val) {
      if (!val) return
      // getNodeAndRelationList({
      //   attrTypeCode: this.attrTypeCode,
      //   nodeId: val,
      //   canvas: this.RelationId
      // }).then(res => {
      //   if (!res) return
      //   if (!res.ships) return
      //   if (!res.ships.length) {
      //     this.mapList = []
      //     return
      //   }

      //   this.mapList = res.ships.map(_c => {
      //     let isRight = true
      //     if (_c.startNodeId == this.nodeId) {
      //       isRight = true
      //     } else if (_c.endNodeId == this.nodeId) {
      //       isRight = false
      //     }

      //     return {
      //       startNodeId: _c.startNodeId,
      //       endNodeId: _c.endNodeId,
      //       relationShipName: _c.relationShipName,
      //       isRight
      //     }
      //   })
      // })
    }
  },
  methods: {
    handleClearRelation () {
      this.mapList = []
      this.curNodeName = ''
    },
    // 处理关系列表数据
    formatRelationList () {
      const mapList = this.mapList.map(_c => {
        let { startNodeId, endNodeId, relationShipName } = _c
        let startAttrTypeCode,
          endAttrTypeCode = ''
        if (parseFloat(startNodeId).toString() == 'NaN') {
          // startNodeId 为文字
          startAttrTypeCode = this.attrTypeCode
          startNodeId = ''
        } else {
          startAttrTypeCode = this.nodeList.find(_c => _c.value == startNodeId)?.typeCode ?? ''
        }

        if (parseFloat(endNodeId).toString() == 'NaN') {
          // endNodeId 为文字
          endAttrTypeCode = this.attrTypeCode
          endNodeId = ''
        } else {
          endAttrTypeCode = this.nodeList.find(_c => _c.value == endNodeId)?.typeCode ?? ''
        }
        return {
          endAttrTypeCode,
          endNodeId,
          relationShipName,
          startAttrTypeCode,
          startNodeId,
          canvas: this.RelationId || ''
        }
      })

      return mapList
    },
    handleChangeDirection (index) {
      const { startNodeId, endNodeId, isRight } = this.mapList[index]
      this.mapList[index].startNodeId = endNodeId
      this.mapList[index].endNodeId = startNodeId
      this.$set(this.mapList[index], 'isRight', !isRight)
    },
    remove (index) {
      this.mapList.splice(index, 1)
    },
    add () {
      this.mapList.push({
        startNodeId: this.nodeId ? parseInt(this.nodeId) : this.curNodeName,
        endNodeId: '',
        relationShipName: '',
        isRight: true
      })
    }
  }
}
</script>

<style lang="less" scoped>
.right-Form {
  .Relation-ul-box {
    width: 100%;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    margin-bottom: 24px;
    margin-top: 24px;
    .Relation-ul {
      position: relative;
      width: 410px;
      padding: 20px 0 60px 32px;
      box-sizing: border-box;
      .Relation-ul-add {
        position: absolute;
        left: 32px;
        bottom: 24px;
      }
      .Relation-li {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
        height: 110px;
        .Relation-li-relationShipName {
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
        .Relation-li-change {
          position: absolute;
          right: -40px;
          top: 50%;
          font-size: 22px;
          transform: translateY(-50%) rotate(90deg);
          -ms-transform: translateY(-50%) rotate(90deg); /* IE 9 */
          -moz-transform: translateY(-50%) rotate(90deg); /* Firefox */
          -webkit-transform: translateY(-50%) rotate(90deg); /* Safari 和 Chrome */
          -o-transform: translateY(-50%) rotate(90deg); /* Opera */
          cursor: pointer;
          &:hover {
            color: #0baaf3;
          }
        }
        .Relation-li-del {
          position: absolute;
          right: -75px;
          top: 50%;
          transform: translateY(-50%);
          font-size: 24px;
          font-weight: 800;
          cursor: pointer;
          &:hover {
            color: #0baaf3;
          }
        }
        .rightArrow {
          .rightArrow-icon {
            width: 110px;
            height: 14px;
          }
        }
      }
    }
  }

  .puckerBtn {
    display: flex;
    align-items: center;
    padding-left: 70px;
    margin-bottom: 16px;
    box-sizing: border-box;
    cursor: pointer;
    .puckerBtn-icon {
      width: 16px;
      height: 16px;
      margin-right: 6px;
    }
    &:hover {
      color: #0baaf3;
    }
  }
}
</style>

