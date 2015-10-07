var numberSort = function(a,b) { return a - b; };

function generateUUID(){                                                                                        
    /* Stack Overflow:                                                                                          
     * http://stackoverflow.com/a/8809472/899470                                                                
     */
    var d = new Date().getTime();
    var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = (d + Math.random()*16)%16 | 0;
        d = Math.floor(d/16);
        return (c=='x' ? r : (r&0x3|0x8)).toString(16);                                                         
    });                                                                                                         

    return uuid;
}

function isNormalInteger(str) {
    //http://stackoverflow.com/a/10834843/899470
    return /^\+?(0|[1-9]\d*)$/.test(str);
}

if(typeof(String.prototype.trim) === "undefined")
    {
        String.prototype.trim = function() 
        {
            return String(this).replace(/^\s+|\s+$/g, '');
        };
    }

function ColorScheme(colorsText) {
    var self = this;
    self.colorsText = colorsText;

    self.parseRange = function(rangeText) {
        //parse a number range such as 1-10 or 3,7,9 or just 7
        var parts = rangeText.split(',')
        var nums = [];

        for (var i = 0; i < parts.length; i++) {
            //could be 1 or 10-11  or something like that
            var parts1 = parts[i].split('-');

            if (parts1.length == 1)
                nums.push(parseInt(parts1[0]));
            else if (parts1.length == 2) {
                var from = parseInt(parts1[0]);
                var to = parseInt(parts1[1]);

                // add each number in this range
                for (var j = from; j <= to; j++) 
                    nums.push(j)
            } else {
                console.log('Malformed range (too many dashes):', rangeText);
            }
        }

        return nums;
    }

    self.parseColorText = function(colorText) {
        /* Parse the text of an RNA color string. Instructions and description
         * of the format are given below.
         *
         * The return is a json double dictionary indexed first by the 
         * molecule name, then by the nucleotide. This is then applied
         * by force.js to the RNAs it is displaying. When no molecule
         * name is specified, the color is applied to all molecules*/
        var lines = colorText.split('\n');
        var currMolecule = '';
        var counter = 1;
        var colorsJson = {colorValues: {'':{}}, range:['white', 'steelblue']};
        var domainValues = [];


        for (var i = 0; i < lines.length; i++) {

            if (lines[i][0] == '>') {
                // new molecule
                currMolecule = lines[i].trim().slice(1);
                counter = 1;

                colorsJson.colorValues[currMolecule] = {};
                continue;
            }

            words = lines[i].trim().split(/[\s]+/);

            for (var j = 0; j < words.length; j++) {
                if (isNaN(words[j])) {
                    if (words[j].search("range") === 0) {
                        //there's a color scale in this entry
                        parts = words[j].split('=');
                        partsRight = parts[1].split(':')
                        colorsJson.range = [partsRight[0], partsRight[1]];
                        continue;
                    }

                    if (words[j].search("domain") == 0) {
                        //there's a color scale in this entry
                        parts = words[j].split('=');
                        partsRight = parts[1].split(':')
                        colorsJson.domain = [partsRight[0], partsRight[1]];
                        continue;
                    }

                    // it's not a number, should be a combination 
                    // of a number (nucleotide #) and a color
                    parts = words[j].split(':');
                    nums = self.parseRange(parts[0]);
                    color = parts[1]

                    for (var k = 0; k < nums.length; k++) {
                        if (isNaN(color)) {
                            colorsJson.colorValues[currMolecule][nums[k]] = color;
                        } else {
                            colorsJson.colorValues[currMolecule][nums[k]] = +color;
                            domainValues.push(Number(color));
                        }
                    }
                } else {
                    //it's a number, so we add it to the list of values
                    //seen for this molecule
                    colorsJson.colorValues[currMolecule][counter] = Number(words[j]);
                    counter += 1;

                    domainValues.push(Number(words[j]));
                }
            }
        }

        if (!('domain' in colorsJson))
            colorsJson.domain = [Math.min.apply(null, domainValues), Math.max.apply(null, domainValues)];

        self.colorsJson = colorsJson;

        return self;
    };

    self.normalizeColors = function() {
        /* 
         * Normalize the passed in values so that they range from
         * 0 to 1
         */
        var value;

        for (var moleculeName in self.colorsJson) {
            var minNum = Number.MAX_VALUE;
            var maxNum = Number.MIN_VALUE;

            // iterate once to find the min and max values;
            for (var resnum in self.colorsJson.colorValues[moleculeName]) {
                value = self.colorsJson.colorValues[moleculeName][resnum];
                if (typeof value == 'number') {
                    if (value < minNum)
                        minNum = value;
                    if (value > maxNum)
                        maxNum = value;
                }
            }

            // iterate again to normalize
            for (resnum in self.colorsJson.colorValues[moleculeName]) {
                value = self.colorsJson.colorValues[moleculeName][resnum];
                if (typeof value == 'number') {
                    self.colorsJson.colorValues[moleculeName][resnum] = (value - minNum ) / (maxNum - minNum);
                }
            }
        }

        return self;
    };

    self.parseColorText(self.colorsText);
}

function ProteinGraph(structName, size, uid) {
    var self = this;

    self.type = 'protein';
    self.size = size;
    self.nodes = [{'name': 'P',
                   'num': 1,
                   'radius': 3 *  Math.sqrt(size),
                   'rna': self,
                   'nodeType': 'protein',
                   'structName': structName,
                   'elemType': 'p',
                   'size': size,
                   'uid': generateUUID()}];

    self.links = [];
    self.uid = generateUUID();

    self.addUids = function(uids) {
        for (var i = 0; i < uids.length; i++)
            self.nodes[i].uid = uids[i];

        return self;
    };

    self.getUids = function() {
        /* Get the positions of each node so that they
         * can be passed to elementsToJson later
         */
        uids = [];
        for (var i = 0; i < self.dotbracket.length; i++)
            uids.push(self.nodes[i].uid);

        return uids;
    };

}

function RNAGraph(seq, dotbracket, structName) {
    var self = this;

    self.type = 'rna';
    self.circularizeExternal = false;

    if (arguments.length == 0) {
        self.seq = '';
        self.dotbracket = '';
        self.structName = '';
    } else {
        self.seq = seq;
        self.dotbracket = dotbracket;  //i.e. ..((..))..
        self.structName = structName;
    }

    self.circular = false;

    if (self.dotbracket.length > 0 && self.dotbracket[self.dotbracket.length-1] == '*') {
        //circular RNA
        self.dotbracket = self.dotbracket.slice(0, self.dotbracket.length-1);
        self.circular = true;
    }

    self.uid = generateUUID();
    self.rnaLength = self.dotbracket.length;

    self.elements = [];            //store the elements and the 
                                   //nucleotides they contain
    self.pseudoknotPairs = [];
    self.nucsToNodes = {};

    self.addUids = function(uids) {
        for (var i = 0; i < uids.length; i++)
            self.nodes[i].uid = uids[i];

        return self;
    };

    self.computePairtable = function() {
        self.pairtable = rnaUtilities.dotbracketToPairtable(self.dotbracket);
    };

    self.computePairtable();

    self.addPositions = function(nodeType, positions) {
        labelNodes = self.nodes.filter(function(d) { return d.nodeType == nodeType; });

        for  (var i = 0; i < labelNodes.length; i++) {
            labelNodes[i].x = positions[i][0];
            labelNodes[i].px = positions[i][0];
            labelNodes[i].y = positions[i][1];
            labelNodes[i].py = positions[i][1];
        }

        return self;
    };

    self.getPositions = function(nodeType) {
        positions = [];
        nucleotideNodes = self.nodes.filter(function(d) { return d.nodeType == nodeType; });

        for (var i = 0; i < nucleotideNodes.length; i++)
            positions.push([nucleotideNodes[i].x, nucleotideNodes[i].y]);

        return positions;
    };

    self.getUids = function() {
        /* Get the positions of each node so that they
         * can be passed to elementsToJson later
         */
        uids = [];
        for (var i = 0; i < self.dotbracket.length; i++)
            uids.push(self.nodes[i].uid);

        return uids;
    };

    self.reinforceStems = function() {
        pt = self.pairtable;
        relevantElements = elements.filter( function(d) {
            return d[0] == 's' && d[2].length >= 4;
        });

        for (var i = 0; i < relevantElements.length; i++) {
            allNucs = relevantElements[i][2];
            nucs = allNucs.slice(0, allNucs.length / 2);

            for (var j = 0; j < nucs.length-1; j++) {
                self.addFakeNode([nucs[j], nucs[j+1], pt[nucs[j+1]], pt[nucs[j]]]);
            }
        }

        return self;    
    };

    self.reinforceLoops = function() {
        /* 
         * Add a set of fake nodes to enforce the structure
         */
        var filterNucs = function(d) { 
            return d !== 0 && d <= self.dotbracket.length;
        };

        for (i=0; i < self.elements.length; i++) {
            if (self.elements[i][0] == 's' || (!self.circularizeExternal && self.elements[i][0] == 'e'))
                continue;

            var nucs = self.elements[i][2].filter(filterNucs);

            if (self.elements[i][0] == 'e') {
                var newNode1 = {'name': '',
                    'num': -1,
                    //'radius': 18 * radius -6,
                    'radius': 0,
                    'rna': self,
                    'nodeType': 'middle',
                    'elemType': 'f',
                    'nucs': [],
                    'x': self.nodes[self.rnaLength-1].x,
                    'y': self.nodes[self.rnaLength-1].y,
                    'px': self.nodes[self.rnaLength-1].px,
                    'py': self.nodes[self.rnaLength-1].py,
                    'uid': generateUUID() };
                var newNode2 = {'name': '',
                    'num': -1,
                    //'radius': 18 * radius -6,
                    'radius': 0,
                    'rna': self,
                    'nodeType': 'middle',
                    'elemType': 'f',
                    'nucs': [],
                    'x': self.nodes[0].x,
                    'y': self.nodes[0].y,
                    'px': self.nodes[0].px,
                    'py': self.nodes[0].py,
                    'uid': generateUUID() };

                    nucs.push(self.nodes.length+1);
                    nucs.push(self.nodes.length+2);
                    self.nodes.push(newNode1);
                    self.nodes.push(newNode2);
            }
            

            self.addFakeNode(nucs);
        }

        return self;
    };

    self.updateLinkUids = function() {
        for (var i = 0; i < self.links.length; i++) {
            self.links[i].uid = self.links[i].source.uid + self.links[i].target.uid;
        }

        return self;
    }

    self.addFakeNode = function(nucs) {
        var linkLength = 18; //make sure this is consistent with the value in force.js
        var nodeWidth = 6;
        var angle = (3.1415 * 2) / (2 * nucs.length);
        var radius =  linkLength / (2 * Math.tan(angle));

        var fakeNodeUid = ""

        for (var i = 0; i < nucs.length; i++)
            fakeNodeUid += self.nodes[nucs[i]-1].uid;

        newNode = {'name': '',
                         'num': -1,
                         //'radius': 18 * radius -6,
                         'radius': radius,
                         'rna': self,
                         'nodeType': 'middle',
                         'elemType': 'f',
                         'nucs': nucs,
                         'uid': fakeNodeUid };
        self.nodes.push(newNode);

        newX = 0;
        newY = 0;
        coordsCounted = 0;

        angle = (nucs.length - 2) * 3.14159 / (2 * nucs.length);
        radius = 0.5 / Math.cos(angle);

        for (j = 0; j < nucs.length; j++) {
            if (nucs[j] === 0 || nucs[j] > self.dotbracket.length)
                continue;
            

            //link to the center node
            self.links.push({'source': self.nodes[nucs[j] - 1],
                             'target': self.nodes[self.nodes.length-1],
                             'linkType': 'fake',
                             'value': radius,
                             'uid': generateUUID() });

            if (nucs.length > 4) {
                //link across the loop
                self.links.push({'source': self.nodes[nucs[j] - 1],
                                 'target': self.nodes[nucs[(j + Math.floor(nucs.length / 2)) % nucs.length] - 1],
                                 'linkType': 'fake',
                                 'value': radius * 2,
                                 'uid': generateUUID() });
            }

            ia = ((nucs.length - 2) * 3.14159) / nucs.length;
            c = 2 * Math.cos(3.14159 / 2 - ia / 2);
            //link to over-neighbor
            self.links.push({'source': self.nodes[nucs[j] - 1],
                             'target': self.nodes[nucs[(j + 2) % nucs.length] - 1],
                             'linkType': 'fake',
                             'value': c});

            // calculate the mean of the coordinats in this loop
            // and place the fake node there
            fromNode = self.nodes[nucs[j]-1];
            if ('x' in fromNode) {
                newX += fromNode.x;
                newY += fromNode.y;

                coordsCounted += 1;
            }
        }

        if (coordsCounted > 0) {
            // the nucleotides had set positions so we can calculate the position
            // of the fake node
            newNode.x = newX / coordsCounted;
            newNode.y = newY / coordsCounted;
            newNode.px = newNode.x;
            newNode.py = newNode.y;
        }

        return self;

    };

    self.connectFakeNodes = function() {
        var linkLength = 18;

        // We want to be able to connect all of the fake nodes
        // and create a structure consisting of just them
        var filterOutNonFakeNodes = function(d) {
            return d.nodeType == 'middle';
        }

        var nucsToNodes = {};
        var fakeNodes = self.nodes.filter(filterOutNonFakeNodes);
        var linked = new Set();

        // initialize the nucleotides to nodes
        for (var i = 1; i <= self.nodes.length; i++) 
            nucsToNodes[i] = [];

        for (i = 0; i < fakeNodes.length; i++) {
            var thisNode = fakeNodes[i];

            // each fake node represents a certain set of nucleotdies (thisNode.nucs)
            for (var j = 0; j < thisNode.nucs.length; j++) {
                var thisNuc = thisNode.nucs[j];

                // check to see if this nucleotide has been seen in another fake node
                // if it has, then we add a link between the two nodes
                for (var k = 0; k < nucsToNodes[thisNuc].length; k++) {
                    if (linked.has(JSON.stringify([nucsToNodes[thisNuc][k].uid, thisNode.uid].sort())))
                        continue; //already linked

                    var distance = nucsToNodes[thisNuc][k].radius + thisNode.radius;

                    self.links.push({"source": nucsToNodes[thisNuc][k],
                                      "target": thisNode,
                                      "value": distance / linkLength,
                                      "linkType": "fake_fake"});

                    // note that we've already seen this link
                    linked.add(JSON.stringify([nucsToNodes[thisNuc][k].uid, thisNode.uid].sort()));
                }

                nucsToNodes[thisNuc].push(thisNode);
            }
        }

        return self;

    };

    self.elementsToJson = function() {
        /* Convert a set of secondary structure elements to a json
         * representation of the graph that can be used with d3's
         * force-directed layout to generate a visualization of 
         * the structure.
         */
        pt = self.pairtable;
        elements = self.elements;

        self.nodes = [];
        self.links = [];

        //create a reverse lookup so we can find out the type
        //of element that a node is part of
        elemTypes = {};

        //sort so that we count stems last
        self.elements.sort();

        for (var i = 0; i < self.elements.length; i++) {
            nucs = self.elements[i][2];
            for (j = 0; j < nucs.length; j++) {
                elemTypes[nucs[j]] = self.elements[i][0];
            }
        }

        for (i = 1; i <= pt[0]; i++) {
            //create a node for each nucleotide
            self.nodes.push({'name': self.seq[i-1],
                             'num': i,
                             'radius': 6,
                             'rna': self,
                             'nodeType': 'nucleotide',
                             'structName': self.structName,
                             'elemType': elemTypes[i],
                             'uid': generateUUID() });
        }


        for (i = 1; i <= pt[0]; i++) {

            if (pt[i] !== 0) {
                // base-pair links
                self.links.push({'source': self.nodes[i-1],
                                 'target': self.nodes[pt[i]-1],
                                 'linkType': 'basepair',
                                 'value': 1,
                                 'uid': generateUUID() });
            }

            if (i > 1) {
                // backbone links
                self.links.push({'source': self.nodes[i-2],
                                 'target': self.nodes[i-1],
                                 'linkType': 'backbone',
                                 'value': 1,
                                 'uid': generateUUID() });
            }
        }

        //add the pseudoknot links
        for (i = 0; i < self.pseudoknotPairs.length; i++) {
            self.links.push({'source': self.nodes[self.pseudoknotPairs[i][0]-1],
                            'target': self.nodes[self.pseudoknotPairs[i][1]-1],
                            'linkType': 'pseudoknot',
                            'value': 1,
                            'uid': generateUUID()});
        }

        if (self.circular) {
            self.links.push({'source': self.nodes[0],
                            'target': self.nodes[self.rnaLength-1],
                            'linkType': 'backbone',
                            'value': 1,
                            'uid': generateUUID() });

        }

        return self;
    };

    self.ptToElements = function(pt, level, i, j) {
        /* Convert a pair table to a list of secondary structure 
         * elements:
         *
         * [['s',1,[2,3]]
         *
         * The 's' indicates that an element can be a stem. It can also be
         * an interior loop ('i'), a hairpin loop ('h') or a multiloop ('m')
         *
         * The second number (1 in this case) indicates the depth or
         * how many base pairs have to be broken to get to this element.
         *
         * Finally, there is the list of nucleotides which are part of
         * of this element.
         */
        var elements = [];
        var u5 = [i-1];
        var u3 = [j+1];

        if (i > j)
            return [];
            
            //iterate over the unpaired regions on either side
            //this is either 5' and 3' unpaired if level == 0
            //or an interior loop or a multiloop
            for (; pt[i] === 0; i++) { u5.push(i); }
            for (; pt[j] === 0; j--) { u3.push(j); }

            if (i > j) {
                //hairpin loop or one large unpaired molecule
                u5.push(i);
                if (level === 0)
                    return [['e',level, u5.sort(numberSort)]];
                else
                    return [['h',level, u5.sort(numberSort)]];
            }

            if (pt[i] != j) {
                //multiloop
                var m = u5;
                var k = i;

                // the nucleotide before and the starting nucleotide
                m.push(k);
                while (k <= j) {
                    // recurse into a stem
                    elements = elements.concat(self.ptToElements(pt, level, k, pt[k]));

                    // add the nucleotides between stems
                    m.push(pt[k]);
                    k = pt[k] + 1;
                    for (; pt[k] === 0 && k <= j; k++) { m.push(k);}
                    m.push(k);
                }
                m.pop();
                m = m.concat(u3);
                
                if (m.length > 0) {
                    if (level === 0)
                        elements.push(['e', level, m.sort(numberSort)]);
                    else
                        elements.push(['m', level, m.sort(numberSort)]);
                }
                
                return elements;
            }

            if (pt[i] === j) {
                //interior loop
                u5.push(i);
                u3.push(j);

                combined = u5.concat(u3);
                if (combined.length > 4) {
                    if (level === 0)
                        elements.push(['e',level, u5.concat(u3).sort(numberSort)]);
                    else
                        elements.push(['i',level, u5.concat(u3).sort(numberSort)]);
                }
            } 

            var s = [];
            //go through the stem
            while (pt[i] === j && i < j) {
                //one stem
                s.push(i);
                s.push(j);

                i += 1;
                j -= 1;

                level += 1;
            }

            u5 = [i-1];
            u3 = [j+1];
            elements.push(['s', level, s.sort(numberSort)]);

        return elements.concat(self.ptToElements(pt, level, i, j));
    };

    self.addLabels = function(startNumber, labelInterval) {
        if (arguments.length  === 0) {
            startNumber = 1;
            labelInterval = 10;
        }

        if (arguments.length === 1) 
            labelInterval = 10;

        if (labelInterval === 0)
            return self;

        if (labelInterval <= 0) 
            console.log('The label interval entered in invalid:', labelInterval);

        for (i = 1; i <= pt[0]; i++) {
            // add labels
            if (i % labelInterval === 0) {
                //create a node for each label
                var newX, newY;

                thisNode = self.nodes[i-1]

                if (self.rnaLength == 1) {
                    nextVec = [thisNode.x - 15, thisNode.y]
                    prevVec = [thisNode.x - 15, thisNode.y]
                } else {
                    // if we're labelling the first node, then label it in relation to the last
                    if (i == 1)
                        prevNode = self.nodes[self.rnaLength - 1];
                    else
                        prevNode = self.nodes[i - 2];

                    // if we're labelling the last node, then label it in relation to the first
                    if (i == self.rnaLength)
                        nextNode = self.nodes[0];
                    else
                        nextNode = self.nodes[i];

                    // this nucleotide and its neighbors are paired
                    if (self.pairtable[nextNode.num] !== 0 &&
                        self.pairtable[prevNode.num] !== 0 &&
                        self.pairtable[thisNode.num] !== 0) {
                        prevNode = nextNode = self.nodes[self.pairtable[thisNode.num]-1]
                    }

                    // this node is paired but at least one of its neighbors is unpaired
                    // place the label in the direction of the two neighbors
                    if (self.pairtable[thisNode.num] !== 0 && (
                        self.pairtable[nextNode.num] === 0 ||
                        self.pairtable[prevNode.num] === 0)) {
                        nextVec = [thisNode.x - nextNode.x, thisNode.y - nextNode.y];
                        prevVec = [thisNode.x - prevNode.x, thisNode.y - prevNode.y];

                    } else {
                        nextVec = [nextNode.x - thisNode.x, nextNode.y - thisNode.y];
                        prevVec = [prevNode.x - thisNode.x, prevNode.y - thisNode.y];
                    }
                }

                combinedVec = [nextVec[0] + prevVec[0], nextVec[1] + prevVec[1]];
                vecLength = Math.sqrt(combinedVec[0] * combinedVec[0] + combinedVec[1] * combinedVec[1]);
                normedVec = [combinedVec[0] / vecLength, combinedVec[1] / vecLength];
                offsetVec = [-15 * normedVec[0], -15 * normedVec[1]];

                newX = self.nodes[i-1].x + offsetVec[0];
                newY = self.nodes[i-1].y + offsetVec[1];

                newNode = {'name': i + startNumber - 1,
                                 'num': -1,
                                 'radius': 6,
                                 'rna': self,
                                 'nodeType': 'label',
                                 'structName': self.structName,
                                 'elemType': 'l',
                                 'x': newX,
                                 'y': newY,
                                 'px': newX,
                                 'py': newY,
                                 'uid': generateUUID() };
                newLink = {'source': self.nodes[i-1],
                            'target': newNode,
                            'value': 1,
                            'linkType': 'label_link',
                            'uid': generateUUID() };

                self.nodes.push(newNode);
                self.links.push(newLink);
            }
        }

        return self;
    };

    self.recalculateElements = function() {
        self.removePseudoknots();
        self.elements = self.ptToElements(self.pairtable, 0, 1, self.dotbracket.length);

        if (self.circular) {
            //check to see if the external loop is a hairpin or a multiloop
            externalLoop = self.elements.filter(function(d) { if (d[0] == 'e') return true; });

            if (externalLoop.length > 0) {
                eloop = externalLoop[0];
                nucs = eloop[2].sort(numberSort);

                prev = nucs[0];
                hloop = true;
                numGreater = 0;
                for (var i = 1; i < nucs.length; i++) {
                    if (nucs[i] - prev > 1) {
                        numGreater += 1;
                    }
                    prev = nucs[i];
                }

                if (numGreater == 1) {
                    eloop[0] = 'h';
                } else if (numGreater == 2) {
                    eloop[0] = 'i';
                } else {
                    eloop[0] = 'm';
                }
            }
        }

        return self;
    };

    self.removePseudoknots = function() {
        if (self.pairtable.length > 1)
            self.pseudoknotPairs = self.pseudoknotPairs.concat(rnaUtilities.removePseudoknotsFromPairtable(self.pairtable));

        return self;
    };

    self.addPseudoknots = function() {
        /* Add all of the pseudoknot pairs which are stored outside
         * of the pairtable back to the pairtable
         */
        var pt = self.pairtable;
        var pseudoknotPairs = self.pseudoknotPairs;

        for (i = 0; i < pseudoknotPairs.length; i++) {
            pt[pseudoknotPairs[i][0]] = pseudoknotPairs[i][1];
            pt[pseudoknotPairs[i][1]] = pseudoknotPairs[i][0];
        }

        self.pseudoknotPairs = [];
        return self;
    };

    if (self.rnaLength > 0)
        self.recalculateElements();
}

moleculesToJson = function(moleculesJson) {
    /* Convert a list of RNA and protein molecules to a list of RNAGraph
     * ProteinGraph and extraLinks structure */

    var nodes = {}; //index the nodes by uid
    var graphs = [];
    var extraLinks = [];


    // Create the graphs for each molecule
    for (var i = 0; i < moleculesJson.molecules.length; i++) {
        var molecule = moleculesJson.molecules[i];

        if (molecule.type == 'rna') {
            rg = new RNAGraph(molecule.seq, molecule.ss, molecule.header);
            rg.circularizeExternal = true;
            rg.elementsToJson()
            .addPositions('nucleotide', molecule.positions)
            .addLabels()
            .reinforceStems()
            .reinforceLoops();

            
        } else if (molecule.type == 'protein') {
            rg = new ProteinGraph(molecule.header, molecule.size);

        }

        rg.addUids(molecule.uids);

        for (var j = 0; j < rg.nodes.length; j++) {
            nodes[rg.nodes[j].uid] = rg.nodes[j];
        }

        graphs.push(rg);
    }

    //Add the extra links
    for (i = 0; i < moleculesJson.extraLinks.length; i++) {
        link = moleculesJson.extraLinks[i];
        
        link.source = nodes[link.source];
        link.target = nodes[link.target];
        link.uid = generateUUID();

        extraLinks.push(link);
    }

    return {"graphs": graphs, "extraLinks": extraLinks};
}
function rnaPlot() {
    var options = {
        "width": 400,
        "height": 400,
        "nucleotideRadius": 5,
        "rnaEdgePadding": 0,     // how far the leftmost, rightmost, topmost and bottomost
                                // nucleotides are from the edge of the plot
        "labelInterval": 0,
        "showNucleotideLabels": true,
        "startNucleotideNumber": 1
    };

    function createTransformToFillViewport(xValues, yValues) {
        // create transform that will scale the x and y values so that
        // they fill the available viewport
    
        // find out leftmost, rightmost, topmost, bottommost positions of each
        // nucleotide so that we can create a scale
        var xExtent = d3.extent(rg.nodes.map(function(d) { return d.x; })) 
        var yExtent = d3.extent(rg.nodes.map(function(d) { return d.y; })) 

        // add the radius of the nucleotides
        xExtent[0] -= options.nucleotideRadius + options.rnaEdgePadding;
        yExtent[0] -= options.nucleotideRadius + options.rnaEdgePadding;

        xExtent[1] += options.nucleotideRadius + options.rnaEdgePadding;
        yExtent[1] += options.nucleotideRadius + options.rnaEdgePadding;

        // find out how wide and height the molecule
        var xRange = xExtent[1] - xExtent[0];
        var yRange = yExtent[1] - yExtent[0];

        // how much wider / taller is it than the available viewport
        var xExtra = xRange - options.width;
        var yExtra = yRange - options.height;

        var xScale, yScale;

        // once we have a scale for one dimension, we can create the scale for the other
        // keeping the same expansion / shrinking ratio
        function createOtherScale(firstScale, newDomain, newRange) {
            var scaleFactor = (firstScale.range()[1] - firstScale.range()[0]) / 
                              (firstScale.domain()[1] - firstScale.domain()[0]);
            var newWidth = (newDomain[1] - newDomain[0]) * scaleFactor
            var newMargin = ((newRange[1] - newRange[0]) - newWidth) / 2;

            return {"scaleFactor": scaleFactor, 
                    "scale": d3.scale.linear()
                                     .domain(newDomain)
                                     .range([newRange[0] + newMargin, newRange[1] - newMargin])};
        }

        var ret;

        if (xExtra > yExtra) {
            // we have to shrink more in the x-dimension than the y
            xScale = d3.scale.linear()
            .domain(xExtent)
            .range([0, options.width])

            ret = createOtherScale(xScale, yExtent, [0, options.height]);
            yScale = ret.scale;
        } else {
            // we have to shrink more in the x-dimension than the y
            yScale = d3.scale.linear()
            .domain(yExtent)
            .range([0, options.height])

            ret = createOtherScale(yScale, xExtent, [0, options.width]);
            xScale = ret.scale;
        }

        var xOffset = xScale.range()[0] - xScale.domain()[0];
        var yOffset = yScale.range()[0] - yScale.domain()[0];

        return "translate(" + -(xScale.domain()[0] * ret.scaleFactor - xScale.range()[0]) + 
                  "," + -(yScale.domain()[0] * ret.scaleFactor - yScale.range()[0]) + ")" + 
            'scale(' + ret.scaleFactor + ')';
    }

    function createNucleotides(selection, nucleotideNodes) {
        // create groupings for each nucleotide and label
        var gs = selection
        .selectAll('.rna-base')
        .data(nucleotideNodes)
        .enter()
        .append('svg:g')
        .attr('transform', function(d) { 
            return 'translate(' + d.x + ',' + d.y + ')'; 
        });

        var circles = gs.append('svg:circle')
        .attr('r', options.nucleotideRadius)
        .classed('rna-base', true)

        if (options.showNucleotideLabels) {
            var nucleotideLabels = gs.append('svg:text')
            .text(function(d) { return d.name; })
            .attr('text-anchor', 'middle')
            .attr('dominant-baseline', 'central')
            .classed('nucleotide-label', true)
            .append('svg:title')
            .text(function(d) { return d.struct_name + ":" + d.num; });
        }
    }

    function createLabels(selection, labelNodes) {
        // create groupings for each nucleotide and label

        var gs = selection 
        .selectAll('.rnaLabel')
        .data(labelNodes)
        .enter()
        .append('svg:g')
        .attr('transform', function(d) { 
            return 'translate(' + d.x + ',' + d.y + ')'; 
        });

        var numberLabels = gs.append('svg:text')
        .text(function(d) { return d.name; })
        .attr('text-anchor', 'middle')
        .attr('font-weight', 'bold')
        .attr('dominant-baseline', 'central')
        .classed('number-label', true)
    }

    function chart(selection) {
        selection.each(function(data) {
            // data should be a dictionary containing at least a structure
            // and possibly a sequence
            rg = new RNAGraph(data.sequence, data.structure, data.name)
                    .recalculateElements()
                    .elementsToJson();

            data.rnaGraph = rg;
            // calculate the position of each nucleotide
            // the positions of the labels will be calculated in
            // the addLabels function
            var positions = simpleXyCoordinates(rg.pairtable);
            rg.addPositions('nucleotide', positions)
            .addLabels(options.startNucleotideNumber, options.labelInterval);

            // create a transform that will fit the molecule to the
            // size of the viewport (canvas, svg, whatever)
            var fillViewportTransform = createTransformToFillViewport(
                rg.nodes.map(function(d) { return d.x; }),
                rg.nodes.map(function(d) { return d.y; }));

            var gTransform = d3.select(this)
            .append('g')
            .attr('transform', fillViewportTransform);

            var nucleotideNodes = rg.nodes.filter(function(d) { 
                return d.nodeType == 'nucleotide'; 
            });

            var labelNodes = rg.nodes.filter(function(d) {
                return d.nodeType == 'label';
            });

            createNucleotides(gTransform, nucleotideNodes);            
            createLabels(gTransform, labelNodes);

        });
    }

    chart.width = function(_) {
        if (!arguments.length) return options.width;
        options.width = _;
        return chart;
    };

    chart.height = function(_) {
        if (!arguments.length) return options.height;
        options.height = _;
        return chart;
    };

    chart.showNucleotideLabels = function(_) {
        if (!arguments.length) return options.showNucleotideLabels;
        options.showNucleotideLabels = _;
        return chart;
    }

    chart.rnaEdgePadding = function(_) {
        if (!arguments.length) return options.rnaEdgePadding;
        options.rnaEdgePadding = _;
        return chart;
    };

    chart.nucleotideRadius = function(_) {
        if (!arguments.length) return options.nucleotideRadius;
        options.nucleotideRadius = _;
        return chart;
    };

    chart.labelInterval = function(_) {
        if (!arguments.length) return options.labelInterval;
        options.labelInterval = _;
        return chart;
    };

    chart.showNucleotideLabels = function(_) {
        if (!arguments.length) return options.showNucleotideLabels;
        options.showNucleotideLabels = _;
        return chart;
    };

    chart.startNucleotideNumber = function(_) {
        if (!arguments.length) return options.startNucleotideNumber;
        options.startNucleotideNumber = _;
        return chart;
    }

    return chart;
}
var number_sort = function(a,b) { return a - b; };

function RNAUtilities() {
    var self = this;

    // the brackets to use when constructing dotbracket strings
    // with pseudoknots
    self.bracket_left =  "([{<ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
    self.bracket_right = ")]}>abcdefghijklmnopqrstuvwxyz".split("");

    self.inverse_brackets = function(bracket) {
        res = {};
        for (i = 0; i < bracket.length; i++) {
            res[bracket[i]] = i;
        }
        return res;
    };

    self.maximumMatching = function maximumMatching(pt){
        // Courtesy of the great Ronny Lorenz

        var n = pt[0];
        var TURN = 0;    //minimal number of nucleotides in the hairpin

        /* array init */
        mm = new Array(n + 1);
        for(var i = 0; i <= n; i++){
            mm[i] = new Array(n + 1);
            for(var j = i; j <= n; j++)
            mm[i][j] = 0;
        }
        var maximum = 0;

        /* actual computation */
        for(var i = n - TURN - 1; i > 0; i--)

        for(var j = i + TURN + 1; j <= n; j++){
            maximum = mm[i][j-1];

            for(var l = j - TURN - 1; l >= i; l--) {
                if(pt[l] === j) {

                    // we have a base pair here
                    maximum = Math.max(maximum, ((l > i) ? mm[i][l-1] : 0) + 1 + ((j - l - 1 > 0) ? mm[l+1][j-1] : 0));
                }
            }

            mm[i][j] = maximum;
        }

        maximum = mm[1][n];

        return mm;
    };

    self.backtrackMaximumMatching = function(mm, old_pt) {
      var pt = Array.apply(null, 
                           Array(mm.length)).map(function() { return 0 }); 
                           //create an array containing zeros

      self.mm_bt(mm, pt, old_pt, 1, mm.length-1);
      return pt;
    }

    self.mm_bt = function(mm, pt, old_pt, i, j){
        // Create a pairtable from the backtracking
      var maximum = mm[i][j];
      var TURN = 0;

      if(j - i - 1 < TURN) return;    /* no more pairs */

      if(mm[i][j-1] == maximum){      /* j is unpaired */
        self.mm_bt(mm, pt, old_pt, i, j-1);
        return;
      }

      for(var q = j - TURN - 1; q >= i; q--){  /* j is paired with some q */
        if (old_pt[j] !== q)
            continue;

        var left_part     = (q > i) ? mm[i][q-1] : 0;
        var enclosed_part = (j - q - 1 > 0) ? mm[q+1][j-1] : 0;

        if(left_part + enclosed_part + 1 == maximum) {
            // there's a base pair between j and q
            pt[q] = j;
            pt[j] = q;

            if(i < q) 
                self.mm_bt(mm, pt, old_pt, i, q - 1);

            self.mm_bt(mm, pt, old_pt, q + 1, j - 1);
            return;
        }
      }

      //alert(i + "," + j + ": backtracking failed!");
      console.log("FAILED!!!" + i + "," + j + ": backtracking failed!");

    };

    self.dotbracketToPairtable = function(dotbracket) {
        // create an array and initialize it to 0
        pt = Array.apply(null, new Array(dotbracket.length + 1)).map(Number.prototype.valueOf,0);
        
        //  the first element is always the length of the RNA molecule
        pt[0] = dotbracket.length;

        // store the pairing partners for each symbol
        stack = {};
        for (i = 0; i < self.bracket_left.length; i++) {
            stack[i] = [];
        }

        // lookup the index of each symbol in the bracket array
        inverse_bracket_left = self.inverse_brackets(self.bracket_left);
        inverse_bracket_right = self.inverse_brackets(self.bracket_right);

        for (i = 0; i < dotbracket.length; i++) {
            a = dotbracket[i];
            ni = i + 1;

            if (a == '.') {
                // unpaired
                pt[ni] = 0;
            } else {
                if (a in inverse_bracket_left) {
                    // open pair?
                    stack[inverse_bracket_left[a]].push(ni);
                } else if (a in inverse_bracket_right){
                    // close pair?
                    j = stack[inverse_bracket_right[a]].pop();

                    pt[ni] = j;
                    pt[j] = ni;
                } else {
                    throw "Unknown symbol in dotbracket string";
                }
            }
        }

        for (key in stack) {
            if (stack[key].length > 0) {
                throw "Unmatched base at position " + stack[key][0];
            }
        }

        return pt;
    };

    self.insert_into_stack = function(stack, i, j) {
        var k = 0;
        while (stack[k].length > 0 && stack[k][stack[k].length - 1] < j) {
            k += 1;
        }

        stack[k].push(j);
        return k;
    };

    self.delete_from_stack = function(stack, j) {
        var k = 0;
        while (stack[k].length === 0 || stack[k][stack[k].length-1] != j) {
            k += 1;
        }
        stack[k].pop();
        return k;
    };

    self.pairtableToDotbracket = function(pt) {
        // store the pairing partners for each symbol
        stack = {};
        for (i = 0; i < pt[0]; i++) {
            stack[i] = [];
        }

        seen = {};
        res = "";
        for (i = 1; i < pt[0] + 1; i++) {
            if (pt[i] !== 0 && pt[i] in seen) {
                throw "Invalid pairtable contains duplicate entries";
            }
            seen[pt[i]] = true;

            if (pt[i] === 0) {
                res += '.';
            } else {
                if (pt[i] > i) {
                    res += self.bracket_left[self.insert_into_stack(stack, i, pt[i])];
                } else {
                    res += self.bracket_right[self.delete_from_stack(stack, i)];
                }
            }
        }

        return res;
    };

    self.find_unmatched = function(pt, from, to) {
        /*
         * Find unmatched nucleotides in this molecule.
         */
        var to_remove = [];
        var unmatched = [];

        var orig_from = from;
        var orig_to = to;

        for (var i = from; i <= to; i++)
            if (pt[i] !== 0 && (pt[i] < from || pt[i] > to))
                unmatched.push([i,pt[i]]);

        for (i = orig_from; i <= orig_to; i++) {
            while (pt[i] === 0 && i <= orig_to) i++;

            to = pt[i];

            while (pt[i] === to) {
                i++;
                to--;
            }
            
            to_remove = to_remove.concat(self.find_unmatched(pt, i, to));
        }

        if (unmatched.length > 0)
            to_remove.push(unmatched);

        return to_remove;
    };

    self.removePseudoknotsFromPairtable = function(pt) {
        /* Remove the pseudoknots from this structure in such a fashion
         * that the least amount of base-pairs need to be broken
         *
         * The pairtable is manipulated in place and a list of tuples
         * indicating the broken base pairs is returned.
         */

        var mm = self.maximumMatching(pt);
        var new_pt = self.backtrackMaximumMatching(mm, pt);
        var removed = [];

        for (var i = 1; i < pt.length; i++) {
            if (pt[i] < i)
                continue;

            if (new_pt[i] != pt[i])  {
                removed.push([i, pt[i]]);
                pt[pt[i]] = 0;
                pt[i] = 0;
            }
        }

        return removed;
    };

}

rnaUtilities = new RNAUtilities();
simpleXyCoordinates = function(pair_table)
{
  var INIT_ANGLE=0.;     /* initial bending angle */
  var INIT_X = 100.;     /* coordinate of first digit */
  var INIT_Y = 100.;     /* see above */
  var RADIUS =  15.;

  var x = [], y = [];

  var i, len;
  var  alpha;

  len = pair_table[0];
  var angle = Array.apply(null, new Array(len+5)).map(Number.prototype.valueOf,0); 
  var loop_size = Array.apply(null, new Array(16+Math.floor(len/5)))
                    .map(Number.prototype.valueOf, 0); 
  var stack_size = Array.apply(null, new Array(16+Math.floor(len/5)))
                    .map(Number.prototype.valueOf, 0); 

  lp = stk = 0;
  var PIHALF = Math.PI / 2;


  loop = function(i, j, pair_table)
  /* i, j are the positions AFTER the last pair of a stack; i.e
     i-1 and j+1 are paired. */
  {
      var count = 2;   /* counts the VERTICES of a loop polygon; that's
                          NOT necessarily the number of unpaired bases!
                          Upon entry the loop has already 2 vertices, namely
                          the pair i-1/j+1.  */

  var    r = 0, bubble = 0; /* bubble counts the unpaired digits in loops */

  var    i_old, partner, k, l, start_k, start_l, fill, ladder;
  var    begin, v, diff;
  var  polygon;

  var remember = Array.apply(null, new Array((1+Math.floor((j-i)/5)*2))).map(Number.prototype.valueOf, 0);

  i_old = i-1, j++;         /* j has now been set to the partner of the
                               previous pair for correct while-loop
                               termination.  */
  while (i != j) {
      partner = pair_table[i];
      if ((!partner) || (i==0))
          i++, count++, bubble++;
      else {
          count += 2;
          k = i, l = partner;    /* beginning of stack */
          remember[++r] = k;
          remember[++r] = l;
          i = partner+1;         /* next i for the current loop */

          start_k = k, start_l = l;
          ladder = 0;
          do {
              k++, l--, ladder++;        /* go along the stack region */
          }
          while (pair_table[k] == l);

          fill = ladder-2;
          if (ladder >= 2) {
              angle[start_k+1+fill] += PIHALF;   /*  Loop entries and    */
              angle[start_l-1-fill] += PIHALF;   /*  exits get an        */
              angle[start_k]        += PIHALF;   /*  additional PI/2.    */
              angle[start_l]        += PIHALF;   /*  Why ? (exercise)    */
              if (ladder > 2) {
                  for (; fill >= 1; fill--) {
                      angle[start_k+fill] = Math.PI;    /*  fill in the angles  */
                      angle[start_l-fill] = Math.PI;    /*  for the backbone    */
                  }
              }
          }
          stack_size[++stk] = ladder;
          loop(k, l, pair_table);
      }
  }

  polygon = Math.PI*(count-2)/count; /* bending angle in loop polygon */
  remember[++r] = j;
  begin = i_old < 0 ? 0 : i_old;
  for (v = 1; v <= r; v++) {
      diff  = remember[v]-begin;
      for (fill = 0; fill <= diff; fill++)
      angle[begin+fill] += polygon;
      if (v > r)
          break;
      begin = remember[++v];
  }
  loop_size[++lp] = bubble;
  }

  loop(0, len+1, pair_table);
  loop_size[lp] -= 2;     /* correct for cheating with function loop */

  alpha = INIT_ANGLE;
  x[0]  = INIT_X;
  y[0]  = INIT_Y;

  poss = [];

  poss.push([x[0], y[0]]);
  for (i = 1; i < len; i++) {
      x[i] = x[i-1]+RADIUS*Math.cos(alpha);
      y[i] = y[i-1]+RADIUS*Math.sin(alpha);

      poss.push([x[i], y[i]]);
      alpha += Math.PI-angle[i+1];
  }

  return poss;
}
