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

// let filterDropdown = document.getElementById('filter-dropdown-menu');
// let filterForm = document.getElementById('filter-form-wrapper');
// let previousScreenWidth = window.innerWidth;

// if(window.innerWidth <= 768 && previousScreenWidth <= 768) {
//     filterDropdown.innerHTML = filterForm.innerHTML;
// }

// window.addEventListener('resize', toggleFilterContainer);

// function toggleFilterContainer() {
//     console.log(window.innerWidth);
//     if(window.innerWidth <= 768 && previousScreenWidth <= 768) {
//     }
//     else if(window.innerWidth <= 768 && previousScreenWidth > 768) {
//         filterDropdown.innerHTML = filterForm.innerHTML;
//     }
//     else if (window.innerWidth > 768 && previousScreenWidth <= 768) {
//         filterForm.innerHTML = filterDropdown.innerHTML;
//     }
//     else {
//     }
//     previousScreenWidth = window.innerWidth;
// }

// Move sidebar contents into dropdown
var sidebar = document.getElementById("filter-form-wrapper");
var dropdown = document.getElementById("filter-dropdown");

let previousScreenWidth = window.innerWidth;

if (window.innerWidth <= 768 && previousScreenWidth <= 768) {
  dropdown.appendChild(sidebar.querySelector("form"));
}

window.addEventListener("resize", toggleFilterContainer);

function toggleFilterContainer() {
  // console.log(window.innerWidth);
  if (window.innerWidth <= 768 && previousScreenWidth <= 768) {
  } else if (window.innerWidth <= 768 && previousScreenWidth > 768) {
    dropdown.appendChild(sidebar.querySelector("form"));
  } else if (window.innerWidth > 768 && previousScreenWidth <= 768) {
    sidebar.appendChild(dropdown.querySelector("form"));
  } else {
  }
  previousScreenWidth = window.innerWidth;
}

// dropdown.appendChild(sidebar.querySelector("form"));

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
      // Hide dropdown
      dropdown.style.display = "none";
      dropdownVisible = false;
    } else {
      // Show dropdown
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
