import Fetcher from './Fetcher.js'

console.log('client called')
const $ = (selector) => document.querySelector(selector)

function onClick() {
  const div = $('.div-text')
  ;(async () => {
    const res = await Fetcher.get('https://api.jokes.one/jod')
    console.log(res)
    div.innerHTML = JSON.stringify(res)
  })()
}
document.querySelector('button').addEventListener('click', onClick)
