const Toolpackage = require('chioro-toolbox/toolpackage')
const base = require('chioro-toolbox/toolbase')

// Toolbox extensions are organized as "Tool Packages".
// A ToolPackage is a collection of tool descriptions, including tests.
// Exporting a ToolPackage object makes a JS module a toolbox extension (see last line)
// base refers to the standard chioro library and can be used anywhere in the code with
// the following syntax: base.nameOfTheStandardFunction

const tools = new Toolpackage("My great toolbox extension")


function niceFunction22(input1, input2) {
    return base.upperCaseText(input1) + " " + base.lowerCaseText(input2);
}
tools.add({
    id: "niceFunction22",
    impl: niceFunction22,
    aliases: {
        en: "niceFunction22",
        de: "netteFunktion22"
    },
    args: {
        en: "input1, input2",
        de: "eingabe1, eingabe2"
    },
    tags: ["tag1", "tag2"],
    tests: () => {
        tools.expect(niceFunction22("hello", "world")).toBe('HELLO world');
        tools.expect(niceFunction22("Helping", "World")).toBe('HELPING world');
    }
})

function posStripHtml_Test(inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR) {
    var outputString = "";
    outputString = base.ersetzeInText(inputString, /<br[^>]*>/g, ersatzFuerBR);
    outputString = base.ersetzeInText(outputString, /<[^\/][^>]*>/g, ersatzOeffnend);
    outputString = base.ersetzeInText(outputString, /<[^>]*>/g, ersatzSchliessend);
    outputString = base.ersetzeInText(outputString,"openingTag", ersatzOeffnend);
    outputString = base.ersetzeInText(outputString,"closingTag", ersatzSchliessend);
    outputString = base.ersetzeInText(outputString,"&auml;","ä");
    outputString = base.ersetzeInText(outputString,"&uuml;","ü");
    outputString = base.ersetzeInText(outputString,"&ouml;","ö");
    outputString = base.ersetzeInText(outputString,"&szlig;","ß");
    outputString = base.ersetzeInText(outputString,"&Auml;","Ä");
    outputString = base.ersetzeInText(outputString,"&Uuml;","Ü");
    outputString = base.ersetzeInText(outputString,"&Ouml;","Ö");
    outputString = base.ersetzeInText(outputString,"&nbsp;"," "); // no-brake space
    outputString = base.normalisiereLücken(outputString);
    outputString.trim();
    return outputString;
}
tools.add({
    id: "posStripHtml_Test",
    impl: posStripHtml_Test,
    aliases: {
        en: "posStripHtml_Test",
        de: "posStripHtml_Test"
    },
    args: {
        en: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR",
        de: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR"
    },
    tags: ["tag1", "tag2"],
    tests: () => {
        tools.expect(posStripHtml_Test("<br><p>total</p>hello", "","","")).toBe('totalhello');
    }
})


//-------------WRITE YOUR FUNCTIONS ABOVE THIS LINE------------------
tools.exportAll(exports)
