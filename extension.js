const Toolpackage = require('chioro-toolbox/toolpackage')
const base = require('chioro-toolbox/toolbase')
const { htmlToText } = require('html-to-text');

// Toolbox extensions are organized as "Tool Packages".
// A ToolPackage is a collection of tool descriptions, including tests.
// Exporting a ToolPackage object makes a JS module a toolbox extension (see last line)
// base refers to the standard chioro library and can be used anywhere in the code with
// the following syntax: base.nameOfTheStandardFunction

const tools = new Toolpackage("My great toolbox extension")

function posHtmlToText(inputString) {
    return htmlToText(inputString, { wordwrap: null });
}
tools.add({
    id: "posHtmlToText",
    impl: posHtmlToText,
    aliases: {
        en: "posHtmlToText",
        de: "posHtmlToText"
    },
    args: {
        en: "inputString",
        de: "inputString"
    },
    tags: ["Possehl"],
    tests: () => {
        tools.expect(posHtmlToText("<h1>Title</h1><p>total</p>hello<br>w&ouml;rld")).toBe('TITLE\n\ntotal\n\nhello\nwörld');
    }
})
//-----------------------------------------------------------------------------------------------------

// function niceFunction22(input1, input2) {
//     return base.upperCaseText(input1) + " " + base.lowerCaseText(input2);
// }
// tools.add({
//     id: "niceFunction22",
//     impl: niceFunction22,
//     aliases: {
//         en: "niceFunction22",
//         de: "netteFunktion22"
//     },
//     args: {
//         en: "input1, input2",
//         de: "eingabe1, eingabe2"
//     },
//     tags: ["Possehl"],
//     tests: () => {
//         tools.expect(niceFunction22("hello", "world")).toBe('HELLO world');
//         tools.expect(niceFunction22("Helping", "World")).toBe('HELPING world');
//     }
// })
//-----------------------------------------------------------------------------------------------------
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
    tags: ["Possehl"],
    tests: () => {
        tools.expect(posStripHtml_Test("<br><p>total</p>hello", "","","")).toBe('totalhello');
    }
})
//-----------------------------------------------------------------------------------------------------
function buildCloudinaryPublicId(prefix,image) {
    let id = "";
    if (image.endsWith(".jpg") || image.endsWith(".png") || image.endsWith(".tiff") || image.endsWith(".jpeg") || image.endsWith(".gif") || image.endsWith(".pdf") || image.endsWith(".bmp")) {
        id = image.replace(/\.[^.]+$/, ""); // wenn Bilddateiendung gefunden - entfernen
    } else {
        id = image; // ansonsten kann das direkt verwendet werden
    }
    id = replaceInText(id, /:|\/|https|http|www\./g, "");
    id = prefix.concat(id);
    return id;
}
tools.add({
    id: "buildCloudinaryPublicId",
    impl: buildCloudinaryPublicId,
    aliases: {
        en: "buildCloudinaryPublicId",
        de: "buildCloudinaryPublicId"
    },
    args: {
        en: "prefix,image",
        de: "prefix,image"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posIdentifyAffectedOffers(orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de) {
    var returnvalue = 0;
    var units = ["c62", "stk", "pce"];
    if(units.indexOf(orderUnit.toLowerCase()) == -1){ returnvalue = 1; }
    if(quantityMin > 1){ returnvalue = 1; }
    if(quantityInterval > 1){ returnvalue = 1; }
    if(lowerBound.length > 1 || (lowerBound.length == 1 && lowerBound[0] > 1)){ returnvalue = 1; }
    if(hazardous > 1){ returnvalue = 1; }
    if(mimeDescHazard.length > 0){ returnvalue = 1; }
    if(mimePurposeHazard.length > 0){ returnvalue = 1; }
    if(tax != '0.19' && tax != '0,19'){ returnvalue = 1; }
    if(price_de <= "0"){ returnvalue = 1; }
    return returnvalue;
}
tools.add({
    id: "posIdentifyAffectedOffers",
    impl: posIdentifyAffectedOffers,
    aliases: {
        en: "posIdentifyAffectedOffers",
        de: "posIdentifyAffectedOffers"
    },
    args: {
        en: "orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de",
        de: "orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function removeFileExtension(image) {
    let result = "";
    if (image.endsWith(".jpg") || image.endsWith(".png") || image.endsWith(".tiff") || image.endsWith(".jpeg") || image.endsWith(".gif") || image.endsWith(".pdf") || image.endsWith(".bmp")) {
        result = image.replace(/\.[^.]+$/, ""); // wenn Bilddateiendung am Ende gefunden - entfernen
    } else {
        result = image; // ansonsten muss das direkt verwendet werden
    }
    return result
}
tools.add({
    id: "removeFileExtension",
    impl: removeFileExtension,
    aliases: {
        en: "removeFileExtension",
        de: "entferneDateiExtension"
    },
    args: {
        en: "image",
        de: "image"
    },
    tags: ["Possehl"],
    tests: () => {
        tools.expect(removeFileExtension("bild.jpg")).toBe('bild');
        tools.expect(removeFileExtension("bild.jpg.max")).toBe('bild.jpg.max');
        tools.expect(removeFileExtension("https://210512ytnvmdy73ryr4.nextcloud.hosting.zone/s/CsAqt7bybpmJPs7/download")).
                                  toBe('https://210512ytnvmdy73ryr4.nextcloud.hosting.zone/s/CsAqt7bybpmJPs7/download');
    }
})
//-----------------------------------------------------------------------------------------------------
function posCheckPriceFormat(price) {
    //   if (containsText(price, /\d+\.\d+\.\d+(\.)?/)) { // min. two dots (million, trillion,...)
    //       price = replaceInText('.','') \d{1,20},\d{1}(?!\d)
    //   }
    if (containsText(price, /\d{1,20}\.\d{1}(?!\d)/)) { // point and only one Cent digit (american format)
        price = replaceInText(price, '.', ',')}
    if (containsText(price, /\d{1,20},\d{1}(?!\d)/)) { // only one Cent digit
        price = price +"0"}
    if (containsText(price, /\d{1,20},\d+\.\d{2}(?!\d)/)) { // is American format (, /.)
        price = replaceInText(replaceInText(price,',',''),'.',',')}
    if (containsText(price, /\d{1,20}\.\d+,\d{2}(?!\d)/)) { // is German format with thousand-sep. (. /,)
        price = replaceInText(price,'.','')}
    if (containsText(price, /\d{1,20}/) && !containsText(price,',') && !containsText(price,'.')) { // is integer
        price = concatenateText(price,',00')}
    if (containsText(price, /\d{1,20}\.\d{2}(?!\d)/)) { // dot and two digits behind: transform to German format
        price = replaceInText(price,'.',',')}
    if (containsText(price, '.')) { // Contains dot and does not fulfill any other rule and does not have exactly two digits after dot: Invalid.
        price = '0,00'}
    if (containsText(price, /^\d+([\.,]\d{2}(?!\d))/)) { // Standard: abcd,xy format
        price = price;}
    if (!containsText(price, /^\d+,\d{2}(?!\d)/)) { // Standard: abcd,xy format
        price = '0,00';}
    if (containsText(price, /^\d+,\d{2}(?!\d)/)) { price = price; }// Standard: abcd,xy format
    return price;
}
tools.add({
    id: "posCheckPriceFormat",
    impl: posCheckPriceFormat,
    aliases: {
        en: "posCheckPriceFormat",
        de: "posCheckPriceFormat"
    },
    args: {
        en: "price",
        de: "price"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function getBmeCatImage() {
    var sortBy = function(field) {
        return function(a, b) {
            return (a[field] > b[field]) - (a[field] < b[field])
        };
    }
    var allImageNames = attributes()
        .filter(attribute => attribute.startsWith('medium normal'))
        .map(attributeStartingWithMedium => ($(attributeStartingWithMedium)))
    if(allImageNames.length > 0) {
        var imageName = allImageNames.sort(sortBy('MIME_ORDER'))[0];
        return replaceInText(imageName['MIME_SOURCE'], /^http:/, "https:");
    }
    return "";
}
tools.add({
    id: "getBmeCatImage",
    impl: getBmeCatImage,
    aliases: {
        en: "getBmeCatImage",
        de: "getBmeCatImage"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function isImage(url) {
    let request = new XMLHttpRequest();
    request.open("GET", url, true);
    request.send();
    request.onload = function() {
        status = request.status;
        if (request.status == 200) //if(statusText == OK)
        {
            return true;
        } else {
            return false;
        }
    }
}
tools.add({
    id: "isImage",
    impl: isImage,
    aliases: {
        en: "isImage",
        de: "isImage"
    },
    args: {
        en: "url",
        de: "url"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function fetchRealUrl(url) {
    if(url && url.startsWith && url.startsWith("http")) {
       return JSON.parse(_apiFetcher.headUrl($('image'), false)).location[0];
    }
    return url;
}
tools.add({
    id: "fetchRealUrl",
    impl: fetchRealUrl,
    aliases: {
        en: "fetchRealUrl",
        de: "fetchRealUrl"
    },
    args: {
        en: "url",
        de: "url"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posStripHtmlTags(inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR) {
    var outputString = "";
    outputString = ersetzeInText(inputString, /<br[^>]*>/g, ersatzFuerBR);
    outputString = ersetzeInText(outputString, /<[^/][^>]*>/g, ersatzOeffnend);
    outputString = ersetzeInText(outputString, /<[^>]*>/g, ersatzSchliessend);
    outputString = ersetzeInText(outputString,"openingTag", ersatzOeffnend)
    outputString = ersetzeInText(outputString,"closingTag", ersatzSchliessend);
    outputString = ersetzeInText(outputString,"&auml;","ä");
    outputString = ersetzeInText(outputString,"&uuml;","ü");
    outputString = ersetzeInText(outputString,"&ouml;","ö");
    outputString = ersetzeInText(outputString,"&szlig;","ß");
    outputString = ersetzeInText(outputString,"&Auml;","Ä");
    outputString = ersetzeInText(outputString,"&Uuml;","Ü");
    outputString = ersetzeInText(outputString,"&Ouml;","Ö");
    outputString = ersetzeInText(outputString,"&nbsp;"," "); // no-brake space
    outputString = base.normalisiereLücken(outputString);
    outputString.trim();
    return outputString
}
tools.add({
    id: "posStripHtmlTags",
    impl: posStripHtmlTags,
    aliases: {
        en: "posStripHtmlTags",
        de: "posStripHtmlTags"
    },
    args: {
        en: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR",
        de: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function dateBeforeToday(relevantDateField) {
    var expired = 0;
    if (relevantDateField && relevantDateField != '') {
        var dateParts = relevantDateField.split('-');
        var dateValue = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]);
        var today = new Date();
        if (dateValue < today) {
            expired = 1;
        }
    }
    return expired;
}
tools.add({
    id: "dateBeforeToday",
    impl: dateBeforeToday,
    aliases: {
        en: "dateBeforeToday",
        de: "dateBeforeToday"
    },
    args: {
        en: "relevantDateField",
        de: "relevantDateField"
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posPrice() {
    return {"currency": arguments[0],"value":arguments[1]};
}
tools.add({
    id: "posPrice",
    impl: posPrice,
    aliases: {
        en: "posPrice",
        de: "posPrice"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posCategory() {
    var result = [];
    var categories = [];
    for (var i = 2; i < arguments.length; i++) {
        categories.push(arguments[i]);
    }
    result.push({"key": arguments[0],"primary_category":arguments[1],"categories":categories});
    return {"key": arguments[0],"primary_category":arguments[1],"categories":categories};
}
tools.add({
    id: "posCategory",
    impl: posCategory,
    aliases: {
        en: "posCategory",
        de: "posCategory"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posSimple() {
    var result = [];
    for (var i=0; i < arguments.length; i++) {
        result.push(arguments[i]);
    }
    return {"type": "simple", "value": result};
}
tools.add({
    id: "posSimple",
    impl: posSimple,
    aliases: {
        en: "posSimple",
        de: "posSimple"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posAsset() {
    let result = {};
    if (arguments[0] == "product_img"){
        return {"type":arguments[0],
            "uri": arguments[1],
            "description":arguments[2],
            "mimeType": arguments[3],
            "sort": arguments[4]
        };
    }
    if (arguments[0] == "safety_data_sheet"){
        return {"type":arguments[0],
            "uri": arguments[1],
            "description":arguments[2],
            "mimeType": arguments[3]
        };
    }
}
tools.add({
    id: "posAsset",
    impl: posAsset,
    aliases: {
        en: "posAsset",
        de: "posAsset"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posDescription() {
    let result = [];
    if (arguments.length < 2){
        result.push({"lang":"de","value":arguments[0]});
    } else {
        for (var i=0; i < arguments.length; i += 2) {
            result.push({"lang":arguments[i],"value":arguments[i+1]});
        }
    }
    return {"type": "description", "value": result};
}
tools.add({
    id: "posDescription",
    impl: posDescription,
    aliases: {
        en: "posDescription",
        de: "posDescription"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function posLocalize() {
    let result = [];
    if (arguments.length < 2){
        result.push({"lang":"de","value":arguments[0]});
    } else {
        for (var i=0; i < arguments.length; i += 2) {
            result.push({"lang":arguments[i],"value":arguments[i+1]});
        }
    }
    return {"type": "localized_text", "value": result};
}
tools.add({
    id: "posLocalize",
    impl: posLocalize,
    aliases: {
        en: "posLocalize",
        de: "posLocalize"
    },
    args: {
        en: "",
        de: ""
    },
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function sortSpecial(images,order) {
    let sortedArray=[];
    for (i=0; i<images.length; i++) {
        for (j=0; j<images.length; j++) {
            if(i+1==order[j]) {
                sortedArray.push(images[j])
            }
        }
    }
    return sortedArray;
}
tools.add({
    id: "sortSpecial",
    impl: sortSpecial,
    aliases: {
        en: "sortSpecial",
        de: "sortSpecial"
    },
    args: {
        en: "images,order",
        de: "images,order"
    },
    tags: ["Possehl"]

})

//-------------WRITE YOUR FUNCTIONS ABOVE THIS LINE------------------
tools.exportAll(exports)
