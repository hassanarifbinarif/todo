// Dynamically making tags on comma separation

const tagsContainer = document.querySelector(".tags-container");
const tagsInput = document.querySelector(".tags-input");
const tagsTextbox = document.querySelector(".tags-textbox");
const tags = [];

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

// Toggling view after property is published successfully

let publishBtn = document.getElementById("publish-property-btn");
let addPropertyContent = document.querySelector(".add-property-card");
let publishPropertyConfirmationContent = document.querySelector(
    ".publish-property-confirmation"
);

// publishBtn.addEventListener("click", function () {
//     if (!addPropertyContent.classList.contains("hide")) {
//         addPropertyContent.classList.add("hide");
//         publishPropertyConfirmationContent.classList.remove("hide");
//     }
// });

// Upload and show images

let imageInput = document.getElementById("image-input");
let imageContainer = document.getElementById("uploaded-image-container");
let imageInputLabel = document.querySelector(".image-input-label");
let imageArray = [];

imageInputLabel.addEventListener("dragenter", dragenter);
imageInputLabel.addEventListener("dragover", dragover);
imageInputLabel.addEventListener("drop", drop);

function dragenter(e) {
    e.stopPropagation();
    e.preventDefault();
}

function dragover(e) {
    e.stopPropagation();
    e.preventDefault();
}

function drop(e) {
    e.stopPropagation();
    e.preventDefault();
    const dt = e.dataTransfer;
    const files = dt.files;

    for (let i = 0; i < files.length; i++) {
        imageArray.push(files[i]);
    }
    previewImages();
}

imageInput.addEventListener("change", function () {
    const imageFiles = imageInput.files;
    for (let i = 0; i < imageFiles.length; i++) {
        imageArray.push(imageFiles[i]);
    }
    previewImages();
    this.nextElementSibling.nextElementSibling.innerText = "";
    this.nextElementSibling.nextElementSibling.classList.remove("active");
});

function previewImages() {
    let images = "";
    imageArray.forEach((image, index) => {
        images += `<div class="uploaded-image">
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
                        <img src="${URL.createObjectURL(image)}" alt="property image" />
                    </div>`;
    });
    imageContainer.innerHTML = images;
}

function delPropertyImage(event) {
    let imageElement = event.currentTarget.nextElementSibling;
    let parentElement = imageElement.parentNode;
    let index = Array.from(parentElement.parentNode.children).indexOf(parentElement);
    parentElement.remove();
    imageArray.splice(index, 1);
}


// Handling Add Property Form

function isValidImageData(images) {
    if (images.children.length == 0) {
        images.previousElementSibling.innerText = "Property images required!";
        images.previousElementSibling.scrollIntoView();
        return false;
    } else {
        images.previousElementSibling.innerText = "";
        images.previousElementSibling.classList.remove("active");
        return true;
    }
}

function isValidContent(textInput) {
    if (textInput.value.trim().length == 0) {
        textInput.nextElementSibling.innerText = "Please fill this field";
        textInput.focus();
        return false;
    } else {
        textInput.nextElementSibling.innerText = "";
        textInput.nextElementSibling.classList.remove("active");
        return true;
    }
}

let propertyDescription = document.querySelector("#property-description");
propertyDescription.addEventListener("input", function () {
    if (isValidContent(this)) {
        this.nextElementSibling.classList.remove("active");
    } else {
        this.nextElementSibling.classList.add("active");
    }
});


async function addPropertyForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    if (!isValidImageData(imageContainer)) {
        imageContainer.previousElementSibling.classList.add("active");
        return true;
    } else 
    if (!isValidContent(propertyDescription)) {
        propertyDescription.nextElementSibling.classList.add("active");
        return false;
    } else {
        form.querySelector('input[name="price"]').value = roundDecimalPlaces(form.querySelector('input[name="price"]').value);
        form.querySelector('input[name="land"]').value = roundDecimalPlaces(form.querySelector('input[name="land"]').value);
        form.querySelector('input[name="construction"]').value = roundDecimalPlaces(form.querySelector('input[name="construction"]').value);
        let formData = new FormData(form);
        let tagText = tags.map((tag) => tag.querySelector('span').innerText).join(',');
        formData.append('ameneties', tagText);
        formData.append('location', JSON.stringify({"type": "point", "coordinates": [31.460294, 74.288639]}));
        formData.delete('images');
        imageArray.forEach((file) => {
            formData.append('images', file);
        });
        beforeLoad(button);
        let response = await listingAPI(formData);
        response.json().then(function(res) {
            if(response.status == 201) {
                openBoostAdModal('boost-ad', res.data.id);
                if (!addPropertyContent.classList.contains("hide")) {
                    addPropertyContent.classList.add("hide");
                    publishPropertyConfirmationContent.classList.remove("hide");
                }
                window.scrollTo({top: 0, behavior: 'smooth'});
                afterLoad(button, buttonText);
            }
            else {
                afterLoad(button, 'Error! Retry');
            }
        })
    }
}

async function listingAPI(formData) {
    let token = getAccessTokenFromCookie();
    let data = formDataToObject(formData);
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken,
    };
    let response = await requestAPI(`${apiURL}/listings`, formData, headers, 'POST');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return listingAPI(formData);
        }
        else {
            logout()
        }
    }
    else {
        return response;
    }
}


function openBoostAdModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `boostAdForm(event, '${id}')`);
    document.querySelector(`.${modalId}`).click();
}