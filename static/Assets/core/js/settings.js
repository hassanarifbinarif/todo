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


// Opening Delete Listing Modal

function openDelListingModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `deleteListing(event, '${id}')`);
    form.querySelector('.btn-text').innerText = 'Confirm';
    document.querySelector(`.${modalId}`).click();
}


// Handling Listing Removal

async function deleteListing(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type=submit][data-id="delete"]');
    let buttonText = button.innerText;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    beforeLoad(button);
    let response = await deleteListingAPI(data, id);
    if(response.status == 204) {
        afterLoad(button, "Listing Deleted");
        getUserListings();
    }
    else if(response.status == 404) {
        afterLoad(button, "Listing not found");
    }
    else {
        afterLoad(button, "Error! Retry");
    }
}

async function deleteListingAPI(data, id) {
    let token = getAccessTokenFromCookie();
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken
    };
    let response = await requestAPI(`${apiURL}/listings/${id}`, null, headers, 'DELETE');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            let accessToken = parseJwt(myRes.access);
            let refreshToken = parseJwt(myRes.refresh);
            setCookie('access', myRes.access, accessToken.exp);
            setCookie('refresh', myRes.refresh, refreshToken.exp);
            return deleteListingAPI(data, id);
        }
        else {
            logout();
        }
    }
    else {
        return response;
    }
}


// Opening Boost Ad Modal

function openBoostAdModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `boostAdForm(event, '${id}')`);
    document.querySelector(`.${modalId}`).click();
}


// Get User Listings

async function getUserListings() {
    listingTableContent.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
    let response = await requestAPI('/get-user-listings/', null, {}, 'GET');
    response.json().then(function(res) {
        if(res.success) {
            listingTableContent.innerHTML = res.listing_data;
        }
        else {
            listingTableContent.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="no-record-row">No records found</span></div>';
        }
    })
}