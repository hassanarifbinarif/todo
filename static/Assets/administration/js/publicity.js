// Preview Uploaded Image

// function previewImage(event, height, width) {
//     let imageInput = event.currentTarget;
//     let image = imageInput.files;
//     let imageTag = imageInput.closest('label').querySelector('.publicity-img');
//     imageTag.src = window.URL.createObjectURL(image[0]);
//     imageTag.classList.remove('hide');
//     imageInput.closest('label').querySelector('.uploader-logo').style.display = 'none';
//     imageInput.closest('label').querySelector('.uploader-text').style.display = 'none';
// }


let fileInput = document.querySelectorAll('.image-uploader-tag');

fileInput.forEach((input) => {
    input.addEventListener('change', event => {
        if (input.files.length > 0) {
            let label = input.closest('.image-input-label');
            let width = label.getAttribute('data-width');
            let height = label.getAttribute('data-height');
            // console.log(width, height);
            const img = document.createElement('img');
            const selectedImage = input.files[0];
            const objectURL = URL.createObjectURL(selectedImage);
            let imageTag = input.closest('label').querySelector('.publicity-img');
            img.onload = function handleLoad() {
                // console.log(`Width: ${img.width}, Height: ${img.height}`);
        
                if (img.width == width && img.height == height) {
                    imageTag.src = objectURL;
                    label.querySelector('.image-msg').classList.remove('active');
                    label.querySelector('.image-msg').innerText = "";
                }
                else {
                    URL.revokeObjectURL(objectURL);
                    console.log('Image dimensions donot match');
                    label.querySelector('.image-msg').classList.add('active');
                    label.querySelector('.image-msg').innerText = "Image dimensions does not match";
                    input.value = null;
                }
            };
      
          img.src = objectURL;
        }
    });
})


async function submitPublicityForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let imageInput = form.querySelector('input[type=file]');
    if(form.querySelector('.image-msg').classList.contains('active')) {
        return false;
    }
    // if(!imageInput.value) {
    //     form.querySelector('.image-msg').classList.add('active');
    //     form.querySelector('.image-msg').innerText = "Publicity image required";
    //     return false
    // }
    // else {
    //     form.querySelector('.image-msg').classList.add('active');
    //     form.querySelector('.image-msg').innerText = "Image dimensions does not match";
    // }
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    beforeLoad(button);
    let response = await publicityAPI(formData, id);
    response.json().then(function(res) {
        if(response.status == 200) {
            afterLoad(button, 'Saved');
        }
        else {
            afterLoad(button, 'Error! Retry');
        }
    })
}


async function publicityAPI(formData, id) {
    let token = getCookie('admin_access');
    let data = formDataToObject(formData)
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken,
    }
    let response = await requestAPI(`${apiURL}/admin/publicity/${id}`, formData, headers, 'PATCH');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return publicityAPI(formData, id);
        }
        else {
            adminLogout()
        }
    }
    else {
        return response;
    }
}