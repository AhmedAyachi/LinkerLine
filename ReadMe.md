## What is this ?
This project is an extension to the original leader-line project https://github.com/anseki/leader-line v1.0.7.

## Why using it ?
The original LeaderLine class lacks:
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
|element|The leaderline svg element|

Changes :
 1. pointAnchor, areaAnchor, mouseHoverAnchor are renamed to PointAnchor, AreaAnchor, MouseHoverAnchor.
 2. CaptionLabel and PathLabel are merged into Label. The Label has an option named "on" that takes as a value either "path" or "element".
 3. animation object "timing" property is renamed to "easing".
 4. dash "len" property is renamed to "length".
 
## Illustration
![Illustration](https://github.com/AhmedAyachi/RepoIllustrations/blob/main/LeaderLine/Illustration.gif)

Check [source code](https://github.com/AhmedAyachi/VritraExamples).

## How to use it ?
Just install the package using npm or any package manager of your choice :

    npm install --save linkerline

And then use it in your code as follows : 
	
	import LinkerLine from "linkerline";
	
    const line=new LinkerLine({
	    //...OriginalClassProps,
	    parent:HTMLElement,// this is the new parent option
	    start:HTMLElement,
	    end:HTMLElement,
    });
	//line.element => returns the line svg element