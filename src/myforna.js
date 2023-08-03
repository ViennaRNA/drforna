import { FornaContainer, RNAUtilities } from 'fornac';

/**
 * Function to set up the FornaContainer for visualization.
 */
export function getFornaContainer(rid, sequence, structure, colors) {
    let fc = new FornaContainer('#' + rid, {
        zoomable: false, 
        editable: false, 
        animation: false,
        displayNodeLabel: true,
        labelInterval: 10,
        transitionDuration: 0
    });
    fc.addRNA(structure, { "sequence": sequence })
    let colorStrings = colors.map(function(d, i) {
        return `${i+1}:${d}`;
    });
    let colorString = colorStrings.join(' ');
    fc.addCustomColorsText(colorString);              
    return fc
}

/**
 * Function to determine the color of each nucleotide.
 */
export function calculateNucleotideColors(structure) {
    // uses an old d3 version!
    const rainbowScale = (i) => { 
        // minimum distance between i's is 0.5 (a bulge loop).
        // Thus two consequtive i's make steps of 80 through the
        // 360 color cycle. In total, we have 9 distinguishalbe 
        // colors, but we add the Math.floor(i/9) to ensure that 
        // color codes can only repeat after sequence lengths > 360.
        const h = Math.floor(i/9) + i * 160
        return d3.hcl(h, 100, 55);
    };
    // get a pairtable and a list of the secondary structure elements
    const rnaUtilities = new RNAUtilities();
    const pt = rnaUtilities.dotbracketToPairtable(structure);
    const pk = rnaUtilities.removePseudoknotsFromPairtable(pt);
    const elements = rnaUtilities.ptToElements(pt, 0, 1, pt[0], []);

    // store the colors of each nucleotide
    let colors = Array(pt[0]).fill(d3.hsl("white"));
    for (let i = 0; i < elements.length; i++) {
        if (elements[i][0] != 's')
            continue; // only stems!
        // assign nucleotide to the stem's imaginary center 
        let averageBpNum = elements[i][2].reduce(
            (a,b) => { return a+b }, 0) / (elements[i][2].length);
        // convert center to color
        elements[i][2].map((d) => {
            colors[d-1] = rainbowScale(+averageBpNum);
        });
    }
    return colors;
}

