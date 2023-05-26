let requiredDataURL = "http://api-dev.todo.com.ec/api/admin/users?search=";
let userTableContainer = document.getElementById("user-table-container");

async function getUsers(event, url) {
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
            });
        } catch (err) {
            userTableContainer.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-2 pb-2"><span class="no-record-row">No records found</span></div>';
            console.log(err);
        }
    }
}

async function searchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    getUsers(
        event,
        `http://api-dev.todo.com.ec/api/admin/users?search=${data.search}`
    );
}
