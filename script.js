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
const planBack4 = document.querySelector("#planBack4");

const planStepNames = [
    "목표 국가 입력",
    "준비 상태 선택",
    "내용 확인",
    "입학일과 지원 목표 입력"
];


// 현재 단계 표시
function showPlanStep(step) {

    planSteps.forEach(function (item) {
        item.hidden =
            Number(item.dataset.step) !== step;
    });

    planProgress.textContent =
        step + " / " + planStepNames.length + " · " + planStepNames[step - 1];
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
        + " 유학 준비 상태를 확인했습니다. "
        + "현재 준비 진행률은 "
        + checkedCount
        + " / 3입니다.";

    showPlanStep(4);
    admissionDateInput.focus();
});

planBack4.addEventListener("click", function () {
    showPlanStep(3);
    planComplete.focus();
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

let calculatedDaysLeft = null;


function resetDeadlinePlanner() {

    admissionDateInput.value = "";

    deadlineError.textContent = "";

    deadlineResult.textContent = "";

    deadlineResult.classList.remove(
        "is-success"
    );

    calculatedDaysLeft = null;
}


admissionDateInput.addEventListener(
    "input",
    function () {

        deadlineError.textContent = "";

        deadlineResult.textContent = "";

        deadlineResult.classList.remove(
            "is-success"
        );

        calculatedDaysLeft = null;
    }
);


deadlineCalculate.addEventListener(
    "click",
    function () {

        const admissionDate =
            admissionDateInput.value;


        if (admissionDate === "") {

            deadlineError.textContent =
                "목표 입학일을 선택해 주세요.";

            admissionDateInput.focus();

            return;
        }


        const targetDate =
            new Date(
                admissionDate + "T00:00:00"
            );

        const today =
            new Date();

        today.setHours(0, 0, 0, 0);


        if (targetDate <= today) {

            deadlineError.textContent =
                "오늘 이후의 입학 목표일을 선택해 주세요.";

            deadlineResult.textContent = "";

            calculatedDaysLeft = null;

            admissionDateInput.focus();

            return;
        }


        const oneDay =
            1000 * 60 * 60 * 24;


        calculatedDaysLeft =
            Math.ceil(
                (targetDate - today)
                / oneDay
            );


        const country =
            countryInput.value.trim();


        deadlineError.textContent = "";

        deadlineResult.textContent =
            country
            + " 유학 목표일까지 "
            + calculatedDaysLeft
            + "일 남았습니다.";


        deadlineResult.classList.add(
            "is-success"
        );
    }
);


planRestart.addEventListener(
    "click",
    resetDeadlinePlanner
);


// 9주차 - 유학 준비 플랜 입력 폼

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


const forcePlanFailure =
    new URLSearchParams(
        location.search
    ).has("plan-error");


function showSchoolError(message) {

    targetSchool.setAttribute(
        "aria-invalid",
        "true"
    );

    schoolError.textContent =
        message;

    schoolField.classList.remove(
        "is-valid"
    );

    schoolField.classList.add(
        "has-error"
    );

    return false;
}


function clearSchoolError() {

    targetSchool.removeAttribute(
        "aria-invalid"
    );

    schoolError.textContent = "";

    schoolField.classList.remove(
        "has-error"
    );

    updateSchoolExperience();
}


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


function updateSchoolExperience() {

    const length =
        targetSchool.value.length;

    const enough =
        targetSchool.value.trim()
            .length >= 2;

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

        schoolHelp.textContent =
            enough
                ? "입력 조건을 충족했습니다."
                : "학교명이나 관심 전공을 2자 이상 입력해 주세요.";
    }
}


function validateAdmissionTerm() {

    if (
        admissionTerm.value === ""
    ) {

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

        languageInputs.forEach(
            function (input) {

                input.checked = false;

                input.removeAttribute(
                    "aria-invalid"
                );
            }
        );

        languageError.textContent = "";
    }
}


function validateLanguage() {

    if (
        !languageOption.checked
    ) {

        return true;
    }


    const selectedLanguage =
        document.querySelector(
            'input[name="language-test"]:checked'
        );


    if (
        selectedLanguage === null
    ) {

        languageError.textContent =
            "준비할 어학 시험을 선택해 주세요.";

        languageInputs[0].setAttribute(
            "aria-invalid",
            "true"
        );

        return false;
    }


    languageInputs.forEach(
        function (input) {

            input.removeAttribute(
                "aria-invalid"
            );
        }
    );

    languageError.textContent = "";

    return true;
}


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
    planRestart.disabled = loading;
    planBack4.disabled = loading;


    studyPlanSave.textContent =
        loading
            ? "저장하는 중…"
            : "유학 준비 플랜 저장하기";


    studyPlanStatus.textContent =
        message;


    studyPlanStatus.classList.remove(
        "is-success",
        "is-error"
    );


    if (
        state === "success"
    ) {

        studyPlanStatus.classList.add(
            "is-success"
        );
    }


    if (
        state === "error"
    ) {

        studyPlanStatus.classList.add(
            "is-error"
        );
    }
}


function waitStudyPlan(
    milliseconds
) {

    return new Promise(
        function (resolve) {

            window.setTimeout(
                resolve,
                milliseconds
            );
        }
    );
}


// 저장된 플랜

let savedPlans =
    JSON.parse(
        localStorage.getItem(
            "studyPathSavedPlans"
        ) || "[]"
    );


function getCompletedItems() {

    const completedItems = [];


    prepareChecks.forEach(
        function (check) {

            if (check.checked) {

                completedItems.push(
                    check.value
                );
            }
        }
    );


    return completedItems;
}


function getPlanStatus(
    checkedCount
) {

    if (
        checkedCount === 0
    ) {

        return "준비 시작 전";
    }


    if (
        checkedCount === 3
    ) {

        return "체크리스트 완료";
    }


    return "준비 중";
}


async function saveStudyPlan(
    plan
) {

    const checkedCount =
        getCheckedCount();


    const savedPlan = {

        id: Date.now(),

        country:
            countryInput.value.trim(),

        completedItems:
            getCompletedItems(),

        checkedCount:
            checkedCount,

        planStatus:
            getPlanStatus(
                checkedCount
            ),

        admissionDate:
            admissionDateInput.value,

        daysLeft:
            calculatedDaysLeft,

        targetSchool:
            plan.targetSchool,

        admissionTerm:
            plan.admissionTerm,

        languagePreparation:
            plan.languagePreparation,

        languageTest:
            plan.languageTest
    };


    await waitStudyPlan(600);


    if (
        forcePlanFailure
    ) {

        throw new Error(
            "수업용 저장 실패"
        );
    }


    persistSavedPlans([savedPlan, ...savedPlans]);
    selectGoalFilter(goalFilterButtons[0]);
}


function persistSavedPlans(nextSavedPlans) {
    localStorage.setItem(
        "studyPathSavedPlans",
        JSON.stringify(nextSavedPlans)
    );
    savedPlans = nextSavedPlans;
}


// 10주차 필터

const goalFilterButtons =
    document.querySelectorAll(
        ".goal-filter"
    );

const goalCount =
    document.querySelector(
        "#goal-count"
    );

const goalEmpty =
    document.querySelector(
        "#goal-empty"
    );

const goalList =
    document.querySelector(
        "#goal-list"
    );

let currentGoalFilter = "all";


function getVisiblePlans() {

    if (
        currentGoalFilter
        === "all"
    ) {

        return savedPlans;
    }


    return savedPlans.filter(
        function (plan) {

            return plan.planStatus
                === currentGoalFilter;
        }
    );
}


function getPlanDdayText(
    admissionDate
) {

    const target =
        new Date(
            admissionDate
            + "T00:00:00"
        );

    const today =
        new Date();

    today.setHours(
        0,
        0,
        0,
        0
    );


    const oneDay =
        1000 * 60 * 60 * 24;


    const days =
        Math.ceil(
            (target - today)
            / oneDay
        );


    if (
        days > 0
    ) {

        return "D-" + days;
    }


    if (
        days === 0
    ) {

        return "D-Day";
    }


    return "D+"
        + Math.abs(days);
}


function renderSavedPlans() {

    const visiblePlans =
        getVisiblePlans();


    goalList.replaceChildren();


    goalCount.textContent =
        "현재 표시 중인 플랜 "
        + visiblePlans.length
        + "개";


    if (
        visiblePlans.length
        === 0
    ) {

        goalEmpty.hidden =
            false;

        goalList.hidden =
            true;


        const title =
            goalEmpty.querySelector(
                "h3"
            );

        const description =
            goalEmpty.querySelector(
                "p"
            );

        const action =
            goalEmpty.querySelector(
                "a"
            );


        if (
            savedPlans.length === 0
        ) {

            title.textContent =
                "아직 저장한 유학 준비 플랜이 없습니다.";

            description.textContent =
                "목표 국가와 준비 상태를 입력해 첫 번째 플랜을 만들어 보세요.";

            action.hidden = false;
        }
        else {

            title.textContent =
                "선택한 준비 상태의 플랜이 없습니다.";

            description.textContent =
                "다른 준비 상태를 선택해 보세요.";

            action.hidden = true;
        }


        return;
    }


    goalEmpty.hidden = true;

    goalList.hidden = false;


    visiblePlans.forEach(
        function (plan) {

            const card =
                document.createElement(
                    "article"
                );

            card.className =
                "goal-card";


            const title =
                document.createElement(
                    "h3"
                );

            title.textContent =
                plan.country
                + " · "
                + plan.targetSchool;


            const course =
                document.createElement(
                    "p"
                );

            course.textContent =
                "희망 유학 과정: "
                + plan.admissionTerm;


            const status =
                document.createElement(
                    "p"
                );

            status.textContent =
                "준비 상태: "
                + plan.planStatus
                + " · "
                + plan.checkedCount
                + " / 3";


            const date =
                document.createElement(
                    "p"
                );

            date.textContent =
                "목표 입학일: "
                + plan.admissionDate
                + " · "
                + getPlanDdayText(
                    plan.admissionDate
                );


            const completed =
                document.createElement(
                    "p"
                );

            completed.textContent =
                plan.completedItems
                    .length > 0
                    ? "완료한 준비: "
                      + plan.completedItems
                          .join(", ")
                    : "완료한 준비: 없음";


            const language =
                document.createElement(
                    "p"
                );

            language.textContent =
                plan.languagePreparation
                    ? "어학시험: "
                      + plan.languageTest
                    : "어학시험 목표: 미설정";


            const details = document.createElement("details");
            const summary = document.createElement("summary");
            summary.textContent = "플랜 상세 보기";
            details.append(summary, course, date, completed, language);

            const deleteButton = document.createElement("button");
            deleteButton.type = "button";
            deleteButton.textContent = "플랜 삭제";
            deleteButton.setAttribute("aria-label", title.textContent + " 플랜 삭제");
            deleteButton.addEventListener("click", function () {
                const actionStatus = document.querySelector("#goal-action-status");
                try {
                    persistSavedPlans(savedPlans.filter(function (savedPlan) {
                        return savedPlan !== plan;
                    }));
                } catch {
                    actionStatus.textContent = "플랜을 삭제하지 못했습니다. 다시 시도해 주세요.";
                    return;
                }

                renderSavedPlans();
                document.querySelector(".goal-filter.is-active").focus();
                actionStatus.textContent = title.textContent + " 플랜을 삭제했습니다.";
            });

            card.append(title, status, details, deleteButton);
            goalList.append(card);
        }
    );
}


function selectGoalFilter(button) {
    currentGoalFilter = button.dataset.filter;

    goalFilterButtons.forEach(function (item) {
        const selected = item === button;
        item.classList.toggle("is-active", selected);
        item.setAttribute("aria-pressed", String(selected));
    });

    document.querySelector("#goal-action-status").textContent = "";
    renderSavedPlans();
}

goalFilterButtons.forEach(function (button) {
    button.addEventListener("click", function () {
        selectGoalFilter(button);
    });
});


// 9주차 입력 상태

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


admissionTerm.addEventListener(
    "change",
    function () {

        if (
            admissionTerm.value
            !== ""
        ) {

            admissionTerm.removeAttribute(
                "aria-invalid"
            );

            termError.textContent = "";
        }
    }
);


languageOption.addEventListener(
    "change",
    syncLanguageFields
);


languageInputs.forEach(
    function (input) {

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


                languageError.textContent =
                    "";
            }
        );
    }
);


syncLanguageFields();


const viewSavedPlan = document.querySelector("#view-saved-plan");

planRestart.addEventListener("click", function () {
    studyPlanForm.reset();
    clearSchoolError();
    admissionTerm.removeAttribute("aria-invalid");
    termError.textContent = "";
    syncLanguageFields();
    setStudyPlanSubmitState(false, "", "");
    viewSavedPlan.hidden = true;
});

// 9주차 submit

studyPlanForm.addEventListener(
    "submit",
    async function (event) {

        event.preventDefault();
        if (studyPlanSave.disabled) return;
        viewSavedPlan.hidden = true;

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


        if (
            countryInput.value
                .trim() === ""
            || admissionDateInput
                .value === ""
            || calculatedDaysLeft
                === null
        ) {

            setStudyPlanSubmitState(
                false,
                "먼저 목표 국가와 목표 입학일을 설정하고 남은 준비 기간을 확인해 주세요.",
                "error"
            );

            window.location.hash =
                "#start";

            return;
        }


        const formData =
            new FormData(
                studyPlanForm
            );


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
            "유학 준비 플랜을 저장하고 있습니다.",
            ""
        );


        try {

            await saveStudyPlan(plan);
            viewSavedPlan.hidden = false;


            setStudyPlanSubmitState(
                false,
                plan.targetSchool
                + " 유학 준비 플랜을 저장했습니다.",
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


renderSavedPlans();

// 10주차 - 주요 메뉴

const navLinks =
    document.querySelectorAll(".main-nav a");

const menuToggle =
    document.querySelector("#menu-toggle");

const mainNav =
    document.querySelector("#main-nav");


function updateCurrentNav() {

    const currentHash =
        window.location.hash;

    navLinks.forEach(function (link) {

        const current =
            currentHash !== ""
                ? link.getAttribute("href")
                    === currentHash
                : link === navLinks[0];

        link.classList.toggle(
            "is-current",
            current
        );

        if (current) {
            link.setAttribute(
                "aria-current",
                "location"
            );
        }
        else {
            link.removeAttribute(
                "aria-current"
            );
        }
    });
}


window.addEventListener(
    "hashchange",
    updateCurrentNav
);

updateCurrentNav();

function setMenuOpen(open) {
    mainNav.classList.toggle("is-open", open);
    menuToggle.textContent = open ? "메뉴 닫기" : "메뉴 열기";
    menuToggle.setAttribute("aria-expanded", String(open));
}

menuToggle.addEventListener("click", function () {
    setMenuOpen(!mainNav.classList.contains("is-open"));
});

navLinks.forEach(function (link) {
    link.addEventListener("click", function () {
        if (mainNav.classList.contains("is-open")) {
            setMenuOpen(false);
            const destination = document.querySelector(link.hash);
            destination.setAttribute("tabindex", "-1");
            destination.focus({ preventScroll: true });
        }
    });
});

window.matchMedia("(max-width: 768px)").addEventListener("change", function () {
    setMenuOpen(false);
});
