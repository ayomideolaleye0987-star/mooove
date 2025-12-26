import { describe, it, expect } from 'vitest'
import { computeLevel, pointsToNextLevel } from '../src/lib/levels'

describe('levels helper', () => {
  it('computes level correctly', () => {
    expect(computeLevel(0)).toBe(0)
    expect(computeLevel(99)).toBe(0)
    expect(computeLevel(100)).toBe(1)
    expect(computeLevel(250)).toBe(2)
  })

  it('computes points to next level', () => {
    expect(pointsToNextLevel(0)).toBe(100)
    expect(pointsToNextLevel(150)).toBe(50)
  })
})
