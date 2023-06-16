// Handling Property Search Form

async function propertySearchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let headers = {
        "X-CSRFToken": data.csrfmiddlewaretoken,
    };
    let response = await requestAPI('/property-search/', JSON.stringify(data), headers, 'POST');
}