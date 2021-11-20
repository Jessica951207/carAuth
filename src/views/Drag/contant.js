let timeArr = []
for(let val=0; val<24;val++){
  timeArr.push([[val*30-14, 15+(val)*30], val*30])
}
const timeMap = new Map(timeArr)
export {timeMap}
