<template>
  <div>
    <div class="result">
      <van-icon name="checked" size="70px" color="#20CE43" />
      <div class="result-text">
        <span>申请提交成功！</span>
      </div>
    </div>
  </div>
</template>

<script>
    export default {
        name: "pushSuccess",
      data(){
          return{

          }
      },
      methods:{

      }
    }
</script>

<style scoped>
  .result {
    text-align: center;
    width: 100%;
    margin-top: 30px;
  }
  .result-text{
    margin-top: 5%;
  }
</style>
