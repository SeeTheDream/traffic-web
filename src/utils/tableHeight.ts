function calcHeight () {
  if (document.querySelector('.el-table')) {
    // @ts-ignore
      const headHeight: number = document.querySelector('.head-condition').clientHeight
    // @ts-ignore
    const pageHeight: number = document.querySelector('.page.el-pagination').clientHeight
    return window.innerHeight - headHeight - pageHeight - 35
  }
}

const tableHeightMixin = {
  data() {
    return {
      tableHeight: null
    }
  },
  mounted() {
    // @ts-ignore
      this.tableHeight = calcHeight()
  }
}

export default tableHeightMixin
