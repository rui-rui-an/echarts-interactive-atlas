<template>
  <div class="CarForm">
    <CusForm
      ref="CarForm"
      formName="CarForm"
      :rules="Rules"
      :formList="FormCol"
      :form="CarForm"
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
      FormCol: Object.freeze([
        { label: '车牌号', prop: 'carLicense' },
        { label: '车辆编码', prop: 'carFrame' }
      ]),
      CarForm: {
        carLicense: '',
        carFrame: ''
      },
      Rules: Object.freeze({
        carLicense: [{ required: true, message: '请输入车牌号', trigger: 'blur' }]
      })
    }
  },
  watch: {
    formData: {
      handler(val) {
        if (JSON.stringify(val) !== '{}') {
          const { carLicense, carFrame } = val
          this.CarForm = { ...this.CarForm, carLicense, carFrame }

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
          // 如果Car节点只剩下一个的话,那么就不要有删除按钮
          let chartsList = JSON.parse(sessionStorage.getItem('chartsList'))
          if(chartsList[0].length === 1){
            this.btnList.splice(1,1)
          }
        } else {
          this.From.carLicense = ''
          this.From.carFrame = ''

          this.btnList = [
            {
              text: '提交',
              type: 'button',
              event: this.submitForm
            }
          ]
        }
        this.$nextTick(() => {
          this.$refs['CarForm'].$refs['CarForm'].clearValidate()
        })
      },
      immediate: true, //关键
      deep: true
    },
    'CarForm.carLicense'(val) {
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
      //   this.$refs['CarForm'].$refs['CarForm'].validate(valid => {
      //     if (valid) {
      //       // 处理 关系列表
      //       const mapList = this.$parent.formatRelationList()

      //       let params = {}
      //       Object.keys(this.CarForm).forEach(key => {
      //         if (this.CarForm[key]) {
      //           params[key] = this.CarForm[key]
      //         }
      //       })

      //       let submitParams = {
      //         attrTypeCode: this.attrTypeCode,
      //         index: params.carLicense,
      //         canvas: this.RelationId,
      //         map: { ...params },
      //         mapList
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
