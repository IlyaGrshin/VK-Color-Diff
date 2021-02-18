var diff = require('color-diff')

var search = document.getElementsByClassName('search')[0] as HTMLInputElement
var content = document.getElementsByClassName('content')[0] as HTMLElement
var closestColor = document.getElementsByClassName('closestColor')[0] as HTMLElement
var select = document.getElementsByClassName('select')[0] as HTMLElement
var selectMode = document.getElementsByClassName('selectMode')[0] as HTMLSelectElement

let paletteData = {}
let scheme = {}
let currentColor = null
let mapColorsToTokens = {}

window.onload = async () => {
    let selectIndexTest = await getPaletteMode()
    selectMode.selectedIndex = selectIndexTest
    changeSelectArrowPosition(selectIndexTest)
}

selectMode.addEventListener('change', () => {
    changeSelectArrowPosition(selectMode.selectedIndex)
    searchColor(search.value)
})

function changeSelectArrowPosition (index) {
    let arrowOffset = ['2px', '-11px']
    select.style.setProperty('--select-offset', arrowOffset[index])
    setPaletteMode(index)
}

window.addEventListener('message', async (event) => {
    if (event.data.pluginMessage.type === 'color') {
        const color = event.data.pluginMessage.layerColor
        color.r = Math.round(color.r * 255)
        color.g = Math.round(color.g * 255)
        color.b = Math.round(color.b * 255)
        
        let hex = RGBToHex(color.r, color.g, color.b)
        search.value = hex.toUpperCase()
        searchColor(hex)
    }
})

search.addEventListener ('input', () => {
    if (search.value.length == 6) {
        searchColor(search.value)
    }
})

async function palleteFetch() {
    let palette_mode = ['palette_web', 'palette']

    let url = 'https://raw.githubusercontent.com/VKCOM/Appearance/master/main.valette/' + palette_mode[selectMode.selectedIndex] + '.json'
    let response = await fetch(url, { 
        mode: 'cors'
    })
    let data = await response.json()

    for (let color in data) {
        data[color] = hexChecker(data[color])
    }
    return data

}

async function searchColor (value: any) {
    if (isEmpty(paletteData)) {
        paletteData = await palleteFetch()
    }

    let palette = []
    for (let color in paletteData) {
        palette.push(paletteData[color])
    }

    value = hexChecker(value)
    let closest = diff.closest(value, palette)

    currentColor = getKeyByValue(paletteData, closest)
    content.innerHTML = '<span class="currentColor">' + currentColor + '</span>';
    
    searchToken().then(tokensArray => {
        tokensArray.forEach(tokenName => {
            content.innerHTML += '<span class="token">' + tokenName + '</span>'
        })
        
    })
}

function hexChecker (color: any) {
    color = color.replace('#', '')
    let hex = (color.length > 7) ? hexAToRGB(color) : hexToRGB(color)
    return hex
}

function hexAToRGB (hex: any) {
    hex = hex.slice(2,8)
    return hexToRGB(hex)
}

function hexToRGB(hex: any) {
    var bigint = parseInt(hex, 16)
    var r = (bigint >> 16) & 255
    var g = (bigint >> 8) & 255
    var b = bigint & 255

    return {
        'R': r,
        'G': g,
        'B': b
    }
}

function RGBToHex (r, g, b) {
    r = r.toString(16)
    g = g.toString(16)
    b = b.toString(16)
  
    if (r.length == 1)
      r = '0' + r
    if (g.length == 1)
      g = '0' + g
    if (b.length == 1)
      b = '0' + b
  
    return r + g + b
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value)
}

async function getPaletteMode(): Promise<number> {
    return new Promise((resolve) => {
        parent.postMessage(
        {
            pluginMessage: { type: 'getPaletteMode' },
        },
        '*'
      )
        window.addEventListener('message', async (event) => {
            if (event.data.pluginMessage && event.data.pluginMessage.type === 'getPaletteMode') {
                let data = event.data.pluginMessage.value
                if (data === undefined) data = 0
                resolve(data)
            }
        })
    })
}
  
function setPaletteMode(id: any) {
    parent.postMessage(
      {
        pluginMessage: { type: 'setPaletteMode', value: id },
      },
      '*'
    )
}

function isEmpty(obj) {
    for (let key in obj) {
      // если тело цикла начнет выполняться - значит в объекте есть свойства
      return false;
    }
    return true;
}

async function schemeFetch () {
    let url = 'https://raw.githubusercontent.com/VKCOM/Appearance/master/main.valette/scheme.json'
    let response = await fetch(url, {
        mode: 'cors'
    })
    let data = await response.json()

    return data
}

async function searchToken () {
    if (isEmpty(scheme)) {
        scheme = await schemeFetch()
    }

    Object.keys(scheme).forEach(schemeItem => (
        Object.keys(scheme[schemeItem].colors).forEach(token => {
            const color = scheme[schemeItem].colors[token].color_identifier;

            if (!mapColorsToTokens[color]) {
                mapColorsToTokens[color] = [token]
            } else if (mapColorsToTokens[color].indexOf(token) === -1) {
                mapColorsToTokens[color].push(token)
            }
        })
    ))
    return mapColorsToTokens[currentColor]
}