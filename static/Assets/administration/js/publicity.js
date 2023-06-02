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


async function submitPublicityForm(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    console.log(data);
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    beforeLoad(button);
    let response = await publicityAPI(formData, id);
    afterLoad(button, buttonText);
    response.json().then(function(res) {
        console.log(response, res);
    })
}


async function publicityAPI(formData, id) {
    let token = getCookie('admin_access');
    let objectData = formDataToObject(formData)
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": objectData.csrfmiddlewaretoken,
    }
    let response = await requestAPI(`${apiURL}/admin/publicity/${id}`, formData, headers, 'PATCH');
    if(response.status == 200 || response.status == 400) {
        return response;
    }
    else {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            const accessToken = parseJwt(myRes.access);
            const refreshToken = parseJwt(myRes.refresh);
            setCookie("admin_access", myRes.access, accessToken.exp);
            setCookie("admin_refresh", myRes.refresh, refreshToken.exp);
            return publicityAPI(formData);
        }
        else {
            adminLogout();
        }
    }
}