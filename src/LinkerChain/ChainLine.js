import LinkerLine from "../LinkerLine/LinkerLine";


export default class ChainLine extends LinkerLine {

    #chainId;

    constructor(options){
        super(options);
        this.#chainId=options.chainId;

        const {start,end}=this;
        if(!Array.isArray(end.inLines)) end.inLines=[];
        if(!Array.isArray(start.outLines)) start.outLines=[];

        end.inLines.push(this);
        start.outLines.push(this);

        if(!Object.hasOwn(end,"inLine")) Object.defineProperty(end,"inLine",{get:()=>{
            const {inLines}=end;
            return Array.isArray(inLines)?inLines.at(-1):null;
        }});
        if(!Object.hasOwn(start,"outLine")) Object.defineProperty(start,"outLine",{get:()=>{
            const {outLines}=start;
            return Array.isArray(outLines)?outLines.at(-1):null;
        }});
    }

    get chainId(){ return this.#chainId };
    get removed(){ return undefined };
    get standalone(){ return false };
    
    hide(){ throw new Error("can't manually hide chain lines") };
    #hide(options){ super.hide("draw",options) };
    static hide(line,options){
        line.#hide(options);
    }

    show(){ throw new Error("can't manually show chain lines") };
    #show(options){ super.show("draw",options) };
    static show(line,options){
        line.#show(options);
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
