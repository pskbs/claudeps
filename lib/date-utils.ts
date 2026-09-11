const MS_PER_DAY = 1000 * 60 * 60 * 24;

export interface BirthInfo {
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
}

/** 월/일이 없으면 1월 1일로 근사한다. */
export function getBirthDate({ birthYear, birthMonth, birthDay }: BirthInfo): Date {
  return new Date(birthYear, (birthMonth ?? 1) - 1, birthDay ?? 1);
}

/** 태어난 날을 1일째로 하여 오늘까지 며칠째인지 계산한다. */
export function getDaysSinceBirth(birth: BirthInfo, today: Date = new Date()): number {
  const birthDate = getBirthDate(birth);
  const start = new Date(birthDate.getFullYear(), birthDate.getMonth(), birthDate.getDate());
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY);
  return diff + 1;
}

/** 예상 수명(만 나이)을 기준으로 앞으로 남은 대략적인 일수를 계산한다. */
export function getDaysRemaining(
  birth: BirthInfo,
  lifeExpectancy: number,
  today: Date = new Date()
): number {
  const birthDate = getBirthDate(birth);
  const endDate = new Date(
    birthDate.getFullYear() + lifeExpectancy,
    birthDate.getMonth(),
    birthDate.getDate()
  );
  const now = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const diff = Math.floor((endDate.getTime() - now.getTime()) / MS_PER_DAY);
  return Math.max(diff, 0);
}

export function formatDate(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export type SajuCompleteness = "none" | "partial" | "full";

/** 태어난 월/일/시 중 얼마나 채워졌는지로 사주 정확도 단계를 판단한다. */
export function getSajuCompleteness(params: {
  birthMonth?: number;
  birthDay?: number;
  birthHour?: number;
}): SajuCompleteness {
  const filled = [params.birthMonth, params.birthDay, params.birthHour].filter(
    (v) => v !== undefined && v !== null
  ).length;
  if (filled === 0) return "none";
  if (filled < 3) return "partial";
  return "full";
}
