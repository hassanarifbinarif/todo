var stripe;
var elements;
let stripe_publishable_key;
let currenSelectedPlan;

window.addEventListener("DOMContentLoaded", getStripeKey);
window.addEventListener("load", getCurrentPlan);


async function getStripeKey() {
    let response = await getStripeKeyAPI();
    response.json().then(function(res) {
        if (response.status == 200) {
            stripe_publishable_key = res.stripe_publishable_key;
            stripe = Stripe(stripe_publishable_key);
        }
    })
}


function getCurrentPlan() {
    for (let i = 0; i < planList.length; i++) {
        if (planList[i].is_subscribed == true) {
            currenSelectedPlan = planList[i].id;
            break;
        }
        currenSelectedPlan = planList[0].id;
    }
}


async function getStripeKeyAPI() {
    let token = getAccessTokenFromCookie();
    let headers = { "Authorization": `Bearer ${token}` };
    let response = await requestAPI(`${apiURL}/subscriptions/stripe_publishable_key`, null, headers, 'GET');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return getStripeKeyAPI();
        }
        else {
            logout();
        }
    }
    else {
        return response;
    }
}


async function changePlan(event) {
    event.preventDefault();
    let form = event.currentTarget;
    let button = form.querySelector('button[type="submit"]');
    let buttonText = button.innerText;
    let subscriptionMsg = form.querySelector('.subscription-msg');
    let formData = new FormData(form);
    let formDataObject = formDataToObject(formData);
    if (currenSelectedPlan != undefined && currenSelectedPlan == formDataObject.plan_radio && currenSelectedPlan != 1) {
        subscriptionMsg.innerText = 'Selected plan is already saved';
        subscriptionMsg.classList.add('active');
        return false;
    }
    subscriptionMsg.innerText = '';
    subscriptionMsg.classList.remove('active');
    beforeLoad(button);
    let response = await changePlanAPI(parseInt(formDataObject.plan_radio));
    response.json().then(function(res) {
        if (response.status == 200) {
            if (res.data.plan.id == 1) {
                currenSelectedPlan = res.data.plan.id;
                afterLoad(button, 'Plan Saved');
                setTimeout(() => {
                    afterLoad(button, buttonText);
                }, 2000);
            }
            else {
                let client_Secret = res.data.latest_payment_client_secret;
                document.querySelector("#payment-form").addEventListener("submit", handleSubmit);

                const appearance = { theme: 'stripe' };
                elements = stripe.elements({ appearance, clientSecret: client_Secret });
                
                const paymentElementOptions = { layout: "tabs" };
                const paymentElement = elements.create("payment", paymentElementOptions);
                paymentElement.mount("#payment-element");
                document.querySelector('.subscription-modal').click();
                afterLoad(button, buttonText);
            }
        }
        else {
            subscriptionMsg.classList.add('active');
            afterLoad(button, buttonText);
            displayMessages(res.messages, subscriptionMsg);
        }
    })
}


async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
  
    const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
            return_url: location.origin + '/success',
        },
    });
  
    // This point will only be reached if there is an immediate error when
    // confirming the payment. Otherwise, your customer will be redirected to
    // your `return_url`. For some payment methods like iDEAL, your customer will
    // be redirected to an intermediate site first to authorize the payment, then
    // redirected to the `return_url`.
    if (error.type === "card_error" || error.type === "validation_error") {
        showMessage(error.message);
    } else {
        showMessage("An unexpected error occurred.");
    }
  
    setLoading(false);
}


function showMessage(messageText) {
    const messageContainer = document.querySelector("#payment-message");
  
    messageContainer.classList.remove("hidden");
    messageContainer.textContent = messageText;
  
    setTimeout(function () {
        messageContainer.classList.add("hidden");
        messageContainer.textContent = "";
    }, 5000);
}


function setLoading(isLoading) {
    if (isLoading) {
        // Disable the button and show a spinner
        document.querySelector("#submit").disabled = true;
        document.querySelector("#spinner").classList.remove("hidden");
        document.querySelector("#button-text").classList.add("hidden");
    } else {
        document.querySelector("#submit").disabled = false;
        document.querySelector("#spinner").classList.add("hidden");
        document.querySelector("#button-text").classList.remove("hidden");
    }
}


async function changePlanAPI(plan_id) {
    let token = getAccessTokenFromCookie();
    let headers = { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
    };
    let data = { "plan": plan_id };
    let response = await requestAPI(`${apiURL}/subscriptions/create-or-update`, JSON.stringify(data), headers, 'POST');
    if(response.status == 401) {
        let myRes = await onRefreshToken();
        if(myRes.status == 200) {
            return changePlanAPI(plan_id);
        }
        else {
            logout();
        }
    }
    else {
        return response;
    }
}