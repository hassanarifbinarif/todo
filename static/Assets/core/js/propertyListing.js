window.onload = () => {
    getPublicities();
}


async function getPublicities() {
    let publicity = document.getElementById('publicity-1');
    publicity.innerHTML = '<div class="w-100 d-flex justify-content-center align-items-center pt-3 pb-2"><span class="spinner-border spinner-border-md" style="color: #8DC63F;" role="status" aria-hidden="true"></span></div>';
    let response = await requestAPI(`${apiURL}/publicity/5`, null, {}, 'GET');
    response.json().then(function(res) {
        if (response.status == 200) {
            publicity.innerHTML = `<a href="${res.url}" target="_blank">
                                        <img src="${res.picture}" loading="lazy" alt="Publicity" />
                                    </a>`;
        }
        else {
            publicity.innerHTML = `<span>Paid Publicity</span>`;
        }
    })
}


var swiper2 = new Swiper(".mainSwiper", {
    spaceBetween: 10,
    slidesPerView: 1,
    autoplay: {
        delay: 10000,
        disableOnInteraction: false
    },
    thumbs: {
        swiper: swiper,
    },
    navigation: {
        nextEl: ".mainswiper-button-next",
        prevEl: ".mainswiper-button-prev",
    },
    breakpoints: {
        768: {
        }
    }
});


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


async function initMap() {
    const { Map } = await google.maps.importLibrary("maps");
    bounds = new google.maps.LatLngBounds();
  
    map = new Map(document.getElementById("map"), {
        center: { lat: lat, lng: lng },
        zoom: 18,
        disableDefaultUI: true,
    });

    const markerIcon = {
        url: location.origin+"/static/Assets/core/images/map_marker_2.svg",
        scaledSize: new google.maps.Size(30, 30)
    };
    const marker = new google.maps.Marker({
        position: {
            lat: lat,
            lng: lng
        },
        map,
        icon: markerIcon,
        animation: google.maps.Animation.DROP
    });

}