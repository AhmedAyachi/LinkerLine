

export default class LinkerLine<StartType,EndType,Path extends LinkerLinePath="fluid"> {
    constructor(props:LinkerLineProps<StartType,EndType,Path>);
    /**
     * The instance id, different from the linkerline svg element id
     */
    readonly id:number;
    /**
     * The linkerline svg element
     */
    readonly element:LinkerLineElement;
    readonly hidden:boolean;
    /**
     * Gets the line start element
    */
    readonly start:StartType;
    /**
     * Gets the line end element
    */
    readonly end:EndType;
    /**
     * Gets the line color
    */
    readonly color:string;
    /**
     * Gets the line size
    */
    readonly size:number;
    readonly dash:LinkerLineDash|null;
    readonly path:LinkerLinePath;
    readonly gradient:LinkerLineGradient|null;
    readonly dropShadow:LinkerLineDropShadow|null;

    readonly startLabel:string|LinkerLineLabel;
    readonly middleLabel:string|LinkerLineLabel;
    readonly endLabel:string|LinkerLineLabel;

    readonly startPlug:LinkerLinePlug;
    readonly startPlugName:string;
    readonly startPlugSize:number;
    readonly startPlugColor:string;
    readonly startPlugOutline:LinkerLineOutline|null;
    readonly startPlugOutlineSize:number;
    readonly startPlugOutlineColor:string;

    readonly endPlug:LinkerLinePlug;
    readonly endPlugName:string;
    readonly endPlugSize:number;
    readonly endPlugColor:string;
    readonly endPlugOutline:LinkerLineOutline|null;
    readonly endPlugOutlineSize:number;
    readonly endPlugOutlineColor:string;

    readonly startSocket:LinkerLineSocket;
    readonly startSocketGravity:LinkerLineSocketGravity;
    
    readonly endSocket:LinkerLineSocket;
    readonly endSocketGravity:LinkerLineSocketGravity;

    readonly outline:LinkerLineOutline|null;
    readonly outlineSize:number;
    readonly outlineColor:string;

    /**
     * Returns true if the line was instantiated directly using the LinkerLine class
     * @notice Returns false if the line is part of a chain linkers
     */
    readonly standalone:boolean;
    /**
     * Returns true if the line was removed using the remove method
     */
    readonly removed:boolean;
    /**
     * Updates the line position
     */
    position():void;
    /**
     * Shows the linkerline element
     * @param effect default "none"
     */
    show(effect:LinkerLineAnimationEffect,options?:LinkerAnimationOptions):void;
    /**
     * Hides the linkerline element
     * @param effect default "none"
     */
    hide(effect:LinkerLineAnimationEffect,options?:LinkerAnimationOptions):void;
    /**
     * Removes the linkerline from DOM
     */
    remove():void;
    /**
     * Sets the line options.
     */
    setOptions(options:Partial<LinkerLineOptions<StartType,EndType,Path>>):void;

    /**
     * positions all lines at once.
     */
    static positionAll():void;

    /**
     * removes all standalone lines at once.
     * @param filter if specified, removes lines that satisfy the condition, all otherwise.
     */
    static removeAll(filter?:(line:LinkerLine<HTMLElement,HTMLElement>)=>boolean):void;

    static findByElement(element:any):LinkerLine<HTMLElement,HTMLElement>|null;

    static Label(text:string,options?:{
        /**
         * @default "path"
         */
        on?:"path"|"element",
        color?:string,
        offset?:number|number[],
        lineOffset?:number,
        /**
         * @default "transparent"
         */
        outlineColor?:string,
    }):LinkerLineLabel;
}

export interface LinkerLineElement extends SVGElement {
    readonly lineId:number,
}

export type LinkerEntity={
    readonly _id:number,
    readonly isRemoved:boolean,
}
export interface LinkerLineLabel extends LinkerEntity {}


export type LinkerLineProps<StartType,EndType,Path extends LinkerLinePath="fluid">=(
    LinkerLineOptions<StartType,EndType,Path>&
    PathPropsMap[Path]&{
    /**
    * The element where to insert the line svg element
    * @default //the line's end element parentNode
    */
    parent?:HTMLElement;
    hidden?:boolean;
});

export type PathPropsMap={
    "arc":{},
    "grid":{
        /**
         * @default 30
         */
        minGridLength?:number,
    },
    "fluid":{},
    "magnet":{},
    "straight":{},
}

export type LinkerLineOptions<StartType,EndType,Path extends LinkerLinePath="fluid">={
    /**
     * @default "fluid"
     */
    path?:Path;
    start:StartType;
    end:EndType;
    /**
     * @default "coral"
     */
    color?:string;
    gradient?:boolean|Partial<LinkerLineGradient>;
    dropShadow?:boolean|LinkerLineDropShadow;
    /**
     * @default 4
     */
    size?:number;
    outline?:boolean|Partial<LinkerLineOutline>;
    /**
     * @default "behind"
     */
    startPlug?:Partial<LinkerLinePlug>|LinkerLinePlugName;
    /**
     * @default "arrow1"
     */
    endPlug?:Partial<LinkerLinePlug>|LinkerLinePlugName;
    startLabel?:string;
    middleLabel?:string;
    endLabel?:string;
    captionLabel?:string;
    pathLabel?:string;
    dash?:boolean|LinkerLineDash;
    /**
     * @default "auto"
     */
    startSocket?:Partial<LinkerLineSocket>;
    /**
     * @default "auto"
     */
    endSocket?:Partial<LinkerLineSocket>;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default -1
     */
    startSocketGravity?:LinkerLineSocketGravity;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default -1
     */
    endSocketGravity?:LinkerLineSocketGravity;
}

export type LinkerAnimationOptions={
    /**
     * in milliseconds
     */
    duration?:number,
    easing?:"ease"|"linear"|"ease-in"|"ease-out"|"ease-in-out"|number[],
}
export type LinkerLineAnimationEffect="none"|"fade"|"draw";
export type LinkerLineAnimation=LinkerAnimationOptions&{
    effect:LinkerLineAnimationEffect,
}

export type LinkerLinePath=keyof PathPropsMap;

export type LinkerLineSocketGravity=number|number[];
export type LinkerLineSocket={
    side:"auto"|"top"|"right"|"bottom"|"left",
    gravity:"auto"|LinkerLineSocketGravity,
};


export type LinkerLineDash={
    length?:"auto"|number,
    gap?:"auto"|number,
    animation?:boolean|LinkerAnimationOptions,
};

export type LinkerLinePlugName="disc"|"square"|"arrow1"|"arrow2"|"arrow3"|"hand"|"crosshair"|"behind"|(string&never);
export type LinkerLinePlug={
    name:LinkerLinePlugName,
    size:number,
    color:string,
    /**
     * @default false
     */
    outline:Partial<LinkerLineOutline>|null,
}
export type LinkerLineOutline={
    /**
     * @default "indianred"
     */
    color:string,
    /**
     * @default 0.25
     */
    size:number,
}
export type LinkerLineDropShadow={
    /**
     * @default 2
     */
    dx?:number,
    /**
     * @default 4
     */
    dy?:number,
    /**
     * @default 3
     */
    blur?:number,
    /**
     * @default "#000"
     */
    color?:string,
    /**
     * @default 0.8
     */
    opacity?:number,
}

export type LinkerLineGradient={
    startColor:string,
    endColor:string,
}
