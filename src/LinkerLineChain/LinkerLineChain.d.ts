import {LinkerLineOptions} from "../index";


export default class LinkerLineChain<Type> {

    constructor(nodes:Type[],options:LinkerLineChainOptions);

    readonly nodes:Type[];
    readonly linked:boolean;
    link():void;
    unlink():void;
}

type LinkerLineChainOptions={
    linkingDuration:number;
    lineOptions:Omit<LinkerLineOptions<Type,Type>,"start"|"end"|"hidden">;
}
