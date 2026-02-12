import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { immersion, learning, satisfaction } = await request.json();

    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key not configured' },
        { status: 500 }
      );
    }

    const prompt = `당신은 아동 발달 및 강점 심리학 전문가입니다. 부모가 관찰한 아이의 활동을 바탕으로 아이의 강점 지능을 분석해주세요.

## 부모가 관찰한 내용:

1. 자발적으로 몰입하는 활동: ${immersion || '(작성하지 않음)'}

2. 빨리 배우는 것: ${learning || '(작성하지 않음)'}

3. 할 때 활력이 넘치는 활동: ${satisfaction || '(작성하지 않음)'}

## 분석 가능한 강점 지능 목록:
- 언어 지능: 말하기, 글쓰기, 읽기, 스토리텔링
- 논리수학 지능: 수학, 과학, 논리적 사고, 문제해결
- 공간시각 지능: 그림, 디자인, 건축, 레고, 퍼즐
- 음악 지능: 노래, 악기, 리듬, 작곡
- 신체운동 지능: 운동, 춤, 손재주, 연기
- 대인관계 지능: 소통, 리더십, 협동, 공감
- 자기이해 지능: 자기성찰, 감정이해, 독립심
- 자연탐구 지능: 동식물, 자연관찰, 환경
- 창의 지능: 새로운 아이디어, 독창성, 상상력
- 감성 지능: 감정조절, 공감능력, 정서적 안정
- 추진력 지능: 목표달성, 끈기, 실행력
- 분석 지능: 데이터 분석, 패턴 인식, 논리적 분해
- 리더십 지능: 조직 이끌기, 결정력, 영향력
- 적응력 지능: 변화 대응, 유연성, 회복탄력성
- 문제해결 지능: 창의적 해결책, 위기 대처

## 응답 형식 (반드시 아래 JSON 형식으로만 응답):
{
  "intelligences": [
    {
      "name": "강점 지능 이름",
      "icon": "적절한 이모지 1개",
      "description": "이 강점 지능에 대한 설명 (2-3문장)",
      "traits": ["특성1", "특성2", "특성3"],
      "encouragement": "이 강점을 가진 아이를 위한 부모 격려 메시지 (2-3문장)"
    }
  ],
  "quote": {
    "text": "분석된 강점 지능과 관련된 유명인의 명언 (한국어로)",
    "author": "명언을 한 사람의 이름 (한국어로)"
  }
}

## 규칙:
1. 반드시 1~2개의 가장 관련성 높은 강점 지능만 선택하세요.
2. 부모가 작성한 내용을 근거로 분석하세요.
3. 격려 메시지는 따뜻하고 구체적으로 작성하세요.
4. 명언은 분석된 강점 지능과 관련이 있어야 합니다. 예를 들어:
   - 음악 지능 → 베토벤, 모차르트 등 음악가의 명언
   - 과학/논리 지능 → 아인슈타인, 뉴턴 등 과학자의 명언
   - 예술/창의 지능 → 피카소, 레오나르도 다빈치 등 예술가의 명언
   - 리더십 지능 → 링컨, 간디 등 리더의 명언
   - 운동 지능 → 마이클 조던, 김연아 등 운동선수의 명언
5. 실제로 존재하는 유명인의 실제 명언을 사용하세요.
6. JSON 형식 외의 다른 텍스트는 출력하지 마세요.`;

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        messages: [
          {
            role: 'user',
            content: prompt,
          },
        ],
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Claude API error:', errorData);
      return NextResponse.json(
        { error: 'AI 분석 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    const data = await response.json();
    const content = data.content[0].text;

    // Parse the JSON response from Claude
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: '분석 결과를 파싱할 수 없습니다.' },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);

  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: '서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
}
