

const weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

const apiKey = 'dcb2c73085msh1841d54247678bcp125986jsn7d3e7e0d8413';
let city = "london";

const url = `https://weatherbit-v1-mashape.p.rapidapi.com/forecast/3hourly?city=${city}&units=imperial&lang=en`;
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'weatherbit-v1-mashape.p.rapidapi.com'
    }
};

async function fetchData() {
    try {
        const response = await fetch(url, options);
        const result = await response.json();

        const weatherData = result.data;

        const dailyWeather = {};

        weekDays.forEach(day => {
            dailyWeather[day] = {
                dayTemperature: [],
                nightTemperature: []
            };
        });

        weatherData.forEach(data => {
            const date = new Date(data.timestamp_local);
            const dayOfWeek = weekDays[date.getDay()];

            if (date.getHours() >= 6 && date.getHours() < 18) {
                dailyWeather[dayOfWeek].dayTemperature.push({
                    timestamp: data.timestamp_local,
                    temperature: data.temp,
                    weatherDescription: data.weather.description
                });
            } else {
                dailyWeather[dayOfWeek].nightTemperature.push({
                    timestamp: data.timestamp_local,
                    temperature: data.temp,
                    weatherDescription: data.weather.description
                });
            }
        });
        console.log(JSON.stringify(dailyWeather, null, 2));

    } catch (error) {
        console.error(error);
    }
    console.log("msg")
}

fetchData();