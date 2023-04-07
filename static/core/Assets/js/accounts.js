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

registerBtn.addEventListener('click', showPostRegistrationContent);



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