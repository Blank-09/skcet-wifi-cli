import { exec } from 'child_process'

export async function getWifiStatus() {
  const statusStr = await getWifiStatusString()
  const status = {
    isWifiOn: isWifiOn(statusStr),
    isWifiConnected: isWifiConnected(statusStr),
    ssid: getConnectedWifiSSID(statusStr),
  }

  return status
}

function isWifiConnected(data) {
  if (typeof data !== 'string') {
    return 'disconnected'
  }

  const status = data.match(/State\s+:\s+(\w+)/)?.[1]
  return status ?? 'disconnected'
}

function isWifiOn(data) {
  if (typeof data !== 'string') {
    return false
  }

  const status = data.match(/Radio status\s+:\s+(\w+)/)

  if (!status) {
    // If the wifi is off, then the radio status will be "Software Off"
    return true
  }

  const isWifiOn = data.match(/Software\s+(\w+)/)[1]
  return isWifiOn.toLocaleLowerCase() === 'on'
}

function getWifiStatusString() {
  return new Promise((resolve, reject) => {
    const child = exec('netsh wlan show interfaces')
    let res = ''

    child.stdout?.on('data', (data) => {
      res += data
    })

    child.stderr?.on('data', (data) => {
      reject(data)
    })

    child.on('close', (code) => {
      resolve(res)
    })
  })
}

function getConnectedWifiSSID(data) {
  if (typeof data !== 'string') {
    return false
  }

  const profile = data.match(/SSID\s+:\s+(\w+)/)?.[1]
  return profile ?? false
}
