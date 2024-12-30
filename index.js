const cityInput = document.querySelector(".city");
const searchBtn = document.querySelector(".search-btn");
const notFoundSection = document.querySelector(".not-found");
const searchCitySection = document.querySelector(".search-city");
const weatherInfoSection = document.querySelector(".info");
const countryTxt = document.querySelector(".country");
const tempTxt = document.querySelector(".temp");
const conditionTxt = document.querySelector(".condition");
const humidityVal = document.querySelector(".humidity-value");
const windVal = document.querySelector(".wind-value");
const weatherImg = document.querySelector(".weather-img");
const dateTxt = document.querySelector(".date");
const forecastItems = document.querySelector(".forecast-items");

const key = "2bfdfeb7de01c0eff720bb6da7686720";

searchBtn.addEventListener("click", () => {
	if (cityInput.value.trim() != "") {
		updateWeatherInfo(cityInput.value);
		cityInput.value = "";
		cityInput.blur();
	}
});

cityInput.addEventListener("keydown", (event) => {
	if (event.key == "Enter" && cityInput.value.trim() != "") {
		updateWeatherInfo(cityInput.value);
		cityInput.value = "";
		cityInput.blur();
	}
});

async function getFetchData(endPoint, city) {
	const url = `https://api.openweathermap.org/data/2.5/${endPoint}?q=${city}&appid=${key}&units=metric`;

	const response = await fetch(url);
	return response.json();
}

function getWeatherIcon(id) {
	if (id <= 232) return `thunderstorm.svg`;
	if (id <= 321) return `drizzle.svg`;
	if (id <= 531) return `rain.svg`;
	if (id <= 622) return `snow.svg`;
	if (id <= 781) return `atmosphere.svg`;
	if (id <= 800) return `clear.svg`;
	else return `clouds.svg`;
}

function getCurrentDate() {
	const currDate = new Date();
	const options = {
		weekday: "short",
		day: "2-digit",
		month: "short",
	};

	return currDate.toLocaleDateString(`en-IN`, options);
}

async function updateWeatherInfo(city) {
	const weatherData = await getFetchData("weather", city);

	if (weatherData.cod != 200) {
		showDisplaySection(notFoundSection);
		return;
	}

	const {
		name: country,
		main: { temp, humidity },
		weather: [{ id, main }],
		wind: { speed },
	} = weatherData;

	countryTxt.textContent = country;
	tempTxt.textContent = Math.round(temp) + "℃";
	conditionTxt.textContent = main;
	humidityVal.textContent = humidity + "%";
	windVal.textContent = speed + " M/s";

	dateTxt.textContent = getCurrentDate();
	weatherImg.src = `images/weather/${getWeatherIcon(id)}`;

	updateForecastsInfo(city);
	showDisplaySection(weatherInfoSection);
}

async function updateForecastsInfo(city) {
	const forecastsData = await getFetchData("forecast", city);

	const timeTaken = "12:00:00";
	const todayDate = new Date().toISOString().split("T")[0];

	forecastItems.innerHTML = "";

	forecastsData.list.forEach((forecastWeather) => {
		if (
			forecastWeather.dt_txt.includes(timeTaken) &&
			!forecastWeather.dt_txt.includes(todayDate)
		) {
			updateForecastsItems(forecastWeather);
		}
	});
}

function updateForecastsItems(weatherData) {
	const {
		dt_txt: date,
		weather: [{ id }],
		main: { temp },
	} = weatherData;

	const dateTaken = new Date(date);
	const dateOption = {
		day: "2-digit",
		month: "short",
	};

	const dateResult = dateTaken.toLocaleDateString("en-US", dateOption);

	const forecast = `
		<div class="forecast">
			<h5 class="forecast-date regular">${dateResult}</h5>
			<img src="images/weather/${getWeatherIcon(id)}" class="forecast-img" />
			<h5 class="forecast-temp">${Math.round(temp)} ℃</h5>
		</div>
	`;

	forecastItems.insertAdjacentHTML("beforeend", forecast);
}

function showDisplaySection(section) {
	[weatherInfoSection, searchCitySection, notFoundSection].forEach(
		(section) => (section.style.display = "none")
	);

	section.style.display = "flex";
}
