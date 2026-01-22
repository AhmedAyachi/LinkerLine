import {EffectName,LinkerLineEntity,LinkerLineAnimation,LinkerLineDash} from "../LinkerLine/LinkerLine";


export default class LinkerAnchor {
    static Point(element:HTMLElement,options?:{
        x?:number|string,
        y?:number|string,
    }):PointAnchor;

    static Area<Shape extends keyof LinkerLineAnchorOptions>(element:HTMLElement,options?:{
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

    static MouseHover(element:HTMLElement,options?:{
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
}

export interface PointAnchor extends LinkerLineEntity {}
export interface AreaAnchor extends LinkerLineEntity {}
export interface MouseHoverAnchor extends LinkerLineEntity {}

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
