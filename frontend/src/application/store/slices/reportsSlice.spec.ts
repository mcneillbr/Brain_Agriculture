import reducer, { fetchReportData, setFilters } from './reportsSlice'

describe('reportsSlice', () => {
  it('retorna estado inicial', () => {
    const state = reducer(undefined, { type: 'unknown' })

    expect(state.filters).toEqual({ harvestId: null, state: null })
    expect(state.kpis).toEqual({
      totalProducers: 0,
      totalFarms: 0,
      totalArea: 0,
      avgAreaPerFarm: 0,
    })
    expect(state.farmsByState).toEqual([])
    expect(state.areasByCrop).toEqual([])
    expect(state.producerReport).toEqual([])
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('aplica filtros localmente', () => {
    const state = reducer(undefined, setFilters({ harvestId: 'h-1', state: 'MT' }))
    expect(state.filters).toEqual({ harvestId: 'h-1', state: 'MT' })
  })

  it('preenche dados no fulfilled do thunk', () => {
    const previous = reducer(undefined, { type: 'unknown' })

    const fulfilledAction = {
      type: fetchReportData.fulfilled.type,
      payload: {
        kpis: {
          totalProducers: 48,
          totalFarms: 127,
          totalArea: 85430,
          avgAreaPerFarm: 672,
        },
        farmsByState: [{ state: 'MT', count: 32 }],
        areasByCrop: [{ crop: 'Soja', totalArea: 38200 }],
        producerReport: [
          {
            producerId: '1',
            name: 'João',
            document: '529.982.247-25',
            farmsCount: 3,
            totalArea: 3200,
            states: ['MT'],
            crops: ['Soja'],
            updatedAt: '2024-12-01',
          },
        ],
      },
    }

    const state = reducer(previous, fulfilledAction)

    expect(state.loading).toBe(false)
    expect(state.kpis.totalProducers).toBe(48)
    expect(state.farmsByState).toHaveLength(1)
    expect(state.areasByCrop).toHaveLength(1)
    expect(state.producerReport).toHaveLength(1)
  })
})
