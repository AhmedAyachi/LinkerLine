import LinkerLine from "../LinkerLine/LinkerLine";
import {LinkerLineOptions,LinkerLinePath,PathPropsMap} from "../LinkerLine/LinkerLine";


export default class LinkerChain<Type,Path extends LinkerLinePath> {

    constructor(nodes:Type[],options?:LinkerChainOptions<Type,Path>);

    readonly nodes:LinkerChainNode<Type>[];
    readonly lines:ChainLine<Type,Type,Path>[];
    /**
     * true if all nodes are fully linked, false otherwise
     */
    readonly linked:boolean;
    /**
     * true if at least one line is visible, false otherwise
     */
    readonly partiallyLinked:boolean;
    readonly destroyed:boolean;
    /**
     * adds new nodes to the end of the chain.
     * @param node 
     */
    append(...newNodes:HTMLElement[]):void;
    /**
     * adds new nodes to the beginning of the chain.
     * @param node 
     */
    prepend(...newNodes:HTMLElement[]):void;

    link(options?:LinkingOptions):void;
    unlink(options?:LinkingOptions):void;
    /**
     * links/unlinks nodes based on the chain current state
     * and the value of the toIndex option.
     */
    relink(options?:LinkingOptions):void;
    /**
     * destroys the chain.
     */
    destroy():void;
}

export type LinkerChainOptions<Type,Path extends LinkerLinePath>={
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
        startNode:LinkerChainNode<Type>,
        endNode:LinkerChainNode<Type>,
        line:LinkerLine<Type,Type,Path>,
        nodesLinked:boolean,
        hopIndex:number,
    }):void;
}

type LinkerChainNode<Type>=Type&{
    readonly inLine:LinkerLine<Type,Type>|undefined,
    readonly outLine:LinkerLine<Type,Type>|undefined,
    readonly inLines:LinkerLine<Type,Type>[];
    readonly outLines:LinkerLine<Type,Type>[];
}

type LinkingOptions={
    toIndex?:number,
}

type ChainLine<StartType,EndType,Path extends LinkerLinePath>=Omit<
    LinkerLine<StartType,EndType,Path>,
    "hide"|"show"|
    "remove"|"removed"
>;
