import LinkerLine from "../index";


export default class LinkerLineChain {
    
    #nodes;

    constructor(nodes,options){
        this.#nodes=nodes;
        const {linkingDuration=500,lineOptions}=options||{};
        let i=-1,linked;
        const maxi=nodes.length-1;
        !function linkNodes(){
            i++;
            if(i<maxi){
                const start=nodes[i];
                const end=nodes[i+1];
                const line=new LinkerLine({...lineOptions,start,end,hidden:true});
                end.inLine=line;
                start.outLine=line;
                linkNodes();
            }
            else{
                animate(true);
            }
        }();

        function animate(link){
            linked=link;
            if(linked){
                let i=-1;
                !function drawPath(){
                    i++;
                    if(i<(nodes.length-1)){
                        const line=nodes[i].outLine;
                        line.show("draw",{duration:linkingDuration});
                        setTimeout(drawPath,linkingDuration);
                    }
                }();
            }
            else{
                let i=nodes.length-1;
                !function hideLink(){
                    i--;
                    if(i>-1){
                        const line=nodes[i].outLine;
                        line.hide("draw",{duration:linkingDuration});
                        setTimeout(hideLink,linkingDuration);
                    }
                }();
            }
        }
    }

    link(){

    }

    unlink(){

    }

    get nodes(){return this.#nodes};
}
