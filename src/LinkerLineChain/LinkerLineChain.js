import LinkerLine from "../index";


export default class LinkerLineChain {
    
    #nodes;
    #linked=false;
    #linkingDuration;

    constructor(nodes,options){
        this.#nodes=nodes;
        const {linkingDuration=500,lineOptions}=options||{};
        this.#linkingDuration=Number(linkingDuration);
        let i=-1;
        const maxi=nodes.length-2;
        while(i<maxi){
            i++;
            const start=nodes[i];
            const end=nodes[i+1];
            const line=new LinkerLine({...lineOptions,start,end,hidden:true});
            end.inLine=line;
            start.outLine=line;
        }
        this.link();
    }

    link(){
        const nodes=this.#nodes;
        let i=-1;
        const drawPath=()=>{
            i++;
            if(i<(nodes.length-1)){
                const line=nodes[i].outLine;
                line.show("draw",{duration:this.#linkingDuration});
                setTimeout(drawPath,this.#linkingDuration);
            }
            else{
                this.#linked=true;
            }
        };
        drawPath();
    }

    unlink(){
        const nodes=this.#nodes;
        let i=nodes.length-1;
        const hideLink=()=>{
            i--;
            if(i>-1){
                const line=nodes[i].outLine;
                line.hide("draw",{duration:this.#linkingDuration});
                setTimeout(hideLink,this.#linkingDuration);
            }
            else{
                this.#linked=false;
            }
        }
        hideLink();
    }

    get nodes(){return this.#nodes};
    get linked(){return this.#linked};
}
