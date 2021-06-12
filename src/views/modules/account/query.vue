<template>
  <div>
    <div class="query-container">
    </div>
    <user-info ref="userInfo"></user-info>
  </div>
</template>

<script>
import UserInfo from './UserInfo'

export default {
  name: 'query',
  components: {UserInfo},
  data() {
    return {
      account: '',
    }
  },
}
</script>

<style lang="scss">
.query-container {
  .el-form {
    text-align: center;
  }
  .el-form-item {
    margin-right: 0;
    margin-bottom: 0;
  }
}
@media screen and (max-width: 479px) {
  .query-container {
    width: 100vw;
    padding: 1rem 0;
  }
}
@media screen and (min-width: 480px) {
  .query-container {
    margin: 15px auto 0;
    width: 380px;
  }
}
</style>
