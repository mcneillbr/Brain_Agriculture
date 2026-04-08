'use client'

import { useCallback, useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { fetchFarmById, fetchFarms, setSelected } from '../store/slices/farmsSlice'
import type { FarmDto } from '@/domain/types'

export function useFarms() {
  const dispatch = useAppDispatch()
  const { items, selected, loading, error } = useAppSelector((state) => state.farms)

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchFarms())
    }
  }, [dispatch, items.length])

  const select = useCallback(
    (farm: FarmDto | null) => dispatch(setSelected(farm)),
    [dispatch],
  )

  const refresh = useCallback(
    async () => dispatch(fetchFarms()).unwrap(),
    [dispatch],
  )

  const fetchById = useCallback(
    async (id: string) => dispatch(fetchFarmById(id)).unwrap(),
    [dispatch],
  )

  return {
    items,
    selected,
    loading,
    error,
    select,
    refresh,
    fetchById,
  }
}
