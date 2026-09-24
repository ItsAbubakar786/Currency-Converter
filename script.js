const BASE_URL =
  "https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies";

const dropdown = document.querySelectorAll(".dropdown select");
const btn = document.querySelector("form .exchange-btn");
const fromCurr = document.querySelector(".from select");
const toCurr = document.querySelector(".to select");
const msg = document.querySelector(".msg");
const arrowExchange = document.querySelector(".arrow");
const quickAmounts = document.querySelectorAll(".quick-amounts span");

const toggleBtn = document.querySelector(".toggle-btn");

/* default dark mode */

document.body.classList.add("dark-theme")
toggleBtn.classList.add("active")

toggleBtn.addEventListener("click", () => {
  toggleBtn.classList.toggle("active");
  document.body.classList.toggle("dark-theme");
});

quickAmounts.forEach((span) => {
  span.addEventListener("click", () => {
    let amountInput = document.querySelector(".amount input");
    amountInput.value = span.innerText;
  });
});

for (let select of dropdown) {
  for (currCode in countryList) {
    let newOption = document.createElement("option");
    newOption.innerText = currCode;
    newOption.value = currCode;
    if (select.name === "from" && currCode === "USD") {
      newOption.selected = true;
    } else if (select.name === "to" && currCode === "INR") {
      newOption.selected = true;
    }
    select.appendChild(newOption);
  }
  select.addEventListener("change", (evt) => {
    updateFlag(evt.target);
    /* updateExchangeRate(); */
  });
}

const updateFlag = (element) => {
  let currCode = element.value;
  let countryCode = countryList[currCode];
  let newSrc = `https://flagsapi.com/${countryCode}/flat/64.png`;
  let img = element.parentElement.querySelector("img");
  img.src = newSrc;
};

btn.addEventListener("click", (evt) => {
  evt.preventDefault();
  updateExchangeRate();
});

arrowExchange.addEventListener("click", () => {
  let temp = fromCurr.value;
  fromCurr.value = toCurr.value;
  toCurr.value = temp;
  updateFlag(fromCurr);
  updateFlag(toCurr);
});

const updateExchangeRate = async () => {
  let amount = document.querySelector(".amount input");
  let amtValue = amount.value;

  btn.innerText = "Converting...";

  if (amtValue === "" || amtValue < 1) {
    amtValue = 1;
    amount.value = 1;
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));

  const URL = `${BASE_URL}/${fromCurr.value.toLowerCase()}.json`;

  let response = await fetch(URL);
  let data = await response.json();

  let rate = data[fromCurr.value.toLowerCase()][toCurr.value.toLowerCase()];

  try {
    if (!rate) {
      throw new Error("Invalid currency code");
    }
    else {
      msg.innerText = `1 ${fromCurr.value} = ${rate} ${toCurr.value}`;
    }
  } catch (error) {
    msg.innerText = "Invalid currency code. Please try again.";
    btn.innerText = "Get Exchange Rate";
    return;
  }

  let finalAmt = amtValue * rate;

  let formattedAmt = finalAmt.toFixed(2);

  msg.innerText = `${amtValue} ${fromCurr.value} = ${formattedAmt} ${toCurr.value}`;

  btn.innerText = "Get Exchange Rate";
};

// Page load hone par exchange rate update
/* updateExchangeRate(); */
