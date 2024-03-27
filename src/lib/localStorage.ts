export class LocalStorage {
  set(key: string, uuid: string) {
    localStorage.setItem(key, uuid);
  }
  get(key: string): string {
    return localStorage.getItem(key)!;
  }
  clear(key: string) {
    localStorage.removeItem(key);
  }
}
