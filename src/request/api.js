import request from './request'
import QS from 'qs'

//直销页面数据显示
export function directSell() {
  return request({
    method:'get',
    url:'rrd/user/queryUser',
  })
}
//已开通省市列表
export function provinceCity() {
  return request({
    method:'get',
    url:'/zlhj_interface/rateScreen/queryProAndCity',
  })
}
//查询城市所在区域
export function searchCityZone(cityId) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/queryCityZone',
    data:cityId
  })
}
//OCR识别行驶证
export function OCRdriving(baseUrl) {
  return request({
    method: 'post',
    url:'/zlhj_interface/ocr/determineLicense',
    data:{licenseImg:baseUrl}
  })
}

//VIN码识别车型
export function checkCarModel(Vin) {
  return request({
    method: 'post',
    url:'/zlhj_interface/carinfo/queryCarModel',
    data:{vin:Vin}
  })
}

//保存ocr扫描数据
export function saveCarInfo(carInfoData) {
  return request({
    method:'post',
    url:'zlhj_interface/carinfo/saveCarinfo',
    data:carInfoData
  })
}
//车300评估价格
export function assessCarValue(assessData) {
  return request({
    method:'post',
    url:'zlhj_interface/carinfo/queryCarValue',
    data:assessData
  })
}
//规则引擎额度测算
export function amountCalculate(clueId) {
  return request({
    method:'post',
    url:'zlhj_interface/completeScreen/amountCalculate',
    data:{clueId:clueId}
  })
}

//实名认证保存三要素信息接口
export function saveUserInfo(userData) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/saveUserInfo',
    data:userData
  })
}
//保存五要素信息
export function saveUserInfoFive(userData) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/saveUserInfoAndIdCard',
    data:userData
  })
}
//复制链接生成token接口
export function generateToken(userData) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/generateToken',
    data:userData
  })
}
//客户点击链接验证token接口且发短信
export function checkTokenAndSendMsg(token) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/checkTokenAndSendMsg',
    data:{token:token}
  })
}
//验证码确认接口
export function checkSmsCodeDirectSale(code) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/checkSmsCodeDirectSale',
    data:code
  })
}
//验证码确认接口
export function authCode(code) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/checkSmsCode',
    data:code
  })
}
//再次发送手机号验证码
export function sendCodeAgain(phone) {
  return request({
    method:'post',
    url:'zlhj_interface/rateScreen/sendMsgAgain',
    data:{phone:phone}
  })
}

//OCR识别身份证
export function OCRIdCard(baseUrl) {
  return request({
    method: 'post',
    url:'/zlhj_interface/ocr/determineIdNum',
    data:{IdNumImg:baseUrl}
  })
}
//保存身份证正反面
export function saveUserIdCard(userIdCard) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/saveUserIdUrl',
    data:userIdCard
  })
}
//人脸识别
export function startCheckFace(userVo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/face/startCheckFace',
    data:userVo
  })
}
//获取结果验证签名
export function checkSign(checkVo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/face/checkSign',
    data:checkVo
  })
}
//保存线索库中实名认证标志位
export function saveRealName(id) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/saveRealNameAuthentication',
    data:id
  })
}
//查询三要素信息接口
export function queryUserInfo(id) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/queryUserInfo',
    data:id
  })
}
//状态更新
export function updateLoanStatus(update) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/updateLoanStatus',
    data:update
  })
}

//重新查询风险评分
export function riskScoreAgain(info) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/queryRiskScoreAgain',
    data:info
  })
}
//重新查询常贷客
export function regularLoanAgain(info) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/queryCdkResultAgain',
    data:info
  })
}
//重新查询复杂网络
export function complexNetAgain(info) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/queryComplexNetAgain',
    data:info
  })
}
//重新查询手机在网时长
export function phoneOnlineAgain(info) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/queryPhoneOnlineAgain',
    data:info
  })
}
//重新查询四合一接口
export function fourInOneAgain(four) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/fourInOneInterface',
    data:four
  })
}
//查询资方
export function searchInvestor(managerId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/queryCapitalList',
    data:managerId
  })
}
//查询来源渠道
export function searchChannel(channel) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/querySources',
    data:channel
  })
}
//提交进件
export function submitPieces(subInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/saveInformation',
    data:subInfo
  })
}
//更新资方及经销商
//todo later
export function updateClue(subInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/updateClueInfoDealer',
    data:subInfo
  })
}
//直销
//查询客户经理信息
export function managerInfo(manInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/queryManagerInfo',
    data:manInfo
  })
}

//识别成为推荐人
export function IdentifyRefer(invitationCode) {
  return request({
    method: 'get',
    url:'/zlhj_interface/public/getNameByCode',
    params:invitationCode
  })
}
//注册成为推荐人
export function tobeReferee(refeeInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/agent/register',
    data:refeeInfo
  })
}
//获取手机验证码
export function validateCode(phone) {
  return request({
    method: 'post',
    url:'/zlhj_interface/agent/getValidate',
    data:phone
  })
}
// export function validateCode(phone) {
//   return request({
//     method: 'get',
//     url:'/zlhj_interface/user/validate',
//     params:phone
//   })
// }


//通过代理人Id获取邀请码
export function invitateCode(userId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/agent/getInvitateCode',
    data:userId
  })
}
//代理人直销-通过客户经理获取邀请码
export function invitateCodeMan(managerId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/agent/kz/getInvitateCode',
    data:managerId
  })
}

//车辆品牌
export function carBrandList(carInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/vehicles/getBrandListNew',
    data:carInfo
  })
}
//贷款申请
export function loanApplication(loanInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/direct/loan/push',
    data:loanInfo
  })
}
//通过订单号获取branchLoanId
export function loanId(applyNo) {
  return request({
    method: 'get',
    url:'/zlhj_interface/direct/loan/loanId',
    params:{applyNo:applyNo}
  })
}
//代理人直销-通过代理人ID查询客户经理信息
export function seachMan(userId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/agent/getManagerById',
    data:userId
  })
}


//查询人员签约状态
export function authorizationState(authorInfo){
  return request({
    method:'post',
    url:'/zlhj_interface/rateScreen/authorizationState',
    data:authorInfo
  })
}
//初筛决策引擎
export function amountFiler(clueId){
  return request({
    method:'post',
    url:'/zlhj_interface/completeScreen/amountFiler',
    data:clueId
  })
}

//人员签约认证接口
export function personSign(personInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/personAuthorization',
    data:personInfo
  })
}

//微信推送
export function wechat(wxInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/direct/loan/sendWechatPush',
    data:wxInfo
  })
}

//验证实名认证是否通过
export function isAccessed(userInfo) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/managerRealNameCertification',
    data:userInfo
  })
}

//结果查询
export function QueryResult(param) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/queryResult',
    data:param
  })
}
//根据clueId查询车辆信息
export function searchCarInfo(ClueId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/carinfo/searchRateScreenCarInfo',
    data:ClueId
  })
}

//重新进件按钮
export function listAgain(BranchLoanId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/completeScreen/saveInfoToApply',
    data:BranchLoanId
  })
}
//结果查询菜单
export function getMenu(BranchLoanId) {
  return request({
    method: 'post',
    url:'/zlhj_interface/rateScreen/searchUserPermission',
    data:BranchLoanId
  })
}
