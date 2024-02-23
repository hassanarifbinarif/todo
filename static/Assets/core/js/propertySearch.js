window.onload = () => {
    getPublicities();
}


async function getPublicities() {
    let publicity1 = document.getElementById('publicity-1');
    let publicity2 = document.getElementById('publicity-2');
    let publicity3 = document.getElementById('publicity-3');
    publicity1.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-3 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
    publicity2.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-3 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
    publicity3.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-3 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
    let response1 = await requestAPI(`${apiURL}/publicity/2`, null, {}, 'GET');
    let response2 = await requestAPI(`${apiURL}/publicity/3`, null, {}, 'GET');
    let response3 = await requestAPI(`${apiURL}/publicity/4`, null, {}, 'GET');
    response1.json().then(function(res) {
        if (response1.status == 200) {
            publicity1.innerHTML = `<a href="${res.url}" target="_blank">
                                        <img src="${res.picture}" loading="lazy" alt="Publicity" />
                                    </a>`;
        }
        else {
            publicity1.innerHTML = `<span>Paid Publicity</span>`;
        }
    })
    response2.json().then(function(res) {
        if (response2.status == 200) {
            publicity2.innerHTML = `<a href="${res.url}" target="_blank">
                                        <img src="${res.picture}" loading="lazy" alt="Publicity" />
                                    </a>`;
        }
        else {
            publicity2.innerHTML = `<span>Paid Publicity</span>`;
        }
    })
    response3.json().then(function(res) {
        if (response3.status == 200) {
            publicity3.innerHTML = `<a href="${res.url}" target="_blank">
                                        <img src="${res.picture}" loading="lazy" alt="Publicity" />
                                    </a>`;
        }
        else {
            publicity3.innerHTML = `<span>Paid Publicity</span>`;
        }
    })
}

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


let queryString = '';

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
    queryString = `${apiURL}/search-listings?perPage=20&criteria=${data.criteria_radio || ''}&property_type__in=${property_type}&price__gte=${data.min_price || ''}&price__lte=${data.max_price || ''}&${bedrooms >= 5 ? 'bedrooms__gte' : 'bedrooms'}=${bedrooms}&${bathrooms >= 5 ? 'bathrooms__gte' : 'bathrooms'}=${bathrooms}&construction__gte=${data.min_construction_area || ''}&construction__lte=${data.max_construction_area}&land__gte=${data.min_land_area || ''}&land__lte=${data.max_land_area}&ameneties__contains=${ameneties}`;
    getListings(queryString);
}


async function getListings(url) {
    if (url != 'null') {
        let accessToken = getAccessTokenFromCookie();
        let headers = {};
        if(accessToken) {
            headers = {
                "Authorization": `Bearer ${accessToken}`,
            };
        }
        document.querySelector('#property-search-result-card-container').innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-5 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
        let response = await requestAPI(`${url}`, null, headers, 'GET');
        response.json().then(async function(res) {
            // console.log(res);
            if(response.status == 200) {
                map_properties = res.data;
                updateMarkers();
                // console.log(map_properties);
                let resp = await requestAPI('/get-search-properties/', JSON.stringify(res), {}, 'POST');
                resp.json().then(function(myRes) {
                    document.querySelector('#property-search-result-card-container').innerHTML = myRes.property;
                    updateContent();
                })
            }
        })
    }
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


let markers = [];
let map;
let bounds;
let markerCluster;


async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    bounds = new google.maps.LatLngBounds();
  
    map = new Map(document.getElementById("map"), {
        center: { lat: 31.4, lng: 74.368 },
        zoom: 8,
        disableDefaultUI: true,
        mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
            map.setCenter(pos);
        },
        () => {
            map.getCenter();
        },
    );

    // Create the DIV to hold the control.
    const centerControlDiv = document.createElement("div");
    // Create the control.
    const centerControl = createCenterControl(map);
    // Append the control to the DIV.
    centerControlDiv.appendChild(centerControl);
    map.controls[google.maps.ControlPosition.TOP_CENTER].push(centerControlDiv);

    createMarkers(map);
}


function createMarkers(map) {
    const infowindow = new google.maps.InfoWindow();
    const markerIcon = {
        url: "/static/Assets/core/images/map_marker.svg",
        scaledSize: new google.maps.Size(30, 30)
    };
    for (let i = 0; i < map_properties.length; i++) {
        let {lat, lng} = getLatLngFromString(map_properties[i].location);
        const marker = new google.maps.Marker({
            position: {
                lat: lat,
                lng: lng
            },
            map,
            icon: markerIcon,
            animation: google.maps.Animation.DROP
        });
        markers.push(marker);
        google.maps.event.addListener(marker, "click", function () {
            infowindow.setContent(createInfoWindowContent(map_properties[i]));
            // map.setCenter(marker.getPosition());
            infowindow.setPosition(marker.getPosition());
            infowindow.setOptions({
                pixelOffset: new google.maps.Size(110, 10),
            });
            infowindow.open(map, marker);
            google.maps.event.addListener(map, "click", () => {
                infowindow.close();
            });
            infowindow.addListener("domready", () => {
                const infoWindowContent = infowindow.getContent();
              
                infoWindowContent.addEventListener("click", (event) => {
                    event.stopPropagation();
                });
            });
        });
    }
    // google.maps.event.addListener(map, 'bounds_changed', function() {
    //     map.fitBounds(bounds, {padding: 100});
    // });
    const renderer = {
        render: ({ count, position }) =>
            new google.maps.Marker({
                icon: { url:"/static/Assets/core/images/marker_clusterer_icon.svg", scaledSize: new google.maps.Size(40, 40) }, 
                label: { text: String(count), color: "#000000", fontSize: "14px" },
                position,
             // adjust zIndex to be above other markers
                zIndex: Number(google.maps.Marker.MAX_ZINDEX) + count,
        }),
    };
    markerCluster = new markerClusterer.MarkerClusterer( {map, markers, renderer} );
}


function paddedBounds(npad, spad, epad, wpad) {
    var SW = map.getBounds().getSouthWest();
    var NE = map.getBounds().getNorthEast();
    var topRight = map.getProjection().fromLatLngToPoint(NE);
    var bottomLeft = map.getProjection().fromLatLngToPoint(SW);
    var scale = Math.pow(2, map.getZoom());

    var SWtopoint = map.getProjection().fromLatLngToPoint(SW);
    var SWpoint = new google.maps.Point(((SWtopoint.x - bottomLeft.x) * scale) + wpad, ((SWtopoint.y - topRight.y) * scale) - spad);
    var SWworld = new google.maps.Point(SWpoint.x / scale + bottomLeft.x, SWpoint.y / scale + topRight.y);
    var pt1 = map.getProjection().fromPointToLatLng(SWworld);

    var NEtopoint = map.getProjection().fromLatLngToPoint(NE);
    var NEpoint = new google.maps.Point(((NEtopoint.x - bottomLeft.x) * scale) - epad, ((NEtopoint.y - topRight.y) * scale) + npad);
    var NEworld = new google.maps.Point(NEpoint.x / scale + bottomLeft.x, NEpoint.y / scale + topRight.y);
    var pt2 = map.getProjection().fromPointToLatLng(NEworld);

    return new google.maps.LatLngBounds(pt1, pt2);
}


function updateMarkers() {
    deleteMarkers();
    createMarkers(map);
    markers.forEach((marker) => {
        bounds.extend(marker.getPosition());
    });
    if(markers.length == 1) {
        map.setCenter(markers[0].position);
    }
    else {
        map.fitBounds(bounds);
    }
}


function deleteMarkers() {
    for (let i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
    markerCluster.clearMarkers();
}


function createInfoWindowContent(propertyDetails) {
    let propertyCard = document.createElement('div');
    propertyCard.classList.add('property-card');
    let propertyCardImageContainer = document.createElement('div');
    propertyCardImageContainer.classList.add('property-card-image-container');
    let cardImage = document.createElement('img');
    cardImage.src = propertyDetails.images[0].image;
    propertyCardImageContainer.appendChild(cardImage);
    if (propertyDetails.is_new) {
        let cardType = document.createElement('div');
        cardType.classList.add('card-type');
        let cardText = document.createElement('span');
        cardText.innerText = 'New';
        cardType.appendChild(cardText);
        propertyCardImageContainer.appendChild(cardType);
    }
    propertyCard.appendChild(propertyCardImageContainer);
    
    let propertyCardDetails = document.createElement('div');
    propertyCardDetails.classList.add('property-card-details');
    let detailsRow1 = document.createElement('div');
    detailsRow1.classList.add('details-row1');
    let detailsRow1Column1 = document.createElement('div');
    detailsRow1Column1.classList.add('details-row1-column1');
    let propertyType = document.createElement('span');
    propertyType.innerText = propertyDetails.property_type;
    propertyType.title = propertyDetails.property_type;
    let propertyNeighbourhood = document.createElement('span');
    propertyNeighbourhood.innerText = propertyDetails.neighbourhood;
    propertyNeighbourhood.title = propertyDetails.neighbourhood;
    detailsRow1Column1.appendChild(propertyType);
    detailsRow1Column1.appendChild(propertyNeighbourhood);
    detailsRow1.appendChild(detailsRow1Column1);

    let detailsRow1Column2 = document.createElement('div');
    detailsRow1Column2.classList.add('details-row1-column2');
    let propertyLabel = document.createElement('label');
    propertyLabel.setAttribute('for', `${propertyDetails.id}`);
    propertyLabel.classList.add('favourite-property-checkbox');
    if (propertyDetails.is_favourite) {
        propertyLabel.classList.add('active');
        propertyLabel.setAttribute('onclick', `removeFavourite(event, '${propertyDetails.id}')`);
    }
    else {
        propertyLabel.setAttribute('onclick', `makeFavourite(event, '${propertyDetails.id}')`);
    }
    let favouriteInput = document.createElement('input');
    favouriteInput.type = 'checkbox';
    favouriteInput.readOnly = true;
    favouriteInput.setAttribute('id', `${propertyDetails.id}`);
    favouriteInput.setAttribute('name', 'favourite_property');
    if (propertyDetails.is_favourite) {
        favouriteInput.checked = true;
    }
    propertyLabel.appendChild(favouriteInput);
    propertyLabel.innerHTML += `<svg class="favourite-logo" width="25" height="22" viewBox="0 0 25 22"
                                        fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M22.6377 3.15345C21.1419 1.47213 19.2008 0.801797 16.9286 1.08202C15.4613 1.26334 14.2681 1.97762 13.2747 3.01608C13.0635 3.23586 12.8751 3.46663 12.6695 3.6974C12.4583 3.45564 12.2699 3.21938 12.0586 3.00509C10.2488 1.16993 8.06794 0.560039 5.56733 1.31828C3.22086 2.03257 1.85066 3.67542 1.23408 5.92817C1.11989 6.35674 1.07422 6.8018 1 7.24136V8.25235C1.01142 8.3018 1.02855 8.35125 1.03425 8.4007C1.15415 9.73586 1.65655 10.9337 2.41016 12.0491C3.20374 13.2304 4.18 14.2688 5.26474 15.1974C7.39997 17.0326 9.56945 18.8293 11.7332 20.637C12.3441 21.148 13.0292 21.1205 13.6686 20.593C15.3243 19.2194 16.9856 17.8458 18.6356 16.4666C20.0343 15.2963 21.3931 14.0765 22.5064 12.6425C23.3571 11.5436 24.0079 10.3512 24.2249 8.98861C24.5674 6.82927 24.1335 4.84575 22.6377 3.15894V3.15345Z"
                                            fill="none" stroke="#000000" />
                                    </svg>`;
    detailsRow1Column2.appendChild(propertyLabel);
    detailsRow1.appendChild(detailsRow1Column2);

    let detailsRow2 = document.createElement('div');
    detailsRow2.classList.add('details-row2');
    let detailsRow2Row1 = document.createElement('div');
    detailsRow2Row1.classList.add('details-row2-column');
    let div1 = document.createElement('div');
    let landImg = document.createElement('img');
    landImg.src = location.origin+"/static/Assets/core/images/area_logo.svg";
    div1.appendChild(landImg);
    div1.innerHTML += `<span>${propertyDetails.land} m<sup>2</sup></span>`;
    let div2 = document.createElement('div');
    let constructionImg = document.createElement('img');
    constructionImg.src = location.origin+"/static/Assets/core/images/house_logo.svg";
    div2.appendChild(constructionImg);
    div2.innerHTML += `<span>${propertyDetails.construction} m<sup>2</sup></span>`;
    detailsRow2Row1.appendChild(div1);
    detailsRow2Row1.appendChild(div2);

    let detailsRow2Row2 = document.createElement('div');
    detailsRow2Row2.classList.add('details-row2-column');
    let div3 = document.createElement('div');
    let bedImg = document.createElement('img');
    bedImg.src = location.origin+"/static/Assets/core/images/bed_logo.svg";
    div3.appendChild(bedImg);
    div3.innerHTML += `<span>${propertyDetails.bedrooms}</span>`;
    let div4 = document.createElement('div');
    let bathroomImg = document.createElement('img');
    bathroomImg.src = location.origin+"/static/Assets/core/images/bathroom_logo.svg";
    div4.appendChild(bathroomImg);
    div4.innerHTML += `<span>${propertyDetails.bathrooms}</span>`;
    detailsRow2Row2.appendChild(div3);
    detailsRow2Row2.appendChild(div4);
    detailsRow2.appendChild(detailsRow2Row1);
    detailsRow2.appendChild(detailsRow2Row2);

    let hr = document.createElement('hr');

    let detailsRow3 = document.createElement('div');
    detailsRow3.classList.add('details-row3');
    detailsRow3.innerHTML = `<span title="${propertyDetails.neighbourhood}, ${propertyDetails.city}">${propertyDetails.neighbourhood}, ${propertyDetails.city}</span>
                            <span class="price">$${propertyDetails.price}</span>`;

    propertyCardDetails.appendChild(detailsRow1);
    propertyCardDetails.appendChild(detailsRow2);
    propertyCardDetails.appendChild(hr);
    propertyCardDetails.appendChild(detailsRow3);
    propertyCard.appendChild(propertyCardDetails);
    
    return propertyCard; 
}


function createCenterControl(map) {
    const controlButton = document.createElement("button");
  
    // Set CSS for the control.
    controlButton.style.backgroundColor = "#8DC63F";
    controlButton.style.border = "0.5px solid #8DC63F";
    controlButton.style.borderRadius = "2px";
    controlButton.style.color = "#FFFFFF";
    controlButton.style.cursor = "pointer";
    controlButton.style.width = '207px';
    controlButton.style.height = '30px';
    controlButton.style.fontSize = "14px";
    controlButton.style.fontWeight = 700;
    controlButton.style.lineHeight = "16px";
    controlButton.style.marginTop = "5px";
    controlButton.style.textAlign = "center";
    controlButton.textContent = "Search this area";
    controlButton.type = "button";
    controlButton.setAttribute('data-i18n', "search-page-search-this-area");
    $.i18n({locale: currentLang})
        .load({ en: location.origin + "/static/Assets/translations/en.json", es: location.origin + "/static/Assets/translations/es.json" })
        .done(function() {
            controlButton.textContent = $.i18n( 'search-page-search-this-area');
        })
    controlButton.addEventListener("click", () => {
        // map.setCenter(chicago);
        // alert('button clicked');
        // updateMarkers();
    });
    return controlButton;
}