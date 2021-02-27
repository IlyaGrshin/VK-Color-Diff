export module util {
    export function hexAToRGB (hex: any) {
        hex = hex.slice(2,8)
        return hexToRGB(hex)
    }

    export function hexToRGB (hex: any) {
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

    export function RGBToHex (r, g, b) {
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

    export function getKeyByValue (object, value) {
        return Object.keys(object).find(key => object[key] === value)
    }

    export function isEmpty (obj) {
        for (let key in obj) {
        // если тело цикла начнет выполняться - значит в объекте есть свойства
        return false;
        }
        return true;
    }
}