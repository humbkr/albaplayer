import { useNavigate } from 'react-router'
import { useAppDispatch, useAppSelector } from 'store/hooks'
import type React from 'react'
import { search, setSearchFilter } from '../store'

export function useSearchBar() {
  const navigate = useNavigate()

  const searchState = useAppSelector((state) => state.libraryBrowser.search)

  const dispatch = useAppDispatch()

  const changeFilter = (filter: SearchFilter) => {
    dispatch(setSearchFilter(filter))
  }

  const runSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(search((event.target as HTMLInputElement).value))
    navigate('/library')
  }

  const clearSearch = () => {
    dispatch(search(''))
  }

  return {
    searchState,
    changeFilter,
    runSearch,
    clearSearch,
  }
}
