var fs = require('fs');


// Preload Teplates
/*******************/
fs.writeFileSync('templates.js', '');
var pathToTemplates = '../../res/templates/';
var templates = fs.readdirSync(pathToTemplates);
for(var i in templates) {
    console.log('appending ' + templates[i]);
    var data = fs.readFileSync(pathToTemplates + templates[i], 'utf8');
    // replace multiple Spaces with a single space
    data = data.replace(/\s{2,}/g,' ');
    // removes all 3 types of line breaks
    data = data.replace(/(\r\n|\n|\r)/gm,'');
    // replace single quotes with double qoutes
    data = data.replace(/'/g,'"');
    // remove all commetns
    data = data.replace(/<!--(.*?)-->/gm,'');

    fs.appendFile('templates.js', "brif.templates['"+templates[i].split('.')[0]+"']='" + data + "'\n", function (err) {
        if (err) throw err;
    });
}


// Pre-include less files
/************************/
var pathToCss = '../../css/';
var styles = fs.readdirSync(pathToCss);
fs.writeFileSync(pathToCss+'imports.less', '');
for(var j in styles) {
    console.log('appending ' + styles[j]);
    if(styles[j] != 'imports.less') {
        fs.appendFile(pathToCss + 'imports.less', '@import "'+styles[j]+'";\n', function (err) {
            if (err) throw err;
        });   
    }
}

