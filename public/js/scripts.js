const BASE_URL =
  "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=false";

const bnbPriceTag = document.querySelector(".bnb-container").querySelector("p");
const spanError = document.querySelector(".d-container").querySelector("span");
const bnbInput = document.getElementById("binance");
const disInput = document.getElementById("dinstagram");
let bnbPrice = 402;

const getCoin = () => {
  fetch(BASE_URL)
    .then((response) => response.json())
    .then((data) => {
      const binanceCoin = data.find((coin) => coin.id === "binancecoin");
      const binancePrice = binanceCoin.current_price;
      bnbPrice = binancePrice;
      bnbPriceTag.innerText = `Binance Price: ${binancePrice} $`;
    })
    .catch((err) => console.log(err));
};

const calculateDis = (event) => {
  spanError.innerText = "";
  const amount = Number(event.target.value);
  const disAmount = ((amount * bnbPrice) / 0.00001).toFixed(3);
  disInput.value = disAmount;
  if (!amount) disInput.value = "";
  if (String(amount) === "NaN") {
    spanError.innerText = "Please enter a number value!";
  }
};

const calculateBnb = (event) => {
  spanError.innerText = "";
  const amount = Number(event.target.value);
  const bnbAmount = ((amount * 0.00001) / bnbPrice).toFixed(10);
  bnbInput.value = bnbAmount;
  if (!amount) bnbInput.value = "";
  if (String(amount) === "NaN") {
    spanError.innerText = "Please enter a number value!";
  }
};

bnbInput.addEventListener("keyup", calculateDis);
disInput.addEventListener("keyup", calculateBnb);
window.addEventListener("load", getCoin);
setInterval(getCoin, 5 * 60 * 1000);
