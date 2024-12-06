import LinkerLineChain,{LinkerLineChainOptions} from "./LinkerLineChain/LinkerLineChain";


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
    show(effectName?:EffectName,animation?:LinkerLineAnimation):void;
    /**
     * Hides the linkerline element
     */
    hide(effectName?:EffectName,animation?:LinkerLineAnimation):void;
    /**
     * Removes the linkerline from DOM
     */
    remove():void;
    /**
     * Same as setOptions method of the old implementation
     * @param props 
     */
    setOptions(props:LinkerLineOptions<StartType,EndType,Path>):void;

    static definePlug(options:{
        name:string,
        shape?:"rect"|"ellipse",
        svg?:string|((color:string,weight:string)=>string),
        src?:string,
        /**
         * sets the plug base width
         * @default 
         * 24 for src
         * width attribute value for svg
         * 0 for shape
         */
        width?:number,
        /**
         * sets the plug base height
         * @default 
         * 24 for icons
         * height attribute value for svg
         * 0 for shapes
         */
        height?:number,
        margin?:number,
        /**
         * @default true
         */
        rotatable?:boolean,
    }):void;

    /**
     * positions all lines at once
     */
    static positionAll():void;

    /**
     * removes all standalone lines at once
     */
    static removeAll():void;

    static PointAnchor(element:HTMLElement,options?:{
        x?:number|string,
        y?:number|string,
    }):PointAnchor;

    static AreaAnchor<Shape extends keyof LinkerLineAnchorOptions>(element:HTMLElement,options?:{
        x?:number|string,
        y?:number|string,
        /**
         * @default "rect"
         */
        shape?:Shape,
        color?:string,
        fillColor?:string,
        size?:number,
        dash?:LinkerLineDash,
    }&LinkerLineAnchorOptions[Shape]):AreaAnchor;

    static MouseHoverAnchor(element:HTMLElement,options?:{
        showEffectName?:EffectName,
        animation?:LinkerLineAnimation,
        style?:Partial<CSSStyleDeclaration>,
        hoverStyle?:Partial<CSSStyleDeclaration>,
         /**
         * A function that is called on line did show/hide, with a mouse event argument
         */
        onToggle?(event:MouseEvent):void,
        /**
         * A function that is called on line did show/hide, with a mouse event argument
         * @deprecated use onToggle instead
         */
        onSwitch?(event:MouseEvent):void,
    }):MouseHoverAnchor;

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

    static Chain:new<Type,Path extends LinkerLinePath="fluid">(
        nodes:Type[],
        options?:LinkerLineChainOptions<Type,Path>,
    )=>LinkerLineChain<Type,Path>;

    /**
     * Returns the chain that the line belongs to.
     */
    static getLineChain<Type,Path extends LinkerLinePath>(line:LinkerLine<Type,Type,Path>|undefined|null):LinkerLineChain<Type,Path>|null;
}


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
         * @default 40
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
    /* set dash(value?:LinkerLineDash);
    get dash()?:LinkerLineDash; */
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

export type EffectName="none"|"fade"|"draw";
export type LinkerLineAnimation={
    /**
     * in milliseconds
     */
    duration?:number,
    easing?:"ease"|"linear"|"ease-in"|"ease-out"|"ease-in-out"|number[],
}
export type LinkerLinePath=keyof PathPropsMap;
export type LinkerLineSocket="auto"|"top"|"right"|"bottom"|"left";
export type LinkerLineSocketGravity="auto"|number|number[];
export type LinkerLinePlug="disc"|"square"|"arrow1"|"arrow2"|"arrow3"|"hand"|"crosshair"|"behind"|String;
export type LinkerLineDash=boolean|{
    length?:"auto"|number,
    gap?:"auto"|number,
    animation?:boolean|LinkerLineAnimation,
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

export type LinkerLineEntity={
    readonly _id:number,
    readonly isRemoved:boolean,
}
export interface PointAnchor extends LinkerLineEntity {}
export interface AreaAnchor extends LinkerLineEntity {}
export interface MouseHoverAnchor extends LinkerLineEntity {}
export interface LinkerLineLabel extends LinkerLineEntity {}

export type LinkerLineAnchorOptions={
    "rect":{
        /**
         * @default "110%"
         */
        width?:number|string,
        /**
         * @default "110%"
         */
        height?:number|string,
    },
    "circle":{
        /**
         * @default 0
         */
        radius?:number,
    },
    "polygon":{
        points?:(number|string)[][],
    },
}
