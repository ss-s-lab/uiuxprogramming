const serviceName = "StudyPath";
let isSubscribed = false;
let submitCount = 0;


// 뉴스레터 신청 결과 문구 만들기
function makeNewsletterMessage(email, subscribed) {
    if (subscribed === true) {
        const country = countryInput.value.trim();
        const checkedCount = getCheckedCount();

        if (country !== "") {
           return email + " 이메일로 "
        + country + " 유학 준비 소식 신청이 완료되었습니다. "
        + "현재 준비 진행률은 " + checkedCount + " / 3입니다.";
        }

        return email + " 이메일로 신청이 완료되었습니다.";
    }

    return "이메일을 입력한 뒤 신청해 주세요.";
}


// DOM 요소 선택
const subscribeForm = document.querySelector("#newsletter-form");
const emailInput = document.querySelector("#email");
const subscribeButton = document.querySelector("#newsletter-button");
const subscribeMessage = document.querySelector("#newsletter-message");

const countryInput = document.querySelector("#country");
const prepareTitle = document.querySelector("#prepare-title");
const prepareChecks = document.querySelectorAll(".prepare-check");
const progressMessage = document.querySelector("#progress-message");


// 체크된 준비 항목 개수 확인
function getCheckedCount() {
    let checkedCount = 0;

    prepareChecks.forEach(function (check) {
        if (check.checked === true) {
            checkedCount += 1;
        }
    });

    return checkedCount;
}


// 목표 국가 input 이벤트
function handleCountryInput() {
    const country = countryInput.value.trim();

    if (country === "") {
        prepareTitle.textContent =
            "유학 준비 체크리스트";

        return;
    }

    prepareTitle.textContent =
        country + " 유학 준비 체크리스트";
}


// 체크리스트 change 이벤트
function handlePrepareChange() {
    const checkedCount = getCheckedCount();

    progressMessage.textContent =
        "준비 진행률: " + checkedCount + " / 3";

    progressMessage.classList.toggle(
        "is-progress",
        checkedCount > 0 && checkedCount < 3
    );

    progressMessage.classList.toggle(
        "is-complete",
        checkedCount === 3
    );
}


// 뉴스레터 상태 초기화
function resetNewsletterState() {
    isSubscribed = false;

    subscribeMessage.classList.remove("is-success");

    subscribeButton.textContent = "소식 받기";
    subscribeButton.disabled = false;
}


// 이메일 input 이벤트
function handleEmailInput() {
    const wasSubscribed = isSubscribed;

    resetNewsletterState();

    const newsletterEmail = emailInput.value.trim();

    if (newsletterEmail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해 주세요.";

        return;
    }

    if (wasSubscribed === true) {
        subscribeMessage.textContent =
            "이메일이 수정되었습니다. 다시 신청해 주세요.";

        return;
    }

    subscribeMessage.textContent =
        "이메일을 확인한 뒤 신청해 주세요.";
}


// 뉴스레터 신청
function handleSubscribe(event) {
    event.preventDefault();

    const newsletterEmail = emailInput.value.trim();

    if (newsletterEmail === "") {
        subscribeMessage.textContent =
            "이메일을 입력한 뒤 신청해 주세요.";

        emailInput.focus();
        return;
    }

    isSubscribed = true;
    submitCount += 1;

    subscribeMessage.textContent =
        makeNewsletterMessage(
            newsletterEmail,
            isSubscribed
        );

    subscribeMessage.classList.add("is-success");

    subscribeButton.textContent = "신청 완료";
    subscribeButton.disabled = true;
}


// input, change, submit 이벤트 연결
countryInput.addEventListener("input", handleCountryInput);

prepareChecks.forEach(function (check) {
    check.addEventListener("change", handlePrepareChange);
});

emailInput.addEventListener("input", handleEmailInput);

subscribeForm.addEventListener("submit", handleSubscribe);


// 탭 요소 선택
const tabs = document.querySelectorAll(".tab");
const panels = document.querySelectorAll(".panel");


// 기존 탭과 패널 상태 초기화
function resetTabsAndPanels() {
    tabs.forEach(function (tab) {
        tab.classList.remove("is-active");
        tab.setAttribute("aria-selected", "false");
    });

    panels.forEach(function (panel) {
        panel.classList.remove("is-active");
        panel.hidden = true;
    });
}


// 클릭한 탭 활성화
function activateTab(clickedTab) {
    const targetSelector = clickedTab.dataset.target;
    const targetPanel = document.querySelector(targetSelector);

    clickedTab.classList.add("is-active");
    clickedTab.setAttribute("aria-selected", "true");

    targetPanel.classList.add("is-active");
    targetPanel.hidden = false;
}


// 탭 click 이벤트
function handleTabClick(event) {
    resetTabsAndPanels();
    activateTab(event.currentTarget);
}


// 각 탭에 click 이벤트 연결
tabs.forEach(function (tab) {
    tab.addEventListener("click", handleTabClick);
});