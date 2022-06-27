import Line from "./LeaderLine";


export default class LeaderLine extends Line { 
    
    element;parent;
    onResize;

    constructor(options){
        super(options);
        const {parent}=options;
        this.element=document.body.querySelector(`:scope>.leader-line:last-of-type`);
        if(parent instanceof HTMLElement){
            this.parent=parent;
            parent.appendChild(this.element);
            this.onResize=()=>{
                this.position();
            }
            window.addEventListener("resize",this.onResize);
            this.position();
        }
    }
    position(){
        super.position();
        const {element,parent}=this;
        const {style}=element,{scrollLeft,scrollTop}=parent,{left,top}=parent.getBoundingClientRect();
        style.transform=`translate(${-1*(left-scrollLeft)}px,${-1*(top-scrollTop)}px)`;
    }
    remove(){
        document.body.appendChild(this.element);
        window.removeEventListener("resize",this.onResize);
        super.remove();
    }
}
