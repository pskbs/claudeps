import fs from "fs";
import path from "path";
import type { User, Entry } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");
const USERS_FILE = path.join(DATA_DIR, "users.json");
const ENTRIES_FILE = path.join(DATA_DIR, "entries.json");

function ensureFile(filePath: string) {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, "[]", "utf-8");
  }
}

function readJson<T>(filePath: string): T[] {
  ensureFile(filePath);
  const raw = fs.readFileSync(filePath, "utf-8");
  try {
    return raw.trim() ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeJson<T>(filePath: string, data: T[]) {
  ensureFile(filePath);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
}

export function getUsers(): User[] {
  return readJson<User>(USERS_FILE);
}

export function saveUsers(users: User[]) {
  writeJson(USERS_FILE, users);
}

export function getUserById(id: string): User | undefined {
  return getUsers().find((u) => u.id === id);
}

export function getUserByUsername(username: string): User | undefined {
  return getUsers().find((u) => u.username === username);
}

export function addUser(user: User) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

export function updateUser(id: string, updates: Partial<User>) {
  const users = getUsers();
  const idx = users.findIndex((u) => u.id === id);
  if (idx === -1) return undefined;
  users[idx] = { ...users[idx], ...updates };
  saveUsers(users);
  return users[idx];
}

export function getEntries(): Entry[] {
  return readJson<Entry>(ENTRIES_FILE);
}

export function saveEntries(entries: Entry[]) {
  writeJson(ENTRIES_FILE, entries);
}

export function getEntriesByUser(userId: string): Entry[] {
  return getEntries()
    .filter((e) => e.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function getEntryById(id: string): Entry | undefined {
  return getEntries().find((e) => e.id === id);
}

export function addEntry(entry: Entry) {
  const entries = getEntries();
  entries.push(entry);
  saveEntries(entries);
}
