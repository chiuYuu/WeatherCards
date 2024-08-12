const earthUrl = 'https://opendata.cwa.gov.tw/api/v1/rest/datastore/E-A0015-001?Authorization=CWA-DFF0594D-2A6E-4597-8B88-A147257DB6D5';

gateEarthquakeDate();

function gateEarthquakeDate() {
    fetch(earthUrl)
        .then(response => response.json())
        .then(eData => {
            render(eData);
            // console.log(eData.records);
        })
        .catch(() => {
            alert('發生錯誤');
        });
}

const container = document.querySelector('#container');

function render(eData) {
    const earthInfo = eData.records.Earthquake;
    console.log(earthInfo);

    let content = '';
    const earthquakeData = {};

    earthInfo.forEach((earth) => {
        const location = earth.EarthquakeInfo.Epicenter.Location;
        const magnitude = earth.EarthquakeInfo.EarthquakeMagnitude.MagnitudeValue;
        const time = earth.EarthquakeInfo.OriginTime;
        const ReportContent = earth.ReportContent;
        const color = earth.ReportColor;
        const earthImg = earth.ReportImageURI;

        console.log(earthImg);

        earthquakeData[location] = {
            magnitude,
            time,
            ReportContent,
            color,
            earthImg
        };

        let titleColor ='rgb(69, 100, 126)';
        let textColor = 'rgb(91, 138, 168)';

        if (earthquakeData[location].color === '綠色') {
            cardBgColor = `background-image: linear-gradient(120deg, #d4fc79 0%, #96e6a1 100%);`;
        } else if (earthquakeData[location].color === '黃色') {
            cardBgColor = `background-image: linear-gradient( 135deg, #FDEB71 10%, #F8D800 100%);`;
        } else if (earthquakeData[location].color === '橘色') {
            cardBgColor = `background-image: linear-gradient( 135deg, #FAD7A1 10%, #E96D71 100%);`;
        }else if (earthquakeData[location].color === '紅色'){
            cardBgColor = `background-image: linear-gradient( 135deg, #F05F57 10%, #360940 100%);`;
            textColor = 'rgb(255, 255, 255)';
            titleColor = 'rgb(255, 255, 0)';
        }

        content += `
        <div class="card" style="${cardBgColor}" >
            <div class="earthquake" >
                <h1 style="color: ${titleColor};">${location}</h1>
                <h3 style="color: ${textColor};">${earthquakeData[location].time}</h3>
                <h3 style="color: ${textColor};">Rui's 規模：${earthquakeData[location].magnitude}</h3>
                <h3 class="report" style="color: ${textColor};">${earthquakeData[location].ReportContent}</h3>
                <div>
                    <img src="${earthquakeData[location].earthImg}" alt="No image" onerror='this.style.display = "none"'>
                </div>
            </div>
        </div>
        `;

        container.innerHTML = content;

        VanillaTilt.init(document.querySelectorAll(".card"), {
            max: 25,
            speed: 800,
            glare: true,
        });
    });
}