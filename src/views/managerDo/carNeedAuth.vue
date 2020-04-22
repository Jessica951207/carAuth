<template>
    <div>
      <van-nav-bar title="直销初筛" />
      <div class="step">
        <van-steps :active="-1">
          <van-step>车辆认证</van-step>
          <van-step>实名认证</van-step>
          <van-step>完成初筛</van-step>
        </van-steps>
      </div>

      <template>
        <div class="result">
          <van-icon name="clear" size="70px" color="#ee0a24" />
          <div class="result-text">
            <span>车辆认证失败！</span>
          </div>
          <!--<div style="margin:50px">-->
            <!--<van-button style="margin-top:25px" round block type="info" @click="carAuth">重新认证</van-button>-->
          <!--</div>-->
        </div>
      </template>

    </div>
</template>

<script>
  import { getUrlParam } from "../../common/common.js";
  import { updateLoanStatus } from '../../request/api'
    export default {
      name: "screenResult",
      data(){
          return{
            name:'',
            idNum:'',
            phone:'',
            message:'',
            managerId:''
          }
      },
      mounted(){

      },
      methods:{
        carAuth(){
          this.$router.push({
            path:'/index',
            query:{
              state: 1,
              managerId:101
            }
          })
        }
      }
    }
</script>

<style scoped>
.result{
  text-align: center;
}
  .list-header{
    height: 35px;
    padding-left: 12px;
    background:#e8f0fe;
    line-height: 38px;
  }
</style>
