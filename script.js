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

// 9주차 - 맞춤 유학 준비 계획 폼

const studyPlanForm =
    document.querySelector("#study-plan-form");

const targetSchool =
    document.querySelector("#target-school");

const schoolField =
    document.querySelector("#school-field");

const schoolHelp =
    document.querySelector("#school-help");

const schoolCount =
    document.querySelector("#school-count");

const schoolError =
    document.querySelector("#school-error");

const admissionTerm =
    document.querySelector("#admission-term");

const termError =
    document.querySelector("#term-error");

const languageOption =
    document.querySelector("#language-option");

const languageOptions =
    document.querySelector("#language-options");

const languageInputs =
    [...document.querySelectorAll(
        'input[name="language-test"]'
    )];

const languageError =
    document.querySelector("#language-error");

const studyPlanSave =
    document.querySelector("#study-plan-save");

const studyPlanStatus =
    document.querySelector("#study-plan-status");


// 주소 뒤에 ?plan-error=1을 붙이면 저장 실패 테스트
const forcePlanFailure =
    new URLSearchParams(location.search)
        .has("plan-error");


// 목표 학교 오류 표시
function showSchoolError(message) {

    targetSchool.setAttribute(
        "aria-invalid",
        "true"
    );

    schoolError.textContent = message;

    schoolField.classList.remove("is-valid");

    schoolField.classList.add("has-error");

    return false;
}


// 목표 학교 오류 해제
function clearSchoolError() {

    targetSchool.removeAttribute("aria-invalid");

    schoolError.textContent = "";

    schoolField.classList.remove("has-error");

    updateSchoolExperience();
}


// 목표 학교 입력 검증
function validateSchool() {

    const school =
        targetSchool.value.trim();

    if (school === "") {

        return showSchoolError(
            "지원 희망 학교 또는 전공을 입력해 주세요."
        );
    }

    if (school.length < 2) {

        return showSchoolError(
            "지원 희망 학교 또는 전공을 2자 이상 입력해 주세요."
        );
    }

    clearSchoolError();

    return true;
}


// 입력 중 글자 수와 조건 표시
function updateSchoolExperience() {

    const length =
        targetSchool.value.length;

    const enough =
        targetSchool.value.trim().length >= 2;

    const invalid =
        targetSchool.getAttribute(
            "aria-invalid"
        ) === "true";

    schoolCount.textContent =
        length + " / 60자";

    schoolField.classList.toggle(
        "is-valid",
        enough && !invalid
    );

    if (!invalid) {

        if (enough) {

            schoolHelp.textContent =
                "입력 조건을 충족했습니다.";
        }
        else {

            schoolHelp.textContent =
                "학교명이나 관심 전공을 2자 이상 입력해 주세요.";
        }
    }
}


// 목표 입학 시기 검증
function validateAdmissionTerm() {

    if (admissionTerm.value === "") {

        admissionTerm.setAttribute(
            "aria-invalid",
            "true"
        );

        termError.textContent =
            "희망 유학 과정을 선택해 주세요.";

        return false;
    }

    admissionTerm.removeAttribute(
        "aria-invalid"
    );

    termError.textContent = "";

    return true;
}


// 조건부 어학 입력 표시
function syncLanguageFields() {

    const open =
        languageOption.checked;

    languageOption.setAttribute(
        "aria-expanded",
        String(open)
    );

    languageOptions.hidden = !open;

    languageOptions.disabled = !open;

    if (!open) {

        languageInputs.forEach(function (input) {
            input.checked = false;
            input.removeAttribute("aria-invalid");
        });

        languageError.textContent = "";
    }
}


// 어학 시험 선택 검증
function validateLanguage() {

    if (languageOption.checked === false) {
        return true;
    }

    const selectedLanguage =
        document.querySelector(
            'input[name="language-test"]:checked'
        );

    if (selectedLanguage === null) {

        languageError.textContent =
            "준비할 어학 시험을 선택해 주세요.";

        languageInputs[0].setAttribute(
            "aria-invalid",
            "true"
        );

        return false;
    }

    languageInputs.forEach(function (input) {
        input.removeAttribute("aria-invalid");
    });

    languageError.textContent = "";

    return true;
}


// 제출 상태 변경
function setStudyPlanSubmitState(
    loading,
    message,
    state
) {

    studyPlanForm.setAttribute(
        "aria-busy",
        String(loading)
    );

    studyPlanSave.disabled = loading;

    if (loading) {
        studyPlanSave.textContent = "저장하는 중…";
    }
    else {
        studyPlanSave.textContent =
           "지원 목표 저장하기";
    }

    studyPlanStatus.textContent = message;

    studyPlanStatus.classList.remove(
        "is-success",
        "is-error"
    );

    if (state === "success") {
        studyPlanStatus.classList.add(
            "is-success"
        );
    }

    if (state === "error") {
        studyPlanStatus.classList.add(
            "is-error"
        );
    }
}


// 잠시 기다리는 함수
function waitStudyPlan(milliseconds) {

    return new Promise(function (resolve) {

        window.setTimeout(
            resolve,
            milliseconds
        );
    });
}


// 브라우저에 저장
async function saveStudyPlan(plan) {

    await waitStudyPlan(600);

    if (forcePlanFailure) {

        throw new Error(
            "수업용 저장 실패"
        );
    }

    localStorage.setItem(
        "studyPathSavedPlan",
        JSON.stringify(plan)
    );
}


// 입력 중 피드백
targetSchool.addEventListener(
    "input",
    function () {

        updateSchoolExperience();

        if (
            targetSchool.getAttribute(
                "aria-invalid"
            ) === "true"
        ) {

            validateSchool();
        }
    }
);


// 입학 시기 수정 시 오류 해제
admissionTerm.addEventListener(
    "change",
    function () {

        if (admissionTerm.value !== "") {

            admissionTerm.removeAttribute(
                "aria-invalid"
            );

            termError.textContent = "";
        }
    }
);


// 조건부 영역
languageOption.addEventListener(
    "change",
    syncLanguageFields
);


// 라디오 선택 시 오류 해제
languageInputs.forEach(function (input) {

    input.addEventListener(
        "change",
        function () {

            languageInputs.forEach(
                function (item) {
                    item.removeAttribute(
                        "aria-invalid"
                    );
                }
            );

            languageError.textContent = "";
        }
    );
});


syncLanguageFields();


// 최종 제출
studyPlanForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();

        const schoolValid =
            validateSchool();

        const termValid =
            validateAdmissionTerm();

        const languageValid =
            validateLanguage();

        if (
            !schoolValid
            || !termValid
            || !languageValid
        ) {

            setStudyPlanSubmitState(
                false,
                "입력 내용을 확인한 뒤 다시 제출해 주세요.",
                "error"
            );

            const firstInvalid =
                studyPlanForm.querySelector(
                    '[aria-invalid="true"]'
                );

            if (firstInvalid) {
                firstInvalid.focus();
            }

            return;
        }


        const formData =
            new FormData(studyPlanForm);

        const plan = {

            targetSchool:
                String(
                    formData.get(
                        "targetSchool"
                    )
                ).trim(),

            admissionTerm:
                String(
                    formData.get(
                        "admissionTerm"
                    )
                ),

            languagePreparation:
                formData.get(
                    "languagePreparation"
                ) === "included",

            languageTest:
                String(
                    formData.get(
                        "language-test"
                    ) || ""
                )
        };


        setStudyPlanSubmitState(
            true,
            "지원 목표를 저장하고 있습니다.",
            ""
        );


        try {

            await saveStudyPlan(plan);

            setStudyPlanSubmitState(
                false,
                plan.targetSchool
                + " 지원 목표를 저장했습니다.",
                "success"
            );
        }
        catch (error) {

            setStudyPlanSubmitState(
                false,
                "저장하지 못했습니다. 입력한 내용은 그대로 두었습니다. 다시 시도해 주세요.",
                "error"
            );
        }
    }
);