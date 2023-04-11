// Dynamically making tags on comma separation

const tagsContainer = document.querySelector('.tags-container');
const tagsInput = document.querySelector('.tags-input');
const tagsTextbox = document.querySelector('.tags-textbox');
const tags = [];

tagsContainer.addEventListener('click', function() {
    tagsTextbox.focus();
})

tagsTextbox.addEventListener('input', function(e) {
  const enteredText = e.target.value.trim();
  if (enteredText.endsWith(',')) {
    const newTagText = enteredText.slice(0, -1);
    if (newTagText.length > 0) {
      const newTag = createTag(newTagText);
      tags.push(newTag);
      tagsTextbox.value = '';
    }
  }
});

function createTag(text) {
  const tag = document.createElement('div');
  tag.classList.add('tag');
  tag.textContent = text;

  const removeBtn = document.createElement('button');
  removeBtn.classList.add('remove-btn');
  removeBtn.textContent = 'x';
  removeBtn.addEventListener('click', function() {
    const index = tags.indexOf(tag);
    tags.splice(index, 1);
    tag.remove();
    tagsTextbox.focus();
  });

  tag.appendChild(removeBtn);
  const tagsContainer = document.querySelector('.tags');
  tagsContainer.appendChild(tag);

  return tag;
}


// Toggling view after property is published successfully 

let publishBtn = document.getElementById('publish-property-btn');
let addPropertyContent = document.querySelector('.add-property-card');
let publishPropertyConfirmationContent = document.querySelector('.publish-property-confirmation');

publishBtn.addEventListener('click', function() {
    if(!addPropertyContent.classList.contains('hide')) {
        addPropertyContent.classList.add('hide');
        publishPropertyConfirmationContent.classList.remove('hide');
    }
})


// Upload and show images

let imageInput = document.getElementById("image-input");
let imageContainer = document.getElementById("uploaded-image-container");
let imageArray = [];

imageInput.addEventListener("change", () => {
  const imageFiles = imageInput.files;
  for (let i = 0; i < imageFiles.length; i++) {
    imageArray.push(imageFiles[i]);
  }
  previewImages();
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