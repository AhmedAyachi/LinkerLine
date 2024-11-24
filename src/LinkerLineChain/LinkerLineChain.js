import LinkerLine from "../index";


export default class LinkerLineChain {
    
    #nodes;
    #linked=false;
    #partiallyLinked=false;
    #linkingDuration;
    #focusIndex;
    #linkTimeout=null;
    #onLinkChange=null;
    #lineOptions=null;

    constructor(nodes,options){
        const {linkingDuration=500,lineOptions,onLinkChange}=options||{};
        this.#nodes=nodes;
        this.#lineOptions=lineOptions;
        this.#onLinkChange=(typeof(onLinkChange)==="function")&&onLinkChange;
        this.#linkingDuration=Number(linkingDuration);
        const linked=this.#linked=Boolean(options.linked);
        this.#partiallyLinked=linked;
        let i=-1;
        const maxi=nodes.length-2;
        this.#focusIndex=linked?maxi:0;
        while(i<maxi){
            i++;
            const start=nodes[i],end=nodes[i+1];
            const line=new LinkerLine({
                ...lineOptions,start,end,
                hidden:!this.#linked,
            });
            Object.defineProperty(start,"outLine",{get:()=>line});
            Object.defineProperty(end,"inLine",{get:()=>line});
        }
        statics.chains.push(this);
    }

    link(){if(!this.linked){
        const nodes=this.#nodes;
        const showLine=()=>{
            const nodeCount=nodes.length;
            const maxIndex=nodeCount-2;
            if(this.#focusIndex<=maxIndex){
                const line=nodes[this.#focusIndex].outLine;
                clearTimeout(this.#linkTimeout);
                line.show("draw",{duration:this.#linkingDuration});
                this.#partiallyLinked=true;
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

    unlink(){if(this.partiallyLinked){
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
                this.#partiallyLinked=false;
            }
        }
        hideLine();
    }}

    get nodes(){return [...this.#nodes]};
    get linked(){return this.#linked};
    get partiallyLinked(){return this.#partiallyLinked};

    get lines(){
        const lines=[];
        const nodes=this.#nodes,{length}=nodes;
        for(let i=1;i<length;i++){
            lines.push(nodes[i].inLine);
        }
        return lines;
    }

    unshiftNode(node){
        if(node instanceof HTMLElement){
            const nodes=this.#nodes;
            if(nodes.every($=>$!==node)){
                const end=nodes.at(0);
                nodes.unshift(node);
                const line=new LinkerLine({
                    ...this.#lineOptions,
                    start:node,end,
                    hidden:true,
                });
                Object.defineProperty(node,"outLine",{get:()=>line});
                Object.defineProperty(end,"inLine",{get:()=>line});
                if(this.#partiallyLinked){
                    this.#focusIndex++;
                    const onLinkChange=this.#onLinkChange;
                    line.show("draw",{duration:this.#linkingDuration});
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:true,
                        hopIndex:0,
                    });
                };
            }
        }
        else throw new Error("LinkerLine chain node must be an HTML element");
    }

    pushNode(node){
        if(node instanceof HTMLElement){
            const nodes=this.#nodes;
            if(nodes.every($=>$!==node)){
                const start=nodes.at(-1);
                nodes.push(node);
                const line=new LinkerLine({
                    ...this.#lineOptions,
                    start,end:node,
                    hidden:true,
                });
                Object.defineProperty(start,"outLine",{get:()=>line});
                Object.defineProperty(node,"inLine",{get:()=>line});
                if(this.#linked){
                    this.#linked=false;
                    this.#focusIndex++;
                    this.link();
                    /* const onLinkChange=this.#onLinkChange;
                    line.show("draw",{duration:this.#linkingDuration});
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:true,
                        hopIndex:nodes.length-2,
                    }); */
                };
            }
        }
        else throw new Error("LinkerLine chain node must be an HTML element");
    }

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
