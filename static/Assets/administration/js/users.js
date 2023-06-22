let requiredDataURL = `${apiURL}/admin/users?search=`;
let userTableContainer = document.getElementById("user-table-container");


window.addEventListener("popstate", (event) => {
    const { state } = event;
    if (state) {
        userTableContainer.innerHTML = state.data;
    }
});

window.history.pushState({data: userTableContainer.innerHTML}, '', `${location.pathname}`);


async function getUsers(url) {
    if (url != 'null') {
        requiredDataURL = getSearchURL(url, requiredDataURL);
        let data = requiredDataURL;
        let token = getCookie("admin_access");
        let headers = {
            Authorization: `Bearer ${token}`,
        };
        try {
            userTableContainer.innerHTML = 
                '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
            let response = await requestAPI(
                "/administration/get-users/",
                JSON.stringify(data),
                headers,
                "POST"
            );
            response.json().then(function (res) {
                if (res.success) {
                    userTableContainer.innerHTML = res.user_data;
                }
                else {
                    userTableContainer.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="no-record-row">No records found</span></div>';
                }
                window.history.pushState({data: userTableContainer.innerHTML}, '', `${location.pathname}`);
            });
        } catch (err) {
            userTableContainer.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="no-record-row">No records found</span></div>';
            console.log(err);
        }
    }
}


function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    getUsers(
        `${apiURL}/admin/users?search=${data.search}`
    );
}


// Preview Image

function previewImage(event) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    let imageInputContainer = document.querySelector('.image-input-container');
    imageTag.src = window.URL.createObjectURL(image[0]);
    imageTag.style.display = 'block';
}



async function openEditUserModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    modal.querySelector('.modal-content').classList.add('hide');
    modal.querySelector('.loader').classList.remove('hide');
    document.querySelector(`.${modalId}`).click();
    let token = getCookie("admin_access");
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let response = await requestAPI(`${apiURL}/admin/users/${id}/personal-information`, null, headers, 'GET');
    if(response.status == 200) {
        response.json().then(function(res) {
            let form = modal.querySelector('form');
            form.setAttribute('onsubmit', `editUser(event, '${id}')`);
            form.querySelector('input[name="first_name"]').value = res.data.first_name;
            form.querySelector('input[name="last_name"]').value = res.data.last_name;
            form.querySelector('input[name="email"]').value = res.data.email;
            form.querySelector('input[name="phone"]').value = res.data.phone;
            form.querySelector('input[name="city"]').value = res.data.city;
            form.querySelector('input[name="business_name"]').value = res.data.business_name;
            form.querySelector('input[name="address"]').value = res.data.address;
            form.querySelector('#profile-image').src = res.data.profile_picture;
            form.querySelector('.btn-text').innerText = 'Save Changes';
            modal.querySelector('.modal-content').classList.remove('hide');
            modal.querySelector('.loader').classList.add('hide');
        })
    }
}


async function getUserInfoAPI(id) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    let response = await requestAPI(`${apiURL}/admin/users/${id}/personal-information`, null, headers, 'GET');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return getUserInfoAPI(id);
        }
        else {
            adminLogout()
        }
    }
    else {
        return response;
    }
}


async function editUser(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let firstName = form.querySelector('input[name="first_name"]');
    let firstNameMsg = form.querySelector('.first-name-msg');
    let lastName = form.querySelector('input[name="last_name"]');
    let lastNameMsg = form.querySelector('.last-name-msg');
    let emailField = form.querySelector('input[name="email"]');
    let emailMsg = form.querySelector('.email-msg');
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    
    if(!isValidName(firstName)) {
        firstName.classList.add('input-error');
        firstNameMsg.classList.add('active');
        firstName.addEventListener('input', function() {
            if(isValidName(this)) {
                this.classList.remove('input-error');
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    inputField.classList.add('input-error');
                    firstNameMsg.classList.add('active');
                }, 1500);
            }
        });
        return false;
    }
    else if(!isValidName(lastName)) {
        lastName.classList.add('input-error');
        lastNameMsg.classList.add('active');
        lastName.addEventListener('input', function() {
            if(isValidName(this)) {
                this.classList.remove('input-error');
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    inputField.classList.add('input-error');
                    lastNameMsg.classList.add('active');
                }, 1500);
            }
        });
        return false;
    }
    else if(!isValidEmail(emailField)){
        emailField.classList.add('input-error');
        emailMsg.classList.add('active');
        email.addEventListener('input', function() {
            if(isValidEmail(this)) {
                this.classList.remove('input-error');
            }
            else {
                let inputField = this;
                if(timeOut) {
                    clearTimeout(timeOut);
                }
                timeOut = setTimeout(function() {
                    inputField.classList.add('input-error');
                    emailMsg.classList.add('active');
                }, 1500);
            }
        });
        return false;
    }
    else {
        let formData = new FormData(form);
        beforeLoad(button);
        let response = await editUserAPI(formData, id);
        response.json().then(function(res) {
            if(response.status == 200) {
                afterLoad(button, "User Updated");
                clearFormData(formData);
                getUsers(requiredDataURL);
            }
            else if(response.status == 400) {
                emailField.classList.add('input-error');
                emailMsg.classList.add('active');
                emailMsg.innerText = res.messages.non_field;
                afterLoad(button, buttonText);
                return false;
            }
            else {
                afterLoad(button, "Error! Retry");
                return false;
            }
        })
    }
}


async function editUserAPI(formData, id) {
    let data = formDataToObject(formData);
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
        "X-CSRFToken": data.csrfmiddlewaretoken
    };
    let response = await requestAPI(`${apiURL}/admin/users/${id}/personal-information`, formData, headers, 'PATCH');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return editUserAPI(formData, id);
        }
        else {
            adminLogout();
        }
    }
    else {
        return response;
    }
}


function openDelUserModal(modalId, id) {
    let modal = document.querySelector(`#${modalId}`);
    let form = modal.querySelector('form');
    form.setAttribute('onsubmit', `deleteUser(event, '${id}')`);
    form.querySelector('.btn-text').innerText = 'Confirm';
    document.querySelector(`.${modalId}`).click();
}


async function deleteUser(event, id) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type=submit]');
    let buttonText = button.innerText;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    beforeLoad(button);
    let response = await deleteUserAPI(data, id);
    if(response.status == 204) {
        afterLoad(button, "User Deleted");
        getUsers(requiredDataURL);
    }
    else if(response.status == 404) {
        afterLoad(button, "User not found");
    }
    else {
        afterLoad(button, "Error! Retry");
    }
}


async function deleteUserAPI(data, id) {
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${apiURL}`,
        "X-CSRFToken": data.csrfmiddlewaretoken,
    };
    let response = await requestAPI(`${apiURL}/admin/users/${id}`, null, headers, 'DELETE');
    if(response.status == 401) {
        let myRes = await onAdminRefreshToken();
        if(myRes.status == 200) {
            return deleteUserAPI(data, id);
        }
        else {
            adminLogout();
        }
    }
    else {
        return response;
    }
}


async function toggleUserState(event, id, isBlocked) {
    let blockSwitch = event.currentTarget;
    let token = getCookie('admin_access');
    let headers = {
        "Authorization": `Bearer ${token}`,
    };
    if(isBlocked == 'False') {
        let response = await requestAPI(`${apiURL}/admin/users/${id}/block`, null, headers, 'POST');
        response.json().then(function(res) {
            if(response.status == 200) {
                blockSwitch.setAttribute('onclick', `toggleUserState(event, '${id}', 'True')`);
                blockSwitch.classList.add('active');
            }
        })
    }
    else if(isBlocked == 'True') {
        let response = await requestAPI(`${apiURL}/admin/users/${id}/unblock`, null, headers, 'POST');
        response.json().then(function(res) {
            if(response.status == 200) {
                blockSwitch.setAttribute('onclick', `toggleUserState(event, '${id}', 'False')`);
                blockSwitch.classList.remove('active');
            }
        })
    }
}