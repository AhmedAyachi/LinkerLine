## What is this ?
This LeaderLine version is an extension to the original LeaderLine project https://github.com/anseki/leader-line .

## Why using it ?
The original leaderline class lacks:
|Feature|Description|
|--|--|
|parent option|The original leaderline class always inserts the line svg element in body. In some cases, inserting the line in a specific element is required.|
|element property|The LeaderLine instance lacks the element property, that points to the line's svg element in the DOM|
|scroll positioning|If you create a line using the original class and then drag one of its connected elements (start/end) to the end of its parent's offset, causing the parent to become scrollable, the positioning of the line becomes incorrect|
|absolute positioning|When you create a line and append it to a draggable element, making the draggable element the parent node of the line SVG element in the DOM, the positioning of the line becomes incorrect if you subsequently drag that element|

## What's new ?
This library tackles all the issues mentioned above and provides more  options and properties to the LeaderLine instance :
|New Options|Description|
|--|--|
|parent|where to insert the line element, default to document.body|

|New Properties|Description|
|--|--|
|parent|The value of the parent option provided when creating the line|
|element|The leaderline svg element|

## How to use it ?
Just install the current git repo using npm or any package manager of your choice :

> npm install --save github:AhmedAyachi/LeaderLine

And then use it in your code as follows : 
	
	import LeaderLine from "leaderline";
	
    const line=new LeaderLine({
	    //...OriginalClassProps,
	    parent:HTMLElement,// this is the new parent option
	    start:HTMLElement,
	    end:HTMLElement,
    });
    //line.parent => returns the parent option
	//line.element => returns the line svg element