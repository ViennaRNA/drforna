/**
 * Parses a standard FASTA file and returns an object with the sequence ID and the sequence.
 * Throws an error if the file contains multiple sequences.
 *
 * @param {string} fasta - The contents of the FASTA file.
 * @returns {object} An object with properties "id" and "sequence".
 * @throws {Error} If the file contains multiple sequences.
 */
function parseFasta(fasta) {
    const lines = fasta.trim().split('\n');
    let id = null;
    let sequence = '';
    // Loop through the lines of the file.
    for (let line of lines) {
        // Check if the line is a sequence header.
        let tline = line.trim();
        if (tline == '') { 
            continue
        }
        if (tline.startsWith('>')) {
            // If an ID has already been found, throw an error.
            if (id !== null) {
                throw new Error('Multiple sequence IDs found.');
            }
            // Extract the sequence ID from the header.
            id = tline.slice(1).split(/\s+/)[0];
        } else {
            console.log(tline);
            // Add the sequence to the existing sequence string.
            if (/^[a-zA-Z]+$/.test(tline)) {
                sequence += tline;
            } else {
                throw new Error('Sequences must contain only letters.');
            }
        }
    }
    // Return the ID and sequence as an object.
    return { id, sequence };
}

/**
 * Generates a ruler string based on the given length.
 * The ruler consists of dots ('.'), numbers incremented by 10 at every tenth
 * position, and commas (',') to denote every position divisible by 5.
 * @param {number} length - The length of the ruler.
 * @returns {string} The generated ruler string.
 */
function writeRuler(length) {
    let ruler = "";
    const major = 10;
    const minor = 5;
    let tick = major;
    for (let i = 1; i <= length; i++) {
        if (ruler.length === i-1) {
            if (i % major === 0) {
                ruler += tick;
                tick += 10;
            } else if (i % minor === 0) {
                ruler += ",";
            } else {
                ruler += ".";
            }
        }
    }
    return ruler
}

module.exports = { parseFasta, writeRuler };
