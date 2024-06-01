import LinkerLine,{LinkerLineOptions} from "../index";


export default class LinkerLineChain<Type> {

    constructor(nodes:Type[],options?:LinkerLineChainOptions<Type>);

    readonly nodes:LinkerLineChainNode<Type>[];
    readonly linked:boolean;
    link():void;
    unlink():void;
}

type LinkerLineChainOptions<Type>={
    linkingDuration?:number;
    /**
     * @default true
     */
    linked?:boolean,
    lineOptions?:Omit<LinkerLineOptions<Type,Type>,"start"|"end"|"hidden">;
}

type LinkerLineChainNode<Type>=Type&{
    readonly inLine:LinkerLine<Type,Type>,
    readonly outLine:LinkerLine<Type,Type>,
}
