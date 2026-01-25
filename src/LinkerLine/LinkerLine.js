import LeaderLine from "../LeaderLine";
import {toLeaderLineAnimationOptions} from "../index";
import {setLinePlugStyle} from "../LinkerPlug/DefinePlug";


export default class LinkerLine extends LeaderLine { 
    #element;
    #hidden=false;

    constructor(props){
        props.ee=Math.max(Number(props.minGridLength),1)||40;
        props.hide=Boolean(props.hidden);
        super(props);
        this.#hidden=props.hide;
        const {id}=this;
        statics.linemap[id]=this;
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
    position(){if(!(this.#hidden||this.removed)){
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
    }}

    show(effectName,options){
        if(this.removed) throw new Error("can't show a removed line");
        this.#hidden=false;
        toLeaderLineAnimationOptions(options);
        super.show(effectName,options);
        this.position();
    }

    hide(effectName,options){
        if(this.removed) throw new Error("can't hide a removed line");
        this.#hidden=true;
        toLeaderLineAnimationOptions(options);
        super.hide(effectName,options);
    }

    remove(){if(!this.removed){
        delete statics.linemap[this.id];
        document.body.appendChild(this.element);
        super.remove();
    }}

    setOptions(options){
        toLeaderLineDash(options.dash);
        super.setOptions(options);
        this.position();
    }

    get standalone(){ return true };

    get element(){ return this.#element};

    get id(){ return this._id};

    get hidden(){ return this.#hidden};
    get removed(){ return !statics.linemap[this.id]};

    get start(){ return super.start};
    get end(){ return super.end};

    get size(){ return super.size};
    get color(){ return super.color};


    static positionAll(){
        const {linemap}=statics;
        for(const lineId in linemap){
            const line=linemap[lineId];
            line.start.isConnected&&line.end.isConnected&&line.position();
        }
    }

    static removeAll(){
        const {linemap}=statics;
        for(const lineId in linemap){
            const line=linemap[lineId];
            if(line.standalone) line.remove();
        }
    }

    static PointAnchor(){
        throw new Error("[deprecated] use LinkerAnchor.Point export instead");
    }

    static AreaAnchor(){
        throw new Error("[deprecated] use LinkerAnchor.Area export instead");
    }

    static MouseHoverAnchor(){
        throw new Error("[deprecated] use LinkerAnchor.MouseHover export instead");
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
}

const statics={
    linemap:{},
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
