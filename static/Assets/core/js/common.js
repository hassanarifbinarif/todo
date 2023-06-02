// Generic method to send request to APIs

async function requestAPI(url, data, headers, method) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method,
        mode: 'cors',
        // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: headers,
        body: data,
    });
    return response; // parses JSON response into native JavaScript objects
}


function formDataToObject(formData) {
    let getData = {}
    formData.forEach(function(value, key) {
        getData[key] = value;
    });
    return getData
}


function beforeLoad(button) {
    button.querySelector('.btn-text').innerText = '';
    button.querySelector('.spinner-border').classList.remove('hide');
    button.disabled = true;
    button.style.cursor ='not-allowed';
}

function afterLoad(button, text) {
    button.querySelector('.btn-text').innerText = text;
    button.querySelector('span').classList.add('hide');
    button.disabled = false;
    button.style.cursor ='pointer';
}


function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(window.atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));
    return JSON.parse(jsonPayload);
};

// let cookie = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNjg1NzE2ODQxLCJqdGkiOiI5MjU3NzI0YzFhMWI0Njk4ODA1ZGU3MDVlMGJkYzRjMCIsInVzZXJfaWQiOjEwLCJzdGVwIjoiY29tcGxldGVkIiwicm9sZSI6ImFkbWluIn0.egox8tE_tM8HJpArqr-OEOhbvMKWXtWoGzA4-3TVgVA';
// let parsedCookie = parseJwt(cookie);
// console.log("Parsed Cookie: ", parsedCookie);
// let date = new Date(parsedCookie.exp * 1000);
// console.log(date.getTime());
// console.log("To Locale String: ", date.toLocaleString());
// console.log("Cookie Expiry Time: ", date.toUTCString());


function setCookie(name, value, expiry) {
    if(name === 'access'){
        name = 'user_access_token'
    }else if(name === 'refresh'){
        name = 'user_refresh_token'
    }else{
        name=name
    }
    var date = new Date(expiry * 1000);
    expires = "; expires=" + date.toUTCString();
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


function getCookie(name) {
    if(name === 'access'){
        name = 'user_access_token'
    }else if(name === 'refresh'){
        name = 'user_refresh_token'
    }else{
        name=name
    }
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
    }
    return null;
}


function getAccessTokenFromCookie() {
    return getCookie('access');
}


function getRefreshTokenFromCookie() {
    return getCookie('refresh');
}


function getCookieExpirationTime(name) {
    if(name === 'access'){
        name = 'buyer_access_token'
    }else if(name === 'refresh'){
        name = 'buyer_refresh_token'
    }else{
        name=name
    }
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    return ca
}

const apiURL = 'https://api-dev.todo.com.ec/api';

async function onRefreshToken() {
    let refreshToken = getRefreshTokenFromCookie();
    let myData = {"refresh": `${refreshToken}`};
    let refreshResponse = await requestAPI(`${apiURL}/refresh`, myData, {}, 'POST');
    return refreshResponse;
}

async function onAdminRefreshToken() {
    let refreshToken = getCookie('admin_refresh');
    let myData = {"refresh": `${refreshToken}`};
    let refreshResponse = await requestAPI(`${apiURL}/refresh`, myData, {}, 'POST');
    return refreshResponse; 
}

function clearTokens(){
    setCookie('access', '', 0);
    setCookie('refresh', '', 0);
}


function clearAdminTokens() {
    setCookie('admin_access', '', 0);
    setCookie('admin_refresh', '', 0);
}


function logout() {
    clearTokens();
    location.pathname = '/accounts/';
}


function adminLogout() {
    clearAdminTokens();
    location.pathname = '/administration/login/';
}


function getSearchURL(searchURL, baseURL) {
    try {
        let sourceParams = new URLSearchParams(searchURL.split('?')[1]);
        let destination = new URL(baseURL);
        if(sourceParams.get('page') == undefined) {
            sourceParams.append('page', '1');
        }
        sourceParams.forEach((value, key) => {
            if(destination.searchParams.has(key)) {
                destination.searchParams.set(key, value);
            }
            else {
                destination.searchParams.append(key, value);
            }
        })
        return destination.toString();
    }
    catch (err) {
        return null;
    }
}


const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
const phoneRegex = /^(\+593|593|09)([2-9]\d{7})$/;
let timeOut;

function isValidEmail(email) {
    let emailMsg = email.closest('form').querySelector('.email-msg');
    if(email.value.trim() == '') {
        emailMsg.innerText = 'Email is required!';
        return false;
    }
    else if(!emailRegex.test(email.value)) {
        emailMsg.innerText = 'Enter a valid email address!';
        return false;
    }
    else {
        email.classList.remove('input-error');
        emailMsg.innerText = '';
        emailMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}

function isValidPassword(password) {
    let passwordMsg = password.closest('.password-input').querySelector('.password-msg');
    if(password.value == '') {
        passwordMsg.innerText = 'Password is required!';
        return false;
    }
    else if(password.value.length < 8) {
        passwordMsg.innerText = 'Password must be atleast 8 characters!';
        return false;
    }
    else {
        password.classList.remove('input-error');
        passwordMsg.innerText = '';
        passwordMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidName(name) {
    let nameMsg = name.nextElementSibling;
    if(name.value.trim().length == 0) {
        nameMsg.innerText = "Required Field!";
        return false;
    }
    else {
        name.classList.remove('input-error');
        nameMsg.innerText = '';
        nameMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function matchingPassword(password, confirmPassword) {
    let confirmPasswordMsg = confirmPassword.closest('.password-input').querySelector('.password-msg');
    if(password.value != confirmPassword.value) {
        confirmPasswordMsg.innerText = 'Passwords does not match';
        return false;
    }
    else {
        confirmPasswordMsg.innerText = '';
        confirmPasswordMsg.classList.remove('active');
        confirmPassword.classList.remove('input-error');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}

// /^\d+$/.test(number.value)

function isValidNumber(number) {
    let numberMsg = number.nextElementSibling;
    if(number.value.trim().length == 0) {
        numberMsg.innerText = 'Required Field';
        return false;
    }
    else if(!(!isNaN(number.value) && /^\d+(\.\d+)?$/.test(number.value))) {
        numberMsg.innerText = 'Number must contain only digits';
    }
    // else if(!phoneRegex.test(number.value)) {
    //     numberMsg.innerText = 'Number is invalid!';
    //     return false;
    // }
    else {
        number.classList.remove('input-error');
        numberMsg.innerText = '';
        numberMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidImage(image) {
    let pictureMsg = image.closest('.image-input-container').querySelector('.picture-msg');
    if(image.files.length == 0) {
        pictureMsg.innerText = 'Image required!';
        return false;
    }
    else {
        image.classList.remove('input-error');
        pictureMsg.innerText = '';
        pictureMsg.classList.remove('active');
        return true;
    }
}