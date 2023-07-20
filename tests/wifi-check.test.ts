import { describe, it, expect } from 'vitest'
import { getWifiStatus } from '../lib'

describe('Wifi status', () => {
  it('should be on', async () => {
    expect((await getWifiStatus()).isWifiOn).toBe(true)
  })

  it('should be connected', async () => {
    expect((await getWifiStatus()).isWifiConnected).toBe('connected')
  })

  it('should be connected to the right network', async () => {
    expect((await getWifiStatus()).ssid).toBe('SKCET_WIFI')
  })
})
