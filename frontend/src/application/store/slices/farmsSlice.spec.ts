import reducer, { fetchFarms, fetchFarmById, setSelected } from './farmsSlice'

describe('farmsSlice', () => {
  it('returns the initial state', () => {
    const state = reducer(undefined, { type: 'unknown' })

    expect(state.items).toEqual([])
    expect(state.selected).toBeNull()
    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
  })

  it('sets selected farm', () => {
    const farm = {
      id: 'farm-1',
      producerId: 'prod-1',
      producerName: 'Joao Silva',
      name: 'Fazenda Boa Vista',
      city: 'Sorriso',
      state: 'MT',
      totalArea: 1200,
      arableArea: 960,
      vegetationArea: 240,
      unusedArea: 0,
      arablePercentage: 80,
      vegetationPercentage: 20,
      crops: [],
      createdAt: '2024-12-01T00:00:00.000Z',
      updatedAt: '2024-12-01T00:00:00.000Z',
    }

    const state = reducer(undefined, setSelected(farm as any))
    expect(state.selected?.id).toBe('farm-1')
    expect(state.selected?.producerName).toBe('Joao Silva')
  })

  it('fills list on fetchFarms.fulfilled', () => {
    const previous = reducer(undefined, { type: 'unknown' })

    const fulfilledAction = {
      type: fetchFarms.fulfilled.type,
      payload: [
        {
          id: 'farm-1',
          producerId: 'prod-1',
          producerName: 'Joao Silva',
          name: 'Fazenda Boa Vista',
          city: 'Sorriso',
          state: 'MT',
          totalArea: 1200,
          arableArea: 960,
          vegetationArea: 240,
          unusedArea: 0,
          arablePercentage: 80,
          vegetationPercentage: 20,
          crops: [],
          createdAt: '2024-12-01T00:00:00.000Z',
          updatedAt: '2024-12-01T00:00:00.000Z',
        },
      ],
    }

    const state = reducer(previous, fulfilledAction)

    expect(state.loading).toBe(false)
    expect(state.error).toBeNull()
    expect(state.items).toHaveLength(1)
    expect(state.items[0].name).toBe('Fazenda Boa Vista')
  })

  it('updates selected on fetchFarmById.fulfilled', () => {
    const previous = reducer(undefined, { type: 'unknown' })

    const fulfilledAction = {
      type: fetchFarmById.fulfilled.type,
      payload: {
        id: 'farm-2',
        producerId: 'prod-2',
        producerName: 'Maria Souza',
        name: 'Estancia Sol',
        city: 'Rio Verde',
        state: 'GO',
        totalArea: 850,
        arableArea: 640,
        vegetationArea: 210,
        unusedArea: 0,
        arablePercentage: 75,
        vegetationPercentage: 25,
        crops: [],
        createdAt: '2024-12-02T00:00:00.000Z',
        updatedAt: '2024-12-02T00:00:00.000Z',
      },
    }

    const state = reducer(previous, fulfilledAction)

    expect(state.selected?.id).toBe('farm-2')
    expect(state.items).toHaveLength(1)
    expect(state.items[0].producerName).toBe('Maria Souza')
  })
})
