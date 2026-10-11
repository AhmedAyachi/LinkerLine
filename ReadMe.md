## What is this ?
This project is an extension to the original leader-line project https://github.com/anseki/leader-line v1.0.7.

<a href="https://www.buymeacoffee.com/ahmedayachi" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50" width="210">
</a>

## LinkerLine v2

LinkerLine v2 introduces a new API. Instead of a single default export, the package now provides the following exports:
|Export|Description|
|--|--|
|LinkerLine|instantiates new standalone lines|
|LinkerChain|instantiates new chains|
|LinkerLabel|instantiates new labels|
|LinkerAnchor|for anything related to anchors|
|LinkerPlug|for anything related to plugs|

These API changes aim to facilitate maintainability and extensibility.
For an API similar to LeaderLine's, you can still use version 1.6, but the latter will no longer receive updates nor fixes.

API Changes :
 1. **PointAnchor**,  **AreaAnchor** and **MouseHoverAnchor** are moved to the **LinkerAnchor** export.
 2. **CaptionLabel** and **PathLabel** are merged into **Label**. The Label has an option named ***on*** that takes as a value either ***path*** or ***element***.
 3. MouseHoverAnchor ***onSwitch*** option is renamed to ***onToggle***.
 4. animation object ***timing*** property is renamed to ***easing***.
 5. Line's ***hide*** option is renamed to ***hidden***.
 6. dash ***len*** property is renamed to ***length***.
 7. Anchors ***size*** option is renamed to ***strokeWidth***.
 8. AreaAnchor ***circle*** shape  is renamed to ***ellipse***.
 9. AreaAnchor ***color*** option is renamed to ***strokeColor***.
 10. Lines are shown and hidden with no animation by default.
 11. The line ***outline***, ***outlineSize*** and ***outlineColor*** options are merged into a single ***outline object***. `outline:{size:number,color:string}`.
 12. The line ***start/endPlug*** ***Size***, ***Color***, ***Outline*** options are merged into one ***start/endPlug*** object.
 13. The line ***start/endSocket*** and ***start/endSocketGravity***  options are merged into one ***start/endSocket*** object.
 14. The line ***start/endPlug*** getter returns the whole plug object. To get only the plug name, use ***start/endPlugName***.
 15. The line ***start/endSocketGravity*** getter returns **-1** in case ***auto*** is specified.
 16. The line options are set via ***setOptions*** only.

>The ***dist/linkerline.min.js*** release was deprecated. You can use **[JsDelivr](https://www.jsdelivr.com/package/npm/linkerline)** instead.

## Why using it ?
The original LeaderLine class lacks:
|Feature|Description|
|--|--|
|parent option|The original leaderline class always inserts the line svg element in body. In some cases, inserting the line in a specific element is required.|
|element property|The LeaderLine instance lacks the element property, that points to the line's svg element in the DOM|
|scroll positioning|If you create a line using the original class and then drag one of its connected elements (start/end) to the end of its parent's offset, causing the parent to become scrollable, the positioning of the line becomes incorrect|
|absolute positioning|When you create a line and append it to a draggable element, making the draggable element the parent node of the line SVG element in the DOM, the positioning of the line becomes incorrect if you subsequently drag that element|

This package tackles all the issues mentioned above and provides more  options and properties to the LeaderLine instance.

## How to use it ?
Just install the package using npm or any package manager of your choice :
```
npm install --save linkerline
```
And then use it in your code as follows : 
```
import {LinkerLine} from "linkerline";
```

## LinkerLine

![Illustration](https://raw.githubusercontent.com/AhmedAyachi/RepoIllustrations/main/LinkerLine/Illustration.gif)
```
import {LinkerLine} from "linkerline";
	
const line=new LinkerLine({
    //...OriginalClassProps,
    parent:HTMLElement,
    start:HTMLElement,
    end:HTMLElement,
    outline:{
        size:0.3,
        color:"green",
    },
    startPlug:"disc",
    endPlug:{
        name:"square",
        size:2,
        color:"red",
        outline:{
            size:1,
            color:"black",
        },
    },
    startSocket:"bottom",
    endSocket:{
        side:"top",
        gravity:50,
    },
});
//line.element => gets the line svg element
```
|New Options|Description|
|--|--|
|parent|where to insert the line element, default to the line's end element parentNode.|
|minGridLength|The minimun line length (default to ***30***). Only applied to grid-pathed lines.|

|New Properties|Type|Description|
|--------------|----|-----------|
|element|SVG Element|the line svg element.|
|hidden|Boolean|indicates whether the line is hidden or not.
|removed|Boolean|indicates whether the line was removed (line.remove was called) or not.
|standalone|Boolean|indicates whether the line is directly instantiated or not (ex: belongs to a LinkerChain instance).|

|Static Member|Type|Description|
|-------------|------------|-----------|
|removeAll|(Function) : void|removes standalone lines at once|
|positionAll|() : void|updates all the lines'positions at once|
|findByElement|(Element) : LinkerLine\|null|gets the element corresponding LinkerLine instance

### removeAll
The ***removeAll*** method takes a filter as argument and calls it once for each standalone line and removes those that meet the condition specified.
```
//removes only red lines
LinkerLine.removeAll(line=>line.color==="red");

//removes all lines
LinkerLine.removeAll();
```



## LinkerChain

![LinkerChain Illustration.gif](https://raw.githubusercontent.com/AhmedAyachi/RepoIllustrations/main/LinkerLine/ChainIllustration.gif)
```
import {LinkerChain} from "linkerline;

const chain=new LinkerChain(nodes,{
    onLinkChange:({line,startNode,endNode,nodesLinked})=>{
        const color=nodesLinked?line.color:null;
        startNode.style.backgroundColor=color;
        endNode.style.backgroundColor=color;
    },
});
linkbtn.onclick=()=>{
    chain.link();
};
unlinkbtn.onclick=()=>{
    chain.unlink();
}
```
|Param Name|Type|Description|
|----------|----|-----------|
|nodes|HTMLElement[]|The chain nodes|
|options|Object|The chain options|

### Chain Options :
|Option Name|Type|Description|
|-----------|----|-----------|
|linkingDuration|Number|The line draw animation duration, default to 500|
|linked|Boolean|specifies if the chain is initially linked or not, default to false|
|lineOptions|LinkerLineOptions|The line options|
|onLinkChange|(context : object) : void|Called on each node-to-node connection change|

#### onLinkChange Context :
|Property Name|Type|Description|
|-------------|----|-----------|
|line|LinkerLine|The connection line|
|startNode|HTMLElement|Same as line.start|
|endNode|HTMLElement|Same as line.end|
|nodesLinked|Boolean|Indicates whether the nodes are linked or unlinked|
|hopIndex|Number|The hop index|

### Chain Properties:
|Name|Type|Description|
|-------|-----|-------|
|nodes|HTMLElement[]|gets the chain target nodes|
|lines|LinkerLine[]|gets the chain lines|
|linked|Boolean|true if all nodes are fully linked, false otherwise|
|partiallyLinked|Boolean|true if at least one line is visible, false otherwise|
|destroyed|Boolean|indicates if the chain was destroyed or not|
|append|(...nodes:HTMLElement) : void|appends new nodes to the end of the chain|
|prepend|(...nodes:HTMLElement) : void|adds new nodes at the start of the chain|
|destroy|() : void|destroys the chain|
|link|(options?:LinkingOptions) : void|links the chain nodes. Only moves forwards|
|unlink|(options?:LinkingOptions) : void|unlinks the chain nodes. Only moves backwards|
|relink|(options:LinkingOptions) : void|links/unlinks the chain based on the "toIndex" option|

#### LinkingOptions
|Option|type|Description|
|------|----|-----------|
|toIndex|Number|the node index to link/unlink to|

**Additional properties are added to nodes:**
|Property Name|Type|Description|
|-------------|----|-----------|
|inLines|LinkerLine[] \| undefined|The linkerline instances entering the node|
|outLines|LinkerLine[] \| undefined|The linkerline instances exiting the node|
|inLine|LinkerLine \| null|Gets the last inLine|
|outLine|LinkerLine \| null|Gets the last outLine|

The **inLines** and **outLines** properties are defined because a single node can belong to multiple chains.

![InterChain Illustration](https://raw.githubusercontent.com/AhmedAyachi/RepoIllustrations/beta/LinkerLine/InterChainIllustration.gif)

## LinkerLabel
```
import {LinkerLabel,LinkerLine} from "linkerline";

const line=new LinkerLine({
    parent,start,end,
    startLabel:new LinkerLabel("start label",{
        on:"element",
        style:{
            color:"red",
            fontSize:20,
            outlineColor:"blue",
        },
    }),
    middleLabel:{
        text:"middle label",
        on:"path",
    },
    endLabel:"end label",
});
```
If a ***string***  is passed, the default label styling is applied.
You can pass a ***plain object*** instead of using the ***LinkerLabel*** class as shown above.

## LinkerAnchor

|Member|Description|
|------|-----------|
|Area|points to an area inside an element|
|Point|targets a point inside an element|
|MouseHover|shows/hides the line on mouse hover|

```
import {LinkerAchor,LinkerLine} from "linkerline;

const line=new LinkerLine({
    parent:Element,
    path:"grid",
    color:"#ffa500",
    start:Element,
    end:LinkerAnchor.Area(element,{
        x:"50%",
        y:"35%",
        shape:"ellipse",
        width:"20%",
        height:"20%",
        fillColor:"#c81fe2",
        strokeColor:"#ffa500",
    });
});
```

![Area Anchor Illustration](https://raw.githubusercontent.com/AhmedAyachi/RepoIllustrations/beta/LinkerLine/AreaAnchor.png)

## LinkerPlug

|Member|Description|
|------|-----------|
|define|defines custom plugs|

### define

|Option|Type|Description|
|------|----|-----------|
|name|string (required)|plug name|
|shape|enum "rect","ellipse"|defines a plug via a shape|
|svg|string \| (color:string,weight:string)=>string|defines a plug via an svg string|
|src|string|defines a plug via an url or base64 string|
|width|number|sets the plug base width|
|height|number|sets the plug base height|
|margin|number|margin between the plug and the start/end element|
|rotatable|boolean|indicates whether the plug should have a fixed orientation or rotate accordingly|

```
import {LinkerPLug} from "linkerline";

LinkerPlug.define({
    name:"star",
    width:20,
    height:20,
    rotatable:false,
    svg:(color,weight)=>`
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="${color}" stroke-width="${weight}" stroke-linecap="round" stroke-linejoin="round">
            <path d="M8.243 7.34l-6.38 .925l-.113 .023a1 1 0 0 0 -.44 1.684l4.622 4.499l-1.09 6.355l-.013 .11a1 1 0 0 0 1.464 .944l5.706 -3l5.693 3l.1 .046a1 1 0 0 0 1.352 -1.1l-1.091 -6.355l4.624 -4.5l.078 -.085a1 1 0 0 0 -.633 -1.62l-6.38 -.926l-2.852 -5.78a1 1 0 0 0 -1.794 0l-2.853 5.78z"/>
        </svg>
    `,
});
const line=new LinkerLine({
    parent:linkerlineview,
    color:"#73f5fa",
    size:3,
    startPlug:"star",
    endPlug:"star",
});
```

For svgs, when a function is specified, the **color** and the **weight**  params will respectively make sure that the plug will match the line color (or start/endPlugColor if specified) and thickness.

##
Thanks for the coffee ☕️, I might buy you a beer 🍺 some day.

<a href="https://www.buymeacoffee.com/ahmedayachi" target="_blank">
  <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" height="50" width="210">
</a>