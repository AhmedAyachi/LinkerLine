## What is this ?
This LeaderLine version is an extension to the original LeaderLine project https://github.com/anseki/leader-line .
## Why using it ?
The original leaderline class lacks:
* parent prop :
The original leaderline class always inserts the line svg element in body. Sometimes you want to insert the svg in a specific element.
* element prop : the svg element of the line
* absolute positioning : regradless of the parents scroll or offset.
## What's new ?
* New options :
    * parent : where to insert the line element, default to document.body
* new Props :
    * element : the line svg element
* Absolute positioning