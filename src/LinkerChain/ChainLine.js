import LinkerLine from "../LinkerLine/LinkerLine";


export default class ChainLine extends LinkerLine {
    constructor(options){
        super(options);
        const {start,end}=this;
        if(!Array.isArray(end.inLines)) end.inLines=[];
        if(!Array.isArray(start.outLines)) start.outLines=[];

        end.inLines.push(this);
        start.outLines.push(this);

        //TODO: check redefinition as it will throw an error.
        Object.defineProperty(end,"inLine",{get:()=>{
            const {inLines}=end;
            return Array.isArray(inLines)?inLines.at(-1):null;
        }});
        Object.defineProperty(start,"outLine",{get:()=>{
            const {outLines}=start;
            return Array.isArray(outLines)?outLines.at(-1):null;
        }});
    }

    get standalone(){ return false };
    get removed(){ return undefined };
    
    hide(){ throw new Error("can't manually hide chain lines") };
    #hide(...params){ super.hide("draw",...params) };
    static hide(line,...params){
        line.#hide(...params);
    }

    show(){ throw new Error("can't manually show chain lines") };
    #show(...params){ super.show("draw",...params) };
    static show(line,...params){
        line.#show(...params);
    }

    remove(){ throw new Error("can't manually remove chain lines") };
    #remove(){ super.remove() };
    static remove(line){
        [line.start,line.end].forEach((element,i)=>{
            const key=i?"inLines":"outLines";
            const lines=element[key];
            if(Array.isArray(lines)){
                const index=lines.indexOf(line);
                if(index>=0) lines.splice(index,1);
                if(lines.length<1) delete element[key];
            }
        });
        line.#remove();
    }
}
