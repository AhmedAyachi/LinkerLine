import LinkerLine from "../index";


export default class LinkerLineChain {
    
    #nodes;
    #linked=false;
    #linkingDuration;
    #focusIndex;
    #linkTimeout=null;
    #onLinkChange=null;

    constructor(nodes,options){
        const {linkingDuration=500,linked,lineOptions,onLinkChange}=options||{};
        this.#nodes=nodes;
        this.#linked=Boolean(linked);
        this.#onLinkChange=(typeof(onLinkChange)==="function")&&onLinkChange;
        this.#linkingDuration=Number(linkingDuration);
        let i=-1;
        const maxi=nodes.length-2;
        this.#focusIndex=linked?maxi:0;
        while(i<maxi){
            i++;
            const start=nodes[i];
            const end=nodes[i+1];
            const line=new LinkerLine({...lineOptions,start,end,hidden:!this.#linked});
            Object.defineProperty(start,"outLine",{get:()=>line});
            Object.defineProperty(end,"inLine",{get:()=>line});
        }
    }

    link(){
        const nodes=this.#nodes;
        const maxIndex=nodes.length-2;
        const showLine=()=>{
            if(this.#focusIndex<=maxIndex){
                const line=nodes[this.#focusIndex].outLine;
                clearTimeout(this.#linkTimeout);
                line.show("draw",{duration:this.#linkingDuration});
                this.#linkTimeout=setTimeout(()=>{
                    const onLinkChange=this.#onLinkChange;
                    this.#focusIndex++;
                    showLine();
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:true,
                    });
                },this.#linkingDuration);
                
            }
            else{
                this.#focusIndex--;
                this.#linked=true;
            }
        };
        showLine();
    }

    unlink(){
        const nodes=this.#nodes;
        const hideLine=()=>{
            if(this.#focusIndex>-1){
                const line=nodes[this.#focusIndex].outLine;
                clearTimeout(this.#linkTimeout);
                this.#linked=false;
                line.hide("draw",{duration:this.#linkingDuration});
                this.#linkTimeout=setTimeout(()=>{
                    const onLinkChange=this.#onLinkChange;
                    this.#focusIndex--;
                    hideLine();
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:false,
                    });
                },this.#linkingDuration);
            }
            else{
                this.#focusIndex++;
            }
        }
        hideLine();
    }

    get nodes(){return [...this.#nodes]};
    get linked(){return this.#linked};
}
