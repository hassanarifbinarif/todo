// Preview Uploaded Image

function previewImage(event) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById("news-blog-img");
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.style.display = "block";
    document.querySelector(".uploader-logo").style.display = "none";
    document.querySelector(".uploader-text").style.display = "none";
}

async function addNewsForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let titleField = form.querySelector('input[name="title"]');
    let titleMsg = form.querySelector(".title-msg");
    let pictureField = form.querySelector("#image-input");
    let pictureMsg = form.querySelector(".picture-msg");
    let contentField = form.querySelector('textarea[name="content"]');
    let contentMsg = form.querySelector(".content-msg");
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if (!isValidName(titleField)) {
        titleField.classList.add("input-error");
        titleMsg.classList.add("active");
        titleField.addEventListener("input", function () {
            if (isValidName(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    titleMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    } else if (!isValidImage(pictureField)) {
        pictureField.classList.add("input-error");
        pictureMsg.classList.add("active");
        pictureField.addEventListener("input", function () {
            if (isValidImage(this)) {
                this.classList.remove("input-error");
            } else {
                this.classList.add("input-error");
                pictureMsg.classList.add("active");
            }
        });
        return false;
    } else if (!isValidName(contentField)) {
        contentField.classList.add("input-error");
        contentMsg.classList.add("active");
        contentField.addEventListener("input", function () {
            if (isValidName(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    contentMsg.classList.add("active");
                }, 1000);
            }
        });
    } else {
        try {
            let formData = new FormData(form);
            beforeLoad(button);
            let response = await addNewsAPI(formData);
            response.json().then(function (res) {
                if (response.status == 200 || response.status == 201) {
                    afterLoad(button, "Uploaded");
                    setTimeout(() => {
                        clearFormData(formData);
                        afterLoad(button, buttonText);
                    }, 2000);
                } else {
                    afterLoad(button, "Error! Retry");
                    setTimeout(() => {
                        afterLoad(button, buttonText);
                    }, 2000);
                }
            });
        } catch (err) {
            afterLoad(button, "Network Error. Retry Later");
            setTimeout(() => {
                afterLoad(button, buttonText);
            }, 2000);
            console.log(err);
        }
    }
}


async function addNewsAPI(formData) {
    let data = formDataToObject(formData);
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken,
    };
    let response = await requestAPI(`${apiURL}/admin/news`, formData, headers, 'POST');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return addNewsAPI(formData);
        }
        else {
            adminLogout();
        }
    }
    else {
        return response;
    }
}