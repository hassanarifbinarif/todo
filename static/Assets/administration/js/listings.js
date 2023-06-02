let requiredDataURL = `${apiURL}/admin/listings?search=`;
let listingTableContainer = document.getElementById("listings-table-container");
let listingMainView = document.querySelector('.listing-main-view');
let listingEditView = document.querySelector('.listing-edit-view');


window.addEventListener("popstate", (event) => {
    const { state } = event;
    if (state) {
        listingTableContainer.innerHTML = state.data;
    }
});

window.history.pushState({data: listingTableContainer.innerHTML}, '', `${location.pathname}`);


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


function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    getListings(
        `${apiURL}/admin/listings?search=${data.search}`
    );
}


function getTodayRecords() {
    let currentTime = new Date().toISOString();
    let startTime = new Date(new Date(new Date().setHours(0, 0, 0, 0)).toString().split('GMT')[0] + ' UTC').toISOString();
    getListings(`${apiURL}/admin/listings?created_at__gte=${startTime}&created_at__lte=${currentTime}`);
}


async function toggleListingView(event, id) {
    let element = event.currentTarget;
    if(element.id == 'edit-listing-btn' && listingEditView.classList.contains('hide')) {
        listingMainView.classList.add('hide');
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`
        };
        let response = await requestAPI(`${apiURL}/admin/listings/${id}`, null, headers, 'GET');
        response.json().then(function(res) {
            console.log(res);
            let form = listingEditView.querySelector('form');
            form.setAttribute('onsubmit', `updateListing(event, '${id}')`);
            form.querySelector('#listing-id').innerText = res.data.id;
            let date = new Date(res.data.created_at);
            form.querySelector('#listing-date').innerText = date.getUTCDate() + '/' + (date.getUTCMonth() + 1) + '/' + date.getUTCFullYear();
            form.querySelector('#property-description').innerText = res.data.description;
            form.querySelector(`input[name="criteria"][value="${res.data.criteria}"]`).checked = true;
            form.querySelector('input[name="price"]').value = res.data.price;
            form.querySelector(`select[name="property_type"] option[value="${res.data.property_type}"]`).selected = true;
            form.querySelector('input[name="land"]').value = res.data.land;
            form.querySelector('input[name="construction"]').value = res.data.construction;
            form.querySelector('input[name="neighbourhood"]').value = res.data.neighbourhood;
            if(res.data.bedrooms < 5 && res.data.bedrooms > 0)
                form.querySelector(`input[name="bedrooms"][value="${res.data.bedrooms}"]`).checked = true;
            else if(res.data.bedrooms >= 5)
                form.querySelector('input[name="bedrooms"]:last-of-type').checked = true;
            if(res.data.bathrooms < 5 && res.data.bathrooms > 0)
                form.querySelector(`input[name="bathrooms"][value="${res.data.bathrooms}"]`).checked = true;
            else if(res.data.bathrooms >= 5)
                form.querySelector('input[name="bathrooms"]:last-of-type').checked = true;
            form.querySelector('input[name="city"]').value = res.data.city;
            form.querySelector('input[name="parking"]').value = res.data.parking;
            form.querySelector('input[name="antiquity"]').value = res.data.antiquity;
            form.querySelector('input[name="location"]').value = res.data.location;
            let tagsString = res.data.ameneties.split(',');
            tagsString.forEach((tag) => {
                let tagBody = createTag(tag);
                tags.push(tagBody);
            })
        })
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

tagsTextbox.addEventListener("keydown", function(event) {
    if(event.keyCode === 13) {
        event.preventDefault();
    }
})

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


async function updateListing(event, id) {
    event.preventDefault();
    if(event.submitter.hasAttribute('data-id', 'delete')) {
        openDelListingModal('del-listing', id);
    }
    else {
        let form = event.currentTarget;
        let button = form.querySelector('#publish-property-btn');
        let buttonText = button.innerText;
        let formData = new FormData(form);
        let data = formDataToObject(formData);
        let tagText = tags.map((tag) => tag.querySelector('span').innerText).join(',');
        formData.append('ameneties', tagText);
        let token = getCookie('admin_access');
        let headers = {
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": data.csrfmiddlewaretoken
        };
        beforeLoad(button);
        let response = await requestAPI(`${apiURL}/admin/listings/${id}`, formData, headers, 'PATCH');
        response.json().then(function(res) {
            if(response.status == 200) {
                afterLoad(button, 'Listing Updated');
                getListings(requiredDataURL);
            }
            else if(response.status == 404) {
                afterLoad(button, 'Not Found');
            }
            else {
                afterLoad(button, 'Error! Retry');
            }
        })
    }
}


function openDelListingModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `deleteListing(event, '${id}')`);
    form.querySelector('.btn-text').innerText = 'Confirm';
    document.querySelector(`.${modalId}`).click();
}


async function deleteListing(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type=submit][data-id="delete"]');
    let buttonText = button.innerText;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken,
    }
    beforeLoad(button);
    let response = await requestAPI(`${apiURL}/admin/listings/${id}`, null, headers, 'DELETE');
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