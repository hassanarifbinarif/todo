let resetPasswordContent = document.getElementById("reset-password-content");
let postContent = document.getElementById("post-content");

async function resetPasswordForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let passwordField = form.querySelector('input[name="password"]');
    let passwordMsg = form.querySelector(".password-msg");
    let confirmPasswordField = form.querySelector(
        'input[name="confirmed_password"]'
    );
    let confirmPasswordMsg = form.querySelector(".confirm-password-msg");

    if (!isValidPassword(passwordField)) {
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
    } else if (!isValidPassword(confirmPasswordField)) {
        confirmPasswordField.classList.add("input-error");
        confirmPasswordMsg.classList.add("active");
        confirmPasswordField.addEventListener("input", function () {
            if (isValidPassword(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    confirmPasswordMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    } else if (!matchingPassword(passwordField, confirmPasswordField)) {
        confirmPasswordMsg.classList.add("active");
        confirmPasswordField.classList.add("input-error");
        return false;
    } else {
        let button = form.querySelector('button[type="submit"]');
        let buttonText = button.innerText;
        try {
            beforeLoad(button);
            let formData = new FormData(form);
            let data = formDataToObject(formData);
            let headers = {
                "Content-Type": "application/json",
                "X-CSRFToken": data.csrfmiddlewaretoken,
            };
            let response = await requestAPI(
                "http://3.140.78.251:8000/api/forgot/confirm",
                JSON.stringify(data),
                headers,
                "POST"
            );
            response.json().then(function (res) {
                if (response.status == 400) {
                    passwordField.classList.add("input-error");
                    passwordMsg.classList.add("active");
                    res.messages.password.forEach((message) => {
                        passwordMsg.innerHTML += `${message}. <br />`;
                    });
                } else if (response.status == 404) {
                    document.querySelector("#invalid-token-msg").innerText =
                        res.message;
                } else if (response.status == 201 || response.status == 200) {
                    passwordField.classList.remove("input-error");
                    passwordMsg.classList.remove("active");
                    passwordMsg.innerText = "";
                    resetPasswordContent.classList.add("hide");
                    postContent.classList.remove("hide");
                }
                afterLoad(button, buttonText);
            });
        } catch (err) {
            console.log(err);
            afterLoad(button, buttonText);
        }
    }
}
