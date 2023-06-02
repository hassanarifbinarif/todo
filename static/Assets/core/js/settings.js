// Toggling between listings, favourites and profile views

let adsRadioBtn = document.getElementsByName('my_ads_radio');
let listingTableContent = document.getElementById('listing-table');
let favouriteTableContent = document.getElementById('favourite-table');
let profileContent = document.getElementById('profile-content');

for (let i = 0; i < adsRadioBtn.length; i++) {
    adsRadioBtn[i].addEventListener("change", function () {
        try {
            if(this.checked && this.id == 'listing') {
                listingTableContent.classList.remove('hide');
                if(!favouriteTableContent.classList.contains('hide')) {
                    favouriteTableContent.classList.add('hide')
                }
                else if(!profileContent.classList.contains('hide')) {
                    profileContent.classList.add('hide');
                }
            }
            else if(this.checked && this.id == 'favourite') {
                favouriteTableContent.classList.remove('hide');
                if(!listingTableContent.classList.contains('hide')) {
                    listingTableContent.classList.add('hide')
                }
                else if(!profileContent.classList.contains('hide')) {
                    profileContent.classList.add('hide');
                }
            }
            else {
                profileContent.classList.remove('hide');
                if(!favouriteTableContent.classList.contains('hide')) {
                    favouriteTableContent.classList.add('hide')
                }
                else if(!listingTableContent.classList.contains('hide')) {
                    listingTableContent.classList.add('hide');
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    })
}



// Preview Image on profile form

function previewImage(event) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    let imageInputContainer = document.querySelector('.image-input-container');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.style.display = 'block';
}


// Handling Profile Form


async function profileForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let profilePicture = form.querySelector('input[name="profile_picture"]');
    let firstName = form.querySelector('input[name="first_name"]');
    let lastName = form.querySelector('input[name="last_name"]');
    let emailField = form.querySelector('input[name="email"]');
    let mobileField = form.querySelector('input[name="phone"]');
    let businessField = form.querySelector('input[name="business_name"]');
    let addressField = form.querySelector('input[name="address"]');
    let cityField = form.querySelector('input[name="city"]');
    let firstNameMsg = form.querySelector('.first-name-msg');
    let lastNameMsg = form.querySelector('.last-name-msg');
    let emailMsg = form.querySelector('.email-msg');
    let mobileMsg = form.querySelector('.mobile-msg');
    let businessNameMsg = form.querySelector('.business-name-msg');
    let addressMsg = form.querySelector('.address-msg');
    let cityMsg = form.querySelector('.city-msg');

    if(!isValidName(firstName)) {
        firstName.classList.add('input-error');
        firstNameMsg.classList.add('active');
        firstName.addEventListener('input', function() {
            if(isValidName(this)) {
                this.classList.remove('input-error');
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    inputField.classList.add('input-error');
                    firstNameMsg.classList.add('active');
                }, 1500);
            }
        });
        return false;
    }
    else if(!isValidName(lastName)) {
        lastName.classList.add('input-error');
        lastNameMsg.classList.add('active');
        lastName.addEventListener('input', function() {
            if(isValidName(this)) {
                this.classList.remove('input-error');
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    inputField.classList.add('input-error');
                    lastNameMsg.classList.add('active');
                }, 1500);
            }
        });
        return false;
    }
    else if(!isValidEmail(emailField)){
        emailField.classList.add('input-error');
        emailMsg.classList.add('active');
        email.addEventListener('input', function() {
            if(isValidEmail(this)) {
                this.classList.remove('input-error');
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    inputField.classList.add('input-error');
                    emailMsg.classList.add('active');
                }, 1500);
            }
        });
        return false;
    }
    // else if(!isValidNumber(mobileField)) {
    //     mobileField.classList.add('input-error');
    //     mobileMsg.classList.add('active');
    //     mobileField.addEventListener('input', function() {
    //         if(isValidNumber(this)) {
    //             this.classList.remove('input-error');
    //         }
    //         else {
    //             let inputField = this;
    //             if(timeOut) {
    //                 clearTimeout(timeOut);
    //             }
    //             timeOut = setTimeout(function() {
    //                 inputField.classList.add('input-error');
    //                 mobileMsg.classList.add('active');
    //             }, 1500);
    //         }
    //     });
    //     return false;        
    // }
    // else if(!isValidName(businessField)) {
    //     businessField.classList.add('input-error');
    //     businessNameMsg.classList.add('active');
    //     businessField.addEventListener('input', function() {
    //         if(isValidName(this)) {
    //             this.classList.remove('input-error');
    //         }
    //         else {
    //             let inputField = this;
    //             if(timeOut) {
    //                 clearTimeout(timeOut);
    //             }
    //             timeOut = setTimeout(function() {
    //                 inputField.classList.add('input-error');
    //                 businessNameMsg.classList.add('active');
    //             }, 1500);
    //         }
    //     });
    //     return false;
    // }
    // else if(!isValidName(addressField)) {
    //     addressField.classList.add('input-error');
    //     addressMsg.classList.add('active');
    //     addressField.addEventListener('input', function() {
    //         if(isValidName(this)) {
    //             this.classList.remove('input-error');
    //         }
    //         else {
    //             let inputField = this;
    //             if(timeOut) {
    //                 clearTimeout(timeOut);
    //             }
    //             timeOut = setTimeout(function() {
    //                 inputField.classList.add('input-error');
    //                 addressMsg.classList.add('active');
    //             }, 1500);
    //         }
    //     });
    //     return false;
    // }
    // else if(!isValidName(cityField)) {
    //     cityField.classList.add('input-error');
    //     cityMsg.classList.add('active');
    //     cityField.addEventListener('input', function() {
    //         if(isValidName(this)) {
    //             this.classList.remove('input-error');
    //         }
    //         else {
    //             let inputField = this;
    //             if(timeOut) {
    //                 clearTimeout(timeOut);
    //             }
    //             timeOut = setTimeout(function() {
    //                 inputField.classList.add('input-error');
    //                 cityMsg.classList.add('active');
    //             }, 1500);
    //         }
    //     });
    //     return false;
    // }
    else {
        let formData = new FormData(form);
        formData.append('step','personal_information');
        let button = form.querySelector('button[type="submit"]');
        let buttonText = button.innerText;
        beforeLoad(button);
        let response = await profileAPI(formData);
        response.json().then(function(res) {
            if(response.status == 200) {
                afterLoad(button, 'Profile updated successfully');
                setTimeout(() => {
                    afterLoad(button, buttonText);
                }, 2000);
            }
            else if(response.status == 400) {
                emailField.classList.add('input-error');
                emailMsg.classList.add('active');
                emailMsg.innerText = res.messages.non_field;
                afterLoad(button, buttonText);
                return false;
            }
        });
    }
}


async function profileAPI(data) {
    let token = getAccessTokenFromCookie();
    let objectData = formDataToObject(data);
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": objectData.csrfmiddlewaretoken,
    }
    let response = await requestAPI(`${apiURL}/me`, data, headers, 'PATCH');
    if(response.status == 200) {
        return response;
    }
    else if(response.status == 400) {
        return response;
    }
    else {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            const accessToken = parseJwt(myRes.access);
            const refreshToken = parseJwt(myRes.refresh);
            setCookie("access", myRes.access, accessToken.exp);
            setCookie("refresh", myRes.refresh, refreshToken.exp);
            return profileAPI(data);
        }
        else {
            logout();
        }
    }
}