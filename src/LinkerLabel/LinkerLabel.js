import LeaderLine from "../LeaderLine";


export default class LinkerLabel {
    constructor(text,options){
        const {style}=options||{};
        if(style){
            const {offset,fontSize}=style;
            if(typeof(offset)==="number") style.offset=[offset,offset];
            /**
             * added because numbers do not work on firefox. 
             */
            if(typeof(fontSize)==="number") style.fontSize=`${fontSize}px`;
            if(!style.outlineColor) style.outlineColor="transparent";
        }
        return (()=>{
            switch(options.on||"path"){
                case "path": return LeaderLine.pathLabel;
                case "element": return LeaderLine.captionLabel;
                default: throw new Error(`the "on" option can be either "path" or "element".`);
            }
        })()(text,{
            ...style,
            lineOffset:options?.lineOffset,
        });
    }
}
