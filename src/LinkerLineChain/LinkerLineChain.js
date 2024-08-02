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
        statics.chains.push(this);
    }

    link(){if(!this.linked){
        const nodes=this.#nodes,nodeCount=nodes.length;
        const maxIndex=nodeCount-2;
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
                        hopIndex:this.#focusIndex-(this.#linked?0:1),
                    });
                },this.#linkingDuration);
            }
            else{
                this.#focusIndex--;
                this.#linked=true;
            }
        };
        showLine();
    }}

    unlink(){if((this.#focusIndex>0)||this.linked){
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
                    const firstReached=this.#focusIndex<0;
                    hideLine();
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:false,
                        hopIndex:this.#focusIndex+(firstReached?0:1),
                    });
                },this.#linkingDuration);
            }
            else{
                this.#focusIndex++;
            }
        }
        hideLine();
    }}

    get nodes(){return [...this.#nodes]};
    get linked(){return this.#linked};

    static getLineChain(line){
        if(line instanceof LinkerLine){
            const {chains}=statics,chainCount=chains.length;
            let i=0;
            while(i<chainCount){
                const chain=chains[i];
                let j=1;
                const {nodes}=chain,nodeCount=nodes.length;
                while(j<nodeCount){
                    if(line===nodes[j].inLine) return chain;
                    j++;
                }
                i++;
            }
            return null;
        }
        else return null;
    }
}

const statics={
    chains:[],
}
