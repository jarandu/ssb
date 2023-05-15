import './app.css'
import App from './App.svelte'

let targetElement = document.querySelector('#app')
const urlParams = window.location.search

const app = new App({
	target: targetElement,
	props: {
		urlParams: urlParams
	}
})

export default app
