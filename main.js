const formSubmit = document.querySelector(".exchange__form")
const clearBtn = document.querySelector(".exchange__clear")


const showCurrencyRates = (e) => {
    e.preventDefault()
    const currency = document.querySelector(".exchange__select").value
    const url = `https://api.nbp.pl/api/exchangerates/rates/c/${currency}/today/?format=json`

    fetch(url)
     .then((response) => {
        if (response.status !== 200){
            alert("błędy status")
        } else {
            return response.json()
        }
     })
     .then(data => currencyDetails(data))
}

const currencyDetails = (data) => {
    const moneyToCalc = document.querySelector(".exchange__input").value
    
    const currencyCode = data.code;
    const currencyBid = data.rates[0].bid
    const currencyAsk = data.rates[0].ask
    const currencyDate = data.rates[0].effectiveDate

    const resultMoney = (moneyToCalc / currencyAsk).toFixed(2)

    const divInfo = document.createElement("div")
    divInfo.classList = "currency__box"
    divInfo.innerHTML = `
        <i class="fa-solid fa-xmark currency__close"></i>
        <p class="currency__name"><strong> ${currencyCode}</strong> </p>
        <p class="currency__bid"> Current purchase amount: <strong>${currencyBid} ZŁ</strong> </p>
        <p class="currency__ask"> Current sales amount: <strong>${currencyAsk} ZŁ</strong> </p>

        <div class="currency__result"> For <strong>${moneyToCalc} PLN</strong> you can currently buy: <strong>${resultMoney} ${currencyCode}</strong> </div>

        <div class="currency__date">Status as of: <strong>${currencyDate}<strong></div>
    `
    
    document.querySelector(".currency").appendChild(divInfo)

    if(document.querySelector(".currency").innerHTML !== ""){
        clearBtn.classList.add("active")
    } 

    const currencyBox = document.querySelectorAll(".currency__box")
    const currencyClose = document.querySelectorAll(".currency__close")

    currencyClose.forEach((item, index) => {
        item.addEventListener("click", () => {
            currencyBox[index].remove()
        })
    })
    
}


formSubmit.addEventListener("submit", showCurrencyRates)

// clear currency area

clearBtn.addEventListener("click", () => {
    document.querySelector(".currency").innerHTML = ""
    clearBtn.classList.remove("active")
})









