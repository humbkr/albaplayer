export declare global {
  type User = {
    id: number
    name: string
    email?: string
    data?: string
    dateAdded?: number
    roles: string[]
  }
}
