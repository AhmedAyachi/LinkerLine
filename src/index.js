

export {default as LinkerPlug} from "./LinkerPlug/LinkerPlug";
export {default as LinkerLine} from "./LinkerLine/LinkerLine";
export {default as LinkerLabel} from "./LinkerLabel/LinkerLabel";
export {default as LinkerChain} from "./LinkerChain/LinkerChain";
export {default as LinkerAnchor} from "./LinkerAnchor/LinkerAnchor";

export const toLeaderLineAnimationOptions=(options)=>{
    if(options&&(typeof(options)==="object")){
        options.timing=options.easing;
    };
    return options;
}
