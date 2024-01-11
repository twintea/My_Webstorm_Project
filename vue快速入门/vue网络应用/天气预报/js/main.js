/*
  请求地址:http://api.k780.com/?app=weather.future&&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&cityNm=
  请求方法:get
  请求参数:city(城市名)
  响应内容:天气信息

  1. 点击回车
  2. 查询数据
  3. 渲染数据
  */
var app = new Vue({
    el: "#app",
    data: {
        city: '',
        weatherList:[]
    },
    methods: {
        searchWeather: function (){
            var that = this;
            axios.get("http://api.k780.com/?app=weather.future&&appkey=10003&sign=b59bc3ef6191eb9f747dd4e83c99f2a4&format=json&cityNm="+that.city).then(function (response) {
               console.log(response)
                that.weatherList = response.data.result;
            }),function (error) {
                console.log(error);
            }
        },
        changeCity: function (city){
            this.city = city;
            this.searchWeather();
        }
    }
})