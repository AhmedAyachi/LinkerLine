import Line from "./LeaderLine";


export default class LeaderLine extends Line { 
    
    element;_parent;
    #onResize;

    constructor(options){
        super(options);
        this.element=document.body.querySelector(`:scope>.leader-line:last-of-type`);
        const {parent}=options;
        if(parent instanceof HTMLElement){
            this._parent=parent;
            parent.appendChild(this.element);
            this.#onResize=()=>{
                this.position();
            }
            window.addEventListener("resize",this.#onResize);
            this.position();
        }
    }
    get parent(){
        return this._parent;
    }
    position(){
        super.position();
        const {element,_parent}=this;
        const {style}=element,{scrollLeft,scrollTop}=_parent,{left,top}=_parent.getBoundingClientRect();
        style.transform=`translate(${-1*(left-scrollLeft)}px,${-1*(top-scrollTop)}px)`;
    }
    remove(){
        document.body.appendChild(this.element);
        window.removeEventListener("resize",this.#onResize);
        super.remove();
    }
}
