const { chromium: app } = require('playwright')

const prepare = async page => {
  try {
    await page.bringToFront()

    await page.goto('https://www.acmicpc.net/login?next=' + encodeURIComponent('/'))

    await page.click('text=로그인 상태 유지')
    await page.click('[placeholder="아이디 / 이메일"]')
  } catch (error) {
    console.error(error)
  }
}

const init = async callback => {
  const browser = await app.launch({
    headless: false,
    timeout: 10 * 1000
  })
  const context = await browser.newContext({
    viewport: {
      width: 500,
      height: 750
    }
  })
  const page = await context.newPage()

  let result = null

  browser.on('disconnected', () => callback(result))

  context.on('close', async () => await browser.close())
  context.on('page', page => page.close())

  page.on('close', async () => await context.close())
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
