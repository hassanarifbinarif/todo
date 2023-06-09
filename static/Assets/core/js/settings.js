// Toggling between listings, favourites and profile views

let adsRadioBtn = document.getElementsByName('my_ads_radio');
let listingTableContent = document.getElementById('listing-table');
let favouriteTableContent = document.getElementById('favourite-table');
let profileContent = document.getElementById('profile-content');

for (let i = 0; i < adsRadioBtn.length; i++) {
    adsRadioBtn[i].addEventListener("change", function () {
        try {
            if(this.checked && this.id == 'listing') {
                listingEditView.classList.add('hide');
                listingTableContent.classList.remove('hide');
                if(!favouriteTableContent.classList.contains('hide')) {
                    favouriteTableContent.classList.add('hide')
                }
                else if(!profileContent.classList.contains('hide')) {
                    profileContent.classList.add('hide');
                }
            }
            else if(this.checked && this.id == 'favourite') {
                listingEditView.classList.add('hide');
                favouriteTableContent.classList.remove('hide');
                if(!listingTableContent.classList.contains('hide')) {
                    listingTableContent.classList.add('hide')
                }
                else if(!profileContent.classList.contains('hide')) {
                    profileContent.classList.add('hide');
                }
            }
            else {
                listingEditView.classList.add('hide');
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
    let imageInputContainer = document.querySelector('.profile-image-container');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.style.display = 'block';
}


// Handling Profile Form

async function profileForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let firstName = form.querySelector('input[name="first_name"]');
    let lastName = form.querySelector('input[name="last_name"]');
    let emailField = form.querySelector('input[name="email"]');
    let firstNameMsg = form.querySelector('.first-name-msg');
    let lastNameMsg = form.querySelector('.last-name-msg');
    let emailMsg = form.querySelector('.email-msg');

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
                afterLoad(button, 'Profile Updated');
                setTimeout(() => {
                    afterLoad(button, buttonText);
                }, 2000);
            }
            else {
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
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return profileAPI(data);
        }
        else {
            logout();
        }
    }
    else {
        return response;
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


// Toggling between main listing UI and edit listing UI

let baseView = document.querySelector('.my-ads-card');
let listingEditView = document.querySelector('.listing-edit-view');

async function toggleListingView(event, data) {
    let element = event.currentTarget;
    if(element.id == 'edit-listing-btn' && listingEditView.classList.contains('hide')) {

        // Populating fields in edit listing UI when edit button is clicked on a listing row
        baseView.classList.add('hide');
        let form = listingEditView.querySelector('form');
        form.setAttribute('onsubmit', `updateListing(event, '${data.id}')`);
        form.querySelector('#listing-id').innerText = data.id;
        let date = new Date(data.created_at);
        form.querySelector('#listing-date').innerText = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
        form.querySelector('#property-description').textContent = data.description;
        form.querySelector(`input[name="criteria"][value="${data.criteria}"]`).checked = true;
        form.querySelector('input[name="price"]').value = data.price;
        form.querySelector(`select[name="property_type"] option[value="${data.property_type}"]`).selected = true;
        form.querySelector('input[name="land"]').value = data.land;
        form.querySelector('input[name="construction"]').value = data.construction;
        form.querySelector('input[name="neighbourhood"]').value = data.neighbourhood;
        if(data.bedrooms < 5 && data.bedrooms > 0)
            form.querySelector(`input[name="bedrooms"][value="${data.bedrooms}"]`).checked = true;
        else if(data.bedrooms >= 5)
            form.querySelector('input[name="bedrooms"]:last-of-type').checked = true;
        if(data.bathrooms < 5 && data.bathrooms > 0)
            form.querySelector(`input[name="bathrooms"][value="${data.bathrooms}"]`).checked = true;
        else if(data.bathrooms >= 5)
            form.querySelector('input[name="bathrooms"]:last-of-type').checked = true;
        form.querySelector('input[name="city"]').value = data.city;
        form.querySelector('input[name="parking"]').value = data.parking;
        form.querySelector('input[name="antiquity"]').value = data.antiquity;
        form.querySelector('input[name="location"]').value = data.location;
        document.querySelectorAll('.tag').forEach(function(tag) {
            tag.parentNode.removeChild(tag);
        })
        tags = [];
        let tagsString = data.ameneties.split(',');
        tagsString.forEach((tag) => {
            let tagBody = createTag(tag);
            tags.push(tagBody);
        })
        let images = imageContainer.querySelectorAll('.uploaded-image');
        images.forEach(function(imageTag) {
            imageTag.parentNode.removeChild(imageTag);
        })
        data.images.forEach((image) => {
            let imageTag = `<div class="uploaded-image">
                                <svg class="del-img-btn" onclick="delPropertyImage(event);" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_4674_1683)">
                                        <path d="M15.4999 2.58301C8.357 2.58301 2.58325 8.35676 2.58325 15.4997C2.58325 22.6426 8.357 28.4163 15.4999 28.4163C22.6428 28.4163 28.4166 22.6426 28.4166 15.4997C28.4166 8.35676 22.6428 2.58301 15.4999 2.58301ZM21.9583 20.1368L20.137 21.958L15.4999 17.3209L10.8628 21.958L9.04159 20.1368L13.6787 15.4997L9.04159 10.8626L10.8628 9.04134L15.4999 13.6784L20.137 9.04134L21.9583 10.8626L17.3212 15.4997L21.9583 20.1368Z" fill="#FC0909"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_4674_1683">
                                            <rect width="31" height="31" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <img src="${image.image}" alt="property image" />
                            </div>`;
            imageContainer.insertAdjacentHTML('afterbegin', imageTag);
        })
        form.querySelector('#publish-property-btn').querySelector('.btn-text').innerText = 'Publish';
        listingEditView.classList.remove('hide');
    }
    else if(element.id == 'back-btn' && baseView.classList.contains('hide')) {
        listingEditView.classList.add('hide');
        baseView.classList.remove('hide');
    }
}


// Handling Images

let imageContainer = document.getElementById("uploaded-image-container");
let imageInput = document.getElementById("image-input");
let imageArray = [];


// Previewing and inserting images in array on upload

imageInput.addEventListener("change", function () {
    const imageFiles = imageInput.files;
    for (let i = 0; i < imageFiles.length; i++) {
        imageArray.push(imageFiles[i]);
        previewImages(imageFiles[i]);
    }
});

function previewImages(imageFile) {
    let image = `<div class="uploaded-image">
                    <svg class="del-img-btn" onclick="delPropertyImage(event);" width="31" height="31" viewBox="0 0 31 31" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_4674_1683)">
                            <path d="M15.4999 2.58301C8.357 2.58301 2.58325 8.35676 2.58325 15.4997C2.58325 22.6426 8.357 28.4163 15.4999 28.4163C22.6428 28.4163 28.4166 22.6426 28.4166 15.4997C28.4166 8.35676 22.6428 2.58301 15.4999 2.58301ZM21.9583 20.1368L20.137 21.958L15.4999 17.3209L10.8628 21.958L9.04159 20.1368L13.6787 15.4997L9.04159 10.8626L10.8628 9.04134L15.4999 13.6784L20.137 9.04134L21.9583 10.8626L17.3212 15.4997L21.9583 20.1368Z" fill="#FC0909"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_4674_1683">
                                <rect width="31" height="31" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                    <img src="${URL.createObjectURL(imageFile)}" alt="property image" />
                </div>`;
    imageContainer.insertAdjacentHTML('afterbegin', image);
}

function delPropertyImage(event) {
    let imageElement = event.currentTarget.nextElementSibling;
    let parentElement = imageElement.parentNode;
    let index = Array.from(parentElement.parentNode.children).indexOf(parentElement);
    parentElement.remove();
    imageArray.splice(index, 1);
}


// Handling Amenity Tags

let tagsContainer = document.querySelector(".tags-container");
let tagsInput = document.querySelector(".tags-input");
let tagsTextbox = document.querySelector(".tags-textbox");
let tags = [];

tagsTextbox.addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault();
    }
});

tagsContainer.addEventListener("click", function () {
    tagsTextbox.focus();
});

tagsTextbox.addEventListener("input", function (e) {
    const enteredText = e.target.value.trim();
    if (enteredText.endsWith(",")) {
        const newTagText = enteredText.slice(0, -1);
        if (newTagText.length > 0) {
            const newTag = createTag(newTagText);
            tags.push(newTag);
            tagsTextbox.value = "";
            tagsTextbox.focus();
        }
    }
});


function createTag(text) {
    const tag = document.createElement("div");
    tag.classList.add("tag");
    let tagText = document.createElement("span");
    tagText.innerText = text;
    tag.appendChild(tagText);

    const removeBtn = document.createElement("button");
    removeBtn.classList.add("remove-btn");
    removeBtn.textContent = "x";
    removeBtn.addEventListener("click", function () {
        const index = tags.indexOf(tag);
        tags.splice(index, 1);
        tag.remove();
        tagsTextbox.focus();
    });

    tag.appendChild(removeBtn);
    const tagsContainer = document.querySelector(".tags");
    tagsContainer.appendChild(tag);

    return tag;
}


// Updating Listing Details

async function updateListing(event, id) {
    event.preventDefault();
    if(event.submitter.hasAttribute('data-id', 'delete')) {
        openDelListingModal('del-listing', id);
    }
    else {
        let form = event.currentTarget;
        let button = form.querySelector('#publish-property-btn');
        let buttonText = button.innerText;
        form.querySelector('input[name="price"]').value = roundDecimalPlaces(form.querySelector('input[name="price"]').value);
        form.querySelector('input[name="land"]').value = roundDecimalPlaces(form.querySelector('input[name="land"]').value);
        form.querySelector('input[name="construction"]').value = roundDecimalPlaces(form.querySelector('input[name="construction"]').value);
        let formData = new FormData(form);
        let tagText = tags.map((tag) => tag.querySelector('span').innerText).join(',');
        formData.append('ameneties', tagText);
        formData.delete('images');
        imageArray.forEach((file) => {
            formData.append('images', file);
        });
        beforeLoad(button);
        let response = await updateListingAPI(formData, id);
        if(response.status == 200) {
            afterLoad(button, 'Listing Updated');
            getUserListings();
        }
        else if(response.status == 404) {
            afterLoad(button, 'Not Found');
        }
        else {
            afterLoad(button, 'Error! Retry');
        }
    }
}


async function updateListingAPI(formData, id) {
    let token = getAccessTokenFromCookie();
    let data = formDataToObject(formData);
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken
    };
    let response = await requestAPI(`${apiURL}/listings/${id}`, formData, headers, 'PATCH');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return updateListingAPI(formData, id);
        }
        else {
            logout();
        }
    }
    else {
        return response;
    }
}