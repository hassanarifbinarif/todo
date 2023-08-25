// Toggling between grid view and map view

let viewMapBtn = document.querySelector(".view-map-btn");
let viewGridBtn = document.querySelector(".view-grid-btn");
let propertyCardContainer = document.querySelector(
  ".property-search-result-card-container"
);
let propertyCardPagination = document.querySelector(
  ".property-search-pagination"
);
let mapView = document.querySelector(".map-view");
let sidePublicityAd = document.querySelector(".side-publicity-ad");

viewMapBtn.addEventListener("click", toggleViewTypes);
viewGridBtn.addEventListener("click", toggleViewTypes);

function toggleViewTypes() {
  if (propertyCardContainer.classList.contains("hide")) {
    propertyCardContainer.classList.remove("hide");
    propertyCardPagination.classList.remove("hide");
    viewGridBtn.classList.add("hide");
    viewMapBtn.classList.remove("hide");
    mapView.classList.add("hide");
    sidePublicityAd.classList.remove("hide");
  } else {
    viewMapBtn.classList.add("hide");
    viewGridBtn.classList.remove("hide");
    propertyCardContainer.classList.add("hide");
    propertyCardPagination.classList.add("hide");
    mapView.classList.remove("hide");
    sidePublicityAd.classList.add("hide");
  }
}


// Move sidebar contents into dropdown
var sidebar = document.getElementById("filter-form-wrapper");
var dropdown = document.getElementById("filter-dropdown");

let previousScreenWidth = window.innerWidth;

if (window.innerWidth <= 768 && previousScreenWidth <= 768) {
  dropdown.appendChild(sidebar.querySelector("form"));
}

window.addEventListener("resize", toggleFilterContainer);

function toggleFilterContainer() {
    if (window.innerWidth <= 768 && previousScreenWidth <= 768) {
    } else if (window.innerWidth <= 768 && previousScreenWidth > 768) {
        dropdown.appendChild(sidebar.querySelector("form"));
    } else if (window.innerWidth > 768 && previousScreenWidth <= 768) {
        sidebar.appendChild(dropdown.querySelector("form"));
  } else {
  }
  previousScreenWidth = window.innerWidth;
}


// Check if mobile view
function isMobileView() {
    return window.innerWidth <= 768;
}

// Show/hide dropdown on button click
var button = document.getElementById("filter-btn");
var dropdownVisible = false;
button.addEventListener("click", function () {
    if (isMobileView()) {
        if (dropdownVisible) {
            dropdown.style.display = "none";
            dropdownVisible = false;
        } else {
            dropdown.style.display = "block";
            dropdownVisible = true;
        }
    }
});

localStorage.clear();

// Check local storage for selected inputs and set them
var inputs = sidebar.querySelectorAll("input");
for (var i = 0; i < inputs.length; i++) {
    var input = inputs[i];
    var value = localStorage.getItem(input.id);
    if (value !== null) {
        if (input.type === "checkbox") {
            input.checked = value === "true";
        } else if (input.type === "radio") {
            input.checked = value === "true";
        } else if (input.type === "number") {
            input.value = value;
        }
    }
}

// Save selected inputs to local storage on change
sidebar.addEventListener("change", function (event) {
    var input = event.target;
    if (input.matches("#sidebar input")) {
        var value;
        if (input.type === "checkbox") {
            value = input.checked.toString();
        } else if (input.type === "radio") {
            value = input.checked.toString();
        } else if (input.type === "number") {
            value = input.value;
        }
        localStorage.setItem(input.id, value);
    }
});


let orderDropdown = document.getElementById('order-dropdown');
let orderDropdownBtn = document.getElementById('order');
let orderOptions = document.querySelectorAll('input[name="order_radio"]');


orderOptions.forEach((option) => {
    option.addEventListener('change', function() {
        if(this.checked) {
            document.getElementById('selected-order').innerText = this.nextElementSibling.innerText;
        }
    })
})

orderDropdownBtn.addEventListener('click', toggleDropdown);


function toggleDropdown(event) {
    let elementBtn = event.target;
    if(!elementBtn.classList.contains('order-btn')) {
        elementBtn = elementBtn.closest('.order-btn');
    }
    let elementDropdown = elementBtn.nextElementSibling;
    if(elementDropdown.style.display == 'flex') {
        elementDropdown.style.display = 'none';
        elementBtn.style.zIndex = '2';
    }
    else {
        elementDropdown.style.display = 'flex';
        elementBtn.style.zIndex = '2';
    }
}

function closeDropdowns(event) {
    if((!orderDropdownBtn.contains(event.target)) && orderDropdown.style.display == 'flex') {
        orderDropdown.style.display = 'none';
        orderDropdownBtn.style.zIndex = '2';
    }
    else if((!button.contains(event.target)) && (!dropdown.contains(event.target)) && dropdownVisible == true) {
        dropdown.style.display = "none";
        dropdownVisible = false;
    }
}

document.body.addEventListener('click', closeDropdowns);


async function filterPropertyForm(event) {
    let form = event.currentTarget;
    let formData = new FormData(form);
    let data = formDataToObject(formData);
    let property_type = formData.getAll('property_type');
    property_type = property_type.length === 0 ? '' : property_type.join(',');
    let ameneties = formData.getAll('ameneties');
    ameneties = ameneties.length === 0 ? '' : ameneties.join(',');
    let bedrooms = data.bedroombtnradio || '';
    let bathrooms = data.bathroombtnradio || '';
    let accessToken = getAccessTokenFromCookie();
    let headers = {};
    if(accessToken) {
        headers = {
            "Authorization": `Bearer ${accessToken}`,
        };
    }
    let queryString = `?criteria=${data.criteria_radio || ''}&property_type__in=${property_type}&price__gte=${data.min_price || ''}&price__lte=${data.max_price || ''}&${bedrooms >= 5 ? 'bedrooms__gte' : 'bedrooms'}=${bedrooms}&${bathrooms >= 5 ? 'bathrooms__gte' : 'bathrooms'}=${bathrooms}&construction__gte=${data.min_construction_area || ''}&construction__lte=${data.max_construction_area}&land__gte=${data.min_land_area || ''}&land__lte=${data.max_land_area}&ameneties__contains=${ameneties}`;
    document.querySelector('#property-search-result-card-container').innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-5 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
    let response = await requestAPI(`${apiURL}/search-listings${queryString}`, null, headers, 'GET');
    response.json().then(async function(res) {
        if(response.status == 200) {
            let resp = await requestAPI('/get-search-properties/', JSON.stringify(res), {}, 'POST');
            resp.json().then(function(myRes) {
                document.querySelector('#property-search-result-card-container').innerHTML = myRes.property;
            })
        }
    })
}

function triggerForm(event) {
    // console.log(event);
    // let form = event.target.closest('form');
    // var event = new Event('change');
    // form.dispatchEvent(event);
}


async function makeFavourite(event, id) {
    event.preventDefault();
    event.stopPropagation();
    let favouriteElement = event.target.closest('.favourite-property-checkbox');
    let formData = new FormData();
    formData.append('listing', `${id}`);
    let token = getAccessTokenFromCookie();
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    let response = await requestAPI(`${apiURL}/listings/favourites`, formData, headers, 'POST');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return removeFavourite(event, id);
        }
        else {
            logout();
        }
    }
    else if(response.status == 200) {
        favouriteElement.classList.add('active');
        favouriteElement.removeAttribute('onclick');
        favouriteElement.setAttribute('onclick', `removeFavourite(event, '${id}')`);
        favouriteElement.querySelector('input').checked = true;
    }
}


async function removeFavourite(event, id) {
    event.preventDefault();
    event.stopPropagation();
    let favouriteElement = event.target.closest('.favourite-property-checkbox');
    let token = getAccessTokenFromCookie();
    let headers = {
        "Authorization": `Bearer ${token}`
    };
    let response = await requestAPI(`${apiURL}/listings/favourites/${id}`, null, headers, 'DELETE');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return removeFavourite(event, id);
        }
        else {
            logout();
        }
    }
    else if(response.status == 200) {
        favouriteElement.classList.remove('active');
        favouriteElement.removeAttribute('onclick');
        favouriteElement.setAttribute('onclick', `makeFavourite(event, '${id}')`);
        favouriteElement.querySelector('input').checked = false;
    }
}