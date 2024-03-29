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
    let htmlToTextLogic = inp => htmlToText(inp, { wordwrap: null, preserveNewlines: true });
    if(Array.isArray(inputString)) {
        //localized text support
        inputString.map(tx => {
            tx['value'] = htmlToTextLogic(tx['value'])
            return tx;
        });

    } else {
        inputString = htmlToTextLogic(inputString);
    }
    return inputString;
}
tools.add({
    id: "posHtmlToText",
    impl: posHtmlToText,
    aliases: {
        en: "posHtmlToText",
        de: "posHtmlToText"
    },
    argsOld: {
        en: "inputString",
        de: "inputString"
    },
    args: [
        {
            "key": "inputString",
            "label_en": "Value",
            "label_de": "Wert",
            "type": "text",
            "desc_en": "Input HTML which will be converted to text",
            "desc_de": "HTML das zu einem Text umgewandelt wird"
        }
    ],
    tags: ["Possehl"],
    tests: () => {
        tools.expect(posHtmlToText("<h1>Title</h1><p>total</p>hello<br>w&ouml;rld")).toBe('TITLE\n\ntotal\n\nhello\nwörld');
    }
})
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
    argsOld: {
        en: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR",
        de: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR"
    },
    args: [
        {
            "key": "inputString",
            "label_en": "Input Html",
            "label_de": "Eingabe Html",
            "type": "text",
            "desc_en": "Input HTML which will be converted to text",
            "desc_de": "HTML das zu einem Text umgewandelt wird"
        },
        {
            "key": "ersatzOeffnend",
            "label_en": "Opening tag",
            "label_de": "Öffnender Tag",
            "type": "text",
            "desc_en": "Substitute for opening tag",
            "desc_de": "Ersatz für öffnenden Tag"
        },
        {
            "key": "ersatzSchliessend",
            "label_en": "Closing tag",
            "label_de": "Schliessender Tag",
            "type": "text",
            "desc_en": "Substitute for closing tag",
            "desc_de": "Ersatz für schliessenden  Tag"
        },
        {
            "key": "ersatzFuerBR",
            "label_en": "Line break",
            "label_de": "Zeilenumbruch",
            "type": "text",
            "desc_en": "Substitute for line break",
            "desc_de": "Ersatz für Zeilenumbruch"
        }
    ],
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
    argsOld: {
        en: "prefix,image",
        de: "prefix,image"
    },
    args: [
        {
            "key": "prefix",
            "label_en": "Prefix",
            "label_de": "Präfix",
            "type": "text",
            "desc_en": "Prefix",
            "desc_de": "Präfix"
        },
        {
            "key": "image",
            "label_en": "Image",
            "label_de": "Bild",
            "type": "text",
            "desc_en": "Image",
            "desc_de": "Bild"
        }
    ],
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
    if(hazardous > 0){ returnvalue = 1; }
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
    argsOld: {
        en: "orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de",
        de: "orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de"
    },
    args: [],
    tags: ["Possehl"]
})
//-----------------------------------------------------------------------------------------------------
function excludedOffers(orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de) {
    var returnvalue = 0;
    var units = ["c62", "stk", "pce"];
    if(units.indexOf(orderUnit.toLowerCase()) == -1){ returnvalue = 1; }
    if(quantityMin > 1){ returnvalue = 1; }
    if(quantityInterval > 1){ returnvalue = 1; }
    if(lowerBound.length > 1 || (lowerBound.length == 1 && lowerBound[0] > 1)){ returnvalue = 1; }
    if(hazardous > 0){ returnvalue = 1; }
    if(mimeDescHazard.length > 0){ returnvalue = 1; }
    if(mimePurposeHazard.length > 0){ returnvalue = 1; }
    if(tax != '0.19' && tax != '0,19'){ returnvalue = 1; }
    if(price_de <= "0"){ returnvalue = 1; }
    return returnvalue;
}
tools.add({
    id: "excludedOffers",
    impl: excludedOffers,
    aliases: {
        en: "excludedOffers",
        de: "excludedOffers"
    },
    argsOld: {
        en: "orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de",
        de: "orderUnit, quantityMin, quantityInterval, lowerBound, hazardous, mimeDescHazard, mimePurposeHazard, tax, price_de"
    },
    args: [],
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
    argsOld: {
        en: "image",
        de: "image"
    },
    args: [
        {
            "key": "image",
            "label_en": "Image Path",
            "label_de": "Bild Pfad",
            "type": "text",
            "desc_en": "Image where the extension should be removed",
            "desc_de": "Bild an dem die Extension entfernt wird"
        }
    ],
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
    price = price.trim();
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
    argsOld: {
        en: "price",
        de: "price"
    },
    args: [
        {
            "key": "price",
            "label_en": "Input Prise",
            "label_de": "Preis Eingabe",
            "type": "text",
            "desc_en": "Price which should be checked if formally correct",
            "desc_de": "Preis der auf korrektes Format überprüft wird"
        }
    ],
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "url",
        de: "url"
    },
    args: [
        {
            "key": "url",
            "label_en": "URL input",
            "label_de": "URL Eingabe",
            "type": "text",
            "desc_en": "Input url which will be checked if contains Image",
            "desc_de": "URL welche überprüft wird ob es ein Bild enthält"
        }
    ],
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
    argsOld: {
        en: "url",
        de: "url"
    },
    args: [
        {
            "key": "url",
            "label_en": "URL input",
            "label_de": "URL Eingabe",
            "type": "text",
            "desc_en": "URL",
            "desc_de": "URL"
        }
    ],
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
    argsOld: {
        en: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR",
        de: "inputString, ersatzOeffnend, ersatzSchliessend, ersatzFuerBR"
    },
    args: [
        {
            "key": "inputString",
            "label_en": "Input Html",
            "label_de": "Eingabe Html",
            "type": "text",
            "desc_en": "Input HTML which will be converted to text",
            "desc_de": "Eingabe HTML was zu einem Text umgewandelt wird"
        },
        {
            "key": "ersatzOeffnend",
            "label_en": "Opening tag",
            "label_de": "Öffnender Tag",
            "type": "text",
            "desc_en": "Substitute for opening tag",
            "desc_de": "Ersatz für öffnenden Tag"
        },
        {
            "key": "ersatzSchliessend",
            "label_en": "Closing tag",
            "label_de": "Schliessender Tag",
            "type": "text",
            "desc_en": "Substitute for closing tag",
            "desc_de": "Ersatz für schliessenden  Tag"
        },
        {
            "key": "ersatzFuerBR",
            "label_en": "Line break",
            "label_de": "Zeilenumbruch",
            "type": "text",
            "desc_en": "Substitute for line break",
            "desc_de": "Ersatz für Zeilenumbruch"
        }
    ],
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
    argsOld: {
        en: "relevantDateField",
        de: "relevantDateField"
    },
    args: [
        {
            "key": "relevantDateField",
            "label_en": "Inpute Date",
            "label_de": "Eingabe Datum",
            "type": "text",
            "desc_en": "Date which will be checked if before today",
            "desc_de": "Datum welches übrprüft wird ob es vor dem heutigen Tag liegt"
        }
    ],
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "",
        de: ""
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true
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
    argsOld: {
        en: "images,order",
        de: "images,order"
    },
    args: [],
    tags: ["Possehl"],
    hideOnSimpleMode: true

})

//-------------WRITE YOUR FUNCTIONS ABOVE THIS LINE------------------
tools.exportAll(exports)

