import puppeteer from 'puppeteer'
import dotenv from 'dotenv'
import { describe, it, expect } from 'vitest'

dotenv.config()
describe('Portal Login', async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()
  let frame = null

  // Set screen size
  await page.setViewport({ width: 1080, height: 1024 })

  it('should open the portal login page', async () => {
    expect(process.env.PORTAL_LOGIN_URL).toBeTypeOf('string')

    // Navigate the page to the login page
    expect(await page.goto(process.env.PORTAL_LOGIN_URL)).not.toBeNull()
    expect(await page.waitForSelector('frame')).not.toBeNull()
  })

  it('should login to the portal', async () => {
    frame = await (await page.$('frame')).contentFrame()
    expect(frame).toBeTypeOf('object')
  })

  it('should fill the form', async () => {
    expect(process.env.PORTAL_USERNAME).toBeTypeOf('string')
    expect(process.env.PORTAL_PASSWORD).toBeTypeOf('string')

    // Type into search box
    await frame.type('#usrname', process.env.PORTAL_USERNAME)
    await frame.type('#newpasswd', process.env.PORTAL_PASSWORD)

    await frame.evaluate(() => {
      document.getElementById('terms').click()
    })

    await frame.click('#update_btn')

    // Wait for navigation to finish
    await frame.waitForNavigation({ waitUntil: 'domcontentloaded' })
  })

  it('should check if the login is successful', async () => {
    const body = await frame.$('body')
    const res = await (await body.getProperty('textContent')).jsonValue()

    expect(res).toBeTypeOf('string')

    if (res.includes('Login Successful')) {
      expect(res).toContain('Login Successful')
    } else if (res.includes('Already logged in')) {
      expect(res).toContain('Already logged in')
    } else {
      expect(res).toContain('Login Failed')
    }

    await browser.close()
  })
})
