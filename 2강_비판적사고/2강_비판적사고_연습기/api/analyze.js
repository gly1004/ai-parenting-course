export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { userInput } = req.body;
  if (!userInput || userInput.trim().length === 0) {
    return res.status(400).json({ error: '분석할 내용을 입력해주세요.' });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return res.status(500).json({ error: 'API 키가 설정되지 않았습니다.' });

  const systemPrompt = `당신은 비판적 사고 교육 전문가입니다. 사용자가 입력한 정보나 상황에 대해 비판적 사고의 4대 요소로 분석하여 가이드해주세요.

반드시 아래 JSON 형식으로만 응답하세요. 다른 텍스트는 포함하지 마세요.

{
  "analysis": {
    "title": "분석 (Analysis)",
    "icon": "🔍",
    "question": "이 말의 핵심 성분은 무엇인가?",
    "content": "전달된 정보의 구조를 해체하여 팩트와 주장을 구분하는 분석 내용 (3-4문장)"
  },
  "evaluation": {
    "title": "평가 (Evaluation)",
    "icon": "⚖️",
    "question": "이 말은 믿을 만한 근거가 있는가?",
    "content": "정보의 출처 신뢰성, 논리적 모순 여부를 검증하는 내용 (3-4문장)"
  },
  "inference": {
    "title": "추론 (Inference)",
    "icon": "🔮",
    "question": "이 정보가 실현된다면 어떤 일이 벌어질까?",
    "content": "드러나지 않은 행간의 의미와 미래 영향을 예측하는 내용 (3-4문장)"
  },
  "reflection": {
    "title": "성찰 (Reflection)",
    "icon": "🪞",
    "question": "내가 보고 싶은 것만 보고 있지는 않은가?",
    "content": "자신의 편향이나 고정관념 개입 여부를 점검하는 내용 (3-4문장)"
  },
  "myPerspective": "4가지 요소를 종합하여 도출한 '나만의 관점' 한 문장 (따옴표 포함)"
}

주의사항:
- 각 요소의 content는 해당 정보/상황에 맞게 구체적으로 작성
- 쉽고 이해하기 쉬운 한국어로 작성
- 부모와 아이가 함께 읽을 수 있는 수준으로 작성
- 반드시 유효한 JSON만 반환`;

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-5-20250929',
        max_tokens: 2000,
        system: systemPrompt,
        messages: [
          { role: 'user', content: userInput }
        ]
      })
    });

    if (!response.ok) {
      console.error('Claude API error:', await response.text());
      return res.status(500).json({ error: 'AI 분석 중 오류가 발생했습니다.' });
    }

    const data = await response.json();
    const content = data.content[0].text;

    let parsed;
    try {
      parsed = JSON.parse(content);
    } catch {
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid JSON response');
      }
    }

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ error: 'AI 분석 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.' });
  }
}
