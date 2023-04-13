// Toggling between login and register views

let authRadioBtn = document.getElementsByName('authentication_radio');
let loginContent = document.getElementById('login-content');
let registerContent = document.getElementById('register-content');

for (let i = 0; i < authRadioBtn.length; i++) {
    authRadioBtn[i].addEventListener("change", function () {
        try {
            if(this.checked && this.id == 'login') {
                loginContent.classList.remove('hide');
                if(registerContent.classList.contains('hide')) {
                    if(!postRegistrationContent.classList.contains('hide')) {
                        postRegistrationContent.classList.add('hide');
                    }
                }
                else {
                    registerContent.classList.add('hide');
                }
            }
            else if(this.checked && this.id == 'register') {
                registerContent.classList.remove('hide')
                if(loginContent.classList.contains('hide')){
                }
                else {
                    loginContent.classList.add('hide');
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    })
}


// Show Post Registration Message

let postRegistrationContent = document.getElementById('post-registration-content');
let registerBtn = document.getElementById('register-btn');

function showPostRegistrationContent() {
    try {
        if(registerContent.classList.contains('hide')) {
        }
        else {
            registerContent.classList.add('hide');
            postRegistrationContent.classList.remove('hide');
        }
    }
    catch(err) {
        console.log(err);
    }
}


// Show/hide password functionality

let passwordIcons = document.querySelectorAll(".hide-password-field");

for (let i = 0; i < passwordIcons.length; i++) {
  passwordIcons[i].addEventListener("click", function () {
    try {
      const passwordField = this.nextElementSibling;
      if (this.classList.contains("fa-eye")) {
        this.classList.remove("fa-eye");
        passwordField.type = "password";
      } else {
        this.classList.add("fa-eye");
        passwordField.type = "text";
      }
    } catch (err) {
      console.log(err);
    }
  });
}


// Login Form Handling


function isValidEmail(email) {
    let emailMsg = email.closest('form').querySelector('.email-msg');
    if(email.value.trim() == '') {
        emailMsg.innerText = 'Email is required!';
        return false;
    }
    else if(!emailRegex.test(email.value)) {
        emailMsg.innerText = 'Email is invalid!';
        return false;
    }
    else {
        email.classList.remove('input-error');
        emailMsg.innerText = '';
        emailMsg.classList.remove('active')
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
        return true;
    }
}


function matchingPassword(password, confirmPassword) {
    let confirmPasswordMsg = confirmPassword.closest('.password-input').querySelector('.password-msg');
    if(password.value != confirmPassword.value) {
        confirmPasswordMsg.innerText = 'Passwords donot match';
        return false;
    }
    else {
        confirmPasswordMsg.innerText = '';
        confirmPasswordMsg.classList.remove('active');
        confirmPassword.classList.remove('input-error');
        return true;
    }
}


const emailRegex = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i

// let loginEmail = document.getElementById('login-email');
// loginEmail.addEventListener('input', function() {
//     if(isValidEmail(this)) {
//         this.classList.remove('input-error');
//     }
// })

// let loginPassword = document.getElementById('login-password');
// loginPassword.addEventListener('input', function() {
//     if(isValidPassword(this)) {
//         this.classList.remove('input-error');
//     }
// })


function loginForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let emailField = form.querySelector('input[name="email"]');
    let emailMsg = form.querySelector('.email-msg');
    let passwordField = form.querySelector('input[name="password"]');
    let passwordMsg = form.querySelector('.password-msg');

    if(!isValidEmail(emailField)) {
        emailField.classList.add('input-error');
        emailMsg.classList.add('active');
        return false;
    }
    else if(!isValidPassword(passwordField)) {
        passwordField.classList.add('input-error');
        passwordMsg.classList.add('active');
        return false;
    }
    else {
        location.href = location.origin + '/property-listing/';
    }

}


// Register Form Handling

// let firstName = document.querySelector('input[name="first_name"]');
// firstName.addEventListener('input', function() {
//     if(isValidName(this)) {
//         this.classList.remove('input-error');
//     }
// });

// let lastName = document.querySelector('input[name="last_name"]');
// lastName.addEventListener('input', function() {
//     if(isValidName(this)) {
//         this.classList.remove('input-error');
//     }
// })

// let registerEmail = document.getElementById('register-email');
// registerEmail.addEventListener('input', function() {
//     if(isValidEmail(this)) {
//         this.classList.remove('input-error');
//     }
// })

// let registerPassword = document.getElementById('register-password');
// registerPassword.addEventListener('input', function() {
//     if(isValidPassword(this)) {
//         this.classList.remove('input-error');
//     }
// })

// let registerConfirmPassword = document.querySelector('input[name="confirm_password"]');
// registerConfirmPassword.addEventListener('input', function() {
//     if(isValidPassword(this)) {
//         this.classList.remove('input-error');
//     }
// })

function registerForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let firstName = form.querySelector('input[name="first_name"]');
    let lastName = form.querySelector('input[name="last_name"]');
    let emailField = form.querySelector('input[name="email"]');
    let passwordField = form.querySelector('input[name="password"]');
    let confirmPassword = form.querySelector('input[name="confirm_password"]');
    let firstNameMsg = form.querySelector('.first-name-msg');
    let lastNameMsg = form.querySelector('.last-name-msg');
    let emailMsg = form.querySelector('.email-msg');
    let passwordMsg = form.querySelector('.password-msg');
    let confirmPasswordMsg = form.querySelector('.confirm-password-msg');

    if(!isValidName(firstName)) {
        firstName.classList.add('input-error');
        firstNameMsg.classList.add('active');
        return false;
    }
    else if(!isValidName(lastName)) {
        lastName.classList.add('input-error');
        lastNameMsg.classList.add('active');
        return false;
    }
    else if(!isValidEmail(emailField)){
        emailField.classList.add('input-error');
        emailMsg.classList.add('active');
        return false;
    }
    else if(!isValidPassword(passwordField)) {
        passwordField.classList.add('input-error');
        passwordMsg.classList.add('active');
        return false;
    }
    else if(!isValidPassword(confirmPassword)) {
        confirmPassword.classList.add('input-error');
        confirmPasswordMsg.classList.add('active');
    }
    else if(!matchingPassword(passwordField, confirmPassword)) {
        confirmPasswordMsg.classList.add('active');
        confirmPassword.classList.add('input-error');
    }
    else {
        if(registerContent.classList.contains('hide')) {
        }
        else {
            registerContent.classList.add('hide');
            postRegistrationContent.classList.remove('hide');
        }
    }
    
}