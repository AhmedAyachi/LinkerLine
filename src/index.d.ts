
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
    });
    position():void;
    show():void;
    remove():void;
    /**
     * The leaderline svg element
     */
    readonly element:SVGElement;
}