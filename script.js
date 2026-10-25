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
// 7주차 유학 준비 사용자 흐름

const planStart = document.querySelector("#planStart");
const planFlow = document.querySelector("#planFlow");
const planSteps = document.querySelectorAll(".plan-step");
const planProgress = document.querySelector("#planProgress");

const countryError = document.querySelector("#countryError");
const planSummary = document.querySelector("#planSummary");
const planCompleteMessage =
    document.querySelector("#planCompleteMessage");

const planNext1 = document.querySelector("#planNext1");
const planBack2 = document.querySelector("#planBack2");
const planNext2 = document.querySelector("#planNext2");
const planBack3 = document.querySelector("#planBack3");
const planComplete = document.querySelector("#planComplete");
const planRestart = document.querySelector("#planRestart");

const planStepNames = [
    "목표 국가 입력",
    "준비 상태 선택",
    "내용 확인"
];


// 현재 단계 표시
function showPlanStep(step) {

    planSteps.forEach(function (item) {
        item.hidden =
            Number(item.dataset.step) !== step;
    });

    if (step <= 3) {
        planProgress.textContent =
            step + " / 3 · " + planStepNames[step - 1];
    } else {
        planProgress.textContent =
            "유학 준비 플랜 완료";
    }
}


// 유학 준비 시작
planStart.addEventListener("click", function () {

    planFlow.hidden = false;
    planStart.hidden = true;

    showPlanStep(1);

    countryInput.focus();
});


// 1단계 → 2단계
planNext1.addEventListener("click", function () {

    const country = countryInput.value.trim();

    if (country === "") {

        countryError.textContent =
            "목표 국가를 입력해 주세요. 예: 독일, 프랑스";

        countryInput.classList.add("has-error");
        countryInput.focus();

        return;
    }

    countryError.textContent = "";
    countryInput.classList.remove("has-error");

    showPlanStep(2);
});


// 국가를 다시 입력하면 오류 상태 제거
countryInput.addEventListener("input", function () {

    if (countryInput.value.trim() !== "") {
        countryError.textContent = "";
        countryInput.classList.remove("has-error");
    }
});


// 2단계 → 1단계
planBack2.addEventListener("click", function () {

    showPlanStep(1);
    countryInput.focus();
});


// 2단계 → 3단계
planNext2.addEventListener("click", function () {

    const country = countryInput.value.trim();
    const checkedCount = getCheckedCount();

    let completedItems = [];

    prepareChecks.forEach(function (check) {

        if (check.checked === true) {
            completedItems.push(check.value);
        }
    });

    let completedText =
        "아직 완료한 준비 항목이 없습니다.";

    if (completedItems.length > 0) {
        completedText =
            "완료한 준비: "
            + completedItems.join(", ");
    }

    planSummary.textContent =
        "목표 국가: "
        + country
        + " / 준비 진행률: "
        + checkedCount
        + " / 3 / "
        + completedText;

    showPlanStep(3);
});


// 3단계 → 2단계
planBack3.addEventListener("click", function () {

    showPlanStep(2);
});


// 플랜 완료
planComplete.addEventListener("click", function () {

    const country = countryInput.value.trim();
    const checkedCount = getCheckedCount();

    planCompleteMessage.textContent =
        country
        + " 유학 준비 플랜이 완성되었습니다. "
        + "현재 준비 진행률은 "
        + checkedCount
        + " / 3입니다.";

    showPlanStep(4);
});


// 다시 시작하기
planRestart.addEventListener("click", function () {

    countryInput.value = "";

    prepareChecks.forEach(function (check) {
        check.checked = false;
    });

    prepareTitle.textContent =
        "유학 준비 체크리스트";

    progressMessage.textContent =
        "준비 진행률: 0 / 3";

    progressMessage.classList.remove(
        "is-progress",
        "is-complete"
    );

    countryError.textContent = "";
    countryInput.classList.remove("has-error");

    planSummary.textContent = "";
    planCompleteMessage.textContent = "";

    showPlanStep(1);

    countryInput.focus();
});

// 중간고사 - 목표 입학일까지 남은 준비 기간 확인

const admissionDateInput =
    document.querySelector("#admissionDate");

const deadlineError =
    document.querySelector("#deadlineError");

const deadlineResult =
    document.querySelector("#deadlineResult");

const deadlineCalculate =
    document.querySelector("#deadlineCalculate");


function resetDeadlinePlanner() {
    admissionDateInput.value = "";

    deadlineError.textContent = "";

    deadlineResult.textContent = "";

    deadlineResult.classList.remove("is-success");
}


admissionDateInput.addEventListener("input", function () {
    deadlineError.textContent = "";

    deadlineResult.textContent = "";

    deadlineResult.classList.remove("is-success");
});


deadlineCalculate.addEventListener("click", function () {

    const admissionDate =
        admissionDateInput.value;


    // 날짜를 입력하지 않은 경우
    if (admissionDate === "") {
        deadlineError.textContent =
            "목표 입학일을 선택해 주세요.";

        admissionDateInput.focus();

        return;
    }


    const targetDate =
        new Date(admissionDate + "T00:00:00");

    const today =
        new Date();

    today.setHours(0, 0, 0, 0);


    // 오늘 또는 과거 날짜를 선택한 경우
    if (targetDate <= today) {
        deadlineError.textContent =
            "오늘 이후의 입학 목표일을 선택해 주세요.";

        deadlineResult.textContent = "";

        deadlineResult.classList.remove("is-success");

        admissionDateInput.focus();

        return;
    }


    const oneDay =
        1000 * 60 * 60 * 24;

    const daysLeft =
        Math.ceil(
            (targetDate - today) / oneDay
        );


    const country =
        countryInput.value.trim();


    deadlineError.textContent = "";

    deadlineResult.textContent =
        country
        + " 유학 목표일까지 "
        + daysLeft
        + "일 남았습니다.";


    deadlineResult.classList.add("is-success");
});


planRestart.addEventListener("click", function () {
    resetDeadlinePlanner();
});