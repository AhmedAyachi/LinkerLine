import LeaderLine from "./LeaderLine";


export default function(options){
    const {name}=options;
    if(!name) throw new Error("Plug name is required");
    else if(LeaderLine.names[name]) throw new Error(`Plug "${name}" already defined`);
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
        if("shape" in options) defineShapePlug(defsEl,options);
        else if("svg" in options) defineSvgPlug(defsEl,options);
        else if("src" in options) defineSrcPlug(defsEl,options);
        else throw new Error("invalid custom plug definition object");
    }
}

const statics={
    shapes:["rect","ellipse"],
}

export const setLinePlugStyle=(linkerline)=>{
    const {element}=linkerline,{plugs}=LeaderLine;
    [linkerline.startPlug,linkerline.endPlug].forEach((plugname,i)=>{
        const definition=plugs[plugname];
        if(definition?.withsvg){
            const useEl=element.querySelector(`[id$=plug-marker-${i}] use[href]`);
            if(useEl){
                useEl.style.stroke=useEl.style.fill||linkerline[(i?"end":"start")+"PlugColor"]||linkerline.color||"black";
                useEl.style.strokeWidth=(linkerline.size||4)/2;
            }
        }
    });
}

const defineSrcPlug=(defsEl,options)=>{
    const {src}=options;
    if(typeof(src)==="string"){
        const groupEl=document.createElementNS("http://www.w3.org/2000/svg","g");
        const imageEl=document.createElementNS("http://www.w3.org/2000/svg","image");
        const {width=24,height=24}=options;
        imageEl.setAttribute("width",width);
        imageEl.setAttribute("height",height);
        imageEl.setAttribute("href",src);
        groupEl.appendChild(imageEl);
        defsEl.appendChild(groupEl);
        groupEl.setAttribute("transform",`translate(-${width/2},-${height/2})`);
        const {elmId}=registerPlug({
            ...options,
            width,height,
            withsvg:true,
        });
        groupEl.id=elmId;
    }
    else throw new Error(`Property "src" should be of type string`);
}

const defineSvgPlug=(defsEl,options)=>{
    let {svg}=options;
    if(typeof(svg)==="function") svg=svg("inherit","inherit");
    if(typeof(svg)==="string"){
        const groupEl=document.createElementNS("http://www.w3.org/2000/svg","g");
        groupEl.innerHTML=svg;
        defsEl.appendChild(groupEl);
        const svgEl=groupEl.querySelector(":scope>svg");
        const width=options.width||svgEl.width.baseVal.value;
        const height=options.height||svgEl.height.baseVal.value;
        svgEl.setAttribute("width",width);
        svgEl.setAttribute("height",height);
        groupEl.setAttribute("transform",`translate(-${width/2},-${height/2})`);
        const {elmId}=registerPlug({
            ...options,
            width,height,
            withsvg:true,
        });
        groupEl.id=elmId;
    }
    else throw new Error(`Property "svg" should be of type string or a function that returns a string`);
}

const defineShapePlug=(defsEl,options)=>{
    const {shape}=options;
    if(statics.shapes.includes(shape)){
        const {width=0,height=0}=options;
        options.width=width;
        options.height=height;
        const {elmId}=registerPlug(options);
        const element=document.createElementNS("http://www.w3.org/2000/svg",shape);
        element.id=elmId;
        defsEl.appendChild(element);
        if(shape==="rect"){
            element.setAttribute("x",-width/2);
            element.setAttribute("y",-height/2);
            element.setAttribute("width",width);
            element.setAttribute("height",height);
        }
        else if(shape==="ellipse"){
            element.setAttribute("cx",0);
            element.setAttribute("cy",0);
            element.setAttribute("rx",width/2);
            element.setAttribute("ry",height/2);
        } 
    }
    else throw new Error(`shape should be one of: ${statics.shapes.toString()}`);
}

const registerPlug=(options)=>{
    const {name,width,height,margin,rotatable=true}=options;
    const innerRadius=Math.max(width,height)/2;
    const plugProps={
        elmId:`linker-line-${name}`,
        bBox:{
            width,height,
            top:-height/2,
            left:-width/2,
            right:width/2,
            bottom:height/2,
        },
        widthR:width/4,
        heightR:height/4,
        bCircle:innerRadius,
        sideLen:innerRadius,
        backLen:innerRadius,
        overhead:(typeof(margin)==="number")&&margin,
        outlineBase:2,
        outlineMax:1.5,
        noRotate:!rotatable,
        withsvg:options.withsvg,
    }
    LeaderLine.plugs[name]=plugProps;
    LeaderLine.names[name]=name;
    return plugProps;
}