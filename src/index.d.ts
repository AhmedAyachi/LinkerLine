
/**
 * for Additional props and methods 
 * please consider checking the original
 * project docs
 */
export default class LinkerLine extends LinkerLineOptions {
    constructor(props:LinkerLineProps);
    /**
     * The instance id, different from the linkerline svg element id
     */
    readonly id:Number;

    position():void;
    /**
     * Shows the linkerline element
     */
    show(effectName:EffectName,animation:LinkerLineAnimation):void;
    /**
     * Hides the linkerline element
     */
    hide(effectName:EffectName,animation:LinkerLineAnimation):void;
    /**
     * Removes the linkerline from DOM
     */
    remove():void;
    /**
     * Same as setOptions method of the old implementation
     * @param props 
     */
    setOptions(props:LinkerLineOptions):void;
    /**
     * The linkerline svg element
     */
    readonly element:SVGElement;

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
        width:number,
        /**
         * sets the plug base height
         * @default 
         * 24 for icons
         * height attribute value for svg
         * 0 for shapes
         */
        height:number,
        margin?:number,
        /**
         * @default true
         */
        rotatable?:boolean,
    }):void;

    static PointAnchor(element:HTMLElement,options:{
        x:number|string,
        y:number|string,
    }):PointAnchor;

    static AreaAnchor<Shape extends keyof LinkerLineAnchorOptions>(element:HTMLElement,options:{
        x:number|string,
        y:number|string,
        /**
         * @default "rect"
         */
        shape:Shape,
        color:string,
        fillColor:string,
        size:number,
        dash:LinkerLineDash,
    }&LinkerLineAnchorOptions[Shape]):AreaAnchor;

    static MouseHoverAnchor(element:HTMLElement,options:{
        showEffectName:EffectName,
        animation:LinkerLineAnimation,
        style?:CSSStyleDeclaration,
        hoverStyle?:CSSStyleDeclaration,
        /**
         * A function that is called after show/hide method, with an event argument
         */
        onSwitch(event:Event):void,
    }):MouseHoverAnchor;

    static Label(text:string,options:{
        /**
         * @default "path"
         */
        on:"path"|"element",
        color:string,
        offset:number|number[],
        lineOffset:number,
        /**
         * @default "transparent"
         */
        outlineColor:string,
    }):LinkerLineLabel;
}


interface LinkerLineProps extends LinkerLineOptions {
    /**
    * The element where to insert the line svg element
    * @default document.body
    */
    parent:HTMLElement;
    hidden:boolean;
}

interface LinkerLineOptions {
    start:HTMLElement;
    end:HTMLElement;
    /**
     * @default "coral"
     */
    color:String;
    gradient:Boolean|{
        startColor:String,
        endColor:String,
    };
    dropShadow:Boolean|{
        /**
         * @default 2
         */
        dx:Number,
        /**
         * @default 4
         */
        dy:Number,
        /**
         * @default 3
         */
        blur:Number,
        /**
         * @default "#000"
         */
        color:String,
        /**
         * @default 0.8
         */
        opacity:Number,
    };
    /**
     * @default "fluid"
     */
    path:LinkerLinePath;
    size:Number;
    outline:Boolean;
    /**
     * @default "indianred"
     */
    outlineColor:String;
    /**
     * @default 0.25
     */
    outlineSize:Number;
    /**
     * @default "behind"
     */
    startPlug:LinkerLinePlug;
    /**
     * @default "arrow1"
     */
    endPlug:LinkerLinePlug;
    startPlugColor:String;
    endPlugColor:String;
    /**
     * @default 1
     */
    startPlugSize:Number;
    /**
     * @default 1
     */
    endPlugSize:Number;
    /**
     * @default false
     */
    startPlugOutline:Boolean;
    /**
     * @default false
     */
    endPlugOutline:Boolean;
    /**
     * @default "auto"
     */
    startPlugOutlineColor:String;
    /**
     * @default "auto"
     */
    endPlugOutlineColor:String;
    /**
     * @default 1
     */
    startPlugOutlineSize:Number;
    /**
     * @default 1
     */
    endPlugOutlineSize:Number;
    startLabel:String;
    middleLabel:String;
    endLabel:String;
    captionLabel:String;
    pathLabel:String;
    /**
     * Sets the effect with specified Object that can have properties as the following options,
     * or true to enable it with all default options
     */
    dash:boolean|LinkerLineDash;
    /* set dash(value:LinkerLineDash);
    get dash():LinkerLineDash; */
    /**
     * @default "auto"
     */
    startSocket:LinkerLineSocket;
    /**
     * @default "auto"
     */
    endSocket:LinkerLineSocket;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default "auto"
     */
    startSocketGravity:LinkerLineSocketGravity;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default "auto"
     */
    endSocketGravity:LinkerLineSocketGravity;
}

type EffectName="none"|"fade"|"draw";
type LinkerLineAnimation={
    /**
     * in milliseconds
     */
    duration:Number,
    easing:"ease"|"linear"|"ease-in"|"ease-out"|"ease-in-out"|Number[],
}
type LinkerLinePath="straight"|"arc"|"fluid"|"magnet"|"grid";
type LinkerLineSocket="auto"|"top"|"right"|"bottom"|"left";
type LinkerLineSocketGravity="auto"|Number|Number[];
type LinkerLinePlug="disc"|"square"|"arrow1"|"arrow2"|"arrow3"|"hand"|"crosshair"|"behind";
type LinkerLineDash=Boolean|{
    length:"auto"|Number,
    gap:"auto"|Number,
    animation:Boolean|LinkerLineAnimation,
};

type LinkerLineEntity={
    readonly _id:Number,
    readonly isRemoved:Boolean,
}
interface PointAnchor extends LinkerLineEntity {}
interface AreaAnchor extends LinkerLineEntity {}
interface MouseHoverAnchor extends LinkerLineEntity {}
interface LinkerLineLabel extends LinkerLineEntity {}

type LinkerLineAnchorOptions={
    "rect":{
        /**
         * @default "110%"
         */
        width:number|string,
        /**
         * @default "110%"
         */
        height:number|string,
    },
    "circle":{
        /**
         * @default 0
         */
        radius:number,
    },
    "polygon":{
        points:(number|string)[][],
    },
}
