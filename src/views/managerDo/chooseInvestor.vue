<template>
    <div class="">
      <template>
        <van-nav-bar title="直销初筛" />
        <div class="step">
          <van-steps :active="2">
            <van-step>车辆认证</van-step>
            <van-step>实名认证</van-step>
            <van-step>完成初筛</van-step>
          </van-steps>
        </div>

        <div class="CertificateResult">
          <div class="list-header">进件信息</div>
          <div style="margin-top:20px">
            <van-form @submit="onSubmit">
              <van-field
                readonly
                clickable
                is-link
                v-model="investor"
                name="investor"
                label="资方"
                placeholder="请选择资方"
                @click="chooseInvestor"
                :rules="[{ required: true, message: '请选择资方' }]"
              />
              <van-field
                readonly
                clickable
                is-link
                v-model="channel"
                name="channel"
                label="渠道"
                placeholder="请选择渠道"
                @click="chooseChannel"
                :rules="[{ required: true, message: '请选择渠道' }]"
              />
              <div style="margin:30px">
                <van-button style="margin-top:25px" round block type="info">提交进件</van-button>
              </div>
            </van-form>

            <van-popup v-model="investorShowPicker" position="bottom" :style="{ height: '300px',width: '100%'}">
              <van-picker
                show-toolbar
                title="标题"
                :columns="investorColumns"
                @cancel="investorCancel"
                @confirm="investorConfirm"
              />
            </van-popup>
            <van-popup v-model="channelShowPicker" position="bottom" :style="{ height: '300px',width: '100%'}">
              <van-picker
                show-toolbar
                title="标题"
                :columns="channelColumns"
                @cancel="channelCancel"
                @confirm="channelConfirm"
              />
            </van-popup>

          </div>
        </div>
      </template>
    </div>
</template>

<script>
  import { getUrlParam } from "../../common/common.js";
  import { searchInvestor , searchChannel ,submitPieces,updateClue ,updateLoanStatus } from '../../request/api'
    export default {
      data(){
          return{
            investor:'',
            investorShowPicker:false,
            investorColumns: [],
            investorIdArray:[],
            investorId:'',
            channel:'',
            channelShowPicker:false,
            channelColumns: [],
            channelIdArray:[],
            channelId:'',
            clueId:'',
            type:'',
            managerId:'',
            state:'',
            feedModel:'',
            bankCode:'',
            loanId:'',
            bankName:"",
            orderState:''

          }
      },
      mounted(){
        // this.$store.commit('updateParam',getUrlParam())
        this.managerId = this.$store.state.managerId;
        this.clueId = this.$store.state.clueId;
        this.type = this.$store.state.type;
        this.state = this.$store.state.state;

        if (this.state == 2) {
          //客户经理
          this.feedModel = 1;
        }
        else if(this.state == 3){
          //代理人
          this.feedModel = 2;
        }
        //渠道直销
        else if(this.state == 6){
          this.feedModel = 3;
        }
          // this.managerId = getUrlParam("managerId")
          // this.type = getUrlParam("type")
          // this.clueId = this.$store.state.clueId
          // console.log("this.managerId",this.managerId)
         this.getInvestor();

      },
      methods:{
        //提交进件
        onSubmit(values){
          const toast = this.$toast.loading({
            duration: 0,
            message: '加载中...',
            forbidClick: true,
            loadingType: 'spinner',
          });
          console.log(values)
          var subInfo = Object.assign(
            {investor:this.investorId},
            {dealerId:this.channelId},
            {clueId:this.clueId}
          )
          var caseInfo = Object.assign(
            {managerId:this.$store.state.managerId},
            {feedModel:this.feedModel},
            {clueId:this.clueId},
          )

          console.log(subInfo)
          //更新资方及经销商
          updateClue(subInfo).then(res => {
            console.log(res.data.data)
            if(res.data.data.stateCode == 1){
              console.log('更新成功！')
              //进件
              submitPieces(caseInfo).then(res => {
                toast.clear();
                console.log(res.data.data)
                if(res.data.data.stateCode == 1){
                  this.$toast.success("进件成功!");

                  this.loanId = res.data.data.loanId;
                  this.bankCode = res.data.data.bankCode;
                  this.bankName = res.data.data.bankName;
                  this.orderState = res.data.data.orderState;

                  /**
                   * js 跟APP交互
                   * */
                  var AppData = Object.assign(
                    {loanID:this.loanId},
                    {bankCode:this.bankCode},
                    {bankName:this.bankName},
                    {orderState:this.orderState},
                  );
                  var u = navigator.userAgent,
                    app = navigator.appVersion;
                  var isAndroid = u.indexOf('Android') > -1 || u.indexOf('Linux') > -1; //android终端或者uc浏览器
                  var isiOS = !!u.match(/(i[^;]+;( U;)? CPU.+Mac OS X)/); //ios终端
                  if(isiOS){
                    window.webkit.messageHandlers.deliveryClueID.postMessage(AppData);
                  }else if(isAndroid){
                    android.deliveryClueID(JSON.stringify(AppData));
                  }
                  /**
                   * js 跟APP交互
                   * */

                  // this.updateState()
                }else{
                  toast.clear()
                  this.$toast.fail("进件失败！")
                }
              })

            }else{
              console.log('更新失败！')
              toast.clear()
            }
          })

        },
        //更新状态
        updateState(){
          var update = Object.assign(
            {state:'A050'},
            {clueId:this.$store.state.clueId}
          )
          updateLoanStatus(update).then(res => {
            if(res.data.data.stateCode === 0){
              this.$toast.fail('状态保存失败！')
            }
          })
        },
        //查询资方
        getInvestor(){
          var managerId = Object.assign({managerId:this.managerId},)
          searchInvestor(managerId).then(res => {
            console.log("资方返回",res.data.data)
            var investorArray = res.data.data;
            investorArray.map((cur,index) => {
              this.investorColumns.push(cur.ORGNAME);
              this.investorIdArray.push(cur.ORGID);
            })

          })
        },
        //查询渠道
        getChannel(){
          var channel = Object.assign(
            {managerId:this.managerId},
            {bankCode:this.bankCode},
            {type:this.type},
            {clueId:this.$store.state.clueId},
            {franchiserId:this.$store.state.franchiserId}
          )
          console.log("渠道：",channel);
          searchChannel(channel).then(res => {
            console.log(res.data.data)
            this.channelColumns = [];
            this.channelIdArray = [];

            var channelArray = res.data.data;

            channelArray.map((cur,index) =>{
              this.channelColumns.push(cur.D_NAME)
              this.channelIdArray.push(cur.D_ID)
            })
          })
        },
        //选择资方
        chooseInvestor(){
          this.investorShowPicker = true;
        },
        investorConfirm(value, index) {
          this.investor = value;
          console.log("选择的资方是：",value)
          this.investorShowPicker = false;
          this.investorId = this.investorIdArray[this.investorColumns.indexOf(value)];
          this.bankCode = this.investorId;
          console.log("this.bankCode",this.bankCode)
          this.getChannel();
          this.channel = ""

        },
        investorCancel() {
          this.investorShowPicker = false;
        },
        //选择渠道
        chooseChannel(){
          this.channelShowPicker = true;
        },
        channelConfirm(value, index) {
          this.channel = value;
          this.channelShowPicker = false;

          this.channelId = this.channelIdArray[this.channelColumns.indexOf(value)];
          console.log(this.channelId)
        },
        channelCancel() {
          this.channelShowPicker = false;
        },


      }
    }
</script>

<style scoped>
  .list-header{
    height: 35px;
    padding-left: 12px;
    background:#e8f0fe;
    line-height: 38px;
  }
</style>
