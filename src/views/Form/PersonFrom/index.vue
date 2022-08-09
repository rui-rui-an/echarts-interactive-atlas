<template>
  <div class="PersonFrom">
    <CusForm
      ref="PersonFrom"
      formName="PersonFrom"
      :rules="Rules"
      :formList="FormCol"
      :form="PersonFrom"
      :btnList="btnList"
      v-bind="$attrs"
    >
      <slot></slot
    ></CusForm>
  </div>
</template>


<script>
import CusForm from '@/components/CusForm'
import { sexOption, cultureOption, maritalStatusOption } from '../form-data'

// import { addAttr, updateAttr } from '@/api/relate/'

export default {
  components: { CusForm },
  props: {
    attrTypeCode: String,
    nodeId: [String, Number],
    personId: [String, Number],
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
        { label: '姓名', prop: 'name' },
        { label: '身份证号', prop: 'cerNumber' },
        { label: '头像', prop: 'avatarUrl', type: 'picture' },
        { label: '性别', prop: 'sex', type: 'select', option: sexOption },
        { label: '出生日期', prop: 'birthday', type: 'dataPick' },
        { label: '现居住地址', prop: 'currentAddr' },
        { label: '户籍地址', prop: 'registeredAddr' },
        { label: '国籍', prop: 'nation' },
        { label: '文化程度', prop: 'culture', type: 'select', option: cultureOption },
        { label: '婚姻状况', prop: 'maritalStatus', type: 'select', option: maritalStatusOption }
      ]),
      PersonFromNothing: {},
      PersonFrom: {
        name: '',
        cerNumber: '',
        avatarUrl: '',
        sex: '',
        birthday: '',
        currentAddr: '',
        registeredAddr: '',
        nation: '',
        culture: '',
        maritalStatus: ''
      },
      Rules: Object.freeze({
        name: [{ required: true, message: '请输入姓名', trigger: 'blur' }],
        cerNumber: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { validator: this.validID, trigger: 'blur' }
        ]
      })
    }
  },
  watch: {
    formData: {
      handler(val) {
        // 这里的formData改变之后,需要将传下去的PersonFrom初始化为空值,否则会带入上一个人的数据.
        Object.keys(this.PersonFrom).forEach(key => {
          this.PersonFrom[key] = ''
        })
        const index = this.FormCol.findIndex(_c => _c.label === '身份证号')

        const numProps = ['sex', 'culture', 'maritalStatus']

        if (JSON.stringify(val) !== '{}') {
          let obj = {}
          Object.keys(val).forEach(key => {
            if (val[key] && this.PersonFrom.hasOwnProperty(key)) {
              if (numProps.includes(key)) {
                obj[key] = parseInt(val[key])
              } else {
                obj[key] = val[key]
              }
            }
          })

          this.FormCol[index].disabled = true
          this.PersonFrom = { ...this.PersonFrom, ...obj }
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
          // 如果人员节点只剩下一个的话,那么就不要有删除按钮
          let chartsList = JSON.parse(sessionStorage.getItem('chartsList'))
          if (chartsList[0].length === 1) {
            this.btnList.splice(1, 1)
          }
        } else {
          Object.keys(this.PersonFrom).forEach(key => {
            this.PersonFrom[key] = ''
          })

          this.FormCol[index].disabled = false

          this.btnList = [
            {
              text: '提交',
              type: 'button',
              event: this.submitForm
            }
          ]
        }

        this.$nextTick(() => {
          this.$refs['PersonFrom'].$refs['PersonFrom'].clearValidate()
        })
      },
      immediate: true, //关键
      deep: true
    },
    'PersonFrom.name'(val) {
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

    // 身份证验证
    validID(rule, value, callback) {
      // 身份证号码为15位或者18位，15位时全为数字，18位前17位为数字，最后一位是校验位，可能为数字或字符X
      let reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
      if (reg.test(value)) {
        this.go()
        callback()
      } else {
        callback(new Error('身份证号码不正确'))
      }
    },

    submitForm() {
      // this.$nextTick(() => {
      //   this.$refs['PersonFrom'].$refs['PersonFrom'].validate(valid => {
      //     if (valid) {
      //       // 处理 关系列表
      //       const mapList = this.$parent.formatRelationList()

      //       let map = {}
      //       // this.PersonFrom有问题,导致了后面的都有问题
      //       Object.keys(this.PersonFrom).forEach(key => {
      //         if (this.PersonFrom[key]) {
      //           map[key] = this.PersonFrom[key]
      //         }
      //       })

      //       let params = {
      //         attrTypeCode: this.attrTypeCode,
      //         index: this.PersonFrom.cerNumber,
      //         nodeId: this.nodeId || '',
      //         canvas: this.RelationId || '',
      //         map,
      //         mapList
      //       }

      //       let Url = addAttr
      //       if (this.personId) {
      //         params = { ...params }
      //         Url = updateAttr
      //       }

      //       Url(params).then(res => {
      //         this.$messageTip.success(this.personId ? '修改成功!' : '新建成功!')
      //         this.$emit('NodeChange', this.RelationId ?? '')
      //       })
      //     }
      //   })
      // })
    },

    // 实现自动生成生日，性别，年龄
    go() {
      let iden = this.PersonFrom.cerNumber
      const len = iden.length
      // 此处根据身份证来sex自动生成的代码影响了性别的修改,先注释了,不知道会不会有bug,后续再看
      let sex = null
      let birth = null

      if (len === 18) {
        sex = iden.substring(16, 17)
        birth = iden.substring(6, 10) + '-' + iden.substring(10, 12) + '-' + iden.substring(12, 14)
      }
      if (len === 15) {
        sex = iden.substring(13, 14)
        birth =
          '19' + iden.substring(6, 8) + '-' + iden.substring(8, 10) + '-' + iden.substring(10, 12)
      }
      if (sex % 2 === 0) sex = 2
      else sex = 1
      this.PersonFrom.sex = sex
      this.PersonFrom.birthday = birth
    }
  }
}
</script>

<style>
</style>
