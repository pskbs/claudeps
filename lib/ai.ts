import { spawn } from "child_process";

/**
 * 로컬 1단계: Anthropic API 키 없이, 로컬에 설치된 Claude Code CLI(`claude -p`)를
 * child_process로 호출해 텍스트 응답을 받는다.
 * 추후 Anthropic API 키를 발급받으면 이 파일의 구현만 SDK 호출로 교체하면 된다.
 */

const DEFAULT_TIMEOUT_MS = 20000;

export type AiResult =
  | { ok: true; text: string }
  | { ok: false; error: string };

export function callClaudeCLI(
  prompt: string,
  timeoutMs: number = DEFAULT_TIMEOUT_MS
): Promise<AiResult> {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (result: AiResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    let child;
    try {
      child = spawn("claude", ["-p"], {
        shell: true,
        timeout: timeoutMs,
        killSignal: "SIGKILL",
      });
    } catch (err) {
      finish({ ok: false, error: `claude CLI 실행 실패: ${String(err)}` });
      return;
    }

    let stdout = "";
    let stderr = "";

    child.stdout?.on("data", (chunk) => {
      stdout += chunk.toString();
    });
    child.stderr?.on("data", (chunk) => {
      stderr += chunk.toString();
    });

    child.on("error", (err) => {
      finish({ ok: false, error: `claude CLI 실행 오류: ${err.message}` });
    });

    child.on("close", (code) => {
      if (code === 0 && stdout.trim()) {
        finish({ ok: true, text: stdout.trim() });
      } else {
        finish({
          ok: false,
          error: stderr.trim() || `claude CLI가 코드 ${code}로 종료됨`,
        });
      }
    });

    try {
      child.stdin?.write(prompt);
      child.stdin?.end();
    } catch (err) {
      finish({ ok: false, error: `프롬프트 전달 실패: ${String(err)}` });
    }
  });
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
라벨과 이모지는 그대로 유지하고, 각 항목은 실제 여행 중 마주칠 법한 구체적인 행동/사람/상황으로 15자 내외로 짧게 써줘.
"기운", "운세 흐름" 같은 추상적인 표현은 쓰지 말고, 오늘 하루를 여행하듯 살아갈 때 실용적인 조언이 되도록 써줘.
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

  const result = await callClaudeCLI(prompt);
  if (result.ok) return result.text;
  return `🚧 오늘 조심할 것
- 행동: 너무 서두르는 것
- 사람: 나를 재촉하는 사람

🧭 오늘 추천할 것
- 행동: 잠깐 숨 고르기
- 사람: 편안한 사람과의 대화`;
}

export async function getEveningFeedback(content: string): Promise<string> {
  const prompt = `너는 따뜻하고 다정한 친구 같은 캐릭터야.
사용자가 오늘 하루를 아주 짧게 요약해서 보내줄 거야.
그 내용을 보고 "위로", "응원", "실용적인 해결책 제안" 중 가장 어울리는 걸 골라서
2~3줄 정도의 짧고 따뜻한 피드백을 해줘. 설명이나 서론 없이 피드백 본문만 출력해줘.

오늘 하루 요약: "${content}"`;

  const result = await callClaudeCLI(prompt);
  if (result.ok) return result.text;
  return "오늘 하루도 정말 애썼어요. 무슨 일이 있었든, 여기까지 온 당신을 꼭 안아주고 싶어요. 🤍";
}
