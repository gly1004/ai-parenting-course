export default async function handler(req, res) {
    // CORS 헤더 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const API_KEY = process.env.ANTHROPIC_API_KEY;

    if (!API_KEY) {
        return res.status(500).json({ error: 'API key not configured' });
    }

    try {
        const { situation, systemPrompt } = req.body;

        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-5-5',
                max_tokens: 4096,
                messages: [
                    {
                        role: 'user',
                        content: `아이의 실패 상황: ${situation}\n\n위 상황에 대해 3단계 질문법 가이드를 JSON 형식으로 제공해주세요.`
                    }
                ],
                system: systemPrompt
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            return res.status(response.status).json({ error: errorData.error?.message || 'API 요청 실패' });
        }

        const data = await response.json();
        // 텍스트 응답만 전달 (최신 모델은 thinking 블록이 먼저 올 수 있음)
        data.content = data.content.filter(block => block.type === 'text');
        return res.status(200).json(data);

    } catch (error) {
        console.error('Error:', error);
        return res.status(500).json({ error: error.message || '서버 오류가 발생했습니다.' });
    }
}
