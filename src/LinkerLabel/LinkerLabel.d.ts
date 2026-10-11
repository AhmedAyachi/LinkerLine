

export default class LinkerLabel {
    constructor(text:string,options?:LinkerLabelOptions);
    
    readonly _id:number;
    readonly isRemoved:boolean;
};

export type LinkerLabelOptions={
    /**
     * @default "path"
     */
    on?:"path"|"element",
    lineOffset?:number,
    style?:Partial<CSSStyleDeclaration>&{
        offset?:number|number[],
        /**
         * @default "transparent"
         */
        outlineColor?:string,
    },
}
