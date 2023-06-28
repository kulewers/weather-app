const searchForm = document.querySelector("form");
const searchInput = document.querySelector("input");

const currentTemp = document.getElementById("current-temp");
const locationPara = document.getElementById("location");
const locationCountryPara = document.getElementById("location-country");
const currentCond = document.getElementById("current-cond");
const mainSectinon = document.getElementById("main");
let conditonIcon;

let tempFormat;

if (!("perferredFormat" in localStorage)) {
  tempFormat = "C";
  localStorage.setItem("perferredFormat", tempFormat);
} else {
  tempFormat = localStorage.getItem("perferredFormat");
}

let responseObj;

if ("response" in localStorage) {
  responseObj = JSON.parse(localStorage.response);
  updateData(responseObj);
} else {
  queryData("London").then((response) => {
    updateData(response);
  });
}

searchForm.addEventListener("submit", async function (e) {
  e.preventDefault();
  try {
    responseObj = await queryData(searchInput.value);
    updateData(responseObj);
    searchInput.value = "";
  } catch (error) {
    console.error(error);
  }
});

async function queryData(searchTerm) {
  const response = await fetch(
    `http://api.weatherapi.com/v1/forecast.json?key=a07b305460b548a4a7b95256232606&q=${searchTerm}&days=7&aqi=no&alerts=no`,
    { mode: "cors" }
  );
  let responseJSON = await response.json();
  if ("error" in responseJSON) throw new Error("Query error!");
  localStorage.setItem("response", JSON.stringify(responseJSON));
  return responseJSON;
}

function updateData(response) {
  currentTemp.textContent =
    tempFormat == "C"
      ? `${response.current.temp_c}° ${tempFormat}`
      : `${response.current.temp_f}° ${tempFormat}`;
  locationPara.textContent = response.location.name;
  locationCountryPara.textContent = response.location.country;
  currentCond.textContent = response.current.condition.text;
  if (!conditonIcon) {
    conditonIcon = document.createElement("img");
    conditonIcon.src = response.current.condition.icon;
    mainSectinon.appendChild(conditonIcon);
  } else {
    conditonIcon.src = response.current.condition.icon;
  }
}

const formatChangeButton = document.getElementById("ch-format");

formatChangeButton.addEventListener("click", () => {
  tempFormat = tempFormat == "C" ? "F" : "C";
  localStorage.setItem("perferredFormat", tempFormat);
  if (responseObj) {
    updateData(responseObj);
  }
});
