const app = require('puppeteer-extra')
const StealthPlugin = require('puppeteer-extra-plugin-stealth')

const prepare = async page => {
  try {
    await page.setViewport({
      width: 500,
      height: 750,
      deviceScaleFactor: 1
    })
    await page.bringToFront()

    await page.goto('https://www.acmicpc.net/login?next=' + encodeURIComponent('/'))

    await page.click('input[name="auto_login"]')
    await page.click('input[name="login_user_id"]')
  } catch (error) {
    console.error(error)
  }
}

const init = async callback => {
  app.use(StealthPlugin())

  const browser = await app.launch({
    headless: false,
    args: ['--window-size=500,750'],
    timeout: 10 * 1000
  })
  const page = await browser.newPage()

  let result = null

  browser.on('disconnected', () => callback(result))

  page.on('close', () => browser.close())
  page.on('response', async response => {
    const url = response.url()

    if (!url.startsWith('https://www.acmicpc.net/signin')) {
      return
    }

    try {
      const cookie = response.headers()['set-cookie']

      if (!cookie) {
        throw new Error('Failed to find set-cookie header to get cookie!')
      }

      const [context] = cookie.split(';')
      const [, token] = context.split('=')

      result = token

      if (token === 'deleted') {
        result = null
      }

      await browser.close()
    } catch (error) {
      prepare(page)
    }
  })

  prepare(page)
}

module.exports = () => {
  return new Promise((resolve, reject) => {
    init(token => resolve(token))
  })
}
