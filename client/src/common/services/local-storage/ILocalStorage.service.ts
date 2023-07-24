export interface ILocalStorageService {
  getItem: <T>(key: string) => T | null
  setItem: <T>(key: string, value: T) => void
  setItemRaw: (key: string, value: string) => void
  getItemRaw: (key: string) => string | null
  removeItem: (key: string) => void
}
