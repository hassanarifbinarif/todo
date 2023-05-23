// Preview Uploaded Image

function previewImage(event) {
    let imageInput = event.currentTarget;
    let image = imageInput.files;
    let imageTag = imageInput.closest('label').querySelector('.publicity-img')
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.style.display = 'block';
    imageInput.closest('label').querySelector('.uploader-logo').style.display = 'none';
    imageInput.closest('label').querySelector('.uploader-text').style.display = 'none';
}