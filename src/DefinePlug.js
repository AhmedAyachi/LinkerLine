import LeaderLine from "./LeaderLine";


export default (options)=>{
    const {name}=options;
    if(LeaderLine.names[name]) throw new Error(`Plug "${name}" already defined`);
    else{
        let defroot=document.body.querySelector(":scope>#linker-line-defs");
        if(!defroot){
            const start=document.body.appendChild(document.createElement("div"));
            const end=document.body.appendChild(document.createElement("div"));
            new LeaderLine({start,end}).remove();
            start.remove();
            end.remove();
            defroot=document.body.querySelector(":scope>#linker-line-defs");
        }
        const defsEl=defroot.querySelector(":scope>defs");
        const {shape}=options;
        if(shape){
            const {type}=shape;
            if(statics.shapeType.includes(type)){
                const {elmId}=registerPlug(name,shape);
                const element=document.createElementNS("http://www.w3.org/2000/svg",type);
                element.id=elmId;
                defsEl.appendChild(element);
                const {width,height}=shape;
                if(type==="rect"){
                    element.setAttribute("x",-width/2);
                    element.setAttribute("y",-height/2);
                    element.setAttribute("width",width);
                    element.setAttribute("height",height);
                }
                else if(type==="ellipse"){
                    element.setAttribute("cx",0);
                    element.setAttribute("cy",0);
                    element.setAttribute("rx",width/2);
                    element.setAttribute("ry",height/2);
                } 
            }
            else{
                throw new Error(`shape type should be one of: ${statics.shapeType.toString()}`);
            }
        }
        else{
            let {svg}=options;
            if(typeof(svg)==="function") svg=svg();
            if(typeof(svg)==="string"){
                const {elmId}=registerPlug(name,{width:60,height:60});
                const groupEl=document.createElementNS("http://www.w3.org/2000/svg","g");
                groupEl.innerHTML=svg;
                groupEl.id=elmId;
                defsEl.appendChild(groupEl);
                console.log(LeaderLine.plugs);
            }
            else{
                throw new Error("custom plug svg value should be a string");
            }
        }
    }
}

const statics={
    shapeType:["rect","ellipse"],
}

const registerPlug=(name,options)=>{
    const {width,height,spacing}=options;
    const plugProps={
        elmId:`linker-line-${name}`,
        bBox:{
            left:-width/2,
            right:width/2,
            top:-height/2,
            bottom:height/2,
            width:width,
            height:height,
        },
        widthR:width/4,
        heightR:height/4,
        bCircle:Math.max(width,height)/2,
        sideLen:Math.max(width,height)/2,
        backLen:Math.max(width,height)/2,
        overhead:(typeof(spacing)==="number")&&spacing,
        outlineBase:2,
        outlineMax:1.5,
        noRotate:true,
    }
    LeaderLine.plugs[name]=plugProps;
    LeaderLine.names[name]=name;
    return plugProps;
}