// Generic method to send request to APIs

async function requestAPI(url, data, headers, method) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: method,
        // mode: 'no-cors',
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


const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i
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
        passwordMsg.innerText = 'Password cannot be less than 8 characters!';
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
        nameMsg.innerText = "Name is Required!";
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