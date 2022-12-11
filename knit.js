function processPattern() {
    // reset DOM and counters
    numPatternRepeats = 0;
    numStitchGroups = 0;
    stitchGroup = 0;
    document.getElementById("pattern-rows").innerHTML = "";
    document.getElementById("pattern-repeats").innerText = 0;

    // split multiline string into an array of single-line strings
    var patternText = document.getElementById("pattern-input").value.split(/\r?\n/).filter(n => n);

    // filter out row headings such as "Row 1: " or "1. "
    const filterRowRE = /[:\.]\s*(.*)/i;
    for (let i = 0; i < patternText.length; i++) {
        patternText[i] = filterRowRE.exec(patternText[i])[1];
    }

    // split each string into an array of stitch groups (ignoring commas within parentheses)
    const splitByCommaRE = /,(?!(?:[^,()]+,)*[^,()]+\))/g;
    for (let i = 0; i < patternText.length; i++) {
        patternText[i] = patternText[i].split(splitByCommaRE);
    }

    // add the pattern rows to DOM
    var stitchGroups = 0;
    var patternRows = document.getElementById("pattern-rows");
    for (let i = 0; i < patternText.length; i++) {
        // create numbered item (i.e. row)
        var rowEl = document.createElement("li");

        // add spans of each stitch group to rowEl
        for (let j = 0; j < patternText[i].length; j++) {
            stitchGroups++;
            var spanEl = document.createElement("span");
            spanEl.setAttribute("id", stitchGroups);
            spanEl.classList.add("stitch-group");
            spanEl.innerText = patternText[i][j].trim();
            rowEl.appendChild(spanEl);
            spanEl = document.createElement("span");
            spanEl.innerText = " ";
            rowEl.appendChild(spanEl);
        }

        // add numbered item (i.e. row) to DOM
        patternRows.appendChild(rowEl);
    }
    numStitchGroups = stitchGroups;
    incrementStitchGroup();
    toggleDisplay();
}

function incrementStitchGroup() {   

    // de-highlight current stitch group
    document.getElementById(stitchGroup).classList.remove("highlight");

    
    // advance to next stitch group and check if pattern has repeated
    stitchGroup++;
    if (stitchGroup > numStitchGroups) {
        numPatternRepeats++;
        document.getElementById("pattern-repeats").innerText = numPatternRepeats;
        stitchGroup = 1;
    }

    // highlight next stitch group 
    document.getElementById(stitchGroup).classList.add("highlight");    
}

function decrementStitchGroup() {

    // de-highlight current stitch group
    document.getElementById(stitchGroup).classList.remove("highlight");

    // go back one stitch group, minding the # of pattern repeats
    stitchGroup--;
    if (stitchGroup < 0) {
        numPatternRepeats--;
        document.getElementById("pattern-repeats").innerText = numPatternRepeats;
        stitchGroup = numStitchGroups;
    }

    // highlight previous stitch group
    document.getElementById(stitchGroup).classList.add("highlight");
}

function toggleDisplay() {

    // toggle instructions/input
    var els = document.querySelectorAll(".hideable");
    for (let i = 0; i < els.length; i++) {
        if (els[i].classList.contains("hidden")) {
            els[i].classList.remove("hidden");
            document.getElementById("button").innerText = "Start knitting!";
        } else {
            els[i].classList.add("hidden");
            document.getElementById("button").innerText = "Knit a new pattern!";
        }
    }

    // toggle pattern display
    var el = document.getElementById("pattern-display");
    if (el.classList.contains("hidden")) {
        el.classList.remove("hidden");
    } else {
        el.classList.add("hidden");
    }
}

var numPatternRepeats = 0;
var numStitchGroups = 0;
var stitchGroup = 0;

// advance through stitch groups by hitting spacebar or clicking/tapping on pattern
document.addEventListener('keyup', event => {
    if (event.code === 'Space' && document.activeElement.nodeName !== "TEXTAREA") {
        incrementStitchGroup();
    }
})

document.getElementById("pattern-rows").addEventListener("click", event => {
    incrementStitchGroup();
})