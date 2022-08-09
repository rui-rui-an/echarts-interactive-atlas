<template>
  <div class="modalForm">
    <el-form :rules="rules" :ref="formName" :model="form" label-width="120px">
      <div v-for="item in formList" :key="item.key">
        <el-form-item
          :label="item.label + '：'"
          :prop="item.prop"
          v-show="!hiddenInput || rules.hasOwnProperty(item.prop)"
        >
          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'input' || !item.type"
            v-model.trim="form[item.prop]"
            :placeholder="`${item.placeholder || '请输入' + item.label}`"
            :disabled="item.disabled || false"
          ></el-input>

          <!-- 输入框 -->
          <el-input
            v-if="item.type === 'numberInput'"
            v-model.number="form[item.prop]"
            :placeholder="`${item.placeholder || '请输入' + item.label}`"
            :disabled="item.disabled || false"
          ></el-input>

          <!-- 头像 -->
          <UploadIcon
            v-if="item.type === 'picture'"
            :UploadImage.sync="UploadImage"
            @handleChange="UploadChange($event, item)"
          ></UploadIcon>

          <!-- 选择框 -->
          <el-select
            v-else-if="item.type === 'select'"
            v-model="form[item.prop]"
            :placeholder="`${'请选择' + item.label}`"
            :disabled="item.disabled || false"
            style="width: 100%"
          >
            <el-option
              v-for="i in item.option"
              :key="i.value"
              :value="i.value"
              :label="i.label"
            ></el-option>
          </el-select>

          <!-- 开关 -->
          <el-switch
            v-else-if="item.type === 'switch'"
            v-model="form[item.prop]"
            :active-text="item.activeText"
            :disabled="item.disabled || false"
          >
          </el-switch>

          <!-- 选择日期 -->
          <el-date-picker
            v-else-if="item.type === 'dataPick'"
            v-model="form[item.prop]"
            :picker-options="pickerOptions"
            type="date"
            value-format="yyyy-MM-dd"
            format="yyyy-MM-dd"
            :disabled="item.disabled || false"
          >
          </el-date-picker>
        </el-form-item>
      </div>

      <slot></slot>
    </el-form>
    <div :style="$attrs.btnBoxStyle" v-if="btnList.length">
      <slot name="formBtns">
        <CusButton :btnList="btnList"></CusButton>
      </slot>
    </div>
  </div>
</template>

<script>
import CusButton from '@/components/CusButton'
import UploadIcon from '@/components/UploadIcon'
// import { uploadFacePic } from '@/api/clueQuery'
const pickerOptions = {
  disabledDate: time => {
    return time.getTime() > Date.now()
  }
}
export default {
  components: {
    CusButton,
    UploadIcon
  },

  props: {
    hiddenInput: Boolean,
    rules: {
      type: Object,
      default: {}
    },
    formList: {
      type: Array,
      default: []
    },
    btnList: {
      type: Array,
      default: []
    },
    form: {
      type: Object,
      default: {}
    },
    formName: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      pickerOptions: Object.freeze(pickerOptions),
      UploadImage: {
        imageUrl: '',
        accept: '.jpg',
        multiple: false,
        width: 104,
        height: 104,
        imgFile: null
      },
    }
  },
  watch: {
    'form': {
      handler: function(val)  {
        if(val.headPic){
          this.UploadImage.imageUrl = window.location.origin + '/' + val.headPic
          // this.UploadImage.imageUrl = 'http://192.168.1.182:8098/' + val.headPic
        }
      },
      immediate: true
    }
  },
  created () {
    // if (this.form.headPic) {
    //   this.UploadImage.imageUrl = this.form.headPic
    // }
  },
  methods: {
    UploadChange (file, item) {
      let url = URL.createObjectURL(file.raw)
      this.UploadImage.imageUrl = url
      this.UploadImage.imgFile = file.raw
      let formData = new FormData();
      formData.append('multipartFile', file.raw)
      // uploadFacePic(formData).then((res) => {
      //   this.form[item.prop] =  res
      // })
    },
  }
}
</script>

<style lang="less" scoped>
/deep/ .el-form-item {
  margin-bottom: 24px !important;
  width: 410px;
}
.el-form {
  display: flex;
  flex-wrap: wrap;
}
.el-form div {
  margin-right: 8%;
}
::v-deep .upload-container{
  margin-bottom: 0;
  .el-upload.el-upload--text{
      line-height: 0 !important;
    }

}
</style>
