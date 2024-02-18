import LeaderLine from "./LeaderLine";
import definePlug,{setLinePlugStyle} from "./DefinePlug";


export default class LinkerLine extends LeaderLine { 
    #element;
    constructor(props){
        props.hide=props.hidden;
        super(props);
        const {id}=this;
        statics.linemap[id]=this;
        this.#element=LeaderLine.Se[id].svg;
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
        super.position();
        const {element}=this,parent=element.parentNode;
        const {left,top}=parent.getBoundingClientRect();
        element.style.transform=`translate(${parent.scrollLeft-left}px,${parent.scrollTop-top}px)`;
    }

    show(effectName,options){
        toLeaderLineAnimationOptions(options);
        super.show(effectName,options);
        this.position();
    }

    hide(effectName,options){
        toLeaderLineAnimationOptions(options);
        super.hide(effectName,options);
    }

    remove(){
        delete statics.linemap[this.id];
        document.body.appendChild(this.element);
        super.remove();
    }

    setOptions(options){
        toLeaderLineDash(options.dash);
        super.setOptions(options);
    }

    get element(){return this.#element};

    get id(){return this._id};

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

    static PointAnchor(element,options){
        return LeaderLine.pointAnchor(element,options);
    }

    static AreaAnchor(element,options){
        return LeaderLine.areaAnchor(element,options);
    }

    static MouseHoverAnchor(element,options){
        if(options){
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
