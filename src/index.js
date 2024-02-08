import LeaderLine from "./LeaderLine";
import definePlug,{setLinePlugStyle} from "./DefinePlug";


export default class LinkerLine extends LeaderLine { 
    #element;
    #onResize;
    constructor(props){
        props.hide=props.hidden;
        super(props);
        this.#element=document.body.querySelector(":scope>.linker-line:last-of-type");
        const {parent}=props;
        if(parent instanceof HTMLElement){
            parent.style.position="relative";
            parent.appendChild(this.element);
            this.#onResize=()=>{requestAnimationFrame(()=>{this.position()})};
            window.addEventListener("resize",this.#onResize);
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
        const {style}=element,{scrollLeft,scrollTop}=parent,{left,top}=parent.getBoundingClientRect();
        style.transform=`translate(${-1*(left-scrollLeft)}px,${-1*(top-scrollTop)}px)`;
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
        document.body.appendChild(this.element);
        window.removeEventListener("resize",this.#onResize);
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
