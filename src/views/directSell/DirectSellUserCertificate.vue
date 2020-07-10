<template>
  <div>
    <van-nav-bar title="实名认证" />
    <div v-show="state != 4" class="step">
      <van-steps :active="1">
        <van-step>车辆认证</van-step>
        <van-step>实名认证</van-step>
        <van-step>完成初筛</van-step>
      </van-steps>
    </div>

    <div>
      <div class="getVerift-title">请上传身份证信息</div>
      <!--身份证上传-->
      <div class="verift-photo">
        <!--国徽-->
        <div class="item1">
          <van-uploader
            v-model="fileList1"
            :max-count="1"
            :after-read="afterReadEmblem"
            :max-size = "7 * 1024 * 1024"
            @oversize="oversize"
          />
        </div>
        <!--人像-->
        <div class="item2">
          <van-uploader
            v-model="fileList2"
            :max-count="1"
            :after-read="afterReadFace"
            :max-size = "7 * 1024 * 1024"
            @oversize="oversize"
          />
        </div>
      </div>

      <van-overlay :show="showLoading">
        <div class="wrapper">
          <van-loading size="30px" type="spinner">ocr识别中...</van-loading>
        </div>
      </van-overlay>
      <div class="getVerift-title">客户基本信息</div>
      <van-field v-model="name" label="姓名：" />
      <van-field v-model="IdNumCut" label="身份证号：" />
      <van-field v-model="phone" label="手机号" placeholder="请填写手机号码" :rules="[{validator:phoneValidator, required: true, message: '请填写正确的手机号'}]"/>
      <van-field maxlength="6" v-model="sms" center clearable label="短信验证码" placeholder="请输入短信验证码">
        <template #button>
          <van-button v-if="isShowSend" size="small" type="primary" button-type="info" native-type="button" @click="sendCode" >发送验证码</van-button>
          <van-button v-else size="small" type="primary" button-type="info" native-type="button">
            <template >
              <van-count-down :time="60000" format=" ss 秒" @finish="isShowSend = true" style="color:#fff"/>
            </template>
          </van-button>
        </template>
      </van-field>
    </div>
    <div style="margin:20px">
      <van-button style="margin-top:25px" round block type="info" @click="faceRecognize">开始人脸识别</van-button>
    </div>
  </div>
</template>

<script>
import { getUrlParam } from "../../common/common.js";
import { checkTokenAndSendMsg , authCode ,sendCodeAgain,OCRIdCard,saveUserIdCard ,startCheckFace ,saveUserInfoFive ,authorizationState,isAccessed} from "../../request/api"
export default {
  data() {
    return {
      state: "",
      name: "",
      IdNumCut:'',
      IdNumber:'',
      phone:'',
      sms:'',
      token:'',
      isShowSend: true,
      time: "",
      btnText: "发送验证码",
      // src1: "http://iph.href.lu/500x400?text=国徽面",
      // src2: "http://iph.href.lu/500x400?text=头像面"
      fileList1:[],
      fileList2:[],
      showLoading:false,
      idCardUrlEmblem: "",
      idCardUrlFace: "",
      scanFaceUrl:'',
      managerId:'',
      feedModel:''
    };
  },
  mounted() {

    console.log(getUrlParam())
    this.$store.commit('updateParam',getUrlParam())

    this.state = this.$store.state.state;
    this.managerId = this.$store.state.managerId;
    // console.log("this.managerId:",this.managerId);
    if(this.state == 2){
      this.feedModel = 1
    }
    else if(this.state == 3){
      this.feedModel = 2
    }
    else if(this.state == 6){
      this.feedModel = 3
    }

    console.log("state=" + this.state);
  },
  methods: {
    //图片超过7M
    oversize(){
      this.$toast.fail("图片大小不能超过7M！")
    },
    //校验
    phoneValidator(val){
      return /^1[3456789]\d{9}$/.test(val);
    },
    //国徽面识别
    afterReadEmblem(file){
      var baseImgUrl = file.content;
      const toast = this.$toast.loading({
        duration: 0,
        message: 'ocr识别中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      OCRIdCard(baseImgUrl).then(res => {
        toast.clear();
        if(res.data.data != ""){
          this.$toast.success(res.data.msg);
          console.log(res.data.data)
          this.idCardUrlEmblem = res.data.data.idCardUrl
        }else{
          this.$toast.fail(res.data.msg)
        }

      })

    },
    //人像面识别
    afterReadFace(file){
      var baseImgUrl = file.content;
      const toast = this.$toast.loading({
        duration: 0,
        message: 'ocr识别中...',
        forbidClick: true,
        loadingType: 'spinner',
      });
      OCRIdCard(baseImgUrl).then(res => {
        if(res.data.data != ""){
          toast.clear();
          this.$toast.success(res.data.msg);
          console.log(res.data.data)
          this.idCardUrlFace = res.data.data.idCardUrl;
          this.IdNumber = res.data.data.userInfo.IdNum
          this.IdNumCut = this.IdNumber.substr(0, 3) + '************' + this.IdNumber.substr(this.IdNumber.length - 4);
          this.name = res.data.data.userInfo.Name
        }else{
          this.$toast.fail(res.data.msg)
        }

      })
    },

    //发送验证码
    sendCode(){
      if(/^1[3456789]\d{9}$/.test(this.phone)){
        this.isShowSend = false;
        var phoneNum = this.phone
        sendCodeAgain(phoneNum).then(res => {
          if(res.data.state === 'Y' && res.data.data.stateCode === 1){
            this.$toast.success('短信发送成功！')
          }else{
            this.$toast.fail('短信发送失败！')
          }
        })
      }else{
        this.isShowSend = true;
        this.$toast.fail('手机号码格式不正确')
      }

    },

    //人脸识别
    faceRecognize() {
      if(this.name == '' || this.IdNumber == ''){
        this.$toast.fail("请上传身份证信息")
      }else if(this.name && this.IdNumber && this.phone == ''){
        this.$toast.fail("请输入手机号")
      }else if(this.name && this.IdNumber && this.phone && this.sms ==''){
        this.$toast.fail("请输入验证码")
      } else{
        var code = Object.assign(
          {phone:this.phone},
          {verifyCode:this.sms}
        )
        authCode(code).then(res => {
          console.log(res.data)
          if(res.data.state === 'Y' && res.data.data.stateCode === 1){
            //验证码正确
            var userIdCard = Object.assign(
              {phone:this.phone},
              {name:this.name},
              {idNum:this.IdNumber},
              {idCardFront:this.idCardUrlFace},
              {idCardBack:this.idCardUrlEmblem},
              {clueId:this.$store.state.clueId},
              {managerId:this.$store.state.managerId},
              {feedModel:this.feedModel}
            )
            console.log("保存五要素参数：",userIdCard)
            //保存五要素信息
            saveUserInfoFive(userIdCard).then(res => {
              console.log(res.data.data)
              if(res.data.data.stateCode === 1){
                this.$store.state.id = res.data.data.id;
                var userVo = Object.assign(
                  {name:this.name},
                  {idNo:this.IdNumber},
                  {from:'App'},
                  {state:this.state},
                  {id:res.data.data.id},
                  {managerId:this.$store.state.managerId},
                  {type:this.$store.state.type},
                  {clueId:this.$store.state.clueId},
                  {branchLoanId:this.$store.state.branchLoanId}
                )

                var stateInfo = Object.assign(
                  {name:this.name},
                  {idNumber:this.IdNumber},
                  {phone:this.phone}
                )

                console.log("stateInfo",stateInfo)
                //人员签约状态
                authorizationState(stateInfo).then(res => {
                    console.log(res.data.data)
                    if(res.data.data.state == '00000'){
                      this.$store.state.agreement = res.data.data.agreement;

                      //客户经理验证
                      var userInfo = Object.assign(
                        {phone:this.phone},
                        {name:this.name},
                        {idNum:this.IdNumber},
                        {clueId:this.$store.state.clueId},
                      )
                      isAccessed(userInfo).then(res => {
                        console.log(res.data.data.stateCode)
                        if(res.data.data.stateCode === 1){
                          this.$router.push({
                            path:'/certificateResult',
                            managerId:this.managerId
                          })
                        }else if(res.data.data.stateCode === -1){
                          this.$toast.fail('vin码保存失败！')
                        }else{
                          this.$toast.fail('实名认证未通过！')
                        }
                      })

                    }else if(res.data.data.state == '20000'){
                      // 人脸核身
                      startCheckFace(userVo).then(res => {
                        this.scanFaceUrl = res.data.data;
                        console.log(this.scanFaceUrl)
                        //todo later
                        window.location.href = this.scanFaceUrl;
                      })
                    }
                })

              }else if(res.data.data.stateCode === -1){
                this.$toast.fail('信息不一致')
              }else if(res.data.data.stateCode === 0){
                this.$toast.fail('保存失败！')
              }
            })
          }else{
            this.$toast.fail('验证码错误！')
          }
        })
      }


      //test
      // this.$router.push({path:'/startCertificate'})

    },


  }
};
</script>

<style scoped>
.getVerift-title {
  padding: 15px;
  font-size: 18px;
  color: #3085be;
}
</style>
<style>
  .verift-photo {
    width: 90%;
    margin: 0 auto;
    margin-top: 10%;
  }
  .item1{
    width: 75%;
    margin: 0 auto;
    height: 180px;
    border-radius: 6px;
    background: url("../../assets/emblem.png") no-repeat ;
    background-size: contain;
    margin-bottom: 5%;
  }
  .item2{
    width: 75%;
    margin: 0 auto;
    height: 180px;
    border-radius: 6px;
    background: url("../../assets/face.png") no-repeat;
    background-size: contain;
  }
  .verift-photo .van-uploader__input{
    width: auto;
  }
  .verift-photo .van-uploader{
    width: 100%;
  }
  .verift-photo .van-uploader__upload{
    background-color: transparent;
    width: 100%;
    height: 180px;
  }
  .verift-photo .van-uploader__preview-image,.van-uploader__preview{
  width: 100%;
  height: 180px;
    margin: 0;
  }
</style>
