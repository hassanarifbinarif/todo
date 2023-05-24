// Show/hide password functionality

let passwordIcon = document.querySelector(".hide-password-field");

passwordIcon.addEventListener("click", function () {
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


// Handling Login Form

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
    }
    else {
        location.href = location.origin + '/administration/dashboard/';
    }
}