
/**
 * for Additional props and methods 
 * please consider checking the original
 * project docs
 */
export default class LeaderLine {
    constructor(props:{
        /**
        * The element where to insert the line svg element
        * @default document.body
        */
        parent?:HTMLElement,
        start:HTMLElement,
        end:HTMLElement,
        color:string,
        startPlugColor:string,
        endPlugColor:string,
        gradient:boolean,
        dropShadow:boolean,
        dash:boolean|{animation:boolean},
        size:number,
        outline:boolean,
        endPlugOutline:boolean,
        endPlugSize:number,
        startPlug:"square",
        endPlug:"hand",
        startLabel:string,
        middleLabel:string,
        endLabel:string,
        captionLabel:string,
        pathLabel:string,
    });
    position():void;
    show():void;
    remove():void;
    /**
     * The leaderline svg element
     */
    readonly element:SVGElement;
    color:String;
    size:Number;
}
