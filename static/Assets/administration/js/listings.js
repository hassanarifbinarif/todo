let requiredDataURL = `${apiURL}/admin/listings?search=`;
let listingTableContainer = document.getElementById("listings-table-container");
let listingMainView = document.querySelector('.listing-main-view');
let listingEditView = document.querySelector('.listing-edit-view');


// Listening for browser back button click to restore previous table state (if any)

window.addEventListener("popstate", (event) => {
    const { state } = event;
    if (state) {
        listingTableContainer.innerHTML = state.data;
    }
});

window.history.pushState({data: listingTableContainer.innerHTML}, '', `${location.pathname}`);


// Getting records for each case e.g. search, sorting, etc.

async function getListings(url) {
    if (url != 'null') {
        requiredDataURL = getSearchURL(url, requiredDataURL);
        let data = requiredDataURL;
        let token = getCookie("admin_access");
        let headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            listingTableContainer.innerHTML = 
                '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
            let response = await requestAPI(
                "/administration/get-listings/",
                JSON.stringify(data),
                headers,
                "POST"
            );
            response.json().then(function (res) {
                if (res.success) {
                    listingTableContainer.innerHTML = res.listing_data;
                }
                else {
                    listingTableContainer.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="no-record-row">No records found</span></div>';
                }
                window.history.pushState({data: listingTableContainer.innerHTML}, '', `${location.pathname}`);
            });
        } catch (err) {
            listingTableContainer.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="no-record-row">No records found</span></div>';
            console.log(err);
        }
    }
}


// Searching records for user entered keywords

function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    getListings(
        `${apiURL}/admin/listings?search=${data.search}`
    );
}


// Getting all records created today

function getTodayRecords() {
    let currentTime = new Date().toISOString();
    let startTime = new Date(new Date(new Date().setHours(0, 0, 0, 0)).toString().split('GMT')[0] + ' UTC').toISOString();
    getListings(`${apiURL}/admin/listings?created_at__gte=${startTime}&created_at__lte=${currentTime}`);
}


// Toggling between main listing UI and edit listing UI

function toggleListingView(event, data) {
    let element = event.currentTarget;
    if(element.id == 'edit-listing-btn' && listingEditView.classList.contains('hide')) {

        // Populating fields in edit listing UI when edit button is clicked on a listing row
        listingMainView.classList.add('hide');
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
                                <img src="${image.image}" alt="property image" />
                            </div>`;
            imageContainer.insertAdjacentHTML('afterbegin', imageTag);
        })
        form.querySelector('#publish-property-btn').querySelector('.btn-text').innerText = 'Publish';
        listingEditView.classList.remove('hide');
    }
    else if(element.id == 'back-btn' && listingMainView.classList.contains('hide')) {
        listingEditView.classList.add('hide');
        listingMainView.classList.remove('hide');
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
                    <img src="${URL.createObjectURL(imageFile)}" alt="property image" />
                </div>`;
    imageContainer.insertAdjacentHTML('afterbegin', image);
}


// Handling Amenity Tags

let tagsContainer = document.querySelector(".tags-container");
let tagsInput = document.querySelector(".tags-input");
let tagsTextbox = document.querySelector(".tags-textbox");
let tags = [];

tagsTextbox.addEventListener("keydown", function(e) {
    if(e.keyCode === 13) {
        e.preventDefault();
        const enteredText = e.target.value.trim();
        if (enteredText.length > 0) {
            const newTag = createTag(enteredText);
            tags.push(newTag);
            tagsTextbox.value = "";
            tagsTextbox.focus();
        }
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
        beforeLoad(button);
        let response = await updateListingAPI(formData, id);
        if (response.status == 200) {
            afterLoad(button, 'Listing Updated');
            getListings(requiredDataURL);    
        }
        else if(response.status == 404) {
            afterLoad(button, 'Listing not found');
        }
        else {
            afterLoad(button, 'Error! Retry');
        }
    }
}

async function updateListingAPI(formData, id) {
    let data = formDataToObject(formData);
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken
    };
    let response = await requestAPI(`${apiURL}/admin/listings/${id}`, formData, headers, 'PATCH');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return updateListingAPI(formData, id);
        }
        else {
            adminLogout();
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
        getListings(requiredDataURL);
    }
    else if(response.status == 404) {
        afterLoad(button, "Listing not found");
    }
    else {
        afterLoad(button, "Error! Retry");
    }
}

async function deleteListingAPI(data, id) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFTOKEN": data.csrfmiddlewaretoken,
    };
    let response = await requestAPI(`${apiURL}/admin/listings/${id}`, null, headers, 'DELETE');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return deleteListingAPI(data, id);
        }
        else {
            adminLogout();
        }
    }
    else {
        return response;
    }
}


async function boostAd(event, id, boost=false) {
    event.preventDefault();
    let element = event.target;
    let formData = new FormData();
    formData.append('is_boosted', boost);
    let response = await boostAdAPI(formData, id);
    response.json().then(function(res) {
        if (response.status == 200) {
            if (res.data.is_boosted) {
                element.src = '/static/Assets/core/images/promotion_logo_on.svg';
                element.setAttribute('onclick', `boostAd(event, '${res.data.id}', false)`);
                element.closest('tr').querySelector('.boost-field').innerText = 'YES';
            }
            else {
                element.src = '/static/Assets/core/images/promotion_logo.svg';
                element.setAttribute('onclick', `boostAd(event, '${res.data.id}', true)`);
                element.closest('tr').querySelector('.boost-field').innerText = 'NO';
            }
        }
        else {
        }
    })
}


async function boostAdAPI(formData, id) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let response = await requestAPI(`${apiURL}/admin/listings/${id}`, formData, headers, 'PATCH');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return boostAdAPI(formData, id);
        }
        else {
            adminLogout();
        }
    }
    else {
        return response;
    }
}


async function reserveListing(event, id, reserve=false) {
    event.preventDefault();
    let element = event.target;
    let formData = new FormData();
    formData.append('is_reserved', reserve);
    let response = await reserveListingAPI(formData, id);
    response.json().then(function(res) {
        if (response.status == 200) {
            if (res.data.is_reserved) {
                element.src = '/static/Assets/core/images/reserved_logo_on.svg';
                element.setAttribute('onclick', `reserveListing(event, '${res.data.id}', false)`);
            }
            else {
                element.src = '/static/Assets/core/images/reserved_logo.svg';
                element.setAttribute('onclick', `reserveListing(event, '${res.data.id}', true)`);
            }
        }
        else {
        }
    })
}


async function reserveListingAPI(formData, id) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let response = await requestAPI(`${apiURL}/admin/listings/${id}`, formData, headers, 'PATCH');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return reserveListingAPI(formData, id);
        }
        else {
            adminLogout();
        }
    }
    else {
        return response;
    }
}