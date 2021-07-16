import {onMounted, ref} from 'vue'

function calcHeight () {
  if (document.querySelector('.el-table')) {
      const headHeight: number = document.querySelector('.head-condition').clientHeight
    const pageHeight: number = document.querySelector('.page.el-pagination').clientHeight
    return window.innerHeight - headHeight - pageHeight - 35
  }
}

function tableHeightMixin() {

  const tableHeight = ref(null)

  onMounted(() => {
    tableHeight.value = calcHeight()
  })
}

export default tableHeightMixin
