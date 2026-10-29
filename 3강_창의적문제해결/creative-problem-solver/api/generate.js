const Anthropic = require("@anthropic-ai/sdk").default;

module.exports = async (req, res) => {
  // CORS 헤더 설정
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { situation } = req.body;

  if (!situation) {
    return res.status(400).json({ error: "문제 상황을 입력해주세요." });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return res.status(500).json({ error: "API 키가 설정되지 않았습니다." });
  }

  const prompt = `당신은 부모의 육아 고민을 창의적으로 해결해주는 전문가입니다.

아래 문제 상황에 대해 "분석-연결-재구성" 3단계로 구체적이고 실용적인 해결 아이디어를 제시해주세요.

[문제 상황]
${situation}

다음 형식으로 답변해주세요. 각 단계는 구체적인 실례와 실천 방법을 포함해야 합니다:

[분석]
- 👀 이모지로 시작
- 실제로 관찰할 수 있는 구체적인 상황 묘사 (시간, 장소, 패턴, 숫자 등)
- "문제의 핵심:" 으로 표면적 문제 뒤에 숨겨진 진짜 원인을 한 문장으로 정리

[연결]
- 💡 이모지로 시작
- 전혀 다른 분야(마트, 앱, 게임, 호텔, 회사 등)의 구체적인 해결 사례 연결
- "핵심 원리:" 로 배울 점을 한 문장으로 정리

[재구성]
- 🛠️ [실천 방법] 으로 시작
- 준비물: (구체적인 물품과 예상 비용)
- 번호 매긴 단계별 설명 (①②③)
- 🎮 아이와 함께: 로 끝내며 아이와 함께 할 수 있는 활동 제안

각 섹션은 반드시 [분석], [연결], [재구성]으로 시작해주세요.`;

  try {
    const client = new Anthropic({ apiKey });

    const message = await client.messages.create({
      model: "claude-sonnet-5-5",
      max_tokens: 4096,
      messages: [{ role: "user", content: prompt }],
    });

    const content = (message.content.find((block) => block.type === "text")?.text || "").replace(/\*\*/g, "");

    // 응답 파싱
    const analysisMatch = content.match(/\[분석\]([\s\S]*?)(?=\[연결\]|$)/);
    const connectionMatch = content.match(/\[연결\]([\s\S]*?)(?=\[재구성\]|$)/);
    const restructureMatch = content.match(/\[재구성\]([\s\S]*?)$/);

    return res.status(200).json({
      analysis: analysisMatch ? analysisMatch[1].trim() : "분석 결과를 불러올 수 없습니다.",
      connection: connectionMatch ? connectionMatch[1].trim() : "연결 결과를 불러올 수 없습니다.",
      restructure: restructureMatch ? restructureMatch[1].trim() : "재구성 결과를 불러올 수 없습니다.",
    });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: error.message || "API 요청 중 오류가 발생했습니다." });
  }
};
