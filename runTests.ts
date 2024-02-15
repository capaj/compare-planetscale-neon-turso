import { renderToChart } from './renderToChart'

const urls = [
  'https://neon-cf.capaj.workers.dev/',
  'https://planetscale-cf.capaj.workers.dev/',
  'https://turso-cf.capaj.workers.dev/'
]

let allTimes = [] as number[][]
async function test() {
  // fetch every url 150 times in 3 second intervals
  for (let i = 0; i < 150; i++) {
    const timings = await Promise.all(
      urls.map(async (url, i) => {
        const res = await fetch(url + 'users')
        const json = await res.json()
        return json.timingMs
      })
    )
    allTimes.push(timings)
    console.log('timings:', timings)

    await new Promise((resolve) => setTimeout(resolve, 3000))
  }
}

await test()
console.log(`✅ done, recorded ${allTimes.length} timings`)

await renderToChart(allTimes, 'select.png')
console.log('Chart generated as chart.png')
export {}
