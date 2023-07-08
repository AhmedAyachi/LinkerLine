
/**
 * for Additional props and methods 
 * please consider checking the original
 * project docs
 */
export default class LeaderLine extends LeaderLineOptions {
    constructor(props:LeaderLineProps);
    /**
     * The instance id, different from the leaderline svg element id
     */
    readonly id:Number;

    position():void;
    /**
     * Shows the leaderline element
     */
    show(effectName:EffectName,animation:LeaderLineAnimation):void;
    /**
     * Hides the leaderline element
     */
    hide(effectName:EffectName,animation:LeaderLineAnimation):void;
    /**
     * Removes the leaderline from DOM
     */
    remove():void;
    /**
     * Same as setOptions method of the old implementation
     * @param props 
     */
    setOptions(props:LeaderLineOptions):void;
    /**
     * The leaderline svg element
     */
    readonly element:SVGElement;

    static PointAnchor(element:HTMLElement,options:{
        x:number,
        y:number,
    }):PointAnchor;

    static AreaAnchor<Shape extends keyof LeaderLineAnchorOptions>(element:HTMLElement,options:{
        x:number,
        y:number,
        /**
         * @default "rect"
         */
        shape:Shape,
        color:string,
        fillColor:string,
        size:number,
        dash:LeaderLineDash,
    }&LeaderLineAnchorOptions[Shape]):AreaAnchor;

    static MouseHoverAnchor(element:HTMLElement,options:{
        showEffectName:EffectName,
        animation:LeaderLineAnimation,
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
    }):LeaderLineLabel;
};

interface LeaderLineProps extends LeaderLineOptions {
    /**
    * The element where to insert the line svg element
    * @default document.body
    */
    parent:HTMLElement;
    hidden:boolean;
    dash:LeaderLineDash;
}

class LeaderLineOptions {
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
    path:LeaderLinePath;
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
    startPlug:LeaderLinePlug;
    /**
     * @default "arrow1"
     */
    endPlug:LeaderLinePlug;
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
     * Sets the effect with specified Object that can have properties as the following options.
     * Or true to enable it with all default options
     */
    set dash(value:LeaderLineDash):void;
    get dash():undefined;
    /**
     * @default "auto"
     */
    startSocket:LeaderLineSocket;
    /**
     * @default "auto"
     */
    endSocket:LeaderLineSocket;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default "auto"
     */
    startSocketGravity:LeaderLineSocketGravity;
    /**
     * If "auto" is specified, it is adjusted to gravity suitable for current path option automatically.
     * @default "auto"
     */
    endSocketGravity:LeaderLineSocketGravity;
}

type EffectName="none"|"fade"|"draw";
type LeaderLineAnimation={
    /**
     * in milliseconds
     */
    duration:Number,
    easing:"ease"|"linear"|"ease-in"|"ease-out"|"ease-in-out"|Number[],
}
type LeaderLinePath="straight"|"arc"|"fluid"|"magnet"|"grid";
type LeaderLineSocket="auto"|"top"|"right"|"bottom"|"left";
type LeaderLineSocketGravity="auto"|Number|Number[];
type LeaderLinePlug="disc"|"square"|"arrow1"|"arrow2"|"arrow3"|"hand"|"crosshair"|"behind";
type LeaderLineDash=Boolean|{
    length:"auto"|Number,
    gap:"auto"|Number,
    animation:Boolean|LeaderLineAnimation,
};

type LeaderLineEntity={
    readonly _id:Number,
    readonly isRemoved:Boolean,
}
interface PointAnchor extends LeaderLineEntity {};
interface AreaAnchor extends LeaderLineEntity {};
interface MouseHoverAnchor extends LeaderLineEntity {};
interface LeaderLineLabel extends LeaderLineEntity {};

type LeaderLineAnchorOptions={
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
        points:(number|string)[][]
    },
}
