// Preview Uploaded Image

function previewImage(event) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById("news-blog-img");
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.style.display = 'block';
    document.querySelector('.uploader-logo').style.display = 'none';
    document.querySelector('.uploader-text').style.display = 'none';
}