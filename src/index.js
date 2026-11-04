

export {default as LinkerPlug} from "./LinkerPlug/LinkerPlug.js";
export {default as LinkerLine} from "./LinkerLine/LinkerLine.js";
export {default as LinkerLabel} from "./LinkerLabel/LinkerLabel.js";
export {default as LinkerChain} from "./LinkerChain/LinkerChain.js";
export {default as LinkerAnchor} from "./LinkerAnchor/LinkerAnchor.js";

export const toLeaderLineAnimationOptions=(options)=>{
    if(options&&(typeof(options)==="object")){
        options.timing=options.easing;
    };
    return options;
}
