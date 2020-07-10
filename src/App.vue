<template>
  <div id="app">
    <!--<keep-alive>-->
    <!--<router-view/>-->
    <!--</keep-alive>-->

    <router-view/>
    <!--<hover/>-->
  </div>
</template>

<script>
  import hover from './views/Temp/hover'
  export default {
    name: 'App',
    data() {
      return {
      };
    },
    // components:{
    //    hover
    // },

    created(){
      //在页面加载时读取sessionStorage里的状态信息
      if (sessionStorage.getItem("store") ) {
        this.$store.replaceState(Object.assign(
          {},
          this.$store.state,
          JSON.parse(sessionStorage.getItem("store"))
          )
        )
      }
      //在页面刷新时将vuex里的信息保存到sessionStorage里
      window.addEventListener("beforeunload",()=>{
        sessionStorage.setItem("store",JSON.stringify(this.$store.state))
      })
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
  }
  #demo img{
    width: 100%;
  }
</style>
<style>
  .wrapper {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
  }
  .step {
    padding-left: 20px;
    padding-right: 20px;
  }
  .changeChassisID {
    margin-top: 10px;
    padding: 16px;
    text-align: center;
  }
  .changeChassisID-title {
    font-size: 17px;
    font-weight: bold;
  }
  .license{
    text-align: center;
  }
  .van-field--error .van-field__control, .van-field--error .van-field__control::placeholder{
    color: #969799!important;
  }
  .van-field--error .van-field__control, .van-field--error .van-field__control::-webkit-input-placeholder{
    color: #969799!important;
  }
</style>
