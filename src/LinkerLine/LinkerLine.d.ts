

export default class LinkerLine<StartType,EndType,Path extends LinkerLinePath="fluid"> {
    constructor(props:LinkerLineProps<StartType,EndType,Path>);
    /**
     * The instance id, different from the linkerline svg element id
     */
    readonly id:number;
    /**
     * The linkerline svg element
     */
    readonly element:SVGElement;
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
     */
    show(effect:LinkerLineAnimationEffect,options?:LinkerAnimationOptions):void;
    /**
     * Hides the linkerline element
     */
    hide(effect:LinkerLineAnimationEffect,options?:LinkerAnimationOptions):void;
    /**
     * Removes the linkerline from DOM
     */
    remove():void;
    /**
     * Same as setOptions method of the old implementation
     * @param props 
     */
    setOptions(props:LinkerLineOptions<StartType,EndType,Path>):void;

    /**
     * positions all lines at once
     */
    static positionAll():void;

    /**
     * removes all standalone lines at once
     */
    static removeAll():void;

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

    /**
     * @deprecated use LinkerAnchor.Point
     */
    static PointAnchor():unknown;
    /**
     * @deprecated use LinkerAnchor.Area
     */
    static AreaAnchor():unknown;
    /**
     * @deprecated use LinkerAnchor.MouseHover
     */
    static MouseHoverAnchor():unknown;
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
    gradient?:boolean|{
        startColor?:string,
        endColor?:string,
    };
    dropShadow?:LinkerLineDropShadow;
    /**
     * @default 4
     */
    size?:number;
    outline?:boolean;
    /**
     * @default "indianred"
     */
    outlineColor?:string;
    /**
     * @default 0.25
     */
    outlineSize?:number;
    /**
     * @default "behind"
     */
    startPlug?:LinkerLinePlug;
    /**
     * @default "arrow1"
     */
    endPlug?:LinkerLinePlug;
    startPlugColor?:string;
    endPlugColor?:string;
    /**
     * @default 1
     */
    startPlugSize?:number;
    /**
     * @default 1
     */
    endPlugSize?:number;
    /**
     * @default false
     */
    startPlugOutline?:boolean;
    /**
     * @default false
     */
    endPlugOutline?:boolean;
    /**
     * @default "auto"
     */
    startPlugOutlineColor?:string;
    /**
     * @default "auto"
     */
    endPlugOutlineColor?:string;
    /**
     * @default 1
     */
    startPlugOutlineSize?:number;
    /**
     * @default 1
     */
    endPlugOutlineSize?:number;
    startLabel?:string;
    middleLabel?:string;
    endLabel?:string;
    captionLabel?:string;
    pathLabel?:string;
    /**
     * Sets the effect with specified Object that can have properties as the following options,
     * or true to enable it with all default options
     */
    dash?:boolean|LinkerLineDash;
    /**
     * @default "auto"
     */
    startSocket?:LinkerLineSocket;
    /**
     * @default "auto"
     */
    endSocket?:LinkerLineSocket;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default "auto"
     */
    startSocketGravity?:LinkerLineSocketGravity;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default "auto"
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
export type LinkerLineSocket="auto"|"top"|"right"|"bottom"|"left";
export type LinkerLineSocketGravity="auto"|number|number[];
export type LinkerLinePlug="disc"|"square"|"arrow1"|"arrow2"|"arrow3"|"hand"|"crosshair"|"behind"|String;
export type LinkerLineDash=boolean|{
    length?:"auto"|number,
    gap?:"auto"|number,
    animation?:boolean|LinkerAnimationOptions,
};

export type LinkerLineDropShadow=boolean|{
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
