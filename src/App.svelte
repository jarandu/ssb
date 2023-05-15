<script>

import { Line } from 'svelte-chartjs'
import 'chart.js/auto';
import { Chart } from 'chart.js';
import { onMount } from "svelte"

export let urlParams

let url = 'https://ssb-server.vercel.app/api/kpi' + urlParams

let output,
    updated = "",
    percentaged = false

Chart.defaults.font.family = "Open Sans"
Chart.defaults.color = "#292827"

let options = {
    type: 'line',
    maintainAspectRatio: false,
    interaction: {
        intersect: false,
        axis: 'x',
        mode: 'nearest'
    },
    elements: {
        line: {
            tension: 0.3
        },
        point: {
            hitRadius: 6,
            hoverRadius: 6,
            radius: 0
        }
    },
    scales: {
        x: {
            ticks: {
                callback: function(value, index, ticks) {
                    let d = new Date(this.getLabelForValue(value))
                    if (value == 0 || d.getMonth() == 0) return d.toLocaleDateString('nb-NO', { year: 'numeric', month: "short" })
                    else return d.toLocaleDateString('nb-NO', { month: "short" })
                }
            }
        },
        y: {
            ticks: {
                callback: function(value, index, ticks) {
                    if (percentaged) return value + '%'
                    else return value
                }
            }
        }
    },
    plugins: {
        legend: {
            labels: {
                boxWidth: 10,
                boxHeight: 1,
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
    if (data.groups[0].base) percentaged = true
    updated = new Date(data.updated)
    output = {
        labels: data.x,
        datasets: data.groups.map((group, index) => {
            return {
                label: group.name,
                data: percentaged ? group.data.map(value => ((value / group.base) - 1) * 100) : group.data,
                borderColor: colors[index]
            }
        })
    }
}

onMount(async () => {
    fetch(url)
    .then(r => r.json())
    .then(d => {
        console.log(urlParams)
        populate(d)
    })
    .catch(e => console.log(e))
})

</script>

<h2>Prisvekst siden invasjonen av Ukraina</h2>
{#if output}
<p class=description>Trykk på varekategoriene for å legge til eller fjerne fra diagramet.</p>
<div class=canvas-container><Line data={output} options={options} /></div>
<div class=credits>Kilde: SSB. Oppdatert {updated != "" ? updated.toLocaleDateString('nb-NO', { year: 'numeric', month: 'long', day: 'numeric' }) : "Kunne ikke hente tidspunkt."}. Utvikling: Jarand Ullestad/Nationen.</div>
{:else}
<div class=canvas-container>
    <div class=loading>
        <div class="spinner">
            <div></div>
            <div></div>
        </div>
    </div>
</div>
{/if}

<style>
.description {
    margin-block: 10px;
}
.canvas-container {
    flex: 1;
    min-height: 300px;
}
.credits {
    margin-top: 10px;
    font-size: 11px;
    color: #888;
}
.loading {
    display: flex;
    width: 100%;
    height: 100%;
    align-items: center;
}
.spinner {
    width: 40px;
    height: 40px;
    position: relative;
    margin: 100px auto;
}
.spinner div {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    border: 2px solid #406619;
    position: absolute;
    top: 0;
    left: 0;
    animation: bounce 1.5s infinite ease-in-out;
}
.spinner div:nth-child(2) {
    animation-delay: -1.0s;
    border-color: #fcda51;
}
@keyframes bounce {
    0%, 100% { 
        transform: scale(0.3);
    } 50% { 
        transform: scale(1);
    }
}
</style>