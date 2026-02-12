"use client";

import { useState } from "react";

type Intelligence = {
  name: string;
  icon: string;
  description: string;
  traits: string[];
  encouragement: string;
};

type Quote = {
  text: string;
  author: string;
};

type Step = "intro" | "questions" | "loading" | "result";

const fallbackQuote: Quote = {
  text: "성공은 최종적인 것이 아니며, 실패는 치명적인 것이 아니다. 중요한 것은 계속하려는 용기다.",
  author: "윈스턴 처칠 (Winston Churchill)"
};

const fallbackIntelligences: Intelligence[] = [
  {
    name: "언어 지능",
    icon: "📚",
    description: "말과 글로 세상을 이해하고 표현하는 능력이 뛰어납니다.",
    traits: ["풍부한 어휘력", "이야기 만들기를 좋아함", "설득력 있는 말하기", "책 읽기를 즐김"],
    encouragement: "다양한 책을 접하게 해주시고, 아이의 이야기에 귀 기울여 주세요. 일기 쓰기나 동화 만들기도 좋습니다."
  },
  {
    name: "논리수학 지능",
    icon: "🧮",
    description: "숫자와 논리적 사고로 문제를 해결하는 능력이 뛰어납니다.",
    traits: ["패턴 찾기를 좋아함", "질문이 많음", "계산을 즐김", "체계적인 사고"],
    encouragement: "퍼즐, 보드게임, 코딩 등을 경험하게 해주세요. '왜?'라는 질문에 함께 답을 찾아가 주세요."
  },
  {
    name: "공간 지능",
    icon: "🎨",
    description: "공간과 이미지를 인식하고 창조하는 능력이 뛰어납니다.",
    traits: ["그림 그리기를 좋아함", "길을 잘 찾음", "조립을 잘함", "상상력이 풍부함"],
    encouragement: "레고, 그림 그리기, 만들기 활동을 충분히 하게 해주세요. 미술관 방문도 좋은 자극이 됩니다."
  }
];

export default function Home() {
  const [step, setStep] = useState<Step>("intro");
  const [activities, setActivities] = useState({
    immersion: "",
    learning: "",
    satisfaction: ""
  });
  const [detectedIntelligences, setDetectedIntelligences] = useState<Intelligence[]>([]);
  const [quote, setQuote] = useState<Quote>(fallbackQuote);
  const [error, setError] = useState<string>("");

  // 화면 전환 시 스크롤을 맨 위로 이동
  const goToStep = (newStep: Step) => {
    setStep(newStep);
    window.scrollTo({ top: 0, behavior: "instant" });
  };

  const analyzeWithAI = async () => {
    goToStep("loading");
    setError("");

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          immersion: activities.immersion,
          learning: activities.learning,
          satisfaction: activities.satisfaction,
        }),
      });

      if (!response.ok) {
        throw new Error('분석 중 오류가 발생했습니다.');
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      if (data.intelligences && data.intelligences.length > 0) {
        setDetectedIntelligences(data.intelligences);
      } else {
        // Fallback if AI returns empty
        setDetectedIntelligences([fallbackIntelligences[0], fallbackIntelligences[2]]);
      }

      // Set quote from AI response
      if (data.quote && data.quote.text && data.quote.author) {
        setQuote(data.quote);
      } else {
        setQuote(fallbackQuote);
      }

      goToStep("result");
    } catch (err) {
      console.error('Analysis error:', err);
      setError(err instanceof Error ? err.message : '분석 중 오류가 발생했습니다.');
      // Use fallback on error
      setDetectedIntelligences([fallbackIntelligences[0], fallbackIntelligences[2]]);
      setQuote(fallbackQuote);
      goToStep("result");
    }
  };

  const handleAnalyze = () => {
    analyzeWithAI();
  };

  const restart = () => {
    goToStep("intro");
    setActivities({ immersion: "", learning: "", satisfaction: "" });
    setDetectedIntelligences([]);
    setQuote(fallbackQuote);
    setError("");
  };

  const hasAnyInput = activities.immersion.trim() || activities.learning.trim() || activities.satisfaction.trim();

  const filledCount = [activities.immersion, activities.learning, activities.satisfaction].filter(a => a.trim()).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Intro Screen */}
      {step === "intro" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl text-center">
            <div className="mb-8">
              <span className="inline-block px-4 py-2 bg-teal-500/20 text-teal-400 rounded-full text-sm font-medium mb-6">
                마음 근육 키우기
              </span>
              <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
                내 아이의 <span className="text-teal-400">강점 지능</span> 찾기
              </h1>
              <p className="text-xl text-gray-300 mb-2">
                &quot;아이가 가장 자기다워 보일 때가 언제인가요?&quot;
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-2xl p-8 mb-8 backdrop-blur-sm border border-slate-700">
              <p className="text-gray-300 mb-6 leading-relaxed">
                실패해도 다시 일어서는 아이는 <span className="text-teal-400 font-semibold">자신이 잘하는 것</span>을 명확히 압니다.
                <br /><br />
                아이가 <span className="text-teal-400 font-semibold">시간 가는 줄 모르고 몰입</span>하거나,
                <span className="text-teal-400 font-semibold"> 유난히 빨리 배우</span>거나,
                <span className="text-teal-400 font-semibold"> 눈빛이 반짝이는</span> 순간을 떠올려 보세요.
                <br /><br />
                그 모습 속에 아이의 <span className="text-teal-400 font-semibold">강점 지능</span>이 숨어 있습니다.
              </p>

              <div className="grid md:grid-cols-3 gap-4 text-left">
                <div className="bg-slate-700/50 rounded-xl p-5">
                  <div className="text-3xl mb-3">⏳</div>
                  <h3 className="text-teal-400 font-semibold mb-2">자발적 몰입</h3>
                  <p className="text-gray-400 text-sm">시키지 않아도 스스로 빠져드는 활동이 있나요?</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-5">
                  <div className="text-3xl mb-3">💡</div>
                  <h3 className="text-teal-400 font-semibold mb-2">빠른 학습</h3>
                  <p className="text-gray-400 text-sm">유난히 빨리 배우는 것이 있나요?</p>
                </div>
                <div className="bg-slate-700/50 rounded-xl p-5">
                  <div className="text-3xl mb-3">😊</div>
                  <h3 className="text-teal-400 font-semibold mb-2">만족감</h3>
                  <p className="text-gray-400 text-sm">할 때 눈빛이 살아나는 활동이 있나요?</p>
                </div>
              </div>
            </div>

            <button
              onClick={() => goToStep("questions")}
              className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-teal-500/25"
            >
              강점 지능 찾기 시작
            </button>
          </div>
        </div>
      )}

      {/* Questions Screen - All in One Page */}
      {step === "questions" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-white mb-2">
                아이의 모습을 떠올려 보세요
              </h1>
              <p className="text-gray-400">
                아래 질문 중 <span className="text-teal-400">최소 1개 이상</span> 작성해 주세요
              </p>
            </div>

            {/* Question 1 */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⏳</span>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded text-xs mb-1">
                    자발적 몰입
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    시간 가는 줄 모르고 빠져드는 활동은?
                  </h2>
                </div>
              </div>
              <textarea
                value={activities.immersion}
                onChange={(e) => setActivities({ ...activities, immersion: e.target.value })}
                placeholder="예: 레고 조립, 공룡 책 읽기, 그림 그리기, 춤추기..."
                className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors resize-none text-sm"
              />
            </div>

            {/* Question 2 */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700 mb-4">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">💡</span>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded text-xs mb-1">
                    빠른 학습
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    유난히 빨리 배우는 것은?
                  </h2>
                </div>
              </div>
              <textarea
                value={activities.learning}
                onChange={(e) => setActivities({ ...activities, learning: e.target.value })}
                placeholder="예: 노래 가사 외우기, 퍼즐 맞추기, 자전거 타기..."
                className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors resize-none text-sm"
              />
            </div>

            {/* Question 3 */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">😊</span>
                <div>
                  <span className="inline-block px-2 py-0.5 bg-teal-500/20 text-teal-400 rounded text-xs mb-1">
                    만족감
                  </span>
                  <h2 className="text-lg font-semibold text-white">
                    눈빛이 살아나고 활력이 넘치는 활동은?
                  </h2>
                </div>
              </div>
              <textarea
                value={activities.satisfaction}
                onChange={(e) => setActivities({ ...activities, satisfaction: e.target.value })}
                placeholder="예: 친구들과 놀기, 축구하기, 피아노 연주하기..."
                className="w-full h-24 px-4 py-3 bg-slate-700/50 border border-slate-600 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-teal-500 transition-colors resize-none text-sm"
              />
            </div>

            {/* Status & Button */}
            <div className="text-center">
              <p className="text-gray-400 text-sm mb-4">
                {filledCount > 0 ? (
                  <span className="text-teal-400">{filledCount}개 질문 작성됨</span>
                ) : (
                  "최소 1개 이상 작성해 주세요"
                )}
              </p>
              <button
                onClick={handleAnalyze}
                disabled={!hasAnyInput}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-600 disabled:bg-slate-600 disabled:cursor-not-allowed text-white font-semibold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-teal-500/25"
              >
                강점 지능 분석하기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Loading Screen */}
      {step === "loading" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="text-center">
            <div className="mb-8">
              <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-teal-500 border-t-transparent"></div>
            </div>
            <h2 className="text-2xl font-bold text-white mb-4">
              AI가 분석 중입니다
            </h2>
            <p className="text-gray-400">
              아이의 강점 지능을 찾고 있어요...
            </p>
          </div>
        </div>
      )}

      {/* Result Screen */}
      {step === "result" && (
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12">
          <div className="max-w-2xl w-full">
            <div className="text-center mb-8">
              <span className="inline-block px-4 py-2 bg-teal-500/20 text-teal-400 rounded-full text-sm font-medium mb-4">
                분석 완료
              </span>
              <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                우리 아이의 <span className="text-teal-400">강점 지능</span>
              </h1>
              <p className="text-gray-400">
                아이에게서 발견된 빛나는 능력입니다
              </p>
              {error && (
                <p className="text-amber-400 text-sm mt-2">
                  (AI 분석 중 문제가 발생하여 기본 결과를 표시합니다)
                </p>
              )}
            </div>

            {/* Recorded Activities */}
            <div className="bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border border-slate-700 mb-6">
              <h3 className="text-teal-400 font-semibold mb-4">기록된 아이의 모습</h3>
              <div className="space-y-3 text-sm">
                {activities.immersion && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">⏳</span>
                    <div>
                      <span className="text-gray-400">몰입하는 활동: </span>
                      <span className="text-white">{activities.immersion}</span>
                    </div>
                  </div>
                )}
                {activities.learning && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                      <span className="text-gray-400">빨리 배우는 것: </span>
                      <span className="text-white">{activities.learning}</span>
                    </div>
                  </div>
                )}
                {activities.satisfaction && (
                  <div className="flex items-start gap-3">
                    <span className="text-xl">😊</span>
                    <div>
                      <span className="text-gray-400">활력이 넘치는 활동: </span>
                      <span className="text-white">{activities.satisfaction}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Detected Intelligences - Max 2 */}
            <div className="space-y-4 mb-8">
              {detectedIntelligences.map((intel, idx) => (
                <div
                  key={idx}
                  className={`bg-slate-800/50 rounded-2xl p-6 backdrop-blur-sm border ${idx === 0 ? 'border-teal-500' : 'border-slate-700'}`}
                >
                  {idx === 0 && (
                    <span className="inline-block px-3 py-1 bg-teal-500/20 text-teal-400 rounded-full text-xs mb-3">
                      가장 두드러지는 강점
                    </span>
                  )}
                  <div className="flex items-center gap-4 mb-4">
                    <span className="text-4xl">{intel.icon}</span>
                    <div>
                      <h3 className="text-xl font-bold text-white">{intel.name}</h3>
                      <p className="text-gray-400 text-sm">{intel.description}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <p className="text-gray-400 text-sm mb-2">이런 특성이 있어요</p>
                    <div className="flex flex-wrap gap-2">
                      {intel.traits.map((trait, i) => (
                        <span key={i} className="px-3 py-1 bg-slate-700/50 text-gray-300 rounded-full text-sm">
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="bg-teal-500/10 rounded-xl p-4 border border-teal-500/20">
                    <p className="text-teal-300 text-sm">
                      <span className="font-semibold">부모님께:</span> {intel.encouragement}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Tips */}
            <div className="bg-slate-800/50 rounded-2xl p-8 backdrop-blur-sm border border-slate-700 mb-8">
              <h3 className="text-xl font-bold text-white mb-4">
                강점 연결 대화 예시
              </h3>
              <div className="bg-slate-700/30 rounded-xl p-5 mb-4">
                <p className="text-gray-300 leading-relaxed">
                  &quot;너 {(activities.immersion || activities.learning || activities.satisfaction).split(/[,，]/)[0]?.trim() || '그 활동'} 할 때 정말 집중하더라?
                  <br />
                  <span className="text-teal-400 font-semibold">{detectedIntelligences[0]?.name || '특별한 능력'}</span>이 정말 대단해!&quot;
                </p>
              </div>
              <p className="text-gray-400 text-sm">
                아이는 자신의 능력을 인지하면, 어려운 문제를 만날 때 이 &apos;강점&apos;을 꺼내 씁니다.
              </p>
            </div>

            {/* Quote */}
            <div className="text-center mb-8 py-6">
              <p className="text-xl md:text-2xl text-white font-light italic leading-relaxed">
                &quot;{quote.text}&quot;
              </p>
              <p className="text-gray-400 mt-4 text-sm">
                - {quote.author}
              </p>
            </div>

            <div className="text-center">
              <button
                onClick={restart}
                className="px-8 py-4 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-full text-lg transition-all transform hover:scale-105 shadow-lg shadow-teal-500/25"
              >
                다시 시작하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
