
const pkgjson=require("./package.json");
const entryFilePath="./src/index.js";

module.exports={
    mode:"production",
    entry:{
        linkerline:entryFilePath,
        ["linkerline-"+pkgjson.version]:entryFilePath,
    },
    output:{
        library:{
            type:"umd",
            name:"LinkerLine",
            export:["default"],
        },
        filename:"[name].min.js",
    },
};
