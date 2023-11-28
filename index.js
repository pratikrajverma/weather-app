const userTab = document.querySelector("[data-userweather]");
const searchTab = document.querySelector("[data-searchweather]");

const grantAccessContainer = document.querySelector(".grant-location-container");
const searchForm=document.querySelector("[data-search-form]");
const loadingScreen = document.querySelector(".loading-container");
const userInfoContainer = document.querySelector(".user-info-container");

const API_key = "4134abfbeb79a649224c675983bf3779";
let currentTab = userTab;
currentTab.classList.add("currentTabStyle");
getFromSessionStorage();


function switchTab(clickedTab)
{
    if(currentTab != clickedTab)
    {
        currentTab.classList.remove("currentTabStyle");
        currentTab = clickedTab;
        currentTab.classList.add("currentTabStyle");
        

        
        if(!searchForm.classList.contains('active'))
        {
            grantAccessContainer.classList.remove('active');
            userInfoContainer.classList.remove('active');
            searchForm.classList.add('active');
        }else{
            searchForm.classList.remove('active');
            userInfoContainer.classList.remove('active');
            getFromSessionStorage();

            
        }

    }





}

userTab.addEventListener("click",()=>{
    switchTab(userTab);
})

searchTab.addEventListener("click",()=>{
    switchTab(searchTab);
})




function  getFromSessionStorage()
{
    const localcoordinate = sessionStorage.getItem("user-coordinate");
    if(!localcoordinate)
    {
        grantAccessContainer.classList.add("active");
    }
    else{
        const coordinate = JSON.parse(localcoordinate);
        fetchUserWeatherInfo(coordinate);
    }

}




async function fetchUserWeatherInfo(coordinate)
{
    const {lat,lon} = coordinate;
    grantAccessContainer.classList.remove("active");
    loadingScreen.classList.add("active");
    
    // API call
    try{
        const response =await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove ("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
        
        
    }
    catch(err){
        loadingScreen.classList.remove ("active");
        alert('something went wronge');
        
    }
}
 



function renderWeatherInfo(weatherdata)
{
    const cityname = document.querySelector("[data-cityname]");
    const countryicon = document.querySelector("[data-country-icon]");
    const disc = document.querySelector("[data-weatherDisc]");
    const weathericon = document.querySelector("[data-weather-icon]"); 
    const temp = document.querySelector("[data-temp]"); 
    const windspeed = document.querySelector("[data-windspeed]"); 
    const humidity = document.querySelector("[data-humidity]"); 
    const cloudiness = document.querySelector("[data-cloudiness]"); 

    cityname.innerText = weatherdata?.name;

    countryicon.src= `https://flagcdn.com/16x12/${weatherdata?.sys?.country.toLowerCase()}.png`;

    disc.innerText = weatherdata?.weather?.[0]?.description;

    weathericon.src = `https://openweathermap.org/img/wn/${weatherdata?.weather?.[0]?.icon}.png`;

    temp.innerText = `${weatherdata?.main?.temp}°C`;

    windspeed.innerText = `${weatherdata?.wind?.speed} m/s`;

    humidity.innerText = `${weatherdata?.main?.humidity}%`;

    cloudiness.innerText = `${weatherdata?.clouds?.all}%`;
  
}



function grantaccess()
{
    getlocation();
   
}



function getlocation()
{
    if(navigator.geolocation)
    {
        navigator.geolocation.getCurrentPosition(showposition);
    }
    else{
        alert('location error');
    }
}



function showposition(position)
{
   const userCoordinate={
    lat: position.coords.latitude,
    lon: position.coords.longitude,
   }

   sessionStorage.setItem("user-coordiante", JSON.stringify(userCoordinate));
   fetchUserWeatherInfo(userCoordinate);
}



const searchInput = document.querySelector("[data-search-input]");
searchForm.addEventListener('submit',(e)=>{
    e.preventDefault();
    let cityname = searchInput.value;
    if(cityname === " ") 
        return;
    else
        fetchsearchweatherinfo(cityname);
})


async function fetchsearchweatherinfo(city)
{
    loadingScreen.classList.add("active");
    userInfoContainer.classList.remove("active");
    grantAccessContainer.classList.remove("active");
    

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_key}&units=metric`);
        const data = await response.json();
        loadingScreen.classList.remove ("active");
        userInfoContainer.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(err){
        alert('somthing went wrong');
    }
}

body.scrollTo({
    behavior: 'smooth' // This creates a smooth scroll effect
  });