var diff = require('color-diff')

var search = document.getElementsByClassName('search')[0]
var content = document.getElementsByClassName('content')[0]
var closestColor = document.getElementsByClassName('closestColor')[0]

search.addEventListener ('input', function() {
    if (this.value.length == 6) {
        searchColor(this.value)
    }
})

async function searchColor (value:any) {
    let paletteWeb = await palleteWeb()
    let palette = []
    for (let color in paletteWeb) {
        palette.push(paletteWeb[color])
    }

    value = hexChecker(value);
    let closest = diff.closest(value, palette)

    let closestName = getKeyByValue(paletteWeb, closest)
    content.innerHTML = closestName
}

async function palleteWeb () {
    let url = 'https://raw.githubusercontent.com/VKCOM/Appearance/master/main.valette/palette_web.json'
    let response = await fetch(url)
    let data = await response.json()

    for (let color in data) {
        data[color] = hexChecker(data[color])
    }

    return data;
}

function hexChecker (color:any) {
    color = color.replace('#', '')
    let hex = (color.length > 7) ? hexAToRGB(color) : hexToRGB(color);
    return hex;
}

function hexAToRGB (hex:any) {
    hex = hex.slice(2,8)
    return hexToRGB(hex)
}

  function hexToRGB(hex:any) {
    var bigint = parseInt(hex, 16);
    var r = (bigint >> 16) & 255;
    var g = (bigint >> 8) & 255;
    var b = bigint & 255;

    return {
        'R': r,
        'G': g,
        'B': b
    }
}

function getKeyByValue(object, value) {
    return Object.keys(object).find(key => object[key] === value);
}