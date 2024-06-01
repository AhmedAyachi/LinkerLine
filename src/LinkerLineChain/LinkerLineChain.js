import LinkerLine from "../index";


export default class LinkerLineChain {
    
    #nodes;
    #linked=false;
    #linkingDuration;
    #focusIndex;
    #linkTimeout=null;

    constructor(nodes,options){
        const {linkingDuration=500,linked=true,lineOptions}=options||{};
        this.#nodes=nodes;
        this.#linked=Boolean(linked);
        this.#linkingDuration=Number(linkingDuration);
        let i=-1;
        const maxi=nodes.length-2;
        this.#focusIndex=linked?maxi:0;
        while(i<maxi){
            i++;
            const start=nodes[i];
            const end=nodes[i+1];
            const line=new LinkerLine({...lineOptions,start,end,hidden:!this.#linked});
            end.inLine=line;
            start.outLine=line;
        }
    }

    link(){
        const nodes=this.#nodes;
        const maxIndex=nodes.length-2;
        const drawPath=()=>{
            if(this.#focusIndex<=maxIndex){
                const line=nodes[this.#focusIndex].outLine;
                clearTimeout(this.#linkTimeout);
                line.show("draw",{duration:this.#linkingDuration});
                this.#linkTimeout=setTimeout(()=>{
                    this.#focusIndex++;
                    drawPath();
                },this.#linkingDuration);
                
            }
            else{
                this.#focusIndex--;
                this.#linked=true;
            }
        };
        drawPath();
    }

    unlink(){
        const nodes=this.#nodes;
        const hideLink=()=>{
            if(this.#focusIndex>-1){
                const line=nodes[this.#focusIndex].outLine;
                clearTimeout(this.#linkTimeout);
                line.hide("draw",{duration:this.#linkingDuration});
                this.#linkTimeout=setTimeout(()=>{
                    this.#focusIndex--;
                    hideLink();
                },this.#linkingDuration);
            }
            else{
                this.#focusIndex++;
                this.#linked=false;
            }
        }
        hideLink();
    }

    get nodes(){return this.#nodes};
    get linked(){return this.#linked};
}
