'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
  interestRate: 1.2, // %
  pin: 1111,

  movementsDates: [
    '2019-11-18T21:31:17.178Z',
    '2019-12-23T07:42:02.383Z',
    '2020-01-28T09:15:04.904Z',
    '2020-04-01T10:17:24.185Z',
    '2020-05-08T14:11:59.604Z',
    '2020-05-27T17:01:17.194Z',
    '2020-07-11T23:36:17.929Z',
    '2020-07-12T10:51:36.790Z',
  ],
  currency: 'EUR',
  locale: 'pt-PT', // de-DE
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,

  movementsDates: [
    '2019-11-01T13:15:33.035Z',
    '2019-11-30T09:48:16.867Z',
    '2019-12-25T06:04:23.907Z',
    '2020-01-25T14:18:46.235Z',
    '2020-02-05T16:33:06.386Z',
    '2020-04-10T14:43:26.374Z',
    '2020-06-25T18:49:59.371Z',
    '2020-07-26T12:01:20.894Z',
  ],
  currency: 'USD',
  locale: 'en-US',
};

const accounts = [account1, account2];
let currUser;
let globalSort = false; 
let time,timer;

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');


const displayMovements = function(sort = false)
{
  globalSort = sort;
  // sort methods actually mutates the original array
  const mov = new Array(...this.movements);
  const movs = sort==true ? mov.sort((a,b) => b-a) : mov;
  containerMovements.innerHTML = '';
  const movsD = this.movementsDates;
  movs.forEach((element, i) => {
    const type = element > 0 ? "deposit" : "withdrawl";
    const newElement = document.createElement('div');
    newElement.className = 'movements__row';
    let dobj = new Date(movsD[i]);
    newElement.innerHTML = `<div class="movements__type movements__type--${type}">${i+1} ${type}</div><div class="movements__date">${dobj.getDate()}/${dobj.getMonth()+1}/${dobj.getFullYear()}</div>
    <div class="movements__value">${element}€</div>`
    containerMovements.appendChild(newElement);
  });
}

const displayDates = function(obj)
{
  let dObj = Date.now();
  let date_obj = new Date(dObj);
  console.log(date_obj);
  labelDate.textContent = `${date_obj.getDate()}/${date_obj.getMonth()}/${date_obj.getFullYear()}`;
}

// displayMovements.call(accounts[0]);
/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

const currencies = new Map([
  ['USD', 'United States dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'Pound sterling'],
]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////

// creating user names for each owner
accounts.forEach((obj)=>
{
  let username = obj['owner'].toLowerCase().split(' ');
  let usr = '';
  const new_usr = username.map((str) => str[0].slice(0));
  //console.log(new_usr);
  new_usr.forEach((ele) => {
    usr = usr + ele;
  });
  console.log(usr);
  obj.username = usr;
});

////////////////////////////////////
// Display Everything

function displayEverything(obj)
{
  // Display UI message
  labelWelcome.textContent = `Welcome Back! ${obj.owner.split(' ')[0]}`;

  // Display Movements and their dates
  displayMovements.call(accounts.find(ele => ele == obj));
  displayDates.call(accounts.find(ele => ele == obj).movementsDates);

  // print total balance
  BalancePrint(accounts.find(ele => ele == obj).movements)

  //display deposists
  DisplayTotalDeposits.call(accounts.find(ele => ele===obj).movements);

  // display withdrawls
  DisplayTotalWith.call(accounts.find(ele => ele == obj).movements);

  // display interest
  DisplayInterest.call(accounts.find(ele => ele == obj));
}
//////////////////////////////////////////////////
// Calculating total Balance
const BalancePrint = function(movements)
{
  const total_bal = movements.reduce((acc,curr)=>acc+curr,0);
  if(total_bal>0)
    labelBalance.textContent = total_bal+`€`;
  else
  labelBalance.textContent = 0+`€`;    
}
// BalancePrint(accounts[0].movements)

//////////////////////////////////////////////
// Calculating total deposits,withdrawls and interest

const DisplayTotalDeposits = function()
{
  labelSumIn.textContent = this.filter(curr => curr > 0).reduce((acc,curr) => acc+curr,0)+' €';
}
// DisplayTotalDeposits.call(accounts[0].movements)

const DisplayTotalWith = function()
{
  labelSumOut.textContent = Math.abs(this.filter(curr => curr < 0).reduce((acc,curr) => acc+curr,0))+' €';
}
// DisplayTotalWith.call(accounts[0].movements);

//interest on each deposit
const DisplayInterest = function()
{
  labelSumInterest.textContent = this.movements.filter(curr => curr > 0).map(curr => curr*this.interestRate/100).filter((interest)=>
  {
    return interest>=1;
  }).reduce((acc,curr) => acc+curr,0)+' €';
}
// DisplayInterest.call(accounts[0]);

const logout_timer = function()
{
  time = 300;
  const tick = function()
  {
    console.log(labelTimer.textContent);
    let min = String(Math.trunc(time/60)).padStart(2,0);
    let sec = String(Math.trunc(time % 60)).padStart(2,0);
    labelTimer.textContent = `${min}:${sec}`;
    time--;
    if(time === 0)
    {
      clearInterval(time);
      labelWelcome.textContent = `Log in to get started`;
      containerApp.style.opacity = 0;
    }
  }
  tick();
  timer = setInterval(tick,1000);
  return timer;
}
// Login Implementation
btnLogin.addEventListener('click',function(e)
{
  e.preventDefault();
  containerApp.style.opacity = 0;
  time = 0;
  let userName = inputLoginUsername.value;
  currUser = userName;
  console.log(userName);
  inputLoginUsername.value = '';
  let pin = inputLoginPin.value;
  inputLoginPin.value = '';
  let obj = accounts.find((ele) => 
  {
    if(ele.username==userName && ele.pin==pin)
      return ele;
  });
  console.log(obj);
  if(obj){
      //Display Everything
      displayEverything(obj);
      containerApp.style.opacity = 100;
      if(timer)
      clearInterval(timer)
      timer = logout_timer();
  }
});

// Transfer money implementation

btnTransfer.addEventListener('click',function(e)
{
  e.preventDefault();
  let tranferTo = inputTransferTo.value;
  inputTransferTo.value = '';
  let money = Number(inputTransferAmount.value);
  inputTransferAmount.value = '';
  let obj = accounts.find((ele) => {
    if(ele.username===tranferTo)
       return ele;
  });
  console.log(obj);
  if(obj)
  {
    obj.movements.push(money);
    obj = accounts.find((ele)=>
    {
      if(ele.username===currUser)
        return ele;
    });
    console.log(obj);
    obj.movements.push(-money);
    console.log(obj);
    displayEverything(obj);
    //Reset timer
    clearInterval(timer);
    timer = logout_timer();
  }
});

// Request Loan
btnLoan.addEventListener('click',function(e)
{
  e.preventDefault();
  let loanAmnt = inputLoanAmount.value;
  inputLoanAmount.value = '';
  let obj = accounts.find(ele => ele.username===currUser);
  obj.movements.push(Number(loanAmnt));
  obj.movementsDates.push(new Date().toISOString());
  displayEverything(obj);
  //Reset timer
  clearInterval(timer);
  timer = logout_timer();
});

// Deleting Account
btnClose.addEventListener('click',function(e)
{
  e.preventDefault();
  let obj = accounts.find(ele => ele.username===currUser);
  console.log(obj)
  if(inputCloseUsername.value==currUser && inputClosePin.value==obj.pin)
  {
    let ind = accounts.findIndex(ele => obj===ele);
    console.log(ind);
    inputCloseUsername.value='';
    inputLoginPin.value='';
    accounts.splice(ind,1);
    containerApp.style.opacity = 0;
  }
});

// Sorting movements
btnSort.addEventListener('click',function()
{
  let obj = accounts.find(ele => ele.username===currUser);
  console.log(obj);
  globalSort==true ? displayMovements.call(obj,false) : displayMovements.call(obj,true);
});


