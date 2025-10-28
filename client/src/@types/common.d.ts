export declare global {
  type SortOrder = 'ASC' | 'DESC'

  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
  }
}
