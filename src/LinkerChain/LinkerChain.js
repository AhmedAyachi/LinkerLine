import ChainLine from "./ChainLine";


export default class LinkerLineChain {
    
    #nodes;
    #linked=false;
    #partiallyLinked=false;
    #linkingDuration;
    #onfocusIndex;
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
        this.#onfocusIndex=linked?maxi:0;
        while(i<maxi){
            i++;
            new ChainLine({
                ...lineOptions,
                start:nodes[i],
                end:nodes[i+1],
                hidden:!this.#linked,
            });
        }
    }

    link(options){if(!this.linked){
        let {toIndex}=options||{};
        if(Number.isFinite(toIndex)) toIndex=Math.max(0,toIndex);
        else toIndex=Infinity;
        const nodes=this.#nodes;
        const showLine=()=>{
            const lastIndex=nodes.length-1;
            const maxIndex=Math.min(lastIndex,toIndex);
            if(this.#onfocusIndex<maxIndex){
                clearTimeout(this.#linkTimeout);
                const line=nodes[this.#onfocusIndex].outLine;
                this.#onfocusIndex++;
                line.show("draw",{duration:this.#linkingDuration});
                this.#partiallyLinked=true;
                this.#linkTimeout=setTimeout(()=>{
                    const onLinkChange=this.#onLinkChange;
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:true,
                        hopIndex:this.#onfocusIndex-1,
                    });
                    showLine();
                },this.#linkingDuration);
            } else {
                this.#onfocusIndex=maxIndex;
                this.#linked=(this.#onfocusIndex>=lastIndex);
            }
        };
        showLine();
    }}

    unlink(options){if(this.partiallyLinked){
        let {toIndex}=options||{};
        const nodes=this.#nodes;
        if(Number.isFinite(toIndex)) toIndex=Math.min(nodes.length-1,toIndex);
        else toIndex=0;
        const hideLine=()=>{
            if(this.#onfocusIndex>toIndex){
                clearTimeout(this.#linkTimeout);
                const line=nodes[this.#onfocusIndex].inLine;
                this.#onfocusIndex--;
                line.hide("draw",{duration:this.#linkingDuration});
                this.#linked=false;
                this.#linkTimeout=setTimeout(()=>{
                    const onLinkChange=this.#onLinkChange;
                    onLinkChange&&onLinkChange({
                        startNode:line.start,
                        endNode:line.end,line,
                        nodesLinked:false,
                        hopIndex:this.#onfocusIndex,
                    });
                    hideLine();
                },this.#linkingDuration);
            } else {
                this.#onfocusIndex=toIndex;
                this.#partiallyLinked=(this.#onfocusIndex>1);
            }
        }
        hideLine();
    }}

    get nodes(){ return [...this.#nodes] };
    get linked(){ return this.#linked };
    get partiallyLinked(){ return this.#partiallyLinked };

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
                const line=new ChainLine({
                    ...this.#lineOptions,
                    start:node,end,
                    hidden:true,
                });
                if(this.#partiallyLinked){
                    this.#onfocusIndex++;
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
                new ChainLine({
                    ...this.#lineOptions,
                    start,end:node,
                    hidden:true,
                });
                if(this.#linked){
                    this.#linked=false;
                    this.link();
                };
            }
        }
        else throw new Error("LinkerLine chain node must be an HTML element");
    }
}
