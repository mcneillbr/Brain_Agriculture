'use client'

import { useEffect } from 'react'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import {
  fetchProducers,
  createProducer,
  updateProducer,
  deleteProducer,
  setSelected,
} from '../store/slices/producersSlice'
import type { CreateProducerDto, ProducerDto, UpdateProducerDto } from '@/domain/types'

export function useProducers() {
  const dispatch = useAppDispatch()
  const { items, selected, loading, error } = useAppSelector((state) => state.producers)

  useEffect(() => {
    if (items.length === 0) {
      dispatch(fetchProducers())
    }
  }, [dispatch, items.length])

  return {
    items,
    selected,
    loading,
    error,
    select: (producer: ProducerDto | null) => dispatch(setSelected(producer)),
    create: (dto: CreateProducerDto) => dispatch(createProducer(dto)),
    update: (id: string, dto: UpdateProducerDto) => dispatch(updateProducer({ id, dto })),
    remove: (id: string) => dispatch(deleteProducer(id)),
  }
}
