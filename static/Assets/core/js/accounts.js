// Toggling between login and register views

let authRadioBtn = document.getElementsByName("authentication_radio");
let loginContent = document.getElementById("login-content");
let registerContent = document.getElementById("register-content");

for (let i = 0; i < authRadioBtn.length; i++) {
    authRadioBtn[i].addEventListener("change", function () {
        try {
            if (this.checked && this.id == "login") {
                loginContent.classList.remove("hide");
                if (registerContent.classList.contains("hide")) {
                    if (!postRegistrationContent.classList.contains("hide")) {
                        postRegistrationContent.classList.add("hide");
                    }
                } else {
                    registerContent.classList.add("hide");
                }
            } else if (this.checked && this.id == "register") {
                registerContent.classList.remove("hide");
                if (loginContent.classList.contains("hide")) {
                } else {
                    loginContent.classList.add("hide");
                }
            }
        } catch (err) {
            console.log(err);
        }
    });
}

// Show Post Registration Message

let postRegistrationContent = document.getElementById(
    "post-registration-content"
);
let registerBtn = document.getElementById("register-btn");

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

async function loginForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let emailField = form.querySelector('input[name="email"]');
    let emailMsg = form.querySelector(".email-msg");
    let passwordField = form.querySelector('input[name="password"]');
    let passwordMsg = form.querySelector(".password-msg");
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (!isValidEmail(emailField)) {
        emailField.classList.add("input-error");
        emailMsg.classList.add("active");
        emailField.addEventListener("input", function () {
            if (isValidEmail(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    emailMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    } else if (!isValidPassword(passwordField)) {
        passwordField.classList.add("input-error");
        passwordMsg.classList.add("active");
        passwordField.addEventListener("input", function () {
            if (isValidPassword(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    passwordMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    } else {
        try {
            beforeLoad(button);
            let formData = new FormData(form);
            let data = formDataToObject(formData);
            let headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": data.csrfmiddlewaretoken,
            };
            let response = await requestAPI(`${apiURL}/login`, JSON.stringify(data), headers, "POST");
            response.json().then(async function (res) {
                if (response.status == 400) {
                    if(res.messages.password) {
                        passwordField.classList.add("input-error");
                        passwordMsg.classList.add("active");
                        res.messages.password.forEach((message) => {
                            passwordMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                    else if(res.messages.email) {
                        emailField.classList.add("input-error");
                        emailMsg.classList.add("active");
                        res.messages.email.forEach((message) => {
                            emailMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                    afterLoad(button, buttonText);
                } else if (response.status == 200) {
                    let myHeader = {
                        Authorization: `Bearer ${res.access}`,
                    };
                    let myRes = await requestAPI(`${apiURL}/me`, null, myHeader, "GET");
                    myRes.json().then(function (myres) {
                        if (myRes.status == 401) {
                            emailField.classList.add("input-error");
                            emailMsg.classList.add("active");
                            emailMsg.innerText = myres.messages.non_field;
                        } else if (myRes.status == 200) {
                            emailMsg.innerText = "";
                            passwordMsg.innerText = "";
                            emailMsg.classList.remove("active");
                            passwordMsg.classList.remove("active");
                            const accessToken = parseJwt(res.access);
                            const refreshToken = parseJwt(res.refresh);
                            setCookie("access", res.access, accessToken.exp);
                            setCookie("refresh", res.refresh, refreshToken.exp);
                            location.href = location.origin + "/";
                        }
                        afterLoad(button, buttonText);
                    });
                } else {
                    passwordMsg.innerText =
                        "An error occured. Please try again";
                    passwordMsg.classList.add("active");
                    afterLoad(button, buttonText);
                }
            });
        } catch (err) {
            console.log(err);
            afterLoad(button, "Error occurred! Retry later");
            setTimeout(() => {
                afterLoad(button, buttonText);
            }, 2000);
        }
    }
}

// Register Form Handling

let firstName = document.querySelector('input[name="first_name"]');
firstName.addEventListener("input", function () {
    if (isValidName(this)) {
        this.classList.remove("input-error");
    } else {
        let inputField = this;
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function () {
            inputField.classList.add("input-error");
            inputField.nextElementSibling.classList.add("active");
        }, 1500);
    }
});

let lastName = document.querySelector('input[name="last_name"]');
lastName.addEventListener("input", function () {
    if (isValidName(this)) {
        this.classList.remove("input-error");
    } else {
        let inputField = this;
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function () {
            inputField.classList.add("input-error");
            inputField.nextElementSibling.classList.add("active");
        }, 1500);
    }
});

let registerEmail = document.getElementById("register-email");
registerEmail.addEventListener("input", function () {
    if (isValidEmail(this)) {
        this.classList.remove("input-error");
    } else {
        let inputField = this;
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function () {
            inputField.classList.add("input-error");
            inputField.nextElementSibling.classList.add("active");
        }, 1500);
    }
});

let registerPassword = document.getElementById("register-password");
registerPassword.addEventListener("input", function () {
    if (isValidPassword(this)) {
        this.classList.remove("input-error");
    } else {
        let inputField = this;
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function () {
            inputField.classList.add("input-error");
            inputField
                .closest(".password-input")
                .querySelector(".password-msg")
                .classList.add("active");
        }, 1500);
    }
});

let registerConfirmPassword = document.querySelector(
    'input[name="confirm_password"]'
);
registerConfirmPassword.addEventListener("input", function () {
    if (isValidPassword(this)) {
        this.classList.remove("input-error");
    } else {
        let inputField = this;
        if (timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function () {
            inputField.classList.add("input-error");
            inputField
                .closest(".password-input")
                .querySelector(".password-msg")
                .classList.add("active");
        }, 1000);
    }
});

async function registerForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let firstName = form.querySelector('input[name="first_name"]');
    let lastName = form.querySelector('input[name="last_name"]');
    let emailField = form.querySelector('input[name="email"]');
    let passwordField = form.querySelector('input[name="password"]');
    let confirmPassword = form.querySelector('input[name="confirm_password"]');
    let firstNameMsg = form.querySelector(".first-name-msg");
    let lastNameMsg = form.querySelector(".last-name-msg");
    let emailMsg = form.querySelector(".email-msg");
    let passwordMsg = form.querySelector(".password-msg");
    let confirmPasswordMsg = form.querySelector(".confirm-password-msg");

    if (!isValidName(firstName)) {
        firstName.classList.add("input-error");
        firstNameMsg.classList.add("active");
        return false;
    } else if (!isValidName(lastName)) {
        lastName.classList.add("input-error");
        lastNameMsg.classList.add("active");
        return false;
    } else if (!isValidEmail(emailField)) {
        emailField.classList.add("input-error");
        emailMsg.classList.add("active");
        return false;
    } else if (!isValidPassword(passwordField)) {
        passwordField.classList.add("input-error");
        passwordMsg.classList.add("active");
        return false;
    } else if (!isValidPassword(confirmPassword)) {
        confirmPassword.classList.add("input-error");
        confirmPasswordMsg.classList.add("active");
        return false;
    } else if (!matchingPassword(passwordField, confirmPassword)) {
        confirmPasswordMsg.classList.add("active");
        confirmPassword.classList.add("input-error");
        return false;
    } else {
        try {
            let button = form.querySelector('button[type="submit"]');
            let buttonText = button.innerText;
            let formData = new FormData(form);
            let data = formDataToObject(formData);
            let headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": data.csrfmiddlewaretoken,
            };
            beforeLoad(button);
            let response = await requestAPI(
                `${apiURL}/register`,
                JSON.stringify(data),
                headers,
                "POST"
            );
            if (response.status == 400) {
                response.json().then(function (res) {
                    if (res.messages.email) {
                        emailField.classList.add("input-error");
                        emailMsg.classList.add("active");
                        res.messages.email.forEach((message) => {
                            emailMsg.innerHTML += `${message} <br />`;
                        });
                    }
                    if (res.messages.password) {
                        passwordField.classList.add("input-error");
                        passwordMsg.classList.add("active");
                        res.messages.password.forEach((message) => {
                            passwordMsg.innerHTML += `${message}. <br />`;
                        });
                    }
                });
                afterLoad(button, buttonText);
                return false;
            }
            if (response.status == 200) {
                afterLoad(button, buttonText);
                if (registerContent.classList.contains("hide")) {
                } else {
                    registerContent.classList.add("hide");
                    postRegistrationContent.classList.remove("hide");
                }
                postRegistrationContent.querySelector(
                    "#post-registration-email"
                ).value = emailField.value;
            }
        } catch (err) {
            console.log(err);
            afterLoad(button, buttonText);
        }
    }
}

async function resendConfirmationEmail(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let headers = {
        "Content-Type": "application/json",
        "X-CSRFToken": data.csrfmiddlewaretoken,
    };
    try {
        let button = form.querySelector('button[type="submit"]');
        let buttonText = button.innerText;
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/users/resend-confirm`, JSON.stringify(data), headers, "PATCH");
        let msgField = form.querySelector(".resend-email-msg");
        if (response.status == 400) {
            response.json().then(function (res) {
                if (res.messages) {
                    let key = Object.keys(res.messages);
                    msgField.innerText = `Email could not be resent. ${
                        res.messages[key[0]]
                    }`;
                } else {
                    msgField.innerText = "Email could not be resent.";
                }
                msgField.classList.add("active");
                if (msgField.classList.contains("input-success-msg")) {
                    msgField.classList.remove("input-success-msg");
                }
                msgField.classList.add("input-failure-msg");
                afterLoad(button, buttonText);
            });
        } else if (response.status == 200) {
            response.json().then(function (res) {
                msgField.innerText = "Successfully resent confirmation.";
                msgField.classList.add("active");
                if (msgField.classList.contains("input-failure-msg")) {
                    msgField.classList.remove("input-failure-msg");
                }
                msgField.classList.add("input-success-msg");
                afterLoad(button, buttonText);
            });
        }
    } catch (err) {
        console.log(err);
        afterLoad(button, buttonText);
    }
}

// Signin With Google

async function googleSigninCallback(response) {
    let loginMsg = document.querySelector('.google-signin-msg');
    let headers = {
        "Content-Type": "application/json",
    };
    let data = {"access_token": `${response.credential}`};
    let res = await requestAPI(`${apiURL}/auth/google/`, JSON.stringify(data), headers, 'POST');
    res.json().then(async function(resObj) {
        if(res.status == 200) {
            let myHeader = {
                Authorization: `Bearer ${resObj.access}`,
            };
            let myRes = await requestAPI(`${apiURL}/me`, null, myHeader, "GET");
            myRes.json().then(function(myResObj) {
                if(myRes.status == 401) {
                    loginMsg.classList.add('active');
                    loginMsg.innerText = myResObj.messages.non_field;
                }
                else if(myRes.status == 200) {
                    loginMsg.innerText = '';
                    loginMsg.classList.remove('active');
                    const accessToken = parseJwt(resObj.access);
                    const refreshToken = parseJwt(resObj.refresh);
                    setCookie("access", resObj.access, accessToken.exp);
                    setCookie("refresh", resObj.refresh, refreshToken.exp);
                    location.href = location.origin + "/";   
                }
            })
        }
    })
}