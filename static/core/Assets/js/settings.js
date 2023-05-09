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
    imageInputContainer.style.backgroundImage = 'none';
}


// Handling Profile Form

const phoneRegex = /^(\+593|593|09)([2-9]\d{7})$/;


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
        emailMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
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
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


function isValidNumber(number) {
    let numberMsg = number.closest('.mobile-input').querySelector('.mobile-msg');
    if(number.value.trim().length == 0) {
        numberMsg.innerText = 'Number is required!';
        return false;
    }
    else if(!phoneRegex.test(number.value)) {
        numberMsg.innerText = 'Number is invalid!';
        return false;
    }
    else {
        number.classList.remove('input-error');
        numberMsg.innerText = '';
        numberMsg.classList.remove('active');
        if(timeOut) {
            clearTimeout(timeOut);
        }
        return true;
    }
}


let firstName = document.querySelector('input[name="first_name"]');
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
            inputField.nextElementSibling.classList.add('active');
        }, 1500);
    }
});

let lastName = document.querySelector('input[name="last_name"]');
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
            inputField.nextElementSibling.classList.add('active');
        }, 1500);
    }
})

let email = document.querySelector('input[name="email"]');
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
            inputField.nextElementSibling.classList.add('active');
        }, 1500);
    }
});

let mobileNumber = document.querySelector('input[name="mobile_number"]');
mobileNumber.addEventListener('input', function() {
    if(isValidNumber(this)) {
        this.classList.remove('input-error');
    }
    else {
        let inputField = this;
        if(timeOut) {
            clearTimeout(timeOut);
        }
        timeOut = setTimeout(function() {
            inputField.classList.add('input-error');
            inputField.closest('.mobile-input').querySelector('.mobile-msg').classList.add('active');
        }, 1500);
    }
})

let businessName = document.querySelector('input[name="business_name"]');
businessName.addEventListener('input', function() {
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
            inputField.nextElementSibling.classList.add('active');
        }, 1500);
    }
});

let address = document.querySelector('input[name="address"]');
address.addEventListener('input', function() {
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
            inputField.nextElementSibling.classList.add('active');
        }, 1500);
    }
})

let city = document.querySelector('input[name="city"]');
city.addEventListener('input', function() {
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
            inputField.nextElementSibling.classList.add('active');
        }, 1500);
    }
});


function profileForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let profileImage = form.querySelector('input[name="profile_image"]');
    let firstName = form.querySelector('input[name="first_name"]');
    let lastName = form.querySelector('input[name="last_name"]');
    let emailField = form.querySelector('input[name="email"]');
    let mobileField = form.querySelector('input[name="mobile_number"]');
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
    else if(!isValidNumber(mobileField)) {
        mobileField.classList.add('input-error');
        mobileMsg.classList.add('active');
        return false;        
    }
    else if(!isValidName(businessField)) {
        businessField.classList.add('input-error');
        businessNameMsg.classList.add('active');
        return false;
    }
    else if(!isValidName(addressField)) {
        addressField.classList.add('input-error');
        addressMsg.classList.add('active');
        return false;
    }
    else if(!isValidName(cityField)) {
        cityField.classList.add('input-error');
        cityMsg.classList.add('active');
        return false;
    }
    // else {
    //     location.href = location.origin + '/settings/';
    // }
}
