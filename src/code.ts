figma.showUI(__html__, { width: 300, height: 600 });

figma.ui.onmessage = async (action) => {
    switch (action.type) {
        case 'setPaletteMode':
            await figma.clientStorage.setAsync('paletteMode', action.value)
            break;

        case 'getPaletteMode':
            figma.clientStorage.getAsync('paletteMode').then((value) => {
                figma.ui.postMessage({ type: 'getPaletteMode', value })
            })

        case 'setStyles':
            let styles = figma.getLocalPaintStyles()
            let mapStyles = {}

            styles.map(key => {
                mapStyles[key.name] = key.key
            })

            //await figma.clientStorage.setAsync('styles', action.value)
            await figma.clientStorage.setAsync('styles', mapStyles)
            break;
    
        case 'getStyles':
            figma.clientStorage.getAsync('styles').then((value) => {
                figma.ui.postMessage({ type: 'getStyles', value })
            })
    }
}

figma.on('selectionchange', () => {
    if (figma.currentPage.selection.length) {
        let selection = figma.currentPage.selection[0]
        getFillFromLayer(selection).then(value => {
            if(value.length) {
                let layerColor = value[0].color
                figma.ui.postMessage({type: 'color', layerColor})
            }
        })
    }
})

async function getFillFromLayer(layer) {
    let fill = await layer.fills
    return fill
}