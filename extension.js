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


//-------------WRITE YOUR FUNCTIONS ABOVE THIS LINE------------------
tools.exportAll(exports)
