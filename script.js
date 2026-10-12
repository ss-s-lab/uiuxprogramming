const serviceName = "StudyPath";
let isSubscribed = false;
let submitCount = 0;

function makeNewsletterMessage(email, subscribed) {
    if (subscribed === true) {
        return email + "로 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해 주세요.";
}

const subscribeForm = document.querySelector("#newsletter-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#newsletter-button");
const subscribeMessage = document.querySelector("#newsletter-message");

function handleSubscribe(event) {
    event.preventDefault();

    const newsletterEmail = emailInput.value.trim();

    if (newsletterEmail === "") {
        subscribeMessage.textContent = "이메일을 입력한 뒤 신청해 주세요.";
        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeNewsletterMessage(newsletterEmail, isSubscribed);

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}

subscribeForm.addEventListener("submit", handleSubscribe);