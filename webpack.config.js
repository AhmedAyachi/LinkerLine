
const pkgjson=require("./package.json");
const entryFilePath="./src/index.js";

module.exports={
    mode:"production",
    entry:{
        linkerline:entryFilePath,
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
