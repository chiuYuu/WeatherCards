const url = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/F-C0032-001?Authorization=CWA-DFF0594D-2A6E-4597-8B88-A147257DB6D5';

// Wx(天氣現象)、MaxT(最高溫度)、MinT(最低溫度)、CI(舒適度)、PoP(降雨機率)
gateDate();

function gateDate() {
    fetch(url)
        .then(response => response.json())
        .then(data => {
            render(data);
            // console.log(data.records);
        })
        .catch(() => {
            alert('發生錯誤');
        });
}

const container = document.querySelector('#container');

const locationItem = [
    { name: '全台', location: ['臺北市', '新北市', '基隆市', '宜蘭縣', '桃園市', '新竹縣', '新竹市', '臺中市', '彰化縣', '南投縣', '雲林縣', '苗栗縣', '臺南市', '高雄市', '嘉義縣', '嘉義市', '屏東縣', '臺東縣', '花蓮縣', '澎湖縣', '金門縣', '連江縣'] },
    { name: '北部', location: ['臺北市', '新北市', '基隆市', '宜蘭縣', '桃園市', '新竹縣', '新竹市'] },
    { name: '中部', location: ['臺中市', '彰化縣', '南投縣', '雲林縣', '苗栗縣'] },
    { name: '南部', location: ['臺南市', '高雄市', '嘉義縣', '嘉義市', '屏東縣'] },
    { name: '東部', location: ['臺東縣', '花蓮縣'] },
    { name: '離島', location: ['澎湖縣', '金門縣', '連江縣'] }
]


// 設一個函式把天氣的資料渲染出來
function render(data) {
    // 宣告locations 為data裡面的location
    const locations = data.records.location;
    // console.log(data);
    let content = '';
    const weatherData = {}; // 設一個物件來儲存之後抓到的天氣資訊

    // 抓出每個地區的天氣資料
    locations.forEach((countries) => {
        // 宣告country 為每個地區的名字
        const country = countries.locationName;
        // console.log(country);

        // Wx(天氣現象)的陣列
        const wx = countries.weatherElement[0];
        const pop = countries.weatherElement[1];
        const minT = countries.weatherElement[2];
        const ci = countries.weatherElement[3];
        const maxT = countries.weatherElement[4];

        // 抓取 time 陣列的第一個元素 12:00 ~ 18:00
        const firstTimePeriod = wx.time[0];
        const startTime = firstTimePeriod.startTime;
        const endTime = firstTimePeriod.endTime;
        const weatherName = firstTimePeriod.parameter.parameterName;

        // 抓取降雨機率、最低溫度、最高溫度、舒適度
        const popState = pop.time[0].parameter.parameterName;
        const minTamperature = minT.time[0].parameter.parameterName;
        const maxTamperature = maxT.time[0].parameter.parameterName;;
        const ciState = ci.time[0].parameter.parameterName;

        // 設定時間的格式
        const formattedTime = formatDateTime(startTime, endTime);
        weatherData[country] = {
            formattedTime,
            weatherName,
            popState,
            minTamperature,
            maxTamperature,
            ciState
        };

        // console.log(weatherData);

        // 判別 weatherName 對應的 icon
        let weatherImg = '';
        if (weatherName === '晴天') {
            weatherImg = './weather img/晴天.svg';
        } else if (weatherName === '晴時多雲' || weatherName === '多雲時晴') {
            weatherImg = './weather img/多雲時晴.svg';
        } else if (weatherName === '多雲' || weatherName === '多雲時陰' || weatherName === '陰時多雲' || weatherName === '陰天') {
            weatherImg = './weather img/多雲.svg';
        } else if (/雷陣雨/.test(weatherName)) {
            weatherImg = './weather img/雷陣雨.svg';
        } else if (/晴.*陣雨/.test(weatherName)) {
            weatherImg = './weather img/太陽雨.svg';
        } else if (/雨/.test(weatherName)) {
            weatherImg = './weather img/雨天.svg';
        }


        content += `
        <div class="card" data-location="${country}" >
            <div class="content animate__animated animate__swing   animate__slow">
                <div class="card-header">
                    <img src="${weatherImg}" class="weather-img">
                    <h1 class="countryName">${country}</h1>
                </div>
                    
                <div class="card-middle">
                    <h5 class="date-time">${weatherData[country].formattedTime}</h5>
                    <h3 class="parameter">${weatherData[country].weatherName}</h3>
                    <span class="bottom-text">降雨機率：${weatherData[country].popState}%</span>
                    <span class="bottom-text">${weatherData[country].ciState}</span>
                </div>
                    
                <div class="card-bottom">
                    <h1 class="temper">${weatherData[country].minTamperature}˚C ～ ${weatherData[country].maxTamperature}˚C</h1>
                </div>
            </div>
        </div>
    `;
    });

    container.innerHTML = content;

    VanillaTilt.init(document.querySelectorAll(".card"), {
        max: 25,
        speed: 800,
        glare: true,
    });
}

// 調整時間的格式
function formatDateTime(dateTimeStr, endDateTimeStr) {
    const date = new Date(dateTimeStr);
    const endDate = new Date(endDateTimeStr);

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');

    const endHours = String(endDate.getHours()).padStart(2, '0');
    const endMinutes = String(endDate.getMinutes()).padStart(2, '0');

    return `${year} ／ ${month} ／ ${day}　　${hours}：${minutes} － ${endHours}：${endMinutes}`;
}

function filterCards(region) {
    const cards = document.querySelectorAll('.card');
    const selectedRegion = locationItem.find(item => item.name === region);

    if (!selectedRegion) {
        cards.forEach(card => {
            card.style.display = 'flex';
        });
        return;
    }

    cards.forEach(card => {
        const cardLocation = card.getAttribute('data-location');
        if (selectedRegion.location.includes(cardLocation)) {
            card.style.display = 'flex';
        } else {
            card.style.display = 'none';
        }
    });
}

const btnAll = document.querySelectorAll('.btn');
btnAll.forEach(btn => {
    btn.addEventListener('click', (event) => {
        const region = event.target.textContent; 
        // 假設按鈕的文本就是地區名稱
        filterCards(region);
    });
});

