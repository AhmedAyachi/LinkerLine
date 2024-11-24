import LinkerLine,{LinkerLineOptions,LinkerLinePath, PathPropsMap} from "../index";


export default class LinkerLineChain<Type,Path extends LinkerLinePath> {

    constructor(nodes:Type[],options?:LinkerLineChainOptions<Type,Path>);

    readonly nodes:LinkerLineChainNode<Type>[];
    readonly lines:LinkerLine<Type,Type,Path>[];
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
    /**
     * appends a new node to the end of the chain
     * @param node 
     */
    pushNode(node:HTMLElement):void;
    /**
     * adds a new node at the start of the chain
     * @param node 
     */
    unshiftNode(node:HTMLElement):void;

    static getLineChain<Type,Path extends LinkerLinePath>(line:LinkerLine<Type,Type,Path>|any):LinkerLineChain<Type,Path>|null;
}

export type LinkerLineChainOptions<Type,Path extends LinkerLinePath>={
    /**
     * Line draw animation duration in milliseconds
     * @default 500
     */
    linkingDuration?:number;
    /**
     * @default false
     */
    linked?:boolean,
    lineOptions?:Omit<LinkerLineOptions<Type,Type,Path>,"start"|"end"|"hidden">&PathPropsMap[Path];
    /**
     * Called on each node-to-node connection change.
     */
    onLinkChange?(context:{
        startNode:LinkerLineChainNode<Type>,
        endNode:LinkerLineChainNode<Type>,
        line:LinkerLine<Type,Type,Path>,
        nodesLinked:boolean,
        hopIndex:number,
    }):void;
}

type LinkerLineChainNode<Type>=Type&{
    readonly inLine:LinkerLine<Type,Type>|undefined,
    readonly outLine:LinkerLine<Type,Type>|undefined,
}
