export interface NotificationSettings {
  morningTime: string; // "HH:MM"
  eveningTime: string; // "HH:MM"
  eveningLabel: string; // 사용자가 지정하는 저녁 알림 이름
}

export interface User {
  id: string;
  username: string;
  birthYear: number;
  birthMonth?: number;
  birthDay?: number;
  birthHour?: number;
  lifeExpectancy: number;
  notification: NotificationSettings;
  createdAt: string;
}

export interface Entry {
  id: string;
  userId: string;
  date: string; // YYYY-MM-DD
  content: string;
  aiFeedback: string;
  sajuFortune?: string; // 그날 저장 시점의 인생사주 (사주 정보를 입력한 사용자만)
  is_shared: boolean; // 향후 익명 SNS 공유 확장 대비, 지금은 항상 false
  createdAt: string;
}
