import LinkerLine,{LinkerLineOptions} from "../index";


export default class LinkerLineChain<Type> {

    constructor(nodes:Type[],options?:LinkerLineChainOptions<Type>);

    readonly nodes:LinkerLineChainNode<Type>[];
    /**
     * true if all nodes are fully linked, false otherwise
     */
    readonly linked:boolean;
    /**
     * true if at least one line is visible, false otherwise
     */
    readonly partiallyLinked:boolean;
    link():void;
    unlink():void;

    static getLineChain<Type>(line:LinkerLine<Type,Type>|any):LinkerLineChain<Type>|null;
}

export type LinkerLineChainOptions<Type>={
    /**
     * Line draw animation duration in milliseconds
     * @default 500
     */
    linkingDuration?:number;
    /**
     * @default false
     */
    linked?:boolean,
    lineOptions?:Omit<LinkerLineOptions<Type,Type>,"start"|"end"|"hidden">;
    /**
     * Called on each node-to-node connection change.
     */
    onLinkChange?(context:{
        startNode:LinkerLineChainNode<Type>,
        endNode:LinkerLineChainNode<Type>,
        line:LinkerLine<Type,Type>,
        nodesLinked:boolean,
        hopIndex:number,
    }):void;
}

type LinkerLineChainNode<Type>=Type&{
    readonly inLine:LinkerLine<Type,Type>|undefined,
    readonly outLine:LinkerLine<Type,Type>|undefined,
}
