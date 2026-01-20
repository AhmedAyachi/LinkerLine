import LinkerLine from "../LinkerLine/LinkerLine";


export default class ChainLine extends LinkerLine {
    constructor(options){
        super(options);
        Object.defineProperty(this.end,"inLine",{get:()=>this});
        Object.defineProperty(this.start,"outLine",{get:()=>this});
    }

    get standalone(){ return false };
    get removed(){ return undefined };

    remove(){
        throw new Error("remove called on a chain line");
    }

    
    #remove(){ super.remove() };
    static remove(line){
        line.#remove();
    }
}
