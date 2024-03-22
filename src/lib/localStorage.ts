export class LocalStorage {
  set(uuid: string) {
    localStorage.setItem("user", uuid);
  }
  get(): string {
    return localStorage.getItem("user")!;
  }
  clear() {
    localStorage.removeItem("user");
  }
}
