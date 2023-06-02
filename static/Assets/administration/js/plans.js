// Updating Plans Form

async function updatePlanForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let planName = form.querySelector('input[name="name"]');
    let nameMsg = form.querySelector('.name-msg');
    let planListingNum = form.querySelector('input[name="num_of_listings"]');
    let listingMsg = form.querySelector('.listings-msg');
    let planImageNum = form.querySelector('input[name="num_of_images"]');
    let imageMsg = form.querySelector('.images-msg');
    let planPrice = form.querySelector('input[name="price"]');
    let priceMsg = form.querySelector('.price-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;

    if(!isValidName(planName)) {
        planName.classList.add("input-error");
        nameMsg.classList.add("active");
        planName.addEventListener("input", function () {
            if (isValidName(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    nameMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    }
    else if(!isValidNumber(planListingNum)) {
        planListingNum.classList.add("input-error");
        listingMsg.classList.add("active");
        planListingNum.addEventListener("input", function () {
            if (isValidNumber(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    listingMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    }
    else if(!isValidNumber(planImageNum)) {
        planImageNum.classList.add("input-error");
        imageMsg.classList.add("active");
        planImageNum.addEventListener("input", function () {
            if (isValidNumber(this)) {
                this.classList.remove("input-error");
            } else {
                let inputField = this;
                if (timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    imageMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    }
    else if(!isValidNumber(planPrice)) {
        planPrice.classList.add("input-error");
        priceMsg.classList.add("active");
        planPrice.addEventListener("input", function () {
            if(isValidNumber(this)) {
                this.classList.remove("input-error");
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function () {
                    inputField.classList.add("input-error");
                    priceMsg.classList.add("active");
                }, 1000);
            }
        });
        return false;
    }
    else {
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        beforeLoad(button);
        let response = await plansAPI(data, id);
        response.json().then(function(res) {
            if(response.status == 200) {
                afterLoad(button, 'Plan Updated');
                setTimeout(() => {
                    afterLoad(button, buttonText);
                }, 2000);
            }
            else {
                afterLoad(button, 'Error Occurred');
                setTimeout(() => {
                    afterLoad(button, buttonText);
                }, 2000);
            }
        })
    }
}

async function plansAPI(data, id) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
        "X-CSRFToken": data.csrfmiddlewaretoken,
    }
    let response = await requestAPI(`${apiURL}/admin/plans/${id}`, JSON.stringify(data), headers, 'PATCH');
    if(response.status == 200 || response.status == 400) {
        return response;
    }
    else {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            const accessToken = parseJwt(myRes.access);
            const refreshToken = parseJwt(myRes.refresh);
            setCookie("admin_access", myRes.access, accessToken.exp);
            setCookie("admin_refresh", myRes.refresh, refreshToken.exp);
            return plansAPI(formData);
        }
        else {
            adminLogout();
        }
    }
}