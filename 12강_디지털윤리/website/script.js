// 질문 데이터
const questions = [
    {
        id: 1,
        category: "가짜 뉴스 판단",
        question: "친구가 단톡방에 '유명 연예인이 큰 사고를 당했다'는 뉴스를 공유했어.\n처음 보는 사이트인데, 너는 어떻게 할 거야?",
        options: [
            { text: "A) 다른 뉴스에서도 나오는지 먼저 확인해본다", score: 3 },
            { text: "B) 일단 다른 친구들에게도 공유한다", score: 1 },
            { text: "C) 그냥 무시하고 넘어간다", score: 2 }
        ],
        area: "정보판단"
    },
    {
        id: 2,
        category: "온라인에서 타인 존중",
        question: "온라인 게임에서 같은 팀원이 실수를 많이 해서 지고 있어.\n다른 팀원들이 그 친구에게 욕을 하고 있어. 넌 어떻게 할 거야?",
        options: [
            { text: "A) 나도 같이 욕한다, 짜증나니까", score: 1 },
            { text: "B) 그냥 게임에만 집중하고 모른 척한다", score: 2 },
            { text: "C) 욕하지 말자고 말하거나, 실수한 친구를 응원한다", score: 3 }
        ],
        area: "타인존중"
    },
    {
        id: 3,
        category: "개인정보 보호",
        question: "온라인에서 새로 알게 된 친구가 네 학교 이름, 반, 사는 동네를 물어봐.\n어떻게 할 거야?",
        options: [
            { text: "A) 친해지고 싶으니까 다 알려준다", score: 1 },
            { text: "B) 학교 이름 정도는 알려줘도 될 것 같다", score: 2 },
            { text: "C) 개인정보라서 알려주기 어렵다고 말한다", score: 3 }
        ],
        area: "프라이버시"
    },
    {
        id: 4,
        category: "AI 활용의 정직성",
        question: "내일까지 독후감을 제출해야 하는데 시간이 없어.\nChatGPT에게 대신 써달라고 하면 어떨까?",
        options: [
            { text: "A) AI가 써준 걸 그대로 내 이름으로 제출한다", score: 1 },
            { text: "B) AI가 써준 걸 참고만 하고, 내 생각으로 다시 쓴다", score: 3 },
            { text: "C) AI 도움을 받았다고 선생님께 솔직히 말하고 제출한다", score: 3 }
        ],
        area: "정직성"
    },
    {
        id: 5,
        category: "딥페이크 인식",
        question: "SNS에서 유명인이 이상한 발언을 하는 영상을 봤어.\n어떻게 할 거야?",
        options: [
            { text: "A) 충격적이니까 바로 친구들에게 공유한다", score: 1 },
            { text: "B) AI가 만든 가짜일 수 있으니 다른 곳에서 확인해본다", score: 3 },
            { text: "C) 재미있으니까 댓글을 단다", score: 2 }
        ],
        area: "정보판단"
    },
    {
        id: 6,
        category: "익명에서의 책임감",
        question: "익명 게시판에 올린 내 글 때문에 누군가 상처를 받았대.\n어떻게 생각해?",
        options: [
            { text: "A) 익명이니까 누가 쓴지 모르잖아, 상관없어", score: 1 },
            { text: "B) 조금 미안하긴 한데, 다들 그렇게 하니까...", score: 2 },
            { text: "C) 익명이라도 내가 한 말에 책임이 있어, 사과해야 해", score: 3 }
        ],
        area: "타인존중"
    },
    {
        id: 7,
        category: "저작권 존중",
        question: "학교 발표 자료를 만드는데, 인터넷에서 예쁜 그림을 찾았어.\n어떻게 할 거야?",
        options: [
            { text: "A) 그냥 복사해서 쓴다, 다들 그렇게 하니까", score: 1 },
            { text: "B) 출처를 적어서 누가 만든 건지 밝힌다", score: 3 },
            { text: "C) 저작권 무료 이미지를 찾거나 직접 그린다", score: 3 }
        ],
        area: "정직성"
    },
    {
        id: 8,
        category: "스스로 사용 시간 조절",
        question: "유튜브 보다 보니 벌써 3시간이 지났어. 부모님은 안 계셔.\n어떻게 할 거야?",
        options: [
            { text: "A) 부모님 없으니까 더 본다", score: 1 },
            { text: "B) 조금만 더 보다가 끈다", score: 2 },
            { text: "C) 내가 정한 시간이 됐으니까 끈다", score: 3 }
        ],
        area: "자기조절"
    },
    {
        id: 9,
        category: "AI에게 말하는 태도",
        question: "AI 챗봇이나 음성 비서(시리, 빅스비 등)에게 말할 때,\n어떻게 말해?",
        options: [
            { text: "A) 기계니까 반말하고 막 대해도 돼", score: 1 },
            { text: "B) 가끔은 예의 바르게, 가끔은 막 대한다", score: 2 },
            { text: "C) 기계여도 예의 바르게 말하는 게 좋은 습관이야", score: 3 }
        ],
        area: "자기조절"
    },
    {
        id: 10,
        category: "기술 사용 목적",
        question: "스마트폰이나 컴퓨터로 주로 뭘 하고 싶어?",
        options: [
            { text: "A) 게임이랑 유튜브 보는 거", score: 1 },
            { text: "B) 게임도 하고, 숙제할 때 검색도 해", score: 2 },
            { text: "C) 재미있는 것도 하고, 다른 사람 돕는 일에도 써보고 싶어", score: 3 }
        ],
        area: "사회기여"
    }
];

// 영역별 조언
const areaAdvice = {
    "정보판단": {
        title: "가짜 정보 구별하기",
        advice: "\"이 뉴스는 누가 썼을까? 왜 썼을까?\" 함께 질문하는 습관을 들이세요."
    },
    "타인존중": {
        title: "화면 너머의 사람",
        advice: "\"화면 너머에도 감정을 가진 사람이 있다\"는 것을 상기시켜 주세요."
    },
    "프라이버시": {
        title: "디지털 발자국",
        advice: "한 번 올린 정보는 지우기 힘들다는 '영구성'에 대해 대화하세요."
    },
    "정직성": {
        title: "정직한 기술 활용",
        advice: "AI 도움을 받았다고 밝히는 것이 진정한 실력임을 보여주세요."
    },
    "자기조절": {
        title: "스스로 조절하는 힘",
        advice: "부모가 시켜서가 아니라 스스로 정한 규칙의 중요성을 나눠보세요."
    },
    "사회기여": {
        title: "기술로 세상에 기여하기",
        advice: "기술을 통해 다른 사람을 도울 수 있는 방법을 함께 고민해 보세요."
    }
};

let currentQuestion = 0;
let answers = [];
let areaScores = {};

// 화면 전환
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// 테스트 시작
function startTest() {
    currentQuestion = 0;
    answers = [];
    areaScores = {
        "정보판단": { score: 0, max: 6 },
        "타인존중": { score: 0, max: 6 },
        "프라이버시": { score: 0, max: 3 },
        "정직성": { score: 0, max: 6 },
        "자기조절": { score: 0, max: 6 },
        "사회기여": { score: 0, max: 3 }
    };
    showScreen('question-screen');
    displayQuestion();
}

// 질문 표시
function displayQuestion() {
    const q = questions[currentQuestion];

    document.getElementById('current-q').textContent = currentQuestion + 1;
    document.getElementById('progress').style.width = ((currentQuestion) / 10 * 100) + '%';
    document.getElementById('category').textContent = '';
    document.getElementById('question').textContent = q.question;

    const optionsContainer = document.getElementById('options');
    optionsContainer.innerHTML = '';

    q.options.forEach((option, index) => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.textContent = option.text;
        btn.onclick = () => selectAnswer(index, option.score, q.area);
        optionsContainer.appendChild(btn);
    });
}

// 답변 선택
function selectAnswer(index, score, area) {
    answers.push({ questionId: currentQuestion + 1, score: score, area: area });
    areaScores[area].score += score;

    // 버튼 선택 효과
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    buttons[index].classList.add('selected');

    // 다음 질문으로
    setTimeout(() => {
        currentQuestion++;
        if (currentQuestion < questions.length) {
            displayQuestion();
        } else {
            showResults();
        }
    }, 300);
}

// 결과 표시
function showResults() {
    const totalScore = answers.reduce((sum, a) => sum + a.score, 0);

    document.getElementById('total-score').textContent = totalScore;
    document.getElementById('progress').style.width = '100%';

    // 부족한 영역 먼저 계산
    const areaNames = {
        "정보판단": "가짜뉴스/딥페이크 판단",
        "타인존중": "온라인 타인 존중",
        "프라이버시": "개인정보 보호",
        "정직성": "정직한 기술 활용",
        "자기조절": "자기 조절 능력",
        "사회기여": "기술의 사회적 활용"
    };

    let weakAreas = [];
    for (const [area, data] of Object.entries(areaScores)) {
        const percentage = (data.score / data.max) * 100;
        if (percentage < 80) {
            weakAreas.push(areaNames[area]);
        }
    }

    // 레벨 결정
    const levelEl = document.getElementById('result-level');
    const descEl = document.getElementById('result-description');
    const weakAreasBox = document.getElementById('weak-areas-box');

    if (totalScore >= 25) {
        levelEl.textContent = '디지털 윤리 리더';
        levelEl.className = 'result-level high';
        descEl.textContent = '훌륭합니다! 아이가 디지털 세상에서 올바른 가치관을 갖고 있습니다. 지속적인 대화로 이 태도를 강화해 주세요.';
    } else if (totalScore >= 18) {
        levelEl.textContent = '성장하는 디지털 시민';
        levelEl.className = 'result-level mid';
        descEl.textContent = '기본적인 인식은 있으나, 일부 영역에서 보완이 필요합니다.';
    } else {
        levelEl.textContent = '디지털 윤리 교육 필요';
        levelEl.className = 'result-level low';
        descEl.textContent = '디지털 윤리에 대한 가정 내 대화가 필요합니다. 아이와 함께 \'우리 가족 디지털 약속\'을 만들어보세요.';
    }

    // 보완 필요 영역 박스 표시
    if (weakAreas.length > 0) {
        const tagsHtml = weakAreas.map(area => `<span class="weak-area-tag">${area}</span>`).join('');
        weakAreasBox.innerHTML = `
            <h4>보완이 필요한 영역</h4>
            <div class="weak-areas-list">${tagsHtml}</div>
        `;
        weakAreasBox.classList.remove('hidden');
    } else {
        weakAreasBox.classList.add('hidden');
    }

    // 영역별 점수 표시
    const areaScoresEl = document.getElementById('area-scores');
    areaScoresEl.innerHTML = '';

    for (const [area, data] of Object.entries(areaScores)) {
        const percentage = (data.score / data.max) * 100;
        let scoreClass = 'high';
        if (percentage < 50) scoreClass = 'low';
        else if (percentage < 80) scoreClass = 'mid';

        areaScoresEl.innerHTML += `
            <div class="area-item">
                <span class="area-name">${areaNames[area]}</span>
                <span class="area-score ${scoreClass}">${data.score} / ${data.max}점</span>
            </div>
        `;
    }

    // 조언 섹션
    const adviceEl = document.getElementById('advice-section');
    adviceEl.innerHTML = '';

    let hasAdvice = false;
    for (const [area, data] of Object.entries(areaScores)) {
        const percentage = (data.score / data.max) * 100;
        if (percentage < 80) {
            hasAdvice = true;
            const advice = areaAdvice[area];
            adviceEl.innerHTML += `
                <div class="advice-item">
                    <h4>${advice.title}</h4>
                    <p>${advice.advice}</p>
                </div>
            `;
        }
    }

    if (!hasAdvice) {
        adviceEl.innerHTML = '<p class="no-advice">모든 영역에서 좋은 점수를 받았습니다! 계속 좋은 습관을 유지하세요.</p>';
    }

    showScreen('result-screen');
}

// 다시 시작
function restartTest() {
    showScreen('start-screen');
}
