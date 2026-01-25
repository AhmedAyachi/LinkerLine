import {LinkerEntity,LinkerLineAnimation,LinkerLineDash} from "../LinkerLine/LinkerLine";


export default class LinkerAnchor {
    static Point(element:HTMLElement,options?:{
        x?:number|string,
        y?:number|string,
    }):PointAnchor;

    static Area<Shape extends keyof LinkerAnchorOptions>(element:HTMLElement,options?:{
        x?:number|string,
        y?:number|string,
        size?:number,
        dash?:LinkerLineDash,
        /**
         * @default "rect"
         */
        shape?:Shape,
        fillColor?:string,
        /**
         * @default line.color
         */
        strokeColor?:string,
        
    }&LinkerAnchorOptions[Shape]):AreaAnchor;

    static MouseHover(element:HTMLElement,options?:{
        style?:Partial<CSSStyleDeclaration>,
        animation?:LinkerLineAnimation,
        hoverStyle?:Partial<CSSStyleDeclaration>,
         /**
         * A function that is called on line did show/hide, with a mouse event argument
         */
        onToggle?(event:MouseEvent):void,
    }):MouseHoverAnchor;
}

export interface PointAnchor extends LinkerEntity {}
export interface AreaAnchor extends LinkerEntity {}
export interface MouseHoverAnchor extends LinkerEntity {}

export type LinkerAnchorOptions={
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
