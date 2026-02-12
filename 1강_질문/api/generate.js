export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // OPTIONS 요청 처리 (CORS preflight)
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // POST만 허용
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { situation } = req.body;

    if (!situation) {
        return res.status(400).json({ error: '상황을 입력해주세요.' });
    }

    // 환경변수에서 API 키 가져오기
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });
    }

    try {
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': apiKey,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `다음 상황에 대해 부모가 아이에게 던질 수 있는 3단계 질문을 생성해주세요.

상황: "${situation}"

아래 프레임워크에 따라 각 단계별로 1개씩, 총 3개의 질문을 만들어주세요:

1단계: 가정하기 (What if?) - 당연함을 의심하고 가정을 통해 새로운 관점을 열어주는 질문
2단계: 본질 찾기 (Why?) - 아이의 생각 뒤에 숨은 진짜 이유를 찾게 하는 질문
3단계: 관점 전환 (Perspective) - 다른 사람의 입장에서 생각해보게 하는 질문

응답은 반드시 다음 JSON 형식으로만 작성해주세요:
{
  "question1": "1단계 질문",
  "question2": "2단계 질문",
  "question3": "3단계 질문"
}

질문은 자연스럽고 따뜻한 대화체로 작성하며, 아이의 나이에 맞게 이해하기 쉬운 언어를 사용하세요.`
                }]
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error?.message || 'API 요청 실패');
        }

        // Claude 응답에서 텍스트 추출
        const textContent = data.content
            .filter(item => item.type === 'text')
            .map(item => item.text)
            .join('');

        // JSON 파싱
        const cleanText = textContent.replace(/```json|```/g, '').trim();
        const questions = JSON.parse(cleanText);

        return res.status(200).json(questions);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({
            error: '질문 생성 중 오류가 발생했습니다: ' + error.message
        });
    }
}
