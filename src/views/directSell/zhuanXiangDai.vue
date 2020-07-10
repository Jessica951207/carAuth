<template>
  <div class="main">
    <div class="headerBG">
      <img v-if="state == 2" src="../../assets/GZTopBanner.jpg" width="100%" />
      <img v-if="state == 3" src="../../assets/bg01_01.png" width="100%">
      <img v-if="state == 6" src="../../assets/bg03_03.jpg" width="100%">
    </div>
<!--    <div class="hHeight"></div>-->
    <div class="content">
      <van-form @submit="onSubmit">
        <van-field
          v-model="mainUser"
          name="mainUser"
          label="姓名:"
          placeholder="请填写姓名"
          :rules="[{ required: true, message: '请填写姓名' }]"/>
        <van-field
          is-link
          readonly
          clickable
          v-model="city"
          name="city"
          label="常住地:"
          placeholder="请选择所属省份"
          @click="showAddress = true"
          :rules="[{ required: true, message: '请选择所属省份' }]"
        />
        <van-field
          is-link
          readonly
          clickable
          v-model="carBrandName"
          name="carBrandName"
          label="车辆品牌:"
          placeholder="请选择车辆品牌"
          @click="toCarModel"
          :rules="[{ required: true, message: '请选择车辆品牌' }]"
        />
        <van-field
          is-link
          readonly
          clickable
          v-model="remark1"
          name="remark1"
          label="车辆归属地:"
          placeholder="请选择车辆归属地"
          @click="showCarLocation = true"
          :rules="[{ required: true, message: '请选择车辆归属地' }]"
        />
        <van-field v-model="loanAmount" name="loanAmount" label="申请金额:" placeholder="请填写申请金额" :rules="[{validator:loanValidator,required: true, message: '请填写正确的申请金额' }]"/>

        <van-field v-model="mainPhone" name="mainPhone" label="手机号:" placeholder="请填写手机号" :rules="[{validator:phoneValidator, required: true, message: '请填写正确的手机号' }]"/>

        <van-field  maxlength="6" v-model="validateCode" name="validateCode" center clearable label="短信验证码:" placeholder="请输入短信验证码" :rules="[{ required: true, message: '请输入短信验证码' }]">
          <template #button>
            <van-button v-if="isShowSend && state == 2" size="small" type="primary" button-type="info" native-type="button" color="#cf271f" @click="getValidateCode" >发送验证码</van-button>
            <van-button v-if="isShowSend && state == 3" size="small" type="primary" button-type="info" native-type="button" color="#171C61" @click="getValidateCode" >发送验证码</van-button>
            <van-button v-if="isShowSend && state == 6" size="small" type="primary" button-type="info" native-type="button" color="#60007d" @click="getValidateCode" >发送验证码</van-button>
            <van-button v-if="!isShowSend && state == 2" size="small" type="primary" button-type="info" native-type="button" color="#cf271f">
              <template >
                <van-count-down :time="60000" format=" ss 秒" @finish="isShowSend = true" style="color:#fff"/>
              </template>
            </van-button>
            <van-button v-if="!isShowSend && state == 3" size="small" type="primary" button-type="info" native-type="button" color="#171C61">
              <template >
                <van-count-down :time="60000" format=" ss 秒" @finish="isShowSend = true" style="color:#fff"/>
              </template>
            </van-button>
            <van-button v-if="!isShowSend && state == 6" size="small" type="primary" button-type="info" native-type="button" color="#60007d">
              <template >
                <van-count-down :time="60000" format=" ss 秒" @finish="isShowSend = true" style="color:#fff"/>
              </template>
            </van-button>
          </template>
        </van-field>
        <div style="margin: 16px;display: none">
          <van-button round block type="info" native-type="submit" id="submitBtn">
            提交
          </van-button>
        </div>
      </van-form>

      <div class="bottomContent">
        <span class="bottomContent_Title">申请流程</span>
        <div class="bottomContent_bottomBG">
          <img src="../../assets/GZ_foot_03.png" width="100%" />
        </div>
        <div class="bottomContent_Content">
          <span>车主专享贷是中联惠捷的合作机构与银行联合推出的车辆抵押贷款服务。线下贷款服务由合作机构与银行提供。</span>
        </div>
      </div>

    </div>

    <!--城市popup-->
    <van-popup
      v-model="showAddress"
      position="bottom"
      :style="{ height: '300px', width: '100%'}"
      get-container="body"
    >
      <van-area
        :area-list="areaList"
        value="110100"
        :columns-num="2"
        title="标题"
        confirm-button-text="确定"
        @confirm="onSelectCity"
        @cancel="hideProCityList"
      />
    </van-popup>

    <!--车辆所在地popup-->
    <van-popup
      v-model="showCarLocation"
      position="bottom"
      :style="{ height: '300px', width: '100%'}"
      get-container="body"
    >
      <van-picker
        show-toolbar t
        itle="标题"
        :columns="columns"
        @confirm="onSelectCarLocation"
        @cancel="hideCarLocation"/>

    </van-popup>

    <!--是否进行初筛-->
    <van-popup v-model="onShowNext" position="bottom">

    <template v-if="state == 2 || state == 6">
      <div class="submitResult">

        <div style="text-align: left;">
          您的专属汽车金融专家：
          <div style="margin-top: 0px; height: 40px;line-height: 40px; display: flex;justify-content: space-between">
            <div style="display: flex">
              <van-icon class="managerInfo-icon" size="20" name="manager" color="#20CE43"  />
              <span>{{this.managerName}}</span>
            </div>

            <div style="display: flex">
              <van-icon class="managerInfo-icon"  size="20" name="phone" color="#20CE43" />
              <a :href="'tel:' + this.managerTel" style="color: #000000">{{this.managerTel}}</a>
            </div>
          </div>
        </div>

        <div style="margin-top:20px">
          <van-icon name="checked" size="70px" color="#20CE43" />
        </div>
        <div class="list-header">是否想要进行初筛获取额度</div>
        <div class="bottomBtn">
          <van-button style="width:45%" round block type="info" @click="noNeed">不需要</van-button>
          <van-button style="width:45%" round block type="info" @click="goOn">继续</van-button>
        </div>
      </div>
    </template>
    <template v-else>
      <div class="submitResult">
        <div style="margin-top:20px">
          <van-icon name="checked" size="70px" color="#20CE43" />
        </div>
        <div class="list-header">是否想要进行初筛获取额度</div>
        <div class="bottomBtn">
          <van-button style="width:45%" round block type="info" @click="noNeed">不需要</van-button>
          <van-button style="width:45%" round block type="info" @click="goOn">继续</van-button>
        </div>
      </div>
    </template>

    </van-popup>

    <div @click="onApplyBtn" :style="{backgroundColor:btnColor}" class="Bottom-Btn">立即申请</div>

    <!--选择车型-->
    <van-popup v-model="showCarModel" :style="{ width: '100%',height:'100%' }" >
      <div>
        <van-nav-bar title="车辆品牌" left-text="返回" left-arrow @click-left="onClickLeft"/>
        <form action="/">
          <van-search
            v-model="value"
            placeholder="请输入搜索关键词"
            @input="HandleSearch"
          />
        </form>

        <p class="title">常用车辆品牌</p>
        <div class="car">
          <p class="font" v-for="item in oftenBrand" @click="chooseBrand(item)">{{item}}</p>
        </div>
        <p class="title">所有车辆品牌</p>
        <div class="car">
          <p class="font" v-for="item in brandLists" @click="chooseBrand(item)">{{item}}</p>
        </div>

      </div>
    </van-popup>

    <!--loading加载-->
    <van-overlay :show="showLoading">
      <div class="wrapper">
        <van-loading type="spinner" />
      </div>
    </van-overlay>


  </div>
</template>
<script>
import { loanApplication ,validateCode ,seachMan ,carBrandList,wechat} from '../../request/api';
export default {
  data() {
    return {
      showLoading:false,
      state: "",
      managerId: "",
      mainUser: "",
      city: "",
      businessProvince:'',
      businessCity:'',
      carBrandName: "",
      remark1: "",
      loanAmount: "",
      mainPhone: "",
      validateCode: "",
      onShowNext: false,
      areaList:{
        province_list:{
          110000:"北京市",
          120000:"天津市",
          130000:"河北省",
          140000:"山西省",
          150000:"内蒙古自治区",
          210000:"辽宁省",
          220000:"吉林省",
          230000:"黑龙江省",
          310000:"上海市",
          320000:"江苏省",
          330000:"浙江省",
          340000:"安徽省",
          350000:"福建省",
          360000:"江西省",
          370000:"山东省",
          410000:"河南省",
          420000:"湖北省",
          430000:"湖南省",
          440000:"广东省",
          450000:"广西壮族自治区",
          460000:"海南省",
          500000:"重庆市",
          510000:"四川省",
          520000:"贵州省",
          530000:"云南省",
          540000:"西藏自治区",
          610000:"陕西省",
          620000:"甘肃省",
          630000:"青海省",
          640000:"宁夏回族自治区",
          650000:"新疆"
        },
        city_list:{
          110100:"北京市",
          120100:"天津市",
          130100:"石家庄市",
          131100:"衡水市",
          131000:"廊坊市",
          130900:"沧州市",
          130800:"承德市",
          130700:"张家口市",
          130600:"保定市",
          130500:"邢台市",
          130400:"邯郸市",
          130300:"秦皇岛市",
          130200:"唐山市",
          140100:"太原市",
          141100:"吕梁市",
          141000:"临汾市",
          140900:"忻州市",
          140800:"运城市",
          140700:"晋中市",
          140600:"朔州市",
          140500:"晋城市",
          140400:"长治市",
          140300:"阳泉市",
          140200:"大同市",
          150100:"呼和浩特市",
          152900:"阿拉善盟",
          152500:"锡林郭勒盟",
          152200:"兴安盟",
          150900:"乌兰察布市",
          150800:"巴彦淖尔市",
          150700:"呼伦贝尔市",
          150600:"鄂尔多斯市",
          150500:"通辽市",
          150400:"赤峰市",
          150300:"乌海市",
          150200:"包头市",
          210100:"沈阳市",
          211400:"葫芦岛市",
          211300:"朝阳市",
          211200:"铁岭市",
          211100:"盘锦市",
          211000:"辽阳市",
          210900:"阜新市",
          210800:"营口市",
          210700:"锦州市",
          210600:"丹东市",
          210500:"本溪市",
          210400:"抚顺市",
          210300:"鞍山市",
          210200:"大连市",
          220100:"长春市",
          222400:"延边朝鲜族自治州",
          220800:"白城市",
          220700:"松原市",
          220600:"白山市",
          220500:"通化市",
          220400:"辽源市",
          220300:"四平市",
          220200:"吉林市",
          230100:"哈尔滨市",
          232700:"大兴安岭地区",
          231200:"绥化市",
          231100:"黑河市",
          231000:"牡丹江市",
          230900:"七台河市",
          230800:"佳木斯市",
          230700:"伊春市",
          230600:"大庆市",
          230500:"双鸭山市",
          230400:"鹤岗市",
          230300:"鸡西市",
          230200:"齐齐哈尔市",
          310100:"上海市",
          320100:"南京市",
          321300:"宿迁市",
          321200:"泰州市",
          321100:"镇江市",
          321000:"扬州市",
          320900:"盐城市",
          320800:"淮安市",
          320700:"连云港市",
          320600:"南通市",
          320500:"苏州市",
          320400:"常州市",
          320300:"徐州市",
          320200:"无锡市",
          330100:"杭州市",
          331100:"丽水市",
          331000:"台州市",
          330900:"舟山市",
          330800:"衢州市",
          330700:"金华市",
          330600:"绍兴市",
          330500:"湖州市",
          330400:"嘉兴市",
          330300:"温州市",
          330200:"宁波市",
          340100:"合肥市",
          341800:"宣城市",
          341700:"池州市",
          341600:"亳州市",
          341500:"六安市",
          341300:"宿州市",
          341200:"阜阳市",
          341100:"滁州市",
          341000:"黄山市",
          340800:"安庆市",
          340700:"铜陵市",
          340600:"淮北市",
          340500:"马鞍山市",
          340400:"淮南市",
          340300:"蚌埠市",
          340200:"芜湖市",
          350100:"福州市",
          350900:"宁德市",
          350800:"龙岩市",
          350700:"南平市",
          350600:"漳州市",
          350500:"泉州市",
          350400:"三明市",
          350300:"莆田市",
          350200:"厦门市",
          360100:"南昌市",
          361100:"上饶市",
          361000:"抚州市",
          360900:"宜春市",
          360800:"吉安市",
          360700:"赣州市",
          360600:"鹰潭市",
          360500:"新余市",
          360400:"九江市",
          360300:"萍乡市",
          360200:"景德镇市",
          370100:"济南市",
          371700:"菏泽市",
          371600:"滨州市",
          371500:"聊城市",
          371400:"德州市",
          371300:"临沂市",
          371200:"莱芜市",
          371100:"日照市",
          371000:"威海市",
          370900:"泰安市",
          370800:"济宁市",
          370700:"潍坊市",
          370600:"烟台市",
          370500:"东营市",
          370400:"枣庄市",
          370300:"淄博市",
          370200:"青岛市",
          410100:"郑州市",
          419000:"省直辖县级行政区划",
          411800:"济源市",
          411700:"驻马店市",
          411600:"周口市",
          411500:"信阳市",
          411400:"商丘市",
          411300:"南阳市",
          411200:"三门峡市",
          411100:"漯河市",
          411000:"许昌市",
          410900:"濮阳市",
          410800:"焦作市",
          410700:"新乡市",
          410600:"鹤壁市",
          410500:"安阳市",
          410400:"平顶山市",
          410300:"洛阳市",
          410200:"开封市",
          420100:"武汉市",
          429000:"省直辖县级行政区划",
          422800:"恩施土家族苗族自治州",
          421300:"随州市",
          421200:"咸宁市",
          421100:"黄冈市",
          421000:"荆州市",
          420900:"孝感市",
          420800:"荆门市",
          420700:"鄂州市",
          420600:"襄阳市",
          420500:"宜昌市",
          420300:"十堰市",
          420200:"黄石市",
          430100:"长沙市",
          430200:"株洲市",
          430800:"张家界市",
          433100:"湘西土家族苗族自治州",
          431300:"娄底市",
          431200:"怀化市",
          431100:"永州市",
          431000:"郴州市",
          430900:"益阳市",
          430700:"常德市",
          430600:"岳阳市",
          430500:"邵阳市",
          430400:"衡阳市",
          430300:"湘潭市",
          440100:"广州市",
          442000:"中山市",
          445300:"云浮市",
          445200:"揭阳市",
          445100:"潮州市",
          441900:"东莞市",
          441800:"清远市",
          441700:"阳江市",
          441600:"河源市",
          441500:"汕尾市",
          441400:"梅州市",
          441300:"惠州市",
          441200:"肇庆市",
          440900:"茂名市",
          440800:"湛江市",
          440700:"江门市",
          440600:"佛山市",
          440500:"汕头市",
          440400:"珠海市",
          440300:"深圳市",
          440200:"韶关市",
          450100:"南宁市",
          451400:"崇左市",
          451300:"来宾市",
          451200:"河池市",
          451100:"贺州市",
          451000:"百色市",
          450900:"玉林市",
          450800:"贵港市",
          450700:"钦州市",
          450600:"防城港市",
          450500:"北海市",
          450400:"梧州市",
          450300:"桂林市",
          450200:"柳州市",
          460100:"海口市",
          469000:"省直辖县级行政区划",
          460300:"三沙市",
          460200:"三亚市",
          500100:"重庆市",
          510100:"成都市",
          510300:"自贡市",
          513400:"凉山彝族自治州",
          513300:"甘孜藏族自治州",
          513200:"阿坝藏族羌族自治州",
          512000:"资阳市",
          511900:"巴中市",
          511800:"雅安市",
          511700:"达州市",
          511600:"广安市",
          511500:"宜宾市",
          511400:"眉山市",
          511300:"南充市",
          511100:"乐山市",
          511000:"内江市",
          510900:"遂宁市",
          510800:"广元市",
          510700:"绵阳市",
          510600:"德阳市",
          510500:"泸州市",
          510400:"攀枝花市",
          520100:"贵阳市",
          522700:"黔南布依族苗族自治州",
          522600:"黔东南苗族侗族自治州",
          522300:"黔西南布依族苗族自治州",
          520600:"铜仁市",
          520500:"毕节市",
          520400:"安顺市",
          520300:"遵义市",
          520200:"六盘水市",
          530100:"昆明市",
          533400:"迪庆藏族自治州",
          533300:"怒江傈僳族自治州",
          533100:"德宏傣族景颇族自治州",
          532900:"大理白族自治州",
          532800:"西双版纳傣族自治州",
          532600:"文山壮族苗族自治州",
          532500:"红河哈尼族彝族自治州",
          532300:"楚雄彝族自治州",
          530900:"临沧市",
          530800:"普洱市",
          530700:"丽江市",
          530600:"昭通市",
          530500:"保山市",
          530400:"玉溪市",
          530300:"曲靖市",
          540100:"拉萨市",
          542600:"林芝地区",
          542500:"阿里地区",
          542400:"那曲地区",
          542300:"日喀则地区",
          542200:"山南地区",
          542100:"昌都地区",
          610100:"西安市",
          611000:"商洛市",
          610900:"安康市",
          610800:"榆林市",
          610700:"汉中市",
          610600:"延安市",
          610500:"渭南市",
          610400:"咸阳市",
          610300:"宝鸡市",
          610200:"铜川市",
          620100:"兰州市",
          623000:"甘南藏族自治州",
          622900:"临夏回族自治州",
          621200:"陇南市",
          621100:"定西市",
          621000:"庆阳市",
          620900:"酒泉市",
          620800:"平凉市",
          620700:"张掖市",
          620600:"武威市",
          620500:"天水市",
          620400:"白银市",
          620300:"金昌市",
          620200:"嘉峪关市",
          630100:"西宁市",
          632800:"海西蒙古族藏族自治州",
          632700:"玉树藏族自治州",
          632600:"果洛藏族自治州",
          632500:"海南藏族自治州",
          632300:"黄南藏族自治州",
          632200:"海北藏族自治州",
          632100:"海东地区",
          640100:"银川市",
          640500:"中卫市",
          640400:"固原市",
          640300:"吴忠市",
          640200:"石嘴山市",
          650100:"乌鲁木齐市",
          659000:"自治区直辖县级行政区划",
          654300:"阿勒泰地区",
          654200:"塔城地区",
          654000:"伊犁哈萨克自治州",
          653200:"和田地区",
          653100:"喀什地区",
          653000:"克孜勒苏柯尔克孜自治州",
          652900:"阿克苏地区",
          652800:"巴音郭楞蒙古自治州",
          652700:"博尔塔拉蒙古自治州",
          652300:"昌吉回族自治州",
          652200:"哈密地区",
          652100:"吐鲁番地区",
          650200:"克拉玛依市"
        }
      },
      columns:[
        {
          values:["京", "沪", "津", "渝", "浙", "苏", "粤", "闽", "湘", "鄂", "辽", "吉", "黑", "冀", "豫", "鲁", "陕", "甘", "晋", "川", "贵", "皖", "赣", "云", "蒙", "桂", "琼", "新", "藏", "青", "宁",]
        },
        {
          values:["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
          ]
        }
      ],
      showCarLocation:false,
      isShowSend: true,
      showAddress: false,
      feedModel:'',
      branchLoanId:'',
      result:'',
      showCarModel:false,
      value: "",
      oftenBrandList:[
        "大众",
        "宝马",
        "奔驰",
        "奥迪",
        "丰田",
        "本田",
        "别克",
        "福特",
        "雪佛兰",
      ],

      oftenBrandIndex:'',
      oftenBrand:[],
      allBrandList:[],

      brandLists:[],
      brandIdList:[],
      brandIndex:'',
      carBrand:'',
      bigManager:'',
      managerTel:'',
      managerName:'',
      btnColor:''
    };
  },
  // beforeRouteEnter(to,from,next){
  //   console.log(111111111111111)
  //   //设置下一个路由的meta
  //   if(from.name == 'carModel'){
  //     to.meta.isBack = true;
  //     to.meta.keepAlive = true;
  //   }//让这个vue缓存
  //   // console.log('$route.meta.keepAlive is;',this.$route.meta.keepAlive)
  //   next();
  // },
  mounted() {
    this.state = this.$store.state.state;
    this.managerId = this.$store.state.managerId;
    this.branchLoanId = this.$store.state.branchLoanId;
    this.managerTel = this.$store.state.managerTel;
    this.managerName = this.$store.state.managerName;
    console.log("state=" , this.state);
    console.log("franchiserId===",this.$store.state.franchiserId)
    //客户经理
        
    if(this.state == 2){
      this.feedModel = 1;
      this.btnColor = '#cf271f'
    }
    //代理人
    else if(this.state == 3){
      this.feedModel = 2;
      this.btnColor = '#171C61'
    }
    //渠道直销
    else if(this.state == 6){
      this.feedModel = 3
      this.btnColor = '#60007d'
    }
    console.log(this.feedModel)
    this.oftenBrand = this.oftenBrandList;
    this.getCarBrand();

  },
  // watch:{
  //   "$store.state.carBrandName":{
  //     deep:true,
  //     handler:function (newValue,oldValue) {
  //       console.log("*****************",newValue,oldValue)
  //       this.carBrandName = this.$store.state.carBrandName;
  //     }
  //   }
  //
  // },
  methods: {
    //关闭车辆品牌
    onClickLeft(){
      this.showCarModel = false;
    },
    //校验
    loanValidator(val){
      return /^[0-9]*$/.test(val)
    },
    phoneValidator(val){
      return /^1[3456789]\d{9}$/.test(val);
    },
    //选中车辆所在地
    onSelectCarLocation(carLoc){
      console.log(carLoc);
      this.showCarLocation = false;
      this.remark1 = carLoc[0] + carLoc[1]
    },
    //取消选择
    hideCarLocation(){
      this.showCarLocation = false;
    },
    //选中省市
    onSelectCity(area) {
      console.log(area)
      this.showAddress = false;
      this.city = area[0].name + area[1].name
      this.businessProvince = area[0].code;
      this.businessCity = area[1].code;

    },
    //取消选择
    hideProCityList(){
      this.showAddress = false;
    },
    //获取手机号验证码
    getValidateCode(){
      if(/^1[3456789]\d{9}$/.test(this.mainPhone)){
        var phone = Object.assign({phone:this.mainPhone})
        validateCode(phone).then(res => {
          console.log(res.data);
          this.$toast(res.data.msg);
        })
        this.isShowSend = false
      }else{
        this.isShowSend = true;
        this.$toast.fail("手机号码格式不正确！")
      }

    },
    //提交
    onSubmit(values){
      const toast = this.$toast.loading({
        duration: 0,
        message: '提交中...',
        forbidClick: true,
        loadingType: 'spinner',
      });

      var loanInfo = Object.assign(values,
        {businessProvince:this.businessProvince},
        {businessCity:this.businessCity},
        {businessChannelCooperation:"97"},
        {businessApplyMode:"1"},
        {businessType:"3"},
        // (客户经理直销模式-1  代理人直销模式-2 )
        {feedModel:this.feedModel},
        {customerManagerId:this.managerId},
        {customerManagerName:this.$store.state.managerName},
        {carBrand:this.carBrand},
        {franchiserId:this.$store.state.franchiserId}
      )
      console.log('loanInfo',loanInfo)
      loanApplication(loanInfo).then(res => {
        toast.clear()

        //如果state == 2   返回值为branchLoanID 如果state == 3 为申请单子编号，需要根据单号调用核心后台拿到branchLoanID
        this.result = res.data.data;
        this.onShowNext = true;
        console.log("result is",this.result)

        this.$store.state.branchLoanId = this.result["branchLoanId"];
        this.$store.state.serialNumber = this.result["serialNumber"];
        this.branchLoanId = this.result;
        console.log("serialNumber:",this.$store.state.serialNumber,"branchLoanId:",this.$store.state.branchLoanId)

        if(this.feedModel == 1 || this.feedModel == 3){
          this.sendWechat();
        }
        // else if(this.feedModel == 2){
        //   var result = this.result
        //   setTimeout(()=>{
        //     loanId(result).then(res => {
        //       this.branchLoanId = res.data.data;
        //       this.$store.state.branchLoanId = res.data.data;
        //       console.log(" this.branchLoanId", this.branchLoanId)
        //     })
        //   },3000)
        // }

      })
    },
    //立即申请
    onApplyBtn(){
      document.getElementById("submitBtn").click();
    },

    //打开车辆品牌
    toCarModel() {
      this.showCarModel = true;
      // let that = this;
      // that.$router.push({
      //   path: "/carModel",
      //   query: {
      //     state: that.state,
      //     managerId:that.managerId
      //   }
      // });
    },
    goOn() {
      console.log(this.$store.state.state)
        this.$router.push({
          path: "/index",
          query:{
            state: this.$store.state.state,
            managerId:this.$store.state.managerId,
            type:this.$store.state.type,
            id:this.$store.state.id,
            clueId:this.$store.state.clueId,
            branchLoanId:this.$store.state.branchLoanId,
            franchiserId:this.$store.state.franchiserId
          }
        });


    },
    //不需要
    noNeed(){
      this.onShowNext = false;
      this.$router.push('/pushSuccess')
      //微信推送
      // if(this.feedModel == 1){
      //   this.bigManager = this.$store.state.managerId;
      //   this.sendWechat();
      // }else if(this.feedModel == 2){
      //   var userId = Object.assign({userId:this.managerId})
      //   seachMan(userId).then(res => {
      //     console.log(res.data.data);
      //     if(res.data.data != ""){
      //       this.bigManager = res.data.data.coreId;
      //       this.sendWechat();
      //     }
      //   })
      // }
    },
    //微信推送
    sendWechat(){
      var wxInfo = Object.assign(
        {branchLoanId:this.$store.state.branchLoanId},
        {type:1},
        {managerId:this.$store.state.managerId}
      )
      wechat(wxInfo).then(res => {
        console.log(res.data.data)
        if (res.data.data.stateCode === 1){
          this.$toast.success("已通知您的专属客户经理！")
          // this.$router.push('/pushSuccess')
        }else {
          this.$toast.fail("发送微信推送失败！")
        }
      })
    },

    //实时搜索
    HandleSearch(value){
      console.log('search is :',value)
      var that = this;
      that.oftenBrand = [];
      that.brandLists = [];
      this.oftenBrandList.map(function (cur,index) {
        if(cur.indexOf(value) > -1){
          console.log(cur)
          that.oftenBrand.push(cur)
        }
      })
      this.allBrandList.map(function (cur,index) {
        if(cur.ceName.indexOf(value) > -1){
          console.log(cur.ceName)
          that.brandLists.push(cur.ceName)
        }
      })
    },
    //选中的品牌
    chooseBrand(value){
      this.carBrandName = value;
      console.log('value is ',value)
      this.showCarModel = false;
      this.chooseBrandId();

    },
    //选中的品牌获取对应的Id
    chooseBrandId(){
      let that = this;
      this.brandLists.map(function (cur,index) {
        if(that.carBrandName == cur ){
          that.brandIndex = index
        }
      })
      console.log("that.brandIndex", that.brandIndex)
      this.carBrand = that.brandIdList[that.brandIndex]
      console.log("that.carBrand",that.carBrand)

    },
    //获取所有车辆品牌
    getCarBrand(){
      var that = this;
      var carInfo = Object.assign(
        {ceInitial:''},
        {pageNum:''},
        {pageSize:''}
      )
      carBrandList(carInfo).then(res => {
        console.log(res.data)
        this.allBrandList = res.data.data.brandList;
        console.log(this.allBrandList)
        this.allBrandList.map(function (cur,index) {
          that.brandLists.push(cur.ceName);
          that.brandIdList.push(cur.ceId);
        })
        console.log('that.brandLists',that.brandLists)
        console.log("that.brandIdList",that.brandIdList)
      })
    },

  }
};
</script>


<style  scoped>
  .hHeight{
    width: 100%;
    height: 40px;
    background-color: #e3cdb7;
  }
  .buleBtn{
    position: sticky;
  }
  .managerInfo-icon{
    height: 30px;
    width: 20px;
    margin-top: 10px;
    margin-right: 3px;
  }
.main {
  width: 100%;
  height: 100%;
  min-height: 760px;
  background: url("../../assets/JD-bg.png") no-repeat;
  background-size: 100% 100%;

}
.headerBG {
  width: 100%;
  background-color: #e3cdb7;
}
.content {
  background: none;
  margin-top: -8px;
}

.bottomContent {
  width: 100%;
  margin-top: 15px;
}
.bottomContent_Title {
  padding-left: 20px;
  font-size: 14px;
}
.bottomContent_bottomBG {
  width: 80%;
  margin: 0 auto;
  margin-top: 5px;
}
  .Bottom-Btn {
    padding: 4% 0;
    width: 100%;
    position: fixed;
    right: 0;
    left: 0;
    bottom: 0;
    z-index: 10;
    background-size: 100% 100%;
    text-align: center;
    color: #ffffff;
  }

/*.Bottom-Btn {*/
/*  height: 12vw;*/
/*  padding-right: 1rem;*/
/*  padding-left: 1rem;*/
/*  width: 100%;*/
/*  padding: 0;*/
/*  position: fixed;*/
/*  right: 0;*/
/*  left: 0;*/
/*  bottom: 0;*/
/*  z-index: 10;*/
/*  background: rgba(0, 0, 0, 0);*/
/*  background: url("../../assets/GZ_btn.png") no-repeat;*/
/*  background-size: 100% 100%;*/
/*}*/
.bottomContent_Content {
  font-size: 3vw;
  width: 100%;
  color: #969696;
  text-align: left;
  transform: scale(0.9);
  padding: 10px;
  margin-bottom: 70px;
}
.submitResult {
  margin: 20px;
  text-align: center;
}
.bottomBtn {
  margin: 20px;
  display: flex;
  justify-content: space-between;
}
</style>

<style scoped>
  .title{
    font-size: 14px;
    padding-left: 4%;
    color: #0870dc;
  }
  .car{
    width: 100%;
  }
  .font{
    position: relative;
    display: -webkit-box;
    display: -webkit-flex;
    display: flex;
    box-sizing: border-box;
    width: 90%;
    margin: 0 auto;
    padding: 10px 0;
    overflow: hidden;
    color: #323233;
    font-size: 14px;
    line-height: 24px;
    background-color: #fff;
    border-bottom: 1px solid #f2f3f5;
  }
  .car:not(:last-child)::after {
    position: absolute;
    box-sizing: border-box;
    content: ' ';
    pointer-events: none;
    right: 0;
    bottom: 0;
    left: 16px;
    border-bottom: 1px solid #ebedf0;
    -webkit-transform: scaleY(.5);
    transform: scaleY(.5);
  }
</style>
