const formSubmit = document.querySelector(".exchange__form")
const clearBtn = document.querySelector(".exchange__clear")
let i = 0
let graphArray = []
let graphShowIcon = []

const showCurrencyRates = (e) => {
    e.preventDefault()
    const currency = document.querySelector(".exchange__select").value
    const url = `https://api.nbp.pl/api/exchangerates/rates/c/${currency}/last/?format=json`

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
    i++
    const currency = document.querySelector(".exchange__select").value
    const urlGraph = `http://api.nbp.pl/api/exchangerates/rates/c/${currency}/last/10/?format=json`
    fetch(urlGraph)
    .then((response) => {
       if (response.status !== 200){
           alert("błędy status")
       } else {
           return response.json()
       }
    })
    .then(data => createGraph(data.rates))

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
        <p class="currency__graph" onclick="showGraph(${i-1})" onmousemove="hoverGraphIcon(${i-1})" onmouseleave="mouseLeave(${i-1})"><i class="fa-solid fa-hand-pointer"></i></p>
        <p class="currency__name"><strong> ${currencyCode}</strong> </p>
        <p class="currency__bid"> Current purchase amount: <strong>${currencyBid} PLN</strong> </p>
        <p class="currency__ask"> Current sales amount: <strong>${currencyAsk} PLN</strong> </p>

        <div class="currency__result"> For <strong>${moneyToCalc} PLN</strong> you can currently buy: <strong>${resultMoney} ${currencyCode}</strong> </div>

        <div class="currency__date">Status as of: <strong>${currencyDate}</strong></div>

        <div class="bg">
            <div class="graph">
                <canvas class="graph__canvas" style="width: 300px; height:250px;" id="myChart-${i}"></canvas>
                <i class="fa-solid fa-xmark graph__close" onclick="closeGraph(${i-1})"></i>
            </div>
        </div>
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

    const graphDiv = [...document.querySelectorAll(".bg")]
    graphArray.push(graphDiv[graphDiv.length - 1])

    const graphShow = [...document.querySelectorAll(".currency__graph")]
    graphShowIcon.push(graphShow[graphShow.length - 1])

}


formSubmit.addEventListener("submit", showCurrencyRates)

// clear currency area

clearBtn.addEventListener("click", () => {
    document.querySelector(".currency").innerHTML = ""
    clearBtn.classList.remove("active")
})


// chart js

const createGraph = (data) => {

    console.log(data);
    

    const ctx = document.getElementById(`myChart-${i}`);

    new Chart(ctx, {
    type: 'line',
    data: {
        labels: [data[0].effectiveDate, data[2].effectiveDate, data[2].effectiveDate, data[3].effectiveDate, data[4].effectiveDate, data[5].effectiveDate, data[6].effectiveDate, data[7].effectiveDate, data[8].effectiveDate, data[9].effectiveDate],
        datasets: [{
        label: 'Average currency sales',
        data: [data[0].ask, data[1].ask, data[2].ask, data[3].ask, data[4].ask, data[5].ask, data[6].ask, data[7].ask, data[8].ask,data[9].ask],
        borderWidth: 1
        }]
    },
    options: {
        scales: {
        y: {
            beginAtZero: false
        }
        }
    }
    });
}

const showGraph = (i) => {
    graphArray[i].classList.add("active");
}

const closeGraph = (i) => {
    graphArray[i].classList.remove("active");
}

const hoverGraphIcon = (i) =>{
    if (graphShowIcon[i].textContent.indexOf("Click to see a graph") !== -1){
        return
    }

   graphShowIcon[i].innerHTML += "Click to see a graph"
   graphShowIcon[i].classList.add("active")
}

const mouseLeave = (i) => {
    let text = graphShowIcon[i].innerHTML.slice(0,-20)
    graphShowIcon[i].innerHTML = text
    graphShowIcon[i].classList.remove("active")
}









