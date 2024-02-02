import './style.css'

document.querySelector<HTMLDivElement>('#app')!.innerHTML = `
    <div>Hello ${import.meta.env.VITE_APP_TITLE}</div>
`

