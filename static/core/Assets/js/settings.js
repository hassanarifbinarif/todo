// Toggling between listings, favourites and profile views

let adsRadioBtn = document.getElementsByName('my_ads_radio');
let listingTableContent = document.getElementById('listing-table');
let favouriteTableContent = document.getElementById('favourite-table');
let profileContent = document.getElementById('profile-content');

for (let i = 0; i < adsRadioBtn.length; i++) {
    adsRadioBtn[i].addEventListener("change", function () {
        try {
            if(this.checked && this.id == 'listing') {
                listingTableContent.classList.remove('hide');
                if(!favouriteTableContent.classList.contains('hide')) {
                    favouriteTableContent.classList.add('hide')
                }
                else if(!profileContent.classList.contains('hide')) {
                    profileContent.classList.add('hide');
                }
            }
            else if(this.checked && this.id == 'favourite') {
                favouriteTableContent.classList.remove('hide');
                if(!listingTableContent.classList.contains('hide')) {
                    listingTableContent.classList.add('hide')
                }
                else if(!profileContent.classList.contains('hide')) {
                    profileContent.classList.add('hide');
                }
            }
            else {
                profileContent.classList.remove('hide');
                if(!favouriteTableContent.classList.contains('hide')) {
                    favouriteTableContent.classList.add('hide')
                }
                else if(!listingTableContent.classList.contains('hide')) {
                    listingTableContent.classList.add('hide');
                }
            }
        }
        catch(err) {
            console.log(err);
        }
    })
}



// Preview Image on profile form

function previewImage(event) {
    let image = event.currentTarget.files;
    let imageTag = document.getElementById('profile-image');
    imageTag.src = window.URL.createObjectURL(image[0]);
}