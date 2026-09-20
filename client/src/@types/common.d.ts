export declare global {
  type SortOrder = 'ASC' | 'DESC'

  type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P]
  }

  type ContextualActionItem<T = void> = { id: string } & T

  type ContextualAction<T = void> = (item: ContextualActionItem<T>) => void

  type ContextualActionsItem<T = void> = {
    id?: string
    type: 'item' | 'subMenu' | 'separator'
    label?: string
    action?: ContextualAction<T>
    subActions?: ContextualActionsItem<T>[]
  }
}
