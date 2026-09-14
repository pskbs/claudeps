import Anthropic from "@anthropic-ai/sdk";

/**
 * Anthropic API(ANTHROPIC_API_KEY)로 짧은 텍스트를 생성한다.
 * 배포 환경(Vercel 서버리스)에는 로컬 Claude Code CLI가 없어서 child_process 호출은
 * 항상 실패하고 매번 동일한 fallback 문구만 보였다 — 그래서 이 파일을 API 호출로 교체했다.
 * getSajuFortune / getEveningFeedback의 시그니처는 그대로 유지한다.
 */

const MODEL = "claude-opus-5";

let cachedClient: Anthropic | undefined;

function getClient(): Anthropic | undefined {
  if (!process.env.ANTHROPIC_API_KEY) return undefined;
  if (!cachedClient) cachedClient = new Anthropic();
  return cachedClient;
}

async function askClaude(prompt: string): Promise<{ ok: true; text: string } | { ok: false; error: string }> {
  const client = getClient();
  if (!client) {
    return { ok: false, error: "ANTHROPIC_API_KEY가 설정되지 않았어요." };
  }

  try {
    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 1024,
      output_config: { effort: "low" },
      messages: [{ role: "user", content: prompt }],
    });

    const textBlock = response.content.find(
      (block): block is Anthropic.TextBlock => block.type === "text"
    );
    if (!textBlock || !textBlock.text.trim()) {
      return { ok: false, error: "빈 응답을 받았어요." };
    }
    return { ok: true, text: textBlock.text.trim() };
  } catch (err) {
    return { ok: false, error: `Claude API 호출 실패: ${String(err)}` };
  }
}

export async function getSajuFortune(params: {
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  birthHour?: number;
  today: string;
}): Promise<string> {
  const { birthYear, birthMonth, birthDay, birthHour, today } = params;

  const parts: string[] = [`태어난 해: ${birthYear}년`];
  if (birthMonth) parts.push(`태어난 월: ${birthMonth}월`);
  if (birthDay) parts.push(`태어난 일: ${birthDay}일`);
  if (birthHour !== undefined) parts.push(`태어난 시: ${birthHour}시`);

  const prompt = `너는 여행 가이드처럼 오늘 하루의 인생사주를 전해주는 캐릭터야.
사용자의 오늘 하루를 "여행"에 비유해서 아래 형식을 그대로 채워줘.
라벨과 이모지는 그대로 유지해줘.
"행동" 항목은 실제 여행 중 마주칠 법한 구체적인 행동으로 15자 내외로 짧게 써줘.
"사람" 항목은 아래 세 가지 묘사 방식을 매번 다르게 섞어서 써줘 (매번 같은 방식만 반복하지 말 것):
1) 성격/특징으로 묘사 — 예: "말을 자주 끊는 사람", "눈을 잘 안 마주치는 사람"
2) 나와의 관계로 묘사 — 예: "오랜만에 연락 온 친구", "잔소리하는 직장 상사 같은 사람", "낯선 사람"
3) 마주치는 구체적 상황으로 묘사 — 예: "버스 세 번째 정류장에서 탄 사람", "엘리베이터에서 마주친 사람", "카페 옆자리에 앉은 사람"
읽는 사람이 "아, 이런 사람은 조심해야지" 혹은 "이런 사람에게는 다가가봐야지" 하고 바로 떠올릴 수 있을 만큼
구체적이고 생생하게 써줘. 모르는 사람이어도 괜찮아. 15~20자 내외로 써줘.
"기운", "운세 흐름" 같은 추상적인 표현은 쓰지 말고, 오늘 하루를 여행하듯 살아갈 때 실용적인 조언이 되도록 써줘.
매번 다른 표현을 써야 해 — 뻔하거나 이전에 흔히 쓰였을 법한 문구("서두르지 마세요", "여유를 가지세요" 류)는 피하고,
오늘 날짜와 생년월일 조합에서만 나올 법한 참신하고 구체적인 이미지를 골라줘.
정보가 부족하면 있는 정보만으로 일반적인 오늘의 조언을 채워줘. 너무 무겁거나 부정적인 표현은 피해줘.
아래 형식 그대로, 설명이나 서론 없이 결과만 출력해줘.

🚧 오늘 조심할 것
- 행동: (조심할 행동 한 가지)
- 사람: (조심할 사람 유형 한 가지)

🧭 오늘 추천할 것
- 행동: (하면 좋을 행동 한 가지)
- 사람: (만나면 좋을 사람 유형 한 가지)

[사용자 정보]
${parts.join("\n")}
오늘 날짜: ${today}`;

  const result = await askClaude(prompt);
  if (result.ok) return result.text;
  return `🚧 오늘 조심할 것
- 행동: 너무 서두르는 것
- 사람: 나를 재촉하는 사람

🧭 오늘 추천할 것
- 행동: 잠깐 숨 고르기
- 사람: 편안한 사람과의 대화`;
}

export async function getEveningFeedback(params: {
  keyword: string;
  detail?: string;
}): Promise<string> {
  const { keyword, detail } = params;

  const prompt = `너는 따뜻하고 다정한 친구 같은 캐릭터야.
사용자가 오늘 하루를 "키워드 한 단어"로 표현하고, 선택적으로 짧은 추가 설명을 남길 거야.
이걸 보고 "아, 내 얘기를 진짜 알아듣고 하는 말이구나"라는 느낌이 들 정도로,
키워드(그리고 추가 설명이 있다면 그 내용까지) 안에 담긴 감정과 상황을 구체적으로 짚어서
공감해주는 2~3줄짜리 짧고 따뜻한 피드백을 써줘.

규칙:
- 키워드와 추가 설명에 나온 단어나 상황을 자연스럽게 한 번은 언급해서, 뻔한 위로가 아니라 이 사람만을 위한 말처럼 느껴지게 해줘.
- "위로", "응원", "실용적인 조언" 중 상황에 가장 어울리는 톤을 골라줘.
- 추가 설명이 없으면 키워드 자체의 뉘앙스(글자에서 느껴지는 감정)에 집중해서 공감해줘.
- 같은 키워드라도 매번 다른 표현과 각도로 써줘 — 정해진 틀에 단어만 바꿔 끼우지 말고,
  이번 키워드/설명만 보고 떠오른 새로운 문장을 만들어줘.
- 설명이나 서론, 따옴표 없이 피드백 본문만 출력해줘. 이모지는 0~1개만 자연스럽게.

오늘의 키워드: "${keyword}"
${detail ? `추가 설명: "${detail}"` : "(추가 설명 없음)"}`;

  const result = await askClaude(prompt);
  if (result.ok) return result.text;
  return `"${keyword}"라는 한마디에 오늘 하루가 다 담겨 있는 것 같아요. 무슨 일이 있었든, 여기까지 온 당신을 꼭 안아주고 싶어요. 🤍`;
}
