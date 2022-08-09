<template>
  <div class="Form">
    <CusForm
      ref="Form"
      formName="Form"
      :rules="Rules"
      :formList="FormCol"
      :form="Form"
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
  data () {
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
        { label: '手机号', prop: 'phone' },
        { label: 'IMEI', prop: 'imei' },
        { label: 'IMSI', prop: 'imsi' },

      ]),
      Form: {
        imsi: '',
        imei: '',
        phone: ''
      },
      Rules: Object.freeze({})
    }
  },
  watch: {
    formData: {
      handler (val) {
        if (JSON.stringify(val) !== '{}') {
          const { imei, imsi, phone } = val
          this.Form = { ...this.Form, imsi, imei, phone }

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
          // 如果IMSI节点只剩下一个的话,那么就不要有删除按钮
          let chartsList = JSON.parse(sessionStorage.getItem('chartsList'))
          if (chartsList[0].length === 1) {
            this.btnList.splice(1, 1)
          }
        } else {
          this.Form = {
            imsi: '',
            imei: '',
            phone: ''
          }
          this.btnList = [
            {
              text: '提交',
              type: 'button',
              event: this.submitForm
            }
          ]
        }

        this.$nextTick(() => {
          this.$refs['Form'].$refs['Form'].clearValidate()
        })
      },
      immediate: true, //关键
      deep: true
    },
    // 下面的代码触发了bug
    // 'Form.phone' (val) {
    //   this.$nextTick(() => {
    //     this.$parent.curNodeName = val
    //   })
    // }
  },
  methods: {
    del () {
      this.$emit('handleDel')
    },
    cancel () {
      this.$emit('handleCancel')
    },
    /** 提交 新增/编辑 表单  */
    submitForm () {
      // this.$nextTick(() => {
      //   this.$refs['Form'].$refs['Form'].validate(valid => {
      //     if (valid) {
      //       // 处理 关系列表
      //       // hasOneMoreValue对列表进行校验,至少要有一个值才可以提交
      //       let hasOneMoreValue  = Object.values(this.Form).filter((item)=>{
      //         return item
      //       })
      //       if(hasOneMoreValue.length ===0 ){
      //         this.$messageTip.error('请至少输入一个值')
      //         return
      //       }
      //       const mapList = this.$parent.formatRelationList()
      //       let submitParams = {
      //         attrTypeCode: this.attrTypeCode,
      //         index: this.Form.phone,
      //         canvas: this.RelationId,
      //         map: { ...this.Form },
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
