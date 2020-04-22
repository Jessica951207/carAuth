<template>
    <div>
      <van-nav-bar title="初筛" />
      <div class="step">
        <van-steps :active="2">
          <van-step>车辆认证</van-step>
          <van-step>实名认证</van-step>
          <van-step>完成初筛</van-step>
        </van-steps>
      </div>

      <template>
        <div class="result">
          <div v-if="resultisSuccess == true">
            <van-icon name="checked" size="70px" color="#20CE43" />
            <div class="result-text">
              <span>恭喜您，通过初筛！</span>
            </div>
          </div>
          <div v-else>
            <van-icon name="clear" size="70px" color="#ee0a24" />
            <div class="result-text">
              <span>很抱歉，没能通过初筛！</span>
            </div>
          </div>
        </div>

        <div style="margin-top:40px">
          <div class="list-header">客户基本信息</div>
          <van-form @submit="onSubmit">
            <van-field readonly v-model="name" label="姓名：" />
            <van-field readonly v-model="idNum" label="身份证号：" />
            <van-field readonly v-model="phone" label="手机号：" />
          </van-form>
          <div class="list-header">提示信息</div>
          <van-field readonly disabled show-word-limit v-model="message" type="textarea" label="备注：" />
          <div style="margin:30px">
            <van-button style="margin-top:25px" round block type="info" v-show="resultisSuccess == true" @click="delivery">我要进件</van-button>
          </div>
        </div>
      </template>

    </div>
</template>

<script>
  import { getUrlParam } from "../../common/common.js";
  import { queryUserInfo , updateLoanStatus } from '../../request/api'
    export default {
      name: "screenResult",
      data(){
          return{
            resultisSuccess:'',
            name:'',
            idNum:'',
            phone:'',
            message:'',
            investor:'',
            isShow:true,
            managerId:''
          }
      },
      mounted(){
        this.managerId = this.$store.state.managerId;
        this.clueId = this.$store.state.clueId;
        this.type = this.$store.state.type;
        this.id = this.$store.state.id;
        this.state = this.$store.state.state;
        // this.managerId = getUrlParam("managerId")
        // this.clueId = getUrlParam("clueId")
        // this.type = getUrlParam("type")
        // this.id = getUrlParam("id")
        // this.$store.state.managerId = this.managerId;
        //
        // this.$store.state.clueId = this.clueId;
        // this.$store.state.type = this.type;
        // this.$store.state.id = this.id;
        // console.log(this.managerId)

        if(this.$store.state.ScreenResult == "0"){
          this.resultisSuccess = true;
        }else {
          this.resultisSuccess = false;
        }

        this.getUserInfo();
        this.updateState();
      },
      methods:{
        //更新状态
        updateState(){
          var update = Object.assign(
            {state:'A040'},
            {clueId:this.$store.state.clueId}
          )
          updateLoanStatus(update).then(res => {
            if(res.data.data.stateCode === 0){
              this.$toast.fail('状态保存失败！')
            }
          })
        },
        //查询用户信息
        getUserInfo(){
          var id = Object.assign({id:this.$store.state.id})
          queryUserInfo(id).then(res => {
            console.log(res.data.data);
            this.name = res.data.data.name;
            this.idNum = res.data.data.idNum;
            this.phone = res.data.data.phone;
            this.idNum = this.idNum.substr(0, 3) + '************' + this.idNum.substr(this.idNum.length - 4);
            this.phone =  '*******' + this.phone.substr(7);
          })
        },
        delivery(){
          this.$router.push({
            path:'/chooseInvestor',
            // query:{
            //   state: this.state,
            //   managerId:this.managerId,
            //   type:this.type,
            //   clueId:this.clueId,
            //   id:this.id
            // }
          })
        },
        onSubmit(){

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
