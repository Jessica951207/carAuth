<template>
  <div>

    <div class="result-icon">
      <div v-if="code == '0'" style="text-align: center">
        <van-icon name="checked" color="#1989fa" size="70" />
        <p> {{alertText}} </p>
      </div>
      <div v-else style="text-align: center">
        <van-icon name="clear" color="#fd0000" size="70"/>
        <p>{{alertText}} </p>
      </div>
    </div>

    <div style="margin:20px" v-show="signShow">
      <van-button
        style="margin-top:25px"
        round
        block
        type="info"
        @click="showAlertContent = true"
      >签订征信协议</van-button>
    </div>
    <van-popup v-model="showAlertContent" position="bottom">
      <div>
        <div class="alertContent">
          <p>本服务使用过程中会采集相关信息，我们将确保本次采集到的信息严格保密，采集信息包括以下</p>
          <ul>
            <li>人脸及身份信息</li>
            <li>授权图像信息</li>
            <li>操作行为信息</li>
          </ul>
        </div>
        <div class="checkbox">
          <van-checkbox icon-size="15px" v-model="isChecked" checked-color="#07c160"></van-checkbox>
          <div style="font-size:12px">
            已仔细阅读并同意
          </div>
        </div>
        <div style="margin:20px">
          <van-button style="margin-top:25px" round block type="info" @click="sure">同意并授权</van-button>
        </div>
      </div>
    </van-popup>
  </div>
</template>

<script>
import { getUrlParam ,getUrlParamSec ,getUrlParamFirst} from "../../common/common.js";
import { checkSign } from '../../request/api'

export default {
  data() {
    return {
      state: "",
      showAlertContent: false,
      isChecked: false,
      orderNo:'',
      code:'',
      newSignature:'',
      alertText:'',
      signShow:true,
      liveRate:'',
      id:''
    };
  },
  mounted() {
    this.state = getUrlParamSec("state");
    this.id = getUrlParamSec("id");
    this.$store.state.state = getUrlParamSec("state");
    this.$store.state.id = getUrlParamSec("id");
    this.$store.state.managerId = getUrlParamSec("managerId");
    this.$store.state.type = getUrlParamSec("type");
    this.$store.state.clueId = getUrlParamSec("clueId");
    this.$store.state.branchLoanId = getUrlParamSec("branchLoanId");

    console.log("this.state is==================",this.state,"this.id is:",this.id,this.$store.state.id)

    this.$store.state.checkOrder = getUrlParamFirst("orderNo")
    this.orderNo = getUrlParamFirst("orderNo")
    this.code = getUrlParamFirst("code")
    this.newSignature = getUrlParamFirst("newSignature")
    this.liveRate = getUrlParamFirst("liveRate")
    console.log('*************************',this.orderNo, this.code,this.newSignature,this.liveRate)

    if(this.code === '0' && this.liveRate != undefined){
      this.alertText = '人脸核身成功,正在验证...';
      //todo later
      this.checkSignApi();
    }else {
      this.signShow = false;
      this.alertText = '人脸核身失败'
    }

  },
  methods: {
    //获取结果验证签名
    checkSignApi(){
      var userVo = Object.assign(
        {orderNo:this.orderNo},
        {code:this.code}
      )
      checkSign(userVo).then(res => {
        console.log('====',res.data)
        if (res.data.state === "Y" &&  res.data.data === this.newSignature){
          this.alertText = "人脸核身成功，验证成功！",
           this.signShow = true;
        }else {
          this.alertText = "人脸核身成功，验证失败！"
          this.code = -1;
          this.signShow = false;
        }
      })

    },
    sure() {
      let that = this;
      if(this.isChecked === true){
          this.$router.push({
            path: "/authorizationBook",

          });
      }
      else{
        this.$toast('请先勾选同意授权书')
      }

    },

  }
};
</script>

<style>
.tempDiv {
  height: 100px;
  text-align: center;
  line-height: 100px;
}
.result-icon{
  margin-top: 70px;
}
.alertContent {
  margin: 5%;
  background: #efefef;
  padding: 3%;
  font-size: 14px;
}
.alertContent ul li{
  list-style-type: disc ;
  margin-left: 5%;
}
.checkbox {
  margin: 5%;
  display: flex;
}
.van-checkbox {
  width: 15px;
  margin-right: 5px;
}
</style>
