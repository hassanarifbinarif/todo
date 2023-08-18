// Handling Property Search Form

// async function propertySearchForm(event) {
//     event.preventDefault();
//     let form = event.currentTarget;
//     let formData = new FormData(form);
//     let data = formDataToObject(formData);
//     location.href = location.origin + `/property-search/?property_type=${data.property_type}&criteria=${data.criteria}&city=${data.city}&min_price=${data.min_price}&max_price=${data.max_price}`;
// }


let criteriaDropdown = document.getElementById('criteria-dropdown');
let criteriaDropdownBtn = document.getElementById('criteria');
let criteriaOptions = document.querySelectorAll('input[name="criteria_radio"]');

let typeOfPropertyDropdown = document.getElementById('type-of-property-dropdown');
let typeOfPropertyDropdownBtn = document.getElementById('type-of-property');
let typeOfPropertyOptions = document.querySelectorAll('input[name="property_radio"]');


criteriaOptions.forEach((option) => {
    option.addEventListener('change', function() {
        if(this.checked) {
            document.getElementById('selected-criteria').innerText = this.nextElementSibling.innerText;
        }
        criteriaDropdownBtn.click();
    })
})

criteriaDropdownBtn.addEventListener('click', toggleDropdown);


typeOfPropertyOptions.forEach((option) => {
    option.addEventListener('change', function() {
        if(this.checked) {
            document.getElementById('selected-property-type').innerText = this.nextElementSibling.innerText;
        }
        typeOfPropertyDropdownBtn.click();
    })
})

typeOfPropertyDropdownBtn.addEventListener('click', toggleDropdown);


function toggleDropdown(event) {
    let elementBtn = event.target;
    if(!elementBtn.classList.contains('filter-btn')) {
        elementBtn = elementBtn.closest('.filter-btn');
    }
    let elementDropdown = elementBtn.nextElementSibling;
    if(elementDropdown.style.display == 'flex') {
        elementDropdown.style.display = 'none';
        elementBtn.style.borderRadius = '4px';
        elementBtn.style.boxShadow = 'unset';
        elementBtn.style.zIndex = '2';
    }
    else {
        elementDropdown.style.display = 'flex';
        elementBtn.style.borderRadius = '2px';
        elementBtn.style.boxShadow = '0px 4px 4px 0px rgba(0, 0, 0, 0.25)';
        elementBtn.style.zIndex = '2';
    }
}