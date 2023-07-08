import Line from "./LeaderLine";


export default class LeaderLine extends Line { 
    #element;
    #onResize;
    constructor(props){
        props.hide=props.hidden;
        super(props);
        this.#element=document.body.querySelector(`:scope>.leader-line:last-of-type`);
        const {parent}=props;
        if(parent instanceof HTMLElement){
            parent.style.position="relative";
            parent.appendChild(this.element);
            this.#onResize=()=>{requestAnimationFrame(()=>{this.position()})};
            window.addEventListener("resize",this.#onResize);
            this.position();
        }
    }

    get element(){return this.#element};

    get id(){return this._id};

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

    static PointAnchor(element,options){
        return Line.pointAnchor(element,options);
    }

    static AreaAnchor(element,options){
        return Line.areaAnchor(element,options);
    }

    static MouseHoverAnchor(element,options){
        if(options){
            options.animOptions=toLeaderLineAnimationOptions(options.animation);
        }
        return Line.mouseHoverAnchor(element,options);
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
        const LeaderLineEntity=Line[on==="path"?"pathLabel":"captionLabel"];
        return LeaderLineEntity(text,options);
        
    }
}

const toLeaderLineDash=(dash)=>{
    if(dash&&(typeof(dash)==="object")){
        toLeaderLineAnimationOptions(dash.animation);
        dash.len=dash.length;
    }
}

const toLeaderLineAnimationOptions=(options)=>{
    if(options){
        options.timing=options.easing;
    };
}
