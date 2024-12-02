

module.exports={
    mode:"production",
    output:{
        library:{
            type:"umd",
            name:"LinkerLine",
            export:["default"],
        },
        filename:"linkerline.min.js",
    },
};
