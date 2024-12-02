

module.exports={
    mode:"production",
    entry:"./src/index.js",
    output:{
        library:{
            type:"umd",
            name:"LinkerLine",
            export:["default"],
        },
        filename:"linkerline.min.js",
    },
};
