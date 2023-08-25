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
    // response.json().then(function(res) {
    //     // console.log(res);
    // })
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
    // response.json().then(function(res) {
    //     // console.log(res);
    // })
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