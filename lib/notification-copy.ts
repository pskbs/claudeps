/** 인앱 알림(브라우저 Notification API)에 쓰일 정적 문구 모음. */

export function getMorningNotificationCopy(daysSinceBirth: number): {
  title: string;
  body: string;
} {
  const bodies = [
    `벌써 ${daysSinceBirth}일째 여행중이에요. 오늘도 좋은 하루 되세요!`,
    `${daysSinceBirth}일째 인생여행 중이에요. 오늘은 어떤 풍경이 기다릴까요?`,
    `오늘로 ${daysSinceBirth}일째! 천천히, 당신의 속도로 걸어가요.`,
    `${daysSinceBirth}일째 여행 중인 당신, 오늘도 응원할게요.`,
    `좋은 아침이에요. 오늘은 ${daysSinceBirth}일째 여행 중이에요.`,
  ];
  return {
    title: "인생여행 🌤️",
    body: bodies[Math.floor(Math.random() * bodies.length)],
  };
}

export function getEveningNotificationCopy(eveningLabel: string): {
  title: string;
  body: string;
} {
  const bodies = [
    "오늘 하루 어땠나요? 짧게 한 줄로 남겨봐요.",
    "하루를 마무리할 시간이에요. 오늘의 기분을 들려주세요.",
    "오늘 하루도 고생 많았어요. 잠깐 기록해볼까요?",
    "잠들기 전, 오늘의 나에게 짧은 인사를 남겨보세요.",
    "오늘 하루 수고했어요. 한 줄로 정리해볼까요?",
  ];
  return {
    title: eveningLabel || "인생여행 🌙",
    body: bodies[Math.floor(Math.random() * bodies.length)],
  };
}
