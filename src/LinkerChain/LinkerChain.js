import ChainLine from "./ChainLine";


export default class LinkerChain {
    
    #id=Math.random().toString(36).substring(2);
    #nodes;
    #linkingDuration;
    #onfocusIndex=0;
    #linkTimeout;
    #onLinkChange;
    #lineOptions;
    #destroyed=false;

    constructor(nodes,options){
        if(!Array.isArray(nodes)) nodes=[];
        const {linkingDuration=500,lineOptions,onLinkChange}=options||{};
        this.#nodes=nodes;
        this.#lineOptions=lineOptions;
        this.#onLinkChange=(typeof(onLinkChange)==="function")&&onLinkChange;
        this.#linkingDuration=Number(linkingDuration);
        const linked=Boolean(options?.linked);
        let i=-1;
        const maxLineIndex=nodes.length-2;
        this.#onfocusIndex=linked?(maxLineIndex+1):0;
        while(i<maxLineIndex){
            i++;
            this.#renderLine(nodes[i],nodes[i+1],!linked);
        }
    }

    link(options){
        if(this.#destroyed) throw DestroyedChainError("link");
        else if(!this.linked){
            let {toIndex}=options||{};
            if(Number.isFinite(toIndex)) toIndex=Math.max(0,toIndex);
            else toIndex=Infinity;
            if(toIndex>this.#onfocusIndex){
                const nodes=this.#nodes;
                const showLine=()=>{
                    const lastIndex=nodes.length-1;
                    const maxIndex=Math.min(lastIndex,toIndex);
                    if(this.#onfocusIndex<maxIndex){
                        clearTimeout(this.#linkTimeout);
                        const line=nodes[this.#onfocusIndex].outLines.find(it=>it.chainId===this.#id);
                        this.#onfocusIndex++;
                        ChainLine.show(line,{duration:this.#linkingDuration});
                        this.#linkTimeout=setTimeout(()=>{
                            this.#linkTimeout=null;
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
                    }
                };
                showLine();
            }
        }
    }

    unlink(options){
        if(this.#destroyed) throw DestroyedChainError("unlink");
        else if(this.partiallyLinked){
            let {toIndex}=options||{};
            const nodes=this.#nodes;
            if(Number.isFinite(toIndex)) toIndex=Math.min(nodes.length-1,toIndex);
            else toIndex=0;
            if(toIndex<this.#onfocusIndex){
                const hideLine=()=>{
                    if(this.#onfocusIndex>toIndex){
                        clearTimeout(this.#linkTimeout);
                        const line=nodes[this.#onfocusIndex].inLines.find(it=>it.chainId===this.#id);
                        this.#onfocusIndex--;
                        ChainLine.hide(line,{duration:this.#linkingDuration});
                        this.#linkTimeout=setTimeout(()=>{
                            this.#linkTimeout=null;
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
                    }
                }
                hideLine();
            }
        }
    }

    relink(options){
        if(this.#destroyed) throw DestroyedChainError("relink");
        else if(options){
            const {toIndex}=options;
            if(toIndex>this.#onfocusIndex) this.link(options);
            else if(toIndex<this.#onfocusIndex) this.unlink(options);
        }
    }

    get id(){ return this.#id };
    get nodes(){ return this.#destroyed?undefined:[...this.#nodes] };
    get linked(){
        if(this.#destroyed) return undefined;
        else return this.#onfocusIndex>=(this.#nodes.length-1);
    };
    get partiallyLinked(){
        if(this.#destroyed) return undefined;
        else return this.#onfocusIndex>=1;
    };

    get lines(){
        if(this.#destroyed) return undefined;
        else{
            const lines=[];
            const nodes=this.#nodes,{length}=nodes;
            for(let i=1;i<length;i++){
                lines.push(nodes[i].inLine);
            }
            return lines;
        }
    }

    get destroyed(){ return Boolean(this.#destroyed) };

    prepend(...newNodes){
        if(this.#destroyed) throw DestroyedChainError("prepend");
        else if(newNodes.length){
            const {partiallyLinked}=this;
            const {length}=newNodes;
            for(let i=length-1;i>=0;i--){
                const node=newNodes[i];
                if(node instanceof HTMLElement){
                    const nodes=this.#nodes;
                    if(!nodes.includes(node)){
                        const endNode=nodes.at(0);
                        nodes.unshift(node);
                        const line=this.#renderLine(node,endNode,true);
                        if(partiallyLinked){
                            this.#onfocusIndex++;
                            ChainLine.show(line,{duration:this.#linkingDuration});
                            const onLinkChange=this.#onLinkChange;
                            onLinkChange&&onLinkChange({
                                startNode:line.start,
                                endNode:line.end,line,
                                nodesLinked:true,
                                hopIndex:i,
                            });
                        }
                    }
                } else throw new Error("LinkerLine chain node must be an HTMLElement");
            }
        }
    }

    append(...newNodes){
        if(this.#destroyed) throw DestroyedChainError("append");
        else if(newNodes.length){
            const {linked}=this;
            for(const node of newNodes){
                if(node instanceof HTMLElement){
                    const nodes=this.#nodes;
                    if(!nodes.includes(node)){
                        const startNode=nodes.at(-1);
                        nodes.push(node);
                        this.#renderLine(startNode,node,true);
                    }
                } else throw new Error("LinkerLine chain node must be an HTMLElement");
            }
            if(linked) this.link();
        }
    }

    destroy(){if(!this.#destroyed){
        const {lines}=this;
        this.#destroyed=true;
        lines.forEach(ChainLine.remove);
        this.#nodes=null;
        clearTimeout(this.#linkTimeout);
        this.#linkTimeout=null;
        this.#lineOptions=null;
        this.#onfocusIndex=null;
        this.#onLinkChange=null;
    }}

    #renderLine(startNode,endNode,hidden){
        return new ChainLine({
            ...this.#lineOptions,
            chainId:this.#id,
            start:startNode,
            end:endNode,
            hidden,
        });
    }
}

const DestroyedChainError=(methodName)=>new Error(`calling ${methodName} on a destroyed chain.`);
