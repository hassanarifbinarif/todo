// Preview Uploaded Image

function previewImage(event) {
    let imageInput = event.currentTarget;
    let image = imageInput.files;
    let imageTag = imageInput.closest('label').querySelector('.publicity-img');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.classList.remove('hide');
    imageInput.closest('label').querySelector('.uploader-logo').style.display = 'none';
    imageInput.closest('label').querySelector('.uploader-text').style.display = 'none';
}


async function submitPublicityForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    beforeLoad(button);
    let response = await publicityAPI(formData, id);
    response.json().then(function(res) {
        console.log(response, res);
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