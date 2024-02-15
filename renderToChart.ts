import { ChartJSNodeCanvas } from 'chartjs-node-canvas'
import fs from 'fs'

export async function renderToChart(data: number[][], fileName: string) {
  const data1 = data.map((item) => item[0])
  const data2 = data.map((item) => item[1])
  const data3 = data.map((item) => item[2])

  // Configuration for the chart
  const width = 2800 // width of the chart
  const height = 2000 // height of the chart
  const chartJSNodeCanvas = new ChartJSNodeCanvas({ width, height })

  const configuration = {
    type: 'line' as const,
    data: {
      labels: data.map((_, index) => index + 1),
      datasets: [
        {
          label: 'Neon',
          fontSize: 30,
          data: data1,
          borderColor: '#00E599',
          backgroundColor: '#00E599'
        },
        {
          label: 'Planetscale',
          fontSize: 30,
          data: data2,
          borderColor: '#F35815',
          backgroundColor: '#F34611'
        },
        {
          label: 'Turso',
          fontSize: 30,
          data: data3,
          borderColor: 'blue',
          backgroundColor: 'rgba(0, 0, 255, 0.5)'
        }
      ]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            font: {
              size: 40 // Increase font size for labels
            }
          }
        },
        title: {
          display: true,
          text: 'Latency comparison between Neon, Planetscale, and Turso, lower is better',
          font: {
            size: 34 // Increase font size for the title
          }
        }
      },

      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            font: {
              size: 20 // Increase font size for Y-axis ticks
            }
          }
        },
        x: {
          ticks: {
            font: {
              size: 20 // Increase font size for X-axis ticks
            }
          }
        }
      }
    }
  }

  const buffer = await chartJSNodeCanvas.renderToBuffer(configuration)
  fs.writeFileSync(fileName, buffer)
  console.log('Chart generated as chart.png')
}

// const json = await fs.promises.readFile('select-results.json', 'utf-8')
// await renderToChart(JSON.parse(json))
