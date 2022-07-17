var alltaglocs = [];
var NEsFoundInThisContext = new Map();
var prevContextStart = 0;
var prevContextEnd = 0;
var ORIGINAL_BG_COLOR = document.body.style.backgroundColor;

/**
 * 
 * This class will change the html body content to add highlight color to strings copied from the website. It works around internal html tags that may otherwise hinder a naive highlighting approach.
 * I do not guarentee this code is optimal or functions in all cases, but I used this for a quick mockup for a different task. I do not code Javascript in general
 * so the provided structure and style will probably be shit. The first found matched strings are the ones highlighted. The three public facing functions are:
 * 
 * addCol(stringFromWebsite, stringHTMLcolor)
 *   - This is the highlight functions. It finds the first match of stringFromWebsite in the HTML body, and colors it stringHTMLcolor. 
 * 
 * undo()
 *   - This undoes your previous highlight. 
 * 
 * 
 * **DO NOT USE. BROKEN and NOT DEBUGGED FOR THIS GENERAL TASK (You are welcome to though): **
 * addContext(stringfromwebsite)
 *   - This allows you to enter a large chunk of string from the website to act as a search substring, to help you highlight the correct string. 
 * 
 */

/*
* This is a helper method for addContext()
*/
function setprevContextStart(num){
    prevContextStart = num;
};

/*
* This is a helper method for addContext() 
*/
function setprevContextEnd(num){
    prevContextEnd = num;
};

/*
* Public facing method 
* Basically treats the given contextstring (as copied plain text from webpage) as the search area for a later addCol() call. 
* If you want to highlight a string, only the first string match will highlight. If you are trying to highlight a string that isn't unique, the wrong one might be highlighted.
* Adding a context first will reduce the search space to inside this context, so the correct string can be highlighted. 
*/
function addContext(contextstring){
    var [start, end] = htmlsearchRecursive(contextstring, document.body.innerHTML);

    if (start == -1) {
        alltaglocs = alltaglocs.concat([[[-1,-1], [-1,-1]]]);
        return;
    }
    var smark = markS(ORIGINAL_BG_COLOR);
    setprevContextStart(start);
    setprevContextEnd(end);
    var newbody = highlight(ORIGINAL_BG_COLOR, prevContextStart, prevContextEnd);
    document.body.innerHTML = newbody;
    NEsFoundInThisContext.clear();
};


/*
* Builds start tag.
*/
function markS(color){
    let builtstring = " <mark style=\"background-color:" + color + "\"> ";
    return builtstring;
};

/*
* Builds end tag. 
*/
function markE(){
    let builtstring = " </mark> ";
    return builtstring;
};


/*
* Helper function for highlight(). Goes through the html string and handles internal tags. 
*/
function highlightInside(mid, starttag, endtag, startLocOffset){
    function Tag(){
        this.taglocs = [];
        this.addedtagwidth = 0;
        this.push = function(tag, where){
            let tagstartloc = where + this.addedtagwidth + startLocOffset;
            this.taglocs.push([tagstartloc, tagstartloc + tag.length]);
            this.addedtagwidth += tag.length;
        }
    }

    let finalhtmllist = [];
    finalhtmllist.push(starttag);
    taginfo = new Tag();
    taginfo.push(starttag, 0);

    let inTag = false;
    let inMark = true;
    for(var ch_i = 0; ch_i<mid.length; ch_i++){
        let ch = mid[ch_i];
        if ( ch === '<' && inMark){
            inTag = true;
            finalhtmllist.push(endtag);
            taginfo.push(endtag, ch_i);
            inMark = false;
        } else if ( inTag && ch === '>') {
            inTag = false;
        } else if (inTag || /\s/.test(ch) ) {  // if in a tag or is a whitespace
            // pass to just add it
        } else if (ch === '<' && !inMark){
            inTag = true;

        } else if (!inMark) {  //Havent begun mark yet, not inTag.
            finalhtmllist.push(starttag);
            taginfo.push(starttag, ch_i);
            inMark = true;
        }
        finalhtmllist.push(ch);
    }
    if (!inTag && inMark){
            finalhtmllist.push(endtag);
            taginfo.push(endtag, ch_i);
            inMark = false;
    }
    return [finalhtmllist.join(''), [taginfo.taglocs], taginfo.addedtagwidth]
}


/*
* Helper function. Pre and Postpends the color tags onto the highlighted content. Will work around other tags. 
*/
function highlight(color, start, end){
    var body = document.body.innerHTML;
    var starttag    = markS(color);
    var endtag      = markE();
    var prefix      = body.substring(0, start);
    var mid         = body.substring(start, end);
    var suffix      = body.substring(end);
    var insideresults = highlightInside(mid, starttag, endtag, start);

    // highlight everythign until you hit an end tag, and then recall this same function for substring after that tag
    var newbody = prefix + insideresults[0] + suffix;
    alltaglocs = alltaglocs.concat(insideresults[1]);  // keep track of where you put tags
    setprevContextEnd(prevContextEnd+insideresults[2]);  // lengthen new context by the mark lengths
    return newbody;
}

/*
* Public facing method. "hl" is the english string you'd like to highlight, as copied from a website. 
* Color is any html understood color. "Yellow", "green", "RED", "blue", whatever. 
*/
function addCol(hl, color){
    console.log("STARTING")
    var highlighted = hl.trim()
    var body = document.body.innerHTML;
    console.log("GOT BODY")
    var samecount = (NEsFoundInThisContext.has(highlighted)) ? NEsFoundInThisContext.get(highlighted) + 1 : 1;
    var searchStartLoc = prevContextStart;
    console.log("STARTING RECUR")
    var offsets = htmlsearchRecursive(highlighted,  document.body.innerHTML);
    console.log("GOT RECURS" + String(offsets))
    if (offsets[0] == -1) {
        alltaglocs = alltaglocs.concat([[[-1,-1], [-1,-1]]]);
        return;
    }

    for(var findingword=1; findingword < samecount; findingword++){
        searchStartLoc = searchStartLoc + offsets[1];
        offsets = htmlsearchRecursive(highlighted, body.substring(searchStartLoc, prevContextEnd));
        if (offsets[0] == -1) {
            alltaglocs = alltaglocs.concat([[[-1,-1], [-1,-1]]]);
            return;
        }
    }

    var start = searchStartLoc + offsets[0];
    var end = searchStartLoc + offsets[1];
    var newbody = highlight(color, start, end);
    document.body.innerHTML = newbody;
    console.log(newbody)
    NEsFoundInThisContext.set(highlighted, samecount);

};

/*
* public facing method.
* undoes the previous highlight command. 
*/ 
function undo() {
    if (!alltaglocs){
        return;
    }
    var alltagstoundo = alltaglocs.pop();
    if (alltagstoundo[0] == -1) {  // [[-1,-1], [-1,-1]]
        console.log("Last item wasn't found, no highlighting to undo.")
        return;
    }
    var body = document.body.innerHTML;
    var htmlbuilt = [];
    htmlbuilt.push(body.substring(0, alltagstoundo[0][0]));
    var prevend = alltagstoundo[0][1];
    var shrinkage = alltagstoundo[0][1] - alltagstoundo[0][0];
    for (var t=1; t < alltagstoundo.length; t++){
        htmlbuilt.push(body.substring(prevend, alltagstoundo[t][0]));
        shrinkage += (alltagstoundo[t][1] - alltagstoundo[t][0]);
        prevend = alltagstoundo[t][1];
    }
    htmlbuilt.push(body.substring(alltagstoundo[alltagstoundo.length - 1][1]))
    document.body.innerHTML = htmlbuilt.join('');
    setprevContextEnd(prevContextEnd - shrinkage);
};


/*
* Helper method for htmlSearchRecursive.
*/
function searchinner(lostboy, context){
    if (!lostboy) {
        return 1;
    }
    if (!context) {
        return -1;
    }
    var i = 0;
    var lostboyI = 0;
    var stuck = true;
    while(stuck) {
        if (i > context.length){
            return -1;
        }
        stuck = false;
        if (/\s/.test(context[i])) {
            stuck = true;
            i += 1;
        }
        if (context[i] == '<') {
            while (context[i] != '>') {
                stuck = true;
                i+=1;
            }
            i += 1;
        }
        // deal with &nbsp;
        // if &thing;, then skip to the end of it in context, skip to 1 over in lostboy.
        var badguy = []
        if (context[i] === '&' && i+1<context.length && !/\s/.test(context[i+1])) {
             while (context[i] != ';') {
                badguy.push(context[i]);
                stuck = true;
                i+=1;
            }
            badguy.push(context[i]);
            i += 1;
            if(badguy.join('') !== '&nbsp;'){  // we took out all the spaces already from lostboy so nothing to skip over.
                lostboyI += 1;
            }

        }
    }
    // special rule to deal with &nbsp;

    if (lostboy[lostboyI] === context[i]){
        ret = searchinner(lostboy.substring(lostboyI + 1), context.substring(i+1));
        if (ret == -1){
            return -1;
        } else {
            return ret + 1 + i;
        }
    }
    return -1;
};


/* Helper method. 
* Finds the substring "lostboy" in the html search area "context". "Context" is a substring of the html body.
*/
function htmlsearchRecursive(lostboy, context) {
    lostboy = lostboy.replace(/\s/g,'');
    for (var cc = 0; cc < context.length; cc++){
        if (lostboy[0] == context[cc]) {
            var ret = searchinner(lostboy.substring(1), context.substring(cc+1));
            if (ret == -1){
                continue
            } else {
                return [cc, cc+ret];
            }
        }
    }
    return [-1, -1];
};

function testSearch(what){
    var b = document.body.innerHTML;
    var t0 = performance.now();
    var res = b.search(what);
    console.log('searchn ',performance.now()-t0, " ms, ", res);
    if (res != -1) { console.log(b.substring(res, res+what.length));}
    /*
    var t0 = performance.now();
    var res = htmlsearch(what, b);
    console.log('charles ',performance.now()-t0, " ms, ", res);
    if (res[0] != -1) { console.log(b.substring(res[0], res[1]));}
    */
    var t0 = performance.now();
    var res = htmlsearchRecursive(what,b);
    console.log('minerec ',performance.now()-t0, " ms, ", res);
    if (res[0] != -1) { console.log(b.substring(res[0], res[1]));}
};