import LeaderLine from "./LeaderLine";
import LinkerLineChain from "./LinkerLineChain/LinkerLineChain";
import definePlug,{setLinePlugStyle} from "./DefinePlug";


export default class LinkerLine extends LeaderLine { 
    #element;
    #hidden=false;

    constructor(props){
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

    position(){
        if(!(this.#hidden||this.removed)){
            super.position();
            const {element}=this,parent=element.parentNode;
            const {left,top}=parent.getBoundingClientRect();
            const translateX=parent.scrollLeft-left-window.scrollX;
            const translateY=parent.scrollTop-top-window.scrollY;
            element.style.transform=`translate(${translateX}px,${translateY}px)`;       
        }
    }

    show(effectName,options){
        this.#hidden=false;
        toLeaderLineAnimationOptions(options);
        super.show(effectName,options);
        this.position();
    }

    hide(effectName,options){
        this.#hidden=true;
        toLeaderLineAnimationOptions(options);
        super.hide(effectName,options);
    }

    remove(){
        if(!this.removed){
            delete statics.linemap[this.id];
            document.body.appendChild(this.element);
            super.remove();
        }
    }

    setOptions(options){
        toLeaderLineDash(options.dash);
        super.setOptions(options);
        this.position();
    }

    get standalone(){
        return !LinkerLineChain.getLineChain(this);
    }

    get element(){return this.#element};

    get id(){return this._id};

    get hidden(){return this.#hidden};
    get removed(){
        return !statics.linemap[this.id];
    }

    get start(){return super.start};
    get end(){return super.end};

    get color(){return super.color};
    get size(){return super.size};


    static definePlug(options){
        definePlug(options);
    }

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

    static PointAnchor(element,options){
        return LeaderLine.pointAnchor(element,options);
    }

    static AreaAnchor(element,options){
        return LeaderLine.areaAnchor(element,options);
    }

    static MouseHoverAnchor(element,options){
        if(options){
            const {onToggle}=options;
            if(onToggle){options.onSwitch=onToggle};
            options.animOptions=toLeaderLineAnimationOptions(options.animation);
        }
        return LeaderLine.mouseHoverAnchor(element,options);
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

    static get plugs(){return Object.keys(LeaderLine.plugs)};

    static get names(){return Object.keys(LeaderLine.names)};

    static Chain=LinkerLineChain;
    static getLineChain=LinkerLineChain.getLineChain;
}

const statics={
    linemap:{},
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

const toLeaderLineAnimationOptions=(options)=>{
    if(options&&(typeof(options)==="object")){
        options.timing=options.easing;
        delete options.easing;
    };
}
