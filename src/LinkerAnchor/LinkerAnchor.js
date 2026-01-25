import LeaderLine from "../LeaderLine";
import {toLeaderLineAnimationOptions} from "../index";


export default class LinkerAnchor {
    
    static Point(element,options){
        return LeaderLine.pointAnchor(element,options);
    }

    static Area(element,options){
        if(options){
            options.color=options.strokeColor;
        }
        const anchorEl=LeaderLine.areaAnchor(element,options);
        console.log("anchorEl",anchorEl);
        console.log("LeaderLine",LeaderLine.a);
        return anchorEl;
    }

    static MouseHover(element,options){
        if(options){
            const {animation}=options;
            options.onSwitch=options.onToggle;
            options.animOptions=toLeaderLineAnimationOptions(animation);
            options.showEffectName=animation&&animation.effect;
        }
        return LeaderLine.mouseHoverAnchor(element,options);
    }
}
