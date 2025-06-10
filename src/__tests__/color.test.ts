import { describe, it, expect } from 'vitest'
import { spectrumToLab, labToRgb, mixKS, ksToLab, ksToRgb, KS, WAVELENGTHS } from '../utils/color'

const ones = new Array(WAVELENGTHS.length).fill(1)

describe('colour utils', () => {
  it('white spectrum -> Lab 100,0,0', () => {
    const [L,a,b] = spectrumToLab(ones)
    expect(L).toBeCloseTo(100, 4)
    expect(a).toBeCloseTo(0, 2)
    expect(b).toBeCloseTo(0, 2)
  })

  it('ks mixing', () => {
    const ks: KS = { K: new Array(WAVELENGTHS.length).fill(0.1), S: new Array(WAVELENGTHS.length).fill(1) }
    const mix = mixKS([{ ks, phi: 1 }])
    const lab = ksToLab(mix)
    const rgb = ksToRgb(mix)
    expect(lab.length).toBe(3)
    expect(typeof rgb).toBe('string')
  })
})
