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
import { refreshDerivedData } from '../store/refreshData'
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
    create: async (dto: CreateProducerDto) => {
      const createdProducer = await dispatch(createProducer(dto)).unwrap()
      await dispatch(refreshDerivedData())
      return createdProducer
    },
    update: async (id: string, dto: UpdateProducerDto) => {
      const updatedProducer = await dispatch(updateProducer({ id, dto })).unwrap()
      await dispatch(refreshDerivedData())
      return updatedProducer
    },
    remove: async (id: string) => {
      const removedProducerId = await dispatch(deleteProducer(id)).unwrap()
      await dispatch(refreshDerivedData())
      return removedProducerId
    },
  }
}
