import LeaderLine from "../LeaderLine";
import {toLeaderLineAnimationOptions} from "../index";
import {setLinePlugStyle} from "../LinkerPlug/DefinePlug";


export default class LinkerLine extends LeaderLine { 
    #element;
    #hidden=false;

    constructor(props){
        props.ee=Math.max(Number(props.minGridLength),1)||30;
        props.hide=Boolean(props.hidden);
        toLeaderLineOptions(props);
        super(props);
        this.#hidden=props.hide;
        const {id}=this;
        statics.lineMap[id]=this;
        this.#element=LeaderLine.Se[id].svg;
        Object.defineProperty(this.#element,"lineId",{
            value:id,
            writable:false,
            enumerable:false,
            configurable:false,
        });
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

    get id(){ return this._id};
    get element(){ return this.#element };
    get standalone(){ return true };

    get hidden(){ return this.#hidden };
    get removed(){ return !statics.lineMap[this.id] };
    
    #baseSize=super.size;
    position(){
        if(this.removed) throw RemovedLineError("position");
        if(!this.#hidden){
            super.position();
            const {element}=this,parent=element.parentNode;
            const parentRect=parent.getBoundingClientRect();
            let translateX=parent.scrollLeft-parentRect.left-window.scrollX;
            let translateY=parent.scrollTop-parentRect.top-window.scrollY;
            const elementStyle=element.style;
            if(statics.isSafari){
                const startZoom=parseFloat(getComputedStyle(this.start).getPropertyValue("zoom"))||1;
                elementStyle.zoom=startZoom;
                translateX/=startZoom;
                translateY/=startZoom;
                super.setOptions({size:this.#baseSize/startZoom});
            }
            elementStyle.transform=`translate(${translateX}px,${translateY}px)`;
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
        if(Object.getPrototypeOf(options)===Object.prototype){
            try {
                toLeaderLineOptions(options);
                super.setOptions(options);
                this.position();
            } catch(error){
                if(this.removed) throw RemovedLineError("setOptions");
                else throw error;
            }
        } else throw new Error("LinkerLine.setOptions expects a plain object as argument.");
    }

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

    static findByElement(element){
        const {lineId}=element;
        const line=statics.lineMap[lineId];
        return (line&&(line.element===element))?line:null;
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

    //Overall style
    get end(){ return super.end };
    get start(){ return super.start };
    get size(){ return super.size };
    get path(){ return super.path };
    get color(){ return super.color };
    get dash(){ 
        const dash=super.dash;
        if(dash&&(typeof(dash)==="object")){
            const {gap,len}=dash,defaultOptions=statics.defaultLineDash;
            dash.gap=typeof(gap)==="string"?defaultOptions.gap:gap;
            dash.length=typeof(len)==="string"?defaultOptions.length:len;
            delete dash.len;
            return dash; 
        } 
        else return dash?statics.defaultLineDash:null;
    };
    get gradient(){
        const gradient=super.gradient;
        if(typeof(gradient)==="object") return gradient;
        else return null;
    };
    //Drop shadow
    get dropShadow(){
        const dropShadow=super.dropShadow;
        if(typeof(dropShadow)==="object") return dropShadow;
        else return dropShadow?statics.defaultLineDropShadow:null;
    };
    //Labels
    get startLabel(){ return super.startLabel };
    get middleLabel(){ return super.middleLabel };
    get endLabel(){ return super.endLabel };
    //Start plug
    get startPlug(){ 
        return {
            name:super.startPlug,
            size:super.startPlugSize,
            color:super.startPlugColor,
            outline:super.startPlugOutline?{
                size:super.startPlugOutlineSize,
                color:super.startPlugOutlineColor,
            }:null,
        };
    };
    get startPlugName(){ return super.startPlug };
    get startPlugSize(){ return super.startPlugSize };
    get startPlugColor(){ return super.startPlugColor };
    get startPlugOutline(){ 
        const outline=super.startPlugOutline;
        return outline?{
            size:super.startPlugOutlineSize,
            color:super.startPlugOutlineColor,
        }:null; 
    };
    get startPlugOutlineSize(){ 
        return super.startPlugOutline?super.startPlugOutlineSize:0;
    };
    get startPlugOutlineColor(){ 
        return super.startPlugOutline?super.startPlugOutlineColor:"";
    };
    //End plug
    get endPlug(){ 
        return {
            name:super.endPlug,
            size:super.endPlugSize,
            color:super.endPlugColor,
            outline:super.endPlugOutline?{
                size:super.endPlugOutlineSize,
                color:super.endPlugOutlineColor,
            }:null,
        };
    };
    get endPlugName(){ return super.endPlug };
    get endPlugSize(){ return super.endPlugSize };
    get endPlugColor(){ return super.endPlugColor };
    get endPlugOutline(){ 
        const outline=super.endPlugOutline;
        return outline?{
            size:super.endPlugOutlineSize,
            color:super.endPlugOutlineColor,
        }:null; 
    };
    get endPlugOutlineSize(){ 
        return super.endPlugOutline?super.endPlugOutlineSize:0;
    };
    get endPlugOutlineColor(){ 
        return super.endPlugOutline?super.endPlugOutlineColor:"";
    };
    //Start socket
    get startSocket(){
        const socketSide=super.startSocket;
        return socketSide?{
            side:socketSide,
            gravity:this.startSocketGravity,
        }:null;
    };
    get startSocketGravity(){
        const socketGravity=super.startSocketGravity;;
        return (typeof(socketGravity)==="string")?-1:socketGravity;
    };
    //End socket
    get endSocket(){
        const socketSide=super.endSocket;
        return socketSide?{
            side:socketSide,
            gravity:this.endSocketGravity,
        }:null;
    };
    get endSocketGravity(){
        const socketGravity=super.endSocketGravity;
        return (typeof(socketGravity)==="string")?-1:socketGravity;
    };
    //Outline
    get outline(){ 
        return super.outline?{
            size:super.outlineSize,
            color:super.outlineColor,
        }:null;
    };
    get outlineSize(){ return super.outline?super.outlineSize:0 };
    get outlineColor(){ return super.outline?super.outlineColor:"" };
}

const statics={
    lineMap:{},
    isSafari:/^((?!chrome|android).)*safari/i.test(navigator.userAgent),
    get defaultLineDropShadow(){
        return {
            dx:2,
            dy:4,
            blur:3,
            color:"#000",
            opacity:0.8,
        }
    },
    get defaultLineDash(){
        return {
            gap:4,length:8,
            animation:false,
        };
    },
}

window.addEventListener("resize",()=>{
    requestAnimationFrame(LinkerLine.positionAll);
},false);

const RemovedLineError=(action)=>new Error(`can't call "${action}" on a removed line.`);
const DeprecatedAnchorError=(name)=>new Error(`[Deprecated] use the LinkerAnchor.${name} export instead.`);

const toLeaderLineOptions=(options)=>{
    setLeaderLinePlug("endPlug",options);
    setLeaderLinePlug("startPlug",options);
    setLeaderLineSocket("endSocket",options);
    setLeaderLineSocket("startSocket",options);
    setLeaderLineOutline(options);
    if("dash" in options) options.dash=toLeaderLineDash(options.dash);
}
const setLeaderLineSocket=(key,options)=>{
    const socket=options[key];
    if(socket&&(typeof(socket)==="object")){
        if("side" in socket) options[key]=socket.side;
        else delete options[key];
        const gravityKey=key+"Gravity";
        if("gravity" in socket) options[gravityKey]=socket.gravity;
        else delete options[gravityKey];
    }
    else return socket;
}

const toLeaderLineDash=(dash)=>{
    if(dash&&(typeof(dash)==="object")){
        toLeaderLineAnimationOptions(dash.animation);
        if("length" in dash) dash.len=dash.length;
        else delete dash.len;
        return dash;
    } else return dash;
}

const setLeaderLineOutline=(options)=>{
    const {outline}=options;
    if("outline" in options){
        options.outline=Boolean(outline);
    }
    if(outline&&typeof(outline)==="object"){
        if("size" in outline) options.outlineSize=outline.size;
        else delete options.outlineSize;
        if("color" in outline) options.outlineColor=outline.color;
        else delete options.outlineColor;
    }
}

const setLeaderLinePlug=(key,options)=>{
    const plug=options[key];
    if(plug&&typeof(plug)==="object"){
        if("name" in plug) options[key]=plug.name;
        else delete options[key];
        const sizeKey=key+"Size";
        if("size" in plug) options[sizeKey]=plug.size;
        else delete options[sizeKey];
        const colorKey=key+"Color";
        if("color" in plug) options[colorKey]=plug.color;
        else delete options[colorKey];
        const outlineKey=key+"Outline";
        if("outline" in plug){
            const {outline}=plug;
            options[outlineKey]=Boolean(outline);
            if(outline){
                const outlineSizeKey=key+"OutlineSize";
                if("size" in outline) options[outlineSizeKey]=outline.size;
                else delete options[outlineSizeKey];
                const outlineColorkey=key+"OutlineColor";
                if("color" in outline) options[outlineColorkey]=outline.color;
                else delete options[outlineColorkey];
            }
        } else delete options[outlineKey];
    }
}
