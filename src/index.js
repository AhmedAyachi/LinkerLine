import LeaderLine from "./LeaderLine";


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

    setOptions(options){
        toLeaderLineDash(options.dash);
        super.setOptions(options);
    }

    static definePlug(options){
        const {name}=options;
        let defroot=document.body.querySelector(":scope>#linker-line-defs");
        if(!defroot){
            const start=document.body.appendChild(document.createElement("div"));
            const end=document.body.appendChild(document.createElement("div"));
            new LeaderLine({start,end}).remove();
            start.remove();
            end.remove();
            defroot=document.body.querySelector(":scope>#linker-line-defs");
        }
        const defsEl=defroot.querySelector(":scope>defs");
        const defEl=defsEl.querySelector(`:scope>#linker-line-${name}`);
        if(defEl) throw new Error(`Plug "${name}" already defined`);
        else{
            const {shape}=options;
            if(shape){
                const {type}=shape;
                const element=document.createElementNS("http://www.w3.org/2000/svg",type);
                element.id="linker-line-"+name;
                delete shape.type;
                /* for(const key in shape){
                    element.setAttribute(key,shape[key]);
                } */
                defsEl.appendChild(element);
                const {width,height,spacing}=shape;
                if(type==="rect"){
                    element.setAttribute("x",-width/2);
                    element.setAttribute("y",-height/2);
                    element.setAttribute("width",width);
                    element.setAttribute("height",height);
                }
                else if(type==="ellipse"){
                    /* element.setAttribute("cx",-width/2);
                    element.setAttribute("cy",-height/2);
                    element.setAttribute("r",width); */
                }
                LinkerLine.plugs[name]={
                    elmId:element.id,
                    bBox:{
                        left:-width/2,
                        right:width/2,
                        top:-height/2,
                        bottom:height/2,
                        width:width,
                        height:height,
                    },
                    widthR:width/4,
                    heightR:height/4,
                    bCircle:Math.max(width,height)/2,
                    sideLen:Math.max(width,height)/2,
                    backLen:Math.max(width,height)/2,
                    overhead:spacing||(width/2),
                    outlineBase:2,
                    outlineMax:1.5,
                }
                LinkerLine.names[name]=name;
            }
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
