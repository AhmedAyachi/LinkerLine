import Line from "./LeaderLine";


export default class LeaderLine extends Line { 
    #element;
    #onResize;
    constructor(props){
        super(props);
        this.#element=document.body.querySelector(`:scope>.leader-line:last-of-type`);
        const {parent}=props;
        if(parent instanceof HTMLElement){
            parent.style.position="relative";
            parent.appendChild(this.element);
            this.#onResize=()=>{
                this.position();
            }
            window.addEventListener("resize",this.#onResize);
            this.position();
        }
    }
    position(){
        super.position();
        const {element}=this,parent=element.parentNode;
        const {style}=element,{scrollLeft,scrollTop}=parent,{left,top}=parent.getBoundingClientRect();
        style.transform=`translate(${-1*(left-scrollLeft)}px,${-1*(top-scrollTop)}px)`;
    }
    show(){
        super.show.apply(this,arguments);
        this.position();
    }
    remove(){
        document.body.appendChild(this.element);
        window.removeEventListener("resize",this.#onResize);
        super.remove();
    }

    get element(){
        return this.#element;
    }
}
