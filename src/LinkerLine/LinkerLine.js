import LeaderLine from "../LeaderLine";
import {toLeaderLineAnimationOptions} from "../index";
import {setLinePlugStyle} from "../LinkerPlug/DefinePlug";


export default class LinkerLine extends LeaderLine { 
    #element;
    #hidden=false;

    constructor(props){
        props.ee=Math.max(Number(props.minGridLength),1)||30;
        props.hide=Boolean(props.hidden);
        super(props);
        this.#hidden=props.hide;
        const {id}=this;
        statics.lineMap[id]=this;
        this.#element=LeaderLine.Se[id].svg;
        this.#element.style.willChange="left,top";
        const {parent=this.end.parentNode}=props;
        if(parent instanceof HTMLElement){
            if(getComputedStyle(parent).position==="static"){
                parent.style.position="relative";
            }
            parent.appendChild(this.element);
            this.position();
            setLinePlugStyle(this);
        }
    }

    set dash(value){
        toLeaderLineDash(value);
        super.dash=value;
    }
    
    #baseSize=super.size;
    position(){
        if(this.removed) throw RemovedLineError("position");
        if(!this.#hidden){
            super.position();
            const {element}=this,parent=element.parentNode;
            const parentRect=parent.getBoundingClientRect();
            let translateX=parent.scrollLeft-parentRect.left-window.scrollX;
            let translateY=parent.scrollTop-parentRect.top-window.scrollY;
            if(statics.isSafari){
                const startZoom=parseFloat(getComputedStyle(this.start).getPropertyValue("zoom"))||1;
                element.style.zoom=startZoom;
                translateX/=startZoom;
                translateY/=startZoom;
                super.setOptions({size:this.#baseSize/startZoom});
            }
            element.style.transform=`translate(${translateX}px,${translateY}px)`;       
        }
    }

    show(effect="none",options){
        if(this.removed) throw RemovedLineError("show");
        this.#hidden=false;
        toLeaderLineAnimationOptions(options);
        super.show(effect,options);
        this.position();
    }

    hide(effect="none",options){
        if(this.removed) throw RemovedLineError("hide");
        this.#hidden=true;
        toLeaderLineAnimationOptions(options);
        super.hide(effect,options);
    }

    remove(){if(!this.removed){
        delete statics.lineMap[this.id];
        document.body.appendChild(this.element);
        super.remove();
    }}

    setOptions(options){
        if(!(Object.getPrototypeOf(options)===Object.prototype)){
            throw new Error("LinkerLine.setOptions expects a plain object as argument.");
        }
        toLeaderLineDash(options.dash);
        super.setOptions(options);
        this.position();
    }

    get id(){ return this._id};
    get element(){ return this.#element };
    get standalone(){ return true };

    get hidden(){ return this.#hidden };
    get removed(){ return !statics.lineMap[this.id] };

    get end(){ return super.end };
    get start(){ return super.start };

    get size(){ return super.size };
    get color(){ return super.color };


    static positionAll(){
        const {lineMap}=statics;
        for(const lineId in lineMap){
            const line=lineMap[lineId];
            if(line.start.isConnected&&line.end.isConnected) line.position();
        }
    }

    static removeAll(filter){
        const targetingAll=typeof(filter)!=="function";
        const {lineMap}=statics;
        for(const lineId in lineMap){
            const line=lineMap[lineId];
            if(line.standalone&&(targetingAll||filter(line))) line.remove();
        }
    }

    static Label(text,options){
        const {on="path"}=options||{};
        if(options){
            const {offset}=options;
            if(typeof(offset)==="number"){
                options.offset=[offset,offset];
            }
            if(!options.outlineColor){options.outlineColor="transparent"};
        }
        const LeaderLineEntity=LeaderLine[on==="path"?"pathLabel":"captionLabel"];
        return LeaderLineEntity(text,options);
        
    }

    static get plugs(){ return Object.keys(LeaderLine.plugs)};
    static get names(){ return Object.keys(LeaderLine.names)};
    static areaAnchor(){ LinkerLine.AreaAnchor() };
    static AreaAnchor(){ throw DeprecatedAnchorError("Area") };
    static pointAnchor(){ LinkerLine.PointAnchor() };
    static PointAnchor(){ throw DeprecatedAnchorError("Point") };
    static mouseHoverAnchor(){ LinkerLine.MouseHoverAnchor() };
    static MouseHoverAnchor(){ throw DeprecatedAnchorError("MouseHover") };
}

const statics={
    lineMap:{},
    isSafari:/^((?!chrome|android).)*safari/i.test(navigator.userAgent),
}

window.addEventListener("resize",()=>{
    requestAnimationFrame(LinkerLine.positionAll);
},false);

const toLeaderLineDash=(dash)=>{
    if(dash&&(typeof(dash)==="object")){
        toLeaderLineAnimationOptions(dash.animation);
        dash.len=dash.length;
        delete dash.length;
    }
}

const RemovedLineError=(action)=>new Error(`"can't ${action} a removed line").`);
const DeprecatedAnchorError=(name)=>new Error(`[Deprecated] use the LinkerAnchor.${name} export instead.`);
