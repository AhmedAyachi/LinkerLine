

export default class LinkerPlug {
    /**
    * defines custom plugs
    */
    static define(options:{
        name:string,
        /**
         * defines a plug via a shape
         */
        shape?:"rect"|"ellipse",
        /**
         * defines a plug via an svg string
         */
        svg?:string|((color:string,weight:string)=>string),
        /**
         * defines a plug via an url or base64 string
         */
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
        /**
         * margin between the plug and the start/end element
         */
        margin?:number,
        /**
         * indicates whether the plug should have a fixed orientation or rotate accordingly
         */
        rotatable?:boolean,
    }):void;
}
