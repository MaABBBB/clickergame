// ここからJavaScriptを記述してください。
const config = {
    initialPage:document.getElementById("initial-page"),
    gamePage:document.getElementById("game-page"),
    gameAll:document.getElementById("game"),
    setting:document.getElementById("setting"),
    
};



function displaytoggle(ele, ele2){
    ele.classList.remove("d-block");
    ele.classList.add("d-none");

    ele2.classList.remove("d-none");
    ele2.classList.add("d-block");
}




class User{
    //ログイン情報をクラスで保存jsonを使ってuser情報を入手
    constructor(userName, burgers, days, money, oneClick, rate){
        this.userName = userName;
        this.burgers = burgers;
        this.years = 20;
        this.days = days;
        this.money = money;
        this.oneClick = oneClick;
        this.rate = rate;
        this.itemArr = [];
    }
    getMoneyRate(totalRate){
        this.rate += totalRate
        return this.rate;
    }
    clickBurger(){
        this.burgers += 1;
        this.money += this.oneClick;
        return this.money;
    }

    buildUserSkill(infoCard, value){
        if (infoCard.status == "ability"){
            this.oneClick += infoCard.effectValue * value;
        }
        else if (infoCard.status == "investment"){
            let price = infoCard.price;
            if (infoCard.name == "ETF Stock"){
                price = infoCard.buyNumber * infoCard.price;
                infoCard.price += infoCard.price * 0.1 * value;
            }
            this.rate += Math.floor(infoCard.effectValue  * price * value);
        }
        else if (infoCard.status == "realEstate"){
            this.rate += infoCard.effectValue * value;
        }
        console.log(this.rate);
        return this.money -= infoCard.price * value;
    }
}



function initializationAccount(gameAccount){
    //jsonを使ってユーザーの初期値をにゅう種
    displaytoggle(config.initialPage, config.gamePage);
    displaytoggle(config.initialPage, config.gameAll);
    setting(gameAccount);
    config.gamePage.append(createCards(gameAccount));
    getGoneDays(gameAccount);
}



function getGoneDays(User){
        //ここで毎秒変化するクラス変数を処理
    let container = config.gamePage;
    let dayCon = container.querySelectorAll("#days")[0];
    let yearCon = container.querySelectorAll("#years")[0];
    let moneyCon = container.querySelectorAll("#money")[0];

    intervalId = setInterval(function(){
        
        
        User.days++;
        User.money += User.rate;
        
        dayCon.innerHTML = `${User.days} days`
        yearCon.innerHTML = `${User.years} years old`
        moneyCon.innerHTML = `￥${User.money}`

        User.years = 20 + Math.floor(User.days/365);
        
        

        console.log(User.days + " " + User.money);
        

    },1000)
    return User;
}

function initialize(){
    //ここでユーザーのクラスを作る
    const gameform = document.getElementById("game-form");
    let gameAccount = new User(
    gameform.querySelectorAll(`input[name="userName"]`)[0].value,
    0,
    0,
    //ここでお金の初期値を決める
    50000,
    //ここでクリックの初期値を決める
    25,
    0)
    return gameAccount;
}


function setting(gameAccount){
    //初期化と保存のボタンをつくる
    config.setting.innerHTML = `
        <button class="btn btn-light p-0 m-0 mr-1">
            <img src="https://img.icons8.com/ios-glyphs/452/filled-trash.png" class=" p-0 m-0 setting" alt=""></button>
        <button class="btn btn-light p-0 m-0 ml-1">
            <img src="https://img.icons8.com/ios-glyphs/30/000000/folder-invoices--v1.png" class="setting p-0 m-0" alt="">
        </button>
                `
    let btnSetting = config.setting.querySelectorAll(".btn");

    btnSetting[0].addEventListener("click", function(){
        let result = confirm("Reset All Date?!??!?!!?");
        if (result){
            clearInterval(intervalId);
            gameAccount = initialize();

            for (let i = 0; i < cardArr.length; i++){
                cardArr[i].buyNumber = 0;
            }

            config.gamePage.innerHTML = "";
            config.gamePage.append(createCards(gameAccount));
            getGoneDays(gameAccount);

            console.log(12);
        }

        })
    btnSetting[1].addEventListener("click", function(){
        alert("Save your Data ;)");
        clearInterval(intervalId);
        for (let i = 0; i < cardArr.length; i++){
            gameAccount.itemArr[i] = cardArr[i].buyNumber;
            cardArr[i].buyNumber = 0;
        }
        let encoded = JSON.stringify(gameAccount);
        console.log(encoded);
        localStorage.setItem(gameAccount.userName, encoded);
        config.gamePage.innerHTML = "";
        config.setting.innerHTML = "";
        config.initialPage.querySelectorAll(`input[name="userName"]`)[0].value = "";
        displaytoggle(config.gameAll, config.initialPage);

    })
}

function createCards(User){
    //各アイテムのカードと詳細のカードを作る
    let container = View.createGameWindow(User);
    let selectCard = container.querySelectorAll("#select-item")[0];
    let itemInfo = container.querySelectorAll("#item-info")[0];
    for (let i = 0; i < cardArr.length; i++){
        let card = cardArr[i];
        let currCard = View.smallCard(cardArr[i]);

        selectCard.append(currCard);

        currCard.addEventListener("click", function(){
            let infoCard = View.largeCard(card);
            itemInfo.innerHTML = "";
            itemInfo.append(infoCard);
            displaytoggle(selectCard, itemInfo);


            let backbtn = infoCard.querySelectorAll(".back-btn")[0];
            backbtn.addEventListener("click", function(){
                changeDisplay(itemInfo, selectCard);
            })
            
            let purchaseBtn = infoCard.querySelectorAll(".next-btn")[0];
            purchaseBtn.addEventListener("click", function(){
                let value = parseInt(infoCard.querySelectorAll(`input[name="total"]`)[0].value);
                let amountPrice = parseInt(infoCard.querySelectorAll("#total")[0].value);
                if (value <= 0){
                    alert("invaild Number!!");
                    changeDisplay(itemInfo, selectCard);
                }
                else if (User.money < amountPrice){
                    alert("You don't have enough money.")
                    changeDisplay(itemInfo, selectCard);
                }
                else if (card.buyNumber + value > card.numberOfpurchae || value > card.numberOfpurchae){
                    alert("Do not buy max over.");
                    displaytoggle(itemInfo, selectCard);
                }
                else {
                    itemInfo.innerHTML = "";
                    displaytoggle(itemInfo, selectCard);

                    card.buyNumber += value;

                    container.querySelectorAll("#money")[0].innerHTML = `￥${User.buildUserSkill(card, value)}`
                    currCard.querySelectorAll("#totalPurchase")[0].innerHTML = `${card.buyNumber}`
                    container.querySelectorAll("#oneClick")[0].innerHTML = `one click ￥${User.oneClick}`
                }
                currCard.querySelectorAll("#price")[0].innerHTML = `￥${card.price}`
                console.log(card.price);
            
            })
            
        })
    }

    let burgerCon = container.querySelectorAll("#burgers")[0];
    let burgerClick = container.querySelectorAll("#burger-img")[0];
    burgerClick.addEventListener("click", function(){
        
        container.querySelectorAll("#money")[0].innerHTML = `￥${User.clickBurger()}`
        burgerCon.innerHTML = `${User.burgers} burger`;
        
    })
    return container;
}

function changeDisplay(ele, ele2){
    ele.innerHTML = "";
    displaytoggle(ele, ele2);
}

//購入するものの配列をクラスで作って、表示するViewクラスを使ってカードが作れるようにする。というかviewクラスにすべてのｈｔｍｌを入れてそこから引っ張り出せるようにする。
class View{
    static createGameWindow(User){
    let container = document.createElement("div");
    container.innerHTML =`
            <div class="col-12 d-flex" id="gamewindow">
                <div class="col-4 bg-dark" id="burger-zone">
                    <div class="text-center pt-3">
                        <div class="bg-blue">
                            <p class="col-12 rem1p5" id="burgers" value="0">${User.burgers} Burgers</p>
                            <p class="col-12" id="oneClick" value="25">one click ￥${User.oneClick}</p>
                        </div>
                    </div>
                    <div class="d-flex align-items-center trans">
                        <img id="burger-img" src="https://image.itmedia.co.jp/business/articles/2106/01/l_kk_burger_00.jpg" class="col-12 hover"　alt="">
                    </div>

                </div>
                <div class="col-8 p-2">
                    <div class="d-flex text-center col-12 p-2">
                        <div class="col-6 p-0 m-0">
                            <p class="pb-3 border-dark m-0" id="username" value="0">${User.userName}</p>
                            <p class="pb-3 border-dark m-0" id="years" value="20">${User.years} years old</p>
                        </div>
                        <div class="col-6 p-0 m-0">
                            <p class="border-dark m-0 pb-3" id="days" value="0">${User.days} days</p>
                            <p class="border-dark m-0 pb-3" id="money" value="20">￥${User.money}</p>
                        </div>
                    </div>
                    <div id="select-item" class="scroll border-dark">
                    </div>
                    <div id="item-info" class="scroll border-dark d-none">
                    </div>
                </div>
            </div>
    `

    return container;
    }

    static smallCard(cardInfo){
        let container = document.createElement("div");
        container.innerHTML = `
        <div class="col-12 d-flex hover border-dark align-items-center">
            <div class="col-4 d-flex align-items-center p-0">
                <img class="imgFit" src="${cardInfo.url}" alt="">
            </div>
            <div class="col-8">
                <div class="d-flex justify-content-around">
                    <p class="col-10 text-left rem1p5">${cardInfo.name}</p>
                    <p class="col-2 text-right rem1p5" id="totalPurchase">${cardInfo.buyNumber}</p>
                </div>
                <div class="d-flex justify-content-around">

                    <p id="price">￥${cardInfo.price}</p>
                    <p id="status" style="green">￥${cardInfo.effectValue} / sec</p>
                </div>
            </div>
        <div>

        `  
        let statusP = container.querySelectorAll("#status")[0];

        if (cardInfo.status == "ability"){
            statusP.innerHTML = `￥${cardInfo.effectValue} /click`
        }


        return container;
    }

    static largeCard(cardInfo){
        let container = document.createElement("div");
        container.innerHTML = `
        <div class="col-12 text-white">
            <div class="col-12 d-flex">
                <div class="col-6 text-left pl-0">
                    <p class="rem1p5">${cardInfo.name}</p>
                    <p>Max purchases: ${cardInfo.numberOfpurchae}</p>
                    <p>price:￥${cardInfo.price}</p>
                    <p id="get">Get ￥${cardInfo.effectValue} /sec</p>
                </div>
                <div class="col-6">
                    <img class="imgFit col-12" src="${cardInfo.url}">
                </div>
            </div>
            <p>How many would you like to buy?</p>
            <input type="number" class="form-control" placeholder="0" value="0" name="total" min="1" max="${cardInfo.numberOfpurchae - cardInfo.buyNumber}">
            <p class="text-right" id="total" value="0">total: ￥0</p>
        </div>

        `
        if (cardInfo.status == "ability"){
            container.querySelectorAll("#get")[0].innerHTML = `￥${cardInfo.effectValue} /click`
        }

        container.append(nextBackBtn("Go Back", "Purchase"));
        container.querySelectorAll(`input[name="total"]`)[0].addEventListener("change", function(){

            let amount = parseInt(container.querySelectorAll(`input[name="total"]`)[0].value);
            console.log(amount);
            let totalCon = container.querySelectorAll("#total")[0];
            let value = cardInfo.price * amount;

            totalCon.innerHTML = `total: ￥${value.toString()}`
            totalCon.value = value.toString();
            


        })

        return container;
    }

}




function nextBackBtn(backString, nextString){
    let btnContainer = document.createElement("div");
    btnContainer.innerHTML =`
    <div class="d-flex justify-content-between p-2 m-0">
        <div class="col-5 pl-0">
            <button class="btn btn-outline-primary btn-light col-12 back-btn">${backString}</button>
        </div>
        <div class="col-5 pr-0">
            <button class="btn btn-primary col-12 next-btn">${nextString}</button>
        </div>
    </div>
    `
    return btnContainer;
}


class CardInfo{
    constructor(name, price, effectValue, numberOfpurchae, url, status, buyNumber){
        this.name = name;
        this.price = price;
        this.effectValue = effectValue;
        this.numberOfpurchae = numberOfpurchae;
        this.url = url;
        this.status = status;
        this.buyNumber = buyNumber;
    }
}


let cardArr = [
    new CardInfo("Flip machine", 15000, 25, 500, "https://cdn.mos.cms.futurecdn.net/dE5g2MPc9xjmCXg6iH34nX.jpg", "ability",0),
    new CardInfo("ETF Stock", 300000, 0.1, Number.MAX_SAFE_INTEGER, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiyeeFnFLfQtDj_hFFWI5rBpYPMGpZ7NfAjg&usqp=CAU", "investment", 0),
    new CardInfo("ETF Bonds", 300000, 0.07, Number.MAX_SAFE_INTEGER, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiyeeFnFLfQtDj_hFFWI5rBpYPMGpZ7NfAjg&usqp=CAU", "investment", 0),
    new CardInfo("Lemonade Stand", 30000, 30, 1000, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcLZI6TDwsAhZ8zIGru9IpQr7fXzIwcXBpZw&usqp=CAU", "realEstate", 0),
    new CardInfo("Ice Cream Truck", 100000, 120, 500, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRJkkNAThoz3q8rt3wsW0rG7oMJEFAYL-6PYA&usqp=CAU", "realEstate", 0),
    new CardInfo("House", 20000000, 32000, 100, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrM_mb5Wqx3OXAlW6_12t3HRX3OG4GhZs7-g&usqp=CAU", "realEstate", 0),
    new CardInfo("TownHouse", 40000000, 64000, 100, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQN9bvwzUK1wONQJsXbfuOhXWUznLq7lQExdg&usqp=CAU", "realEstate", 0),
    new CardInfo("Mansion", 250000000, 500000, 20, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZmzTYIDcLgS18UYtllQHfREZon9d_dMxXSg&usqp=CAU", "realEstate", 0),
    new CardInfo("Industrial Space", 1000000000, 2200000, 10, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSkj6YsW0eACrqWKNOoMKlkR4D0FQxvRikgfw&usqp=CAU", "realEstate", 0),
    new CardInfo("Hotel Skyscraper", 10000000000, 25000000, 5, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ19yKHHXtsurF94j-o13CaFMkDuyfjnAv6qA&usqp=CAU", "realEstate", 0),
    new CardInfo("Bullet-Speed Sky Railway", 10000000000000, 30000000000, 1, "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSS_jEFEdp_acZF-HiunpDKYg_RL6b6z01UVw&usqp=CAU", "realEstate", 0)
]


document.getElementById("new").onclick = function(){
    let name = document.getElementById("name");
    if (!name.value){
        alert("enter user name");
        return false;
    }
    initializationAccount(initialize());
}

document.getElementById("login").onclick = function(){
    let name = document.getElementById("name");
    if (!name.value){
        alert("enter user name");
        return false;
    }
    else if (localStorage.getItem(name.value) === null){
        alert("no data");
        return false;
    }
    let gameAccount = initialize();
        if (localStorage.getItem(gameAccount.userName) !== null){
            let strage = localStorage.getItem(gameAccount.userName);
            let jsonDecoded = JSON.parse(strage);
            console.log(jsonDecoded);


            gameAccount.burgers = jsonDecoded.burgers;
            gameAccount.days = jsonDecoded.days;
            gameAccount.years = jsonDecoded.years;
            gameAccount.money = jsonDecoded.money;
            gameAccount.oneClick = jsonDecoded.oneClick;
            gameAccount.rate = jsonDecoded.rate;
            gameAccount.itemArr = jsonDecoded.itemArr;
            for (let i = 0; i < cardArr.length; i++){
                cardArr[i].buyNumber = gameAccount.itemArr[i];
            }
            console.log(gameAccount);
        }

        initializationAccount(gameAccount);
}
