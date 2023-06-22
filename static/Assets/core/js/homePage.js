// Handling Property Search Form

async function propertySearchForm(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    location.href = location.origin + `/property-search/?property_type=${data.property_type}&criteria=${data.criteria}&city=${data.city}&min_price=${data.min_price}&max_price=${data.max_price}`;
}