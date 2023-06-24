const inputslider =document.querySelector("[data-lengthSlider]");
// syntax to access custom attributes
const lengthDisplay = document.querySelector("[data-lengthNumber]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercasecheck = document.querySelector("#uppercase");
const lowercasecheck = document.querySelector("#lowercase");
const numberscheck = document.querySelector("#numbers");
const symbolcheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allcheckBox = document.querySelectorAll("input[type=checkbox]");

const symbols = '~`!@#$%^&*()_-+=[]{}|/<>,?.:;';


let password = "";
let passwordLength = 10;
let checkcount =0;
 handleSlider();
 setIndicator("#ccc");
 // set password length
function handleSlider(){
    inputslider.value = passwordLength; // intial slider at 10 (Default)
    lengthDisplay.innerText = passwordLength; // initial value also equal to slider
    
//password length ko ui pe display karta hai
// it jaha tak slider gaya h waha tak voilet color karna rest all dark voilet but ye hua kyu nhi
 const min = inputslider.min;
 const max = inputslider.max;
 inputslider.style.backgroundSize = ( (passwordLength - min)*100/(max-min)) +"% 100%";
 // now our size is upto slider thumb
}

function setIndicator(color){ // color strength change karna
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;     //for shadow around indicator 
}

function getRandomInteger(min, max){
    return  Math.floor( Math.random()*(max- min)) + min ;// random value between  min and max 
} 
function generateRandomNumber(){
     return getRandomInteger(0,9);
}
function generateLowercase(){
    return String.fromCharCode(getRandomInteger(97,123));
}
function generateUppercase(){
    return String.fromCharCode(getRandomInteger(65,90));
}
function generateSymbol(){
    const randNo = getRandomInteger(0, symbols.length);
    return symbols.charAt(randNo);//charAt tell kon sa symbol or character h use position par 
}
function calcStrength(){
    let hasupper = false;
    let haslower = false; 
    let hasnumber = false;
    let hassym = false;
    if(uppercasecheck.checked) hasupper = true;//.checked tell the checkbox is checked or not it return bool
    if(lowercasecheck.checked) haslower = true;
    if(numberscheck.checked) hasnumber = true;
    if(symbolcheck.checked) hassym = true;

     if(hasupper && haslower && (hasnumber || hassym) && passwordLength>=8){
        setIndicator("#0f0");
     }
     else if((haslower || hasupper) && (hasnumber || hassym) && passwordLength >=8){
        setIndicator("#ff0");
     }
     else{
        setIndicator("#f00");
     }
}

 // copycontent : it will copy the password in clipboard
// we using await in copyCOntent function ki jab tak generate password na ho toh 
//tab tak ye wait kare "copied" show karne ke liye
// if user in hurry and press before generation then we do error handling 
 // await , setTimeout are asyncronous function therefore write in await function
async function copyContent(){
    try {  
        await navigator.clipboard.writeText(passwordDisplay.value);
       copyMsg.innerText = "copied";
    }
       catch(e){
        copyMsg.innerText = "failed";
       }

       // to make copy wala span visible
       copyMsg.classList.add("active"); // copied visible ho screen par 
                                       // isliye copyMsg ki class list me active daal diya jo starting mein nahi hoga

       setTimeout(() => {
        copyMsg.classList.remove("active"); //after 2 sec we have to remove this 
       },2000);
}


inputslider.addEventListener('input',(e)=>{
    passwordLength= e.target.value;
    handleSlider();
    // value of slider between 1 to 20
    //slider ke liye slide hi input hota h
    // e.target just current value of slider darshata h uski value ko 
    //passwordLength ki value bana di
    // at last handleslider ko call kiya taki lengthdisplay( woh no) bhi uske equal ho jae
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value) // agar koi password h toh use tafi hum copy kar paenge
    copyContent();
})

function handleCheckBoxChange(){
    checkcount =0;
    allcheckBox.forEach((checkbox)=>{
        if(checkbox.checked)checkcount++;
    });

    //special case no of checked box checked is greater than the length of password
    // do passwordlength = countof checkbox who checked
    if(passwordLength<checkcount){
        passwordLength = checkcount;
 //becuse here length change so we calll handleslider to show change of password length on ui
        handleSlider();
    }
}
allcheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})
// sabhi checkbox ko alag alag bhi event listner laga sakte but length badi ho jaegi
// ye acchi practice h
generateBtn.addEventListener('click', ()=>{
 if(checkcount<=0)return ;

 if(passwordLength < checkcount){
    passwordLength = checkcount;
           handleSlider();
 }
 
 // remove old password before gerenate new one
 password = "";
 
  // let's put the stuff mentioned by checkbox

// {if(uppercasecheck) password += generateUppercase();
// if(lowercasecheck) password += generateLowercase();
// if(numberscheck) password += generateRandomNumber();
// if(symbolcheck) password += generateSymbol();
// we use loop beacuse length may greater than 4 but phir password ek order mein aaega ki pahle 
// upper -> lowe -> number ->symbol 
// ye toh nho chahte so 
// we make array jisme four function honge to generate upper lower num and symbol
// usme se random select karenge
// }

let funarr = [];
if(uppercasecheck.checked) funarr.push(generateUppercase);
if(lowercasecheck.checked) funarr.push(generateLowercase);
if(numberscheck.checked) funarr.push(generateRandomNumber);
if(symbolcheck.checked) funarr.push(generateSymbol);

//complusory addition atleat ek baar sare aae jo checked h
 for(let i=0;i<funarr.length;i++){
    password += funarr[i]();
 }

 //remaining and randomly
 for(let i=0;i<passwordLength- funarr.length;i++){
    let randindex = getRandomInteger(0,funarr.length);
    password += funarr[randindex]();
 }

 // now suffle the password beacuse everytime jo upper tick chekcbox let upper then password mein pahle woh hi aaega issliye need to suffle
  password = shufflePassword(Array.from(password)); // pass password as array because fisher yates method need array
 
   function shufflePassword(array){
     //best suffle algorithm is "fisher Yates method" and this method can apply on array
   for(let i =array.length-1;i>0;i--){
    const j = Math.floor(Math.random()*(i+1));
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp ;
   }
   let str = "";
   array.forEach((el)=>(str += el));
   return str;
    }
  //show in UI
   passwordDisplay.value = password;
    // calculate strength
    calcStrength();
})


















