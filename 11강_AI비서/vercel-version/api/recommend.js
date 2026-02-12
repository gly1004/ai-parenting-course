// Vercel Serverless Function - CommonJS 방식
module.exports = async function handler(req, res) {
    // CORS 설정
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    // 환경변수에서 API 키 읽기
    const apiKey = process.env.CLAUDE_API_KEY;

    if (!apiKey) {
        return res.status(500).json({ error: 'API key not configured. Please set CLAUDE_API_KEY in Vercel Environment Variables.' });
    }

    const { activity } = req.body;

    if (!activity) {
        return res.status(400).json({ error: 'Activity is required' });
    }

    const systemPrompt = `당신은 부모와 아이가 함께 활동할 때 유용한 AI 비서를 추천해주는 전문 컨설턴트입니다.

사용 가능한 AI 도구 목록:
- ChatGPT-4o (대화 및 논리 기획)
- Claude (대화 및 논리 기획)
- Perplexity (대화 및 논리 기획)
- Midjourney (이미지 생성)
- DALL-E 3 (이미지 생성)
- Adobe Firefly (이미지 생성)
- Canva (디자인)
- Looka (로고 디자인)
- LogoAI (로고 디자인)
- Gamma (프레젠테이션)
- Tome (프레젠테이션)
- Beautiful.ai (프레젠테이션)
- Napkin AI (시각화)
- Sora (영상 생성)
- HeyGen (영상 생성)
- Runway (영상 편집)
- Suno (음악 생성)
- ElevenLabs (음성 생성)
- GuideGeek (여행 계획)
- Roam Around (여행 계획)
- Tripnotes (여행 계획)
- Khanmigo (학습)
- Wolfram Alpha (학습/계산)
- Replit (코딩)
- Storybird (동화 제작)
- Notion AI (생산성)
- Otter.ai (기록)

사용자가 입력한 활동에 대해 가장 적합한 AI 비서 3-5개를 추천해 주세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트 없이 JSON만 출력하세요:

{
  "summary": "활동에 대한 한 줄 요약",
  "recommendations": [
    {
      "toolName": "도구 이름",
      "reason": "이 활동에 이 도구를 추천하는 이유 (2-3문장)",
      "howToUse": [
        "사용 방법 1단계",
        "사용 방법 2단계",
        "사용 방법 3단계"
      ],
      "activityGuide": "이 도구를 활용한 구체적인 활동 가이드 (3-4문장)",
      "parentTip": "부모가 아이와 함께 사용할 때 팁 (1-2문장)"
    }
  ]
}`;

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
                max_tokens: 2048,
                system: systemPrompt,
                messages: [{
                    role: 'user',
                    content: `다음 활동에 적합한 AI 비서를 추천해 주세요:\n\n${activity}`
                }]
            })
        });

        if (!response.ok) {
            const errorData = await response.text();
            console.error('Claude API Error:', errorData);
            return res.status(500).json({ error: 'Claude API request failed: ' + errorData });
        }

        const data = await response.json();
        const responseText = data.content[0].text;

        // Parse JSON
        let recommendations;
        try {
            recommendations = JSON.parse(responseText);
        } catch (e) {
            const jsonMatch = responseText.match(/\{[\s\S]*\}/);
            if (jsonMatch) {
                recommendations = JSON.parse(jsonMatch[0]);
            } else {
                console.error('Failed to parse response:', responseText);
                return res.status(500).json({ error: 'Failed to parse AI response' });
            }
        }

        return res.status(200).json(recommendations);

    } catch (error) {
        console.error('Server Error:', error);
        return res.status(500).json({ error: error.message });
    }
};
