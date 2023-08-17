// Handling Property Search Form

// async function propertySearchForm(event) {
//     event.preventDefault();
//     let form = event.currentTarget;
//     let formData = new FormData(form);
//     let data = formDataToObject(formData);
//     location.href = location.origin + `/property-search/?property_type=${data.property_type}&criteria=${data.criteria}&city=${data.city}&min_price=${data.min_price}&max_price=${data.max_price}`;
// }


// let criteriaDropdown = document.getElementById('criteria-dropdown');
// // console.log(criteriaDropdown);
// let criteriaDropdownBtn = document.getElementById('criteria');

// criteriaDropdownBtn.addEventListener('click', function() {
//     criteriaDropdown.style.display = 'flex';
//     criteriaDropdownBtn.style.borderRadius = '2px';
//     criteriaDropdownBtn.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
// })