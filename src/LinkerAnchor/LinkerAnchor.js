import LeaderLine from "../LeaderLine";
import {toLeaderLineAnimationOptions} from "../index";


export default class LinkerAnchor {
    
    static Point(element,options){
        return LeaderLine.pointAnchor(element,options);
    }

    static Area(element,options){
        return LeaderLine.areaAnchor(element,options);
    }

    static MouseHover(element,options){
        if(options){
            const {onToggle}=options;
            if(onToggle) options.onSwitch=onToggle;
            options.animOptions=toLeaderLineAnimationOptions(options.animation);
        }
        return LeaderLine.mouseHoverAnchor(element,options);
    }
}
