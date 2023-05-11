let forgotPasswordContent = document.getElementById("forgot-password-content");
let postContent = document.getElementById("post-content");
clearTokens();

async function forgotPasswordForm(event) {
  event.preventDefault();
  let form = event.currentTarget;
  let emailField = form.querySelector('input[name="email"]');
  let emailMsg = form.querySelector(".email-msg");

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
        "http://3.140.78.251:8000/api/forgot",
        JSON.stringify(data),
        headers,
        "POST"
      );
      response.json().then(function (res) {
        if (response.status == 400) {
          emailField.classList.add("input-error");
          emailMsg.classList.add("active");
          if (res.messages) {
            let key = Object.keys(res.messages);
            emailMsg.innerText = `${res.messages[key[0]]}`;
          } else {
            emailMsg.innerText = "Error occured";
          }
        } else if (response.status == 201 || response.status == 200) {
          emailField.classList.remove("input-error");
          emailMsg.classList.remove("active");
          emailMsg.innerText = "";
          document.querySelector("#resend-email-input").value =
            emailField.value;
          document.querySelector("#post-content-email").value =
            emailField.value;
          forgotPasswordContent.classList.add("hide");
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

async function resendVerificationEmailForm(event) {
  event.preventDefault();
  let form = event.currentTarget;
  let emailField = form.querySelector('input[name="email"]');
  let emailMsg = form.querySelector(".email-msg");
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
      "http://3.140.78.251:8000/api/forgot",
      JSON.stringify(data),
      headers,
      "POST"
    );
    response.json().then(function (res) {
      if (response.status == 400) {
        emailMsg.classList.add("active");
        if (res.messages) {
          let key = Object.keys(res.messages);
          emailMsg.innerText = `${res.messages[key[0]]}`;
        } else {
          emailMsg.innerText = "Error occured";
        }
        afterLoad(button, buttonText);
      } else if (response.status == 201 || response.status == 200) {
        emailMsg.classList.remove("active");
        emailMsg.innerText = "";
        afterLoad(button, "Resent successfully!");
        setTimeout(() => {
          afterLoad(button, buttonText);
        }, 2000);
      }
    });
  } catch (err) {
    console.log(err);
    afterLoad(button, buttonText);
  }
}
