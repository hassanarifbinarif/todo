// Dynamically making tags on comma separation

const tagsContainer = document.querySelector(".tags-container");
const tagsInput = document.querySelector(".tags-input");
const tagsTextbox = document.querySelector(".tags-textbox");
const tags = [];

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
  tag.textContent = text;

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

publishBtn.addEventListener("click", function () {
  if (!addPropertyContent.classList.contains("hide")) {
    addPropertyContent.classList.add("hide");
    publishPropertyConfirmationContent.classList.remove("hide");
  }
});

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
        <img src="${URL.createObjectURL(image)}" alt="property image" />
    </div>`;
  });
  imageContainer.innerHTML = images;
}

// Handling Add Property Form

function isValidImage(images) {
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

function addPropertyForm(event) {
  event.preventDefault();
  let form = event.currentTarget;
  let formData = new FormData(form);
  let data = formDataToObject(formData);
  let tagText = [];
  data.property_image = imageArray;
  tags.forEach((tag) => {
    tagText.push(tag.textContent);
  });
  data.ameneties = tagText;
  console.log(data);

  if (!isValidImage(imageContainer)) {
    imageContainer.previousElementSibling.classList.add("active");
    return false;
  } else if (!isValidContent(propertyDescription)) {
    propertyDescription.nextElementSibling.classList.add("active");
    return false;
  } else {
    if (!addPropertyContent.classList.contains("hide")) {
      addPropertyContent.classList.add("hide");
      publishPropertyConfirmationContent.classList.remove("hide");
    }
  }
}
