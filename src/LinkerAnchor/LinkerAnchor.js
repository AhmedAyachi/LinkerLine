import LeaderLine from "../LeaderLine";
import {toLeaderLineAnimationOptions} from "../index";


export default class LinkerAnchor {
    
    static Point(element,options){
        return LeaderLine.pointAnchor(element,options);
    }

    static MouseHover(element,options){
        if(options){
            const {animation}=options;
            options.onSwitch=options.onToggle;
            options.animOptions=toLeaderLineAnimationOptions(animation);
            options.showEffectName=(()=>{
                if(typeof(animation)==="string") return animation||"none";
                else return (animation&&animation.effect)||"none";
            })();
        } else options={showEffectName:"none"};
        return LeaderLine.mouseHoverAnchor(element,options);
    }

    static Area(element,options){
        if(options){
            options.color=options.strokeColor;
            options.size="strokeWidth" in options?options.strokeWidth:2;
            options.shape=(()=>{
                const {shape}=options;
                switch(shape){
                    case "circle": 
                        throw new Error(`"circle" shape deprecated, use "ellipse" instead`);
                    case "ellipse": return "circle";
                    default: return shape;
                };
            })();
        }
        const anchorData=LeaderLine.areaAnchor(element,options);
        const anchor=LeaderLine.anchors[anchorData._id],{svg,conf}=anchor;
        conf.update=(()=>{
            const update=conf.update.bind(conf);
            return (...args)=>{
                update(...args);
                const {bBoxRel}=anchor.curStats;
                ["left","top"].forEach(side=>{ 
                    svg.style[side]=bBoxRel[side];
                });
            };
        })();
        svg.style.zIndex=1036372536;
        element.appendChild(svg);
        return anchorData;
    }
}
