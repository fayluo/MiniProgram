const weatherMap = {
  'sunny': '晴天',
  'cloudy': '多云',
  'overcast': '阴天',
  'lightrain': '小雨',
  'heavyrain': '大雨',
  'snow': '下雪'
}
const weatherColorMap = {
  'sunny': '#cbeefd',
  'cloudy': '#deeef6',
  'overcast': '#c6ced2',
  'lightrain': '#bdd5e1',
  'heavyrain': '#c5ccd0',
  'snow': '#aae1fc'
}

Page({//❓js的缩进不严格
  data: { //冒号表示名称和值得关系。❓下面有的用小括号request，有的直接用括号onLaod
    nowTemp: '',
    nowWeather: '',
    nowWeatherBackground: '', //表示页面的初始数据。其实不赋值为空也没有bug啊，why一定这么做呢？
    hourlyWeather: [],
    todayTemp: "",
    todayDate: "",
    cityLoc: '深圳市',
  },

  onLoad(){
    this.getNow()
  },

  onPullDownRefresh(){
    this.getNow(() => { //❓这个函数不能理解啊！
      wx.stopPullDownRefresh()
    })
  },

  getNow(callback){ //❓callback作为函数是什么意思？
    wx.request({
      url: 'https://test-miniprogram.com/api/weather/now',
      data:{
        city: '深圳市'//❗️名称和值是通过：对应的，而非=
      },//❗️❗️每一个数据后面不需有逗号，否则会报错
      success: res => {
        /*console.log(res.data)*/
        let result = res.data.result//res对应箭头函数中的内容
        this.setNow(result)
        this.setHourlyWeather(result)
        this.setToday(result)//why这里不用逗号❓
      },

      complete: () =>{
        callback && callback() //❓这句话什么意思？&&是哪个逻辑判断符是and 还是 or？像前者。
      }
    })  //page内的函数就那么几个，所以要在加载时候获取数据！
  },

  setNow(result) { //（）表示传入这个函数的参数，也就是这个函数将如何处理result
    let temp = result.now.temp
    let weather = result.now.weather
    this.setData({
      nowTemp: temp + '°',
      nowWeather: weatherMap[weather],
      nowWeatherBackground: '/images/' + weather + '-bg.png'
    })
    wx.setNavigationBarColor({
      frontColor: '#000000',
      backgroundColor: weatherColorMap[weather],
    })
  },

  setHourlyWeather(result) {
    let forecast = result.forecast
    let hourlyWeather = []
    let nowHour = new Date().getHours()
    for (let i = 0; i < 8; i += 1) {
      hourlyWeather.push({
        time: (i * 3 + nowHour) % 24 + "时",
        iconPath: '/images/' + forecast[i].weather + '-icon.png',
        temp: forecast[i].temp + '°'
      })
    }

    hourlyWeather[0].time = '现在'
    this.setData({
      hourlyWeather: hourlyWeather
    })
  },

  setToday(result) {
    let date = new Date()
    this.setData({
      todayTemp: `${result.today.minTemp}° - ${result.today.maxTemp}°`,//${result.today.minTemp}大括号是变量，$表示在字符内的替换。语法同python 不同html
      todayDate: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} 今天`
    })
  },

  onTapDayWeather() {
    wx.navigateTo({
      url: '/pages/list/list', //这里用URL表示跳转到另一个页面list.wxml❓
    })
  }

})