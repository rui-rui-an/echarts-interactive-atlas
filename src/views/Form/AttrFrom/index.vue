<template>
  <div class="From">
    <CusForm
      ref="From"
      formName="From"
      :rules="Rules"
      :formList="FormCol"
      :form="From"
      :btnList="btnList"
      ><slot></slot
    ></CusForm>
  </div>
</template>


<script>
import CusForm from '@/components/CusForm'
// import { addAttr, updateAttr } from '@/api/relate/'

export default {
  components: { CusForm },
  props: {
    attrTypeCode: String,
    nodeId: [String, Number],
    formData: Object,
    RelationId: [String, Number]
  },
  data() {
    return {
      btnList: [
        {
          text: '取消',
          event: this.cancel
        },
        {
          text: '删除',
          type: 'button',
          event: this.del
        },
        {
          text: '提交',
          type: 'button',
          event: this.submitForm
        }
      ],
      FormCol: Object.freeze([{ label: '值', prop: 'index' }]),
      From: {
        index: ''
      },
      Rules: Object.freeze({
        index: [{ required: true, message: '请输入值', trigger: 'blur' }]
      })
    }
  },
  watch: {
    formData: {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          const { index } = val
          this.From = { ...this.From, index: index }

          this.btnList = [
            {
              text: '取消',
              event: this.cancel
            },
            {
              text: '删除',
              type: 'button',
              event: this.del
            },
            {
              text: '提交',
              type: 'button',
              event: this.submitForm
            }
          ]
          // 如果Attr节点只剩下一个的话,那么就不要有删除按钮
          let chartsList = JSON.parse(sessionStorage.getItem('chartsList'))
          if(chartsList[0].length === 1){
            this.btnList.splice(1,1)
          }
        } else {
          this.From.index = ''
          this.btnList = [
            {
              text: '提交',
              type: 'button',
              event: this.submitForm
            }
          ]
        }

        this.$nextTick(() => {
          this.$refs['From'].$refs['From'].clearValidate()
        })
      },
      immediate: true, //关键
      deep: true
    },
    'From.index'(val) {
      this.$nextTick(() => {
        this.$parent.curNodeName = val
      })
    }
  },
  methods: {
    del() {
      this.$emit('handleDel')
    },
    cancel() {
      this.$emit('handleCancel')
    },
    /** 提交 新增/编辑 表单  */
    submitForm() {
      // this.$nextTick(() => {
      //   this.$refs['From'].$refs['From'].validate(valid => {
      //     if (valid) {
      //       // 处理 关系列表
      //       const mapList = this.$parent.formatRelationList()

      //       let submitParams = {
      //         attrTypeCode: this.attrTypeCode,
      //         canvas: this.RelationId,
      //         mapList,
      //         ...this.From
      //       }

      //       let Url = addAttr
      //       if (this.nodeId) {
      //         submitParams.nodeId = this.nodeId
      //         Url = updateAttr
      //       }

      //       Url(submitParams).then(res => {
      //         this.$messageTip.success(this.nodeId ? '修改成功!' : '新建成功!')
      //         this.$emit('NodeChange')
      //       })
      //     }
      //   })
      // })
    }
  }
}
</script>

<style>
</style>
