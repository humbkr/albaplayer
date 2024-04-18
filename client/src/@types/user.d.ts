export declare global {
  type Role = 'root' | 'admin' | 'listener'

  type User = {
    id: number
    name: string
    email?: string
    data?: string
    dateAdded?: number
    roles: Role[]
    isDefaultUser?: boolean
  }
}
