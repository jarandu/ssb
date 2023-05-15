<script>

import { Line } from 'svelte-chartjs'
import 'chart.js/auto';
import { onMount } from "svelte"

export let urlParams

let url = 'https://ssb-server.vercel.app/api/kpi' + urlParams

let output

let options = {
    type: 'line',
    maintainAspectRatio: false,
    elements: {
        line: {
            tension: 0.3
        },
        point: {
            hitRadius: 6,
            hoverRadius: 6
            // pointStyle: false
        }
    },
    scales: {
        x: {
            grid: {
                display: false
            },
            ticks: {
                callback: function(value, index, ticks) {
                    if (index != ticks.length -1) return value + '%';
                }
            }
        },
        y: {
            ticks: {
                callback: function(value, index, ticks) {
                    if (index != ticks.length -1) return value + '%';
                }
            }
        }
    },
    plugins: {
        legend: {
            labels: {
                boxWidth: 10,
                boxHeight: 10,
                borderRadius: 50,
                font: {
                    size: 14
                }
            },
            align: 'start'
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += (context.parsed.y).toFixed(1) + "%";
                    }
                    return label;
                }
            }
        }
    }
}

let colors = ['rgb(64,102,25)', 'rgb(25,60,102)', 'rgb(181,42,24)']

function populate(data) {
    output = {
        labels: data.x,
        datasets: data.groups.map((group, index) => {
            return {
                label: group.name,
                data: group.data.map(value => ((value / group.base) - 1) * 100),
                borderColor: colors[index]
            }
        })
    }
}

onMount(async () => {
    fetch(url)
    .then(r => r.json())
    .then(d => {
        populate(d)
    })
    .catch(e => console.log(e))
})

</script>

<h2>Prisvekst siden invasjonen av Ukraina</h2>
<p>Trykk på varekategoriene for å legge til eller fjerne fra diagramet.</p>
<div><Line data={output} width={100} height={500} options={options} /></div>

<style>
p {
    margin-block: 10px;
}
</style>