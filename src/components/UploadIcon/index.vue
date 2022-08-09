<template>
  <div class="upload-container">
    <div class="imgList" v-if="UploadImage.multiple">
      <div
        v-for="(item, index) in UploadImage.imageUrl"
        :key="index + '_' + item"
        class="imgList_item"
        @mouseleave="removedEle"
        @mouseover="moveqEle(index)"
      >
        <div class="imgList_item_image">
          <img :src="item" class="avatar" :width="UploadImage.width" :height="UploadImage.height" />
          <div :class="{ isMoveq: curIndex === index }" v-if="curIndex === index">
            <div @click="handlePictureCardPreview(item)">
              <i class="el-icon-zoom-in"></i>
            </div>
            <div @click="handleRemove(item)">
              <i class="el-icon-delete"></i>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      v-if="
        (UploadImage.multiple && UploadImage.imageUrl.length !== UploadImage.limit) ||
        !UploadImage.multiple
      "
    >
      <el-upload
        :style="{
          width: UploadImage.width + 'px',
          height: UploadImage.height + 'px'
        }"
        :class="[disabledInput ? 'upLoadShowNone' : '']"
        ref="upload"
        class="upload-demo"
        :accept="UploadImage.accept"
        :action="UploadUrl()"
        :multiple="UploadImage.multiple"
        :on-success="handleSuccess"
        :disabled="disabledInput"
        :auto-upload="false"
        :show-file-list="false"
        :on-change="handleChange"
      >
        <div class="icon" v-if="UploadImage.imageUrl && !UploadImage.multiple">
          <img
            :src="UploadImage.imageUrl"
            class="avatar"
            :width="UploadImage.width"
            :height="UploadImage.height"
          />
        </div>

        <div v-else>
          <div><i class="el-icon-plus avatar-uploader-icon"></i></div>
          <div class="titleText">上传图片</div>
        </div>
      </el-upload>

      <div class="tip" :style="{ display: tipIsShow }">只支持.jpg 格式</div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'UploadFile',
  props: {
    disabledInput: {
      type: Boolean,
      default: false
    },
    fileList: {
      type: Array,
      default: () => []
    },
    Url: {
      type: String,
      default: ''
    },
    UploadImage: {
      type: Object
    },
    tipIsShow: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      curIndex: -1
    }
  },
  methods: {
    removedEle () {
      this.curIndex = -1
    },
    moveqEle (index) {
      this.curIndex = index
    },
    /**上传到服务器 */
    submitUpload () {
      this.$refs.upload.submit()
    },
    //上传路径
    UploadUrl: function () {
      // return `${process.env.BASE_API}/base/fus/uploadFile`
      return this.Url ? this.Url : '#'
    },

    /**文件上传成功时的钩子 */
    handleSuccess (res, file, fileList) {
      this.$emit('update:fileList', fileList)
    },

    /**文件列表移除文件时的钩子 */
    handleRemove (url) {
      this.$emit('remove', url)
    },

    /**点击文件列表中已上传的文件时的钩子 */
    handlePictureCardPreview (url) {
      window.open(url)
    },
    clearFiles () {
      this.$refs.upload.clearFiles()
    },

    /**文件状态改变时的钩子，添加文件、上传成功和上传失败时都会被调用 */
    handleChange (file, fileList) {
      this.clearFiles()
      this.$emit('handleChange', file)
    }
  }
}
</script>

<style lang="less" scoped>
.upload-demo {
  background-color: transparent;
  border: 1px dashed #657494;
  display: flex;
  align-items: center;
  justify-content: center;
  div {
    color: #bac9e1;
    font-size: 14px;
    i {
      font-size: 18px;
      margin-bottom: 14px;
    }
  }
}
.upload-demo.upLoadShowNone {
  cursor: not-allowed;
  div {
    cursor: not-allowed;
  }
}
.tip {
  color: #617090;
  font-size: 14px;
  padding-top: 8px;
}

.upload-container {
  display: flex;
  margin-bottom: 36px;
  > div {
    margin-right: 16px;
  }
}

.imgList {
  display: flex;
  .imgList_item {
    margin-right: 16px;
    &:last-child {
      margin-right: 0px;
    }
    .imgList_item_image {
      position: relative;
      .isMoveq {
        background-color: rgba(0, 0, 0, 0.8);
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        cursor: pointer;
      }
    }
  }
}
</style>
