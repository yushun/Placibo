/*
 * Pixastic - JavaScript Image Processing Library
 * Copyright (c) 2008 Jacob Seidelin, jseidelin@nihilogic.dk, http://blog.nihilogic.dk/
 * MIT License [http://www.pixastic.com/lib/license.txt]
 */
var pixastic_parseonload = true;

var Pixastic=(function(){function addEvent(el,event,handler){if(el.addEventListener)
el.addEventListener(event,handler,false);else if(el.attachEvent)
el.attachEvent("on"+event,handler);}
function onready(handler){var handlerDone=false;var execHandler=function(){if(!handlerDone){handlerDone=true;handler();}}
document.write("<"+"script defer src=\"//:\" id=\"__onload_ie_pixastic__\"></"+"script>");var script=document.getElementById("__onload_ie_pixastic__");script.onreadystatechange=function(){if(script.readyState=="complete"){script.parentNode.removeChild(script);execHandler();}}
if(document.addEventListener)
document.addEventListener("DOMContentLoaded",execHandler,false);addEvent(window,"load",execHandler);}
function init(){var imgEls=getElementsByClass("pixastic",null,"img");var canvasEls=getElementsByClass("pixastic",null,"canvas");var elements=imgEls.concat(canvasEls);for(var i=0;i<elements.length;i++){(function(){var el=elements[i];var actions=[];var classes=el.className.split(" ");for(var c=0;c<classes.length;c++){var cls=classes[c];if(cls.substring(0,9)=="pixastic-"){var actionName=cls.substring(9);if(actionName!="")
actions.push(actionName);}}
if(actions.length){if(el.tagName.toLowerCase()=="img"){var dataImg=new Image();dataImg.src=el.src;if(dataImg.complete){for(var a=0;a<actions.length;a++){var res=Pixastic.applyAction(el,el,actions[a],null);if(res)
el=res;}}else{dataImg.onload=function(){for(var a=0;a<actions.length;a++){var res=Pixastic.applyAction(el,el,actions[a],null)
if(res)
el=res;}}}}else{setTimeout(function(){for(var a=0;a<actions.length;a++){var res=Pixastic.applyAction(el,el,actions[a],null);if(res)
el=res;}},1);}}})();}}
if(typeof pixastic_parseonload!="undefined"&&pixastic_parseonload)
onready(init);function getElementsByClass(searchClass,node,tag){var classElements=new Array();if(node==null)
node=document;if(tag==null)
tag='*';var els=node.getElementsByTagName(tag);var elsLen=els.length;var pattern=new RegExp("(^|\\s)"+searchClass+"(\\s|$)");for(i=0,j=0;i<elsLen;i++){if(pattern.test(els[i].className)){classElements[j]=els[i];j++;}}
return classElements;}
var debugElement;function writeDebug(text,level){if(!Pixastic.debug)return;try{switch(level){case"warn":console.warn("Pixastic:",text);break;case"error":console.error("Pixastic:",text);break;default:console.log("Pixastic:",text);}}catch(e){}
if(!debugElement){}}
var hasCanvas=(function(){var c=document.createElement("canvas");var val=false;try{val=!!((typeof c.getContext=="function")&&c.getContext("2d"));}catch(e){}
return function(){return val;}})();var hasCanvasImageData=(function(){var c=document.createElement("canvas");var val=false;var ctx;try{if(typeof c.getContext=="function"&&(ctx=c.getContext("2d"))){val=(typeof ctx.getImageData=="function");}}catch(e){}
return function(){return val;}})();var hasGlobalAlpha=(function(){var hasAlpha=false;var red=document.createElement("canvas");if(hasCanvas()&&hasCanvasImageData()){red.width=red.height=1;var redctx=red.getContext("2d");redctx.fillStyle="rgb(255,0,0)";redctx.fillRect(0,0,1,1);var blue=document.createElement("canvas");blue.width=blue.height=1;var bluectx=blue.getContext("2d");bluectx.fillStyle="rgb(0,0,255)";bluectx.fillRect(0,0,1,1);redctx.globalAlpha=0.5;redctx.drawImage(blue,0,0);var reddata=redctx.getImageData(0,0,1,1).data;hasAlpha=(reddata[2]!=255);}
return function(){return hasAlpha;}})();return{parseOnLoad:false,debug:false,applyAction:function(img,dataImg,actionName,options){options=options||{};var imageIsCanvas=(img.tagName.toLowerCase()=="canvas");if(imageIsCanvas&&Pixastic.Client.isIE()){if(Pixastic.debug)writeDebug("Tried to process a canvas element but browser is IE.");return false;}
var canvas,ctx;var hasOutputCanvas=false;if(Pixastic.Client.hasCanvas()){hasOutputCanvas=!!options.resultCanvas;canvas=options.resultCanvas||document.createElement("canvas");ctx=canvas.getContext("2d");}
var w=img.offsetWidth;var h=img.offsetHeight;if(imageIsCanvas){w=img.width;h=img.height;}
if(w==0||h==0){if(img.parentNode==null){var oldpos=img.style.position;var oldleft=img.style.left;img.style.position="absolute";img.style.left="-9999px";document.body.appendChild(img);w=img.offsetWidth;h=img.offsetHeight;document.body.removeChild(img);img.style.position=oldpos;img.style.left=oldleft;}else{if(Pixastic.debug)writeDebug("Image has 0 width and/or height.");return;}}
if(actionName.indexOf("(")>-1){var tmp=actionName;actionName=tmp.substr(0,tmp.indexOf("("));var arg=tmp.match(/\((.*?)\)/);if(arg[1]){arg=arg[1].split(";");for(var a=0;a<arg.length;a++){thisArg=arg[a].split("=");if(thisArg.length==2){if(thisArg[0]=="rect"){var rectVal=thisArg[1].split(",");options[thisArg[0]]={left:parseInt(rectVal[0],10)||0,top:parseInt(rectVal[1],10)||0,width:parseInt(rectVal[2],10)||0,height:parseInt(rectVal[3],10)||0}}else{options[thisArg[0]]=thisArg[1];}}}}}
if(!options.rect){options.rect={left:0,top:0,width:w,height:h};}else{options.rect.left=Math.round(options.rect.left);options.rect.top=Math.round(options.rect.top);options.rect.width=Math.round(options.rect.width);options.rect.height=Math.round(options.rect.height);}
var validAction=false;if(Pixastic.Actions[actionName]&&typeof Pixastic.Actions[actionName].process=="function"){validAction=true;}
if(!validAction){if(Pixastic.debug)writeDebug("Invalid action \""+actionName+"\". Maybe file not included?");return false;}
if(!Pixastic.Actions[actionName].checkSupport()){if(Pixastic.debug)writeDebug("Action \""+actionName+"\" not supported by this browser.");return false;}
if(Pixastic.Client.hasCanvas()){if(canvas!==img){canvas.width=w;canvas.height=h;}
if(!hasOutputCanvas){canvas.style.width=w+"px";canvas.style.height=h+"px";}
ctx.drawImage(dataImg,0,0,w,h);if(!img.__pixastic_org_image){canvas.__pixastic_org_image=img;canvas.__pixastic_org_width=w;canvas.__pixastic_org_height=h;}else{canvas.__pixastic_org_image=img.__pixastic_org_image;canvas.__pixastic_org_width=img.__pixastic_org_width;canvas.__pixastic_org_height=img.__pixastic_org_height;}}else if(Pixastic.Client.isIE()&&typeof img.__pixastic_org_style=="undefined"){img.__pixastic_org_style=img.style.cssText;}
var params={image:img,canvas:canvas,width:w,height:h,useData:true,options:options}
var res=Pixastic.Actions[actionName].process(params);if(!res){return false;}
if(Pixastic.Client.hasCanvas()){if(params.useData){if(Pixastic.Client.hasCanvasImageData()){canvas.getContext("2d").putImageData(params.canvasData,options.rect.left,options.rect.top);canvas.getContext("2d").fillRect(0,0,0,0);}}
if(!options.leaveDOM){canvas.title=img.title;canvas.imgsrc=img.imgsrc;if(!imageIsCanvas)canvas.alt=img.alt;if(!imageIsCanvas)canvas.imgsrc=img.src;canvas.className=img.className;canvas.style.cssText=img.style.cssText;canvas.name=img.name;canvas.tabIndex=img.tabIndex;canvas.id=img.id;if(img.parentNode&&img.parentNode.replaceChild){img.parentNode.replaceChild(canvas,img);}}
options.resultCanvas=canvas;return canvas;}
return img;},prepareData:function(params,getCopy){var ctx=params.canvas.getContext("2d");var rect=params.options.rect;var dataDesc=ctx.getImageData(rect.left,rect.top,rect.width,rect.height);var data=dataDesc.data;if(!getCopy)params.canvasData=dataDesc;return data;},process:function(img,actionName,options,callback){if(img.tagName.toLowerCase()=="img"){var dataImg=new Image();dataImg.src=img.src;if(dataImg.complete){var res=Pixastic.applyAction(img,dataImg,actionName,options);if(callback)callback(res);return res;}else{dataImg.onload=function(){var res=Pixastic.applyAction(img,dataImg,actionName,options)
if(callback)callback(res);}}}
if(img.tagName.toLowerCase()=="canvas"){var res=Pixastic.applyAction(img,img,actionName,options);if(callback)callback(res);return res;}},revert:function(img){if(Pixastic.Client.hasCanvas()){if(img.tagName.toLowerCase()=="canvas"&&img.__pixastic_org_image){img.width=img.__pixastic_org_width;img.height=img.__pixastic_org_height;img.getContext("2d").drawImage(img.__pixastic_org_image,0,0);if(img.parentNode&&img.parentNode.replaceChild){img.parentNode.replaceChild(img.__pixastic_org_image,img);}
return img;}}else if(Pixastic.Client.isIE()){if(typeof img.__pixastic_org_style!="undefined")
img.style.cssText=img.__pixastic_org_style;}},Client:{hasCanvas:hasCanvas,hasCanvasImageData:hasCanvasImageData,hasGlobalAlpha:hasGlobalAlpha,isIE:function(){return!!document.all&&!!window.attachEvent&&!window.opera;}},Actions:{}}})();Pixastic.Actions.blend={process:function(params){var amount=parseFloat(params.options.amount);var mode=(params.options.mode||"normal").toLowerCase();var image=params.options.image;amount=Math.max(0,Math.min(1,amount));if(!image)return false;if(Pixastic.Client.hasCanvasImageData()){var rect=params.options.rect;var data=Pixastic.prepareData(params);var w=rect.width;var h=rect.height;params.useData=false;var otherCanvas=document.createElement("canvas");otherCanvas.width=params.canvas.width;otherCanvas.height=params.canvas.height;var otherCtx=otherCanvas.getContext("2d");otherCtx.drawImage(image,0,0);var params2={canvas:otherCanvas,options:params.options};var data2=Pixastic.prepareData(params2);var dataDesc2=params2.canvasData;var p=w*h;var pix=p*4;var pix1,pix2;var r1,g1,b1;var r2,g2,b2;var r3,g3,b3;var r4,g4,b4;var dataChanged=false;switch(mode){case"normal":break;case"multiply":while(p--){data2[pix-=4]=data[pix]*data2[pix]/255;data2[pix1=pix+1]=data[pix1]*data2[pix1]/255;data2[pix2=pix+2]=data[pix2]*data2[pix2]/255;}
dataChanged=true;break;case"lighten":while(p--){if((r1=data[pix-=4])>data2[pix])
data2[pix]=r1;if((g1=data[pix1=pix+1])>data2[pix1])
data2[pix1]=g1;if((b1=data[pix2=pix+2])>data2[pix2])
data2[pix2]=b1;}
dataChanged=true;break;case"darken":while(p--){if((r1=data[pix-=4])<data2[pix])
data2[pix]=r1;if((g1=data[pix1=pix+1])<data2[pix1])
data2[pix1]=g1;if((b1=data[pix2=pix+2])<data2[pix2])
data2[pix2]=b1;}
dataChanged=true;break;case"darkercolor":while(p--){if(((r1=data[pix-=4])*0.3+(g1=data[pix1=pix+1])*0.59+(b1=data[pix2=pix+2])*0.11)<=(data2[pix]*0.3+data2[pix1]*0.59+data2[pix2]*0.11)){data2[pix]=r1;data2[pix1]=g1;data2[pix2]=b1;}}
dataChanged=true;break;case"lightercolor":while(p--){if(((r1=data[pix-=4])*0.3+(g1=data[pix1=pix+1])*0.59+(b1=data[pix2=pix+2])*0.11)>(data2[pix]*0.3+data2[pix1]*0.59+data2[pix2]*0.11)){data2[pix]=r1;data2[pix1]=g1;data2[pix2]=b1;}}
dataChanged=true;break;case"lineardodge":while(p--){if((r3=data[pix-=4]+data2[pix])>255)
data2[pix]=255;else
data2[pix]=r3;if((g3=data[pix1=pix+1]+data2[pix1])>255)
data2[pix1]=255;else
data2[pix1]=g3;if((b3=data[pix2=pix+2]+data2[pix2])>255)
data2[pix2]=255;else
data2[pix2]=b3;}
dataChanged=true;break;case"linearburn":while(p--){if((r3=data[pix-=4]+data2[pix])<255)
data2[pix]=0;else
data2[pix]=(r3-255);if((g3=data[pix1=pix+1]+data2[pix1])<255)
data2[pix1]=0;else
data2[pix1]=(g3-255);if((b3=data[pix2=pix+2]+data2[pix2])<255)
data2[pix2]=0;else
data2[pix2]=(b3-255);}
dataChanged=true;break;case"difference":while(p--){if((r3=data[pix-=4]-data2[pix])<0)
data2[pix]=-r3;else
data2[pix]=r3;if((g3=data[pix1=pix+1]-data2[pix1])<0)
data2[pix1]=-g3;else
data2[pix1]=g3;if((b3=data[pix2=pix+2]-data2[pix2])<0)
data2[pix2]=-b3;else
data2[pix2]=b3;}
dataChanged=true;break;case"screen":while(p--){data2[pix-=4]=(255-(((255-data2[pix])*(255-data[pix]))>>8));data2[pix1=pix+1]=(255-(((255-data2[pix1])*(255-data[pix1]))>>8));data2[pix2=pix+2]=(255-(((255-data2[pix2])*(255-data[pix2]))>>8));}
dataChanged=true;break;case"exclusion":var div_2_255=2/255;while(p--){data2[pix-=4]=(r1=data[pix])-(r1*div_2_255-1)*data2[pix];data2[pix1=pix+1]=(g1=data[pix1])-(g1*div_2_255-1)*data2[pix1];data2[pix2=pix+2]=(b1=data[pix2])-(b1*div_2_255-1)*data2[pix2];}
dataChanged=true;break;case"overlay":var div_2_255=2/255;while(p--){if((r1=data[pix-=4])<128)
data2[pix]=data2[pix]*r1*div_2_255;else
data2[pix]=255-(255-data2[pix])*(255-r1)*div_2_255;if((g1=data[pix1=pix+1])<128)
data2[pix1]=data2[pix1]*g1*div_2_255;else
data2[pix1]=255-(255-data2[pix1])*(255-g1)*div_2_255;if((b1=data[pix2=pix+2])<128)
data2[pix2]=data2[pix2]*b1*div_2_255;else
data2[pix2]=255-(255-data2[pix2])*(255-b1)*div_2_255;}
dataChanged=true;break;case"softlight":var div_2_255=2/255;while(p--){if((r1=data[pix-=4])<128)
data2[pix]=((data2[pix]>>1)+64)*r1*div_2_255;else
data2[pix]=255-(191-(data2[pix]>>1))*(255-r1)*div_2_255;if((g1=data[pix1=pix+1])<128)
data2[pix1]=((data2[pix1]>>1)+64)*g1*div_2_255;else
data2[pix1]=255-(191-(data2[pix1]>>1))*(255-g1)*div_2_255;if((b1=data[pix2=pix+2])<128)
data2[pix2]=((data2[pix2]>>1)+64)*b1*div_2_255;else
data2[pix2]=255-(191-(data2[pix2]>>1))*(255-b1)*div_2_255;}
dataChanged=true;break;case"hardlight":var div_2_255=2/255;while(p--){if((r2=data2[pix-=4])<128)
data2[pix]=data[pix]*r2*div_2_255;else
data2[pix]=255-(255-data[pix])*(255-r2)*div_2_255;if((g2=data2[pix1=pix+1])<128)
data2[pix1]=data[pix1]*g2*div_2_255;else
data2[pix1]=255-(255-data[pix1])*(255-g2)*div_2_255;if((b2=data2[pix2=pix+2])<128)
data2[pix2]=data[pix2]*b2*div_2_255;else
data2[pix2]=255-(255-data[pix2])*(255-b2)*div_2_255;}
dataChanged=true;break;case"colordodge":while(p--){if((r3=(data[pix-=4]<<8)/(255-(r2=data2[pix])))>255||r2==255)
data2[pix]=255;else
data2[pix]=r3;if((g3=(data[pix1=pix+1]<<8)/(255-(g2=data2[pix1])))>255||g2==255)
data2[pix1]=255;else
data2[pix1]=g3;if((b3=(data[pix2=pix+2]<<8)/(255-(b2=data2[pix2])))>255||b2==255)
data2[pix2]=255;else
data2[pix2]=b3;}
dataChanged=true;break;case"colorburn":while(p--){if((r3=255-((255-data[pix-=4])<<8)/data2[pix])<0||data2[pix]==0)
data2[pix]=0;else
data2[pix]=r3;if((g3=255-((255-data[pix1=pix+1])<<8)/data2[pix1])<0||data2[pix1]==0)
data2[pix1]=0;else
data2[pix1]=g3;if((b3=255-((255-data[pix2=pix+2])<<8)/data2[pix2])<0||data2[pix2]==0)
data2[pix2]=0;else
data2[pix2]=b3;}
dataChanged=true;break;case"linearlight":while(p--){if(((r3=2*(r2=data2[pix-=4])+data[pix]-256)<0)||(r2<128&&r3<0)){data2[pix]=0}else{if(r3>255)
data2[pix]=255;else
data2[pix]=r3;}
if(((g3=2*(g2=data2[pix1=pix+1])+data[pix1]-256)<0)||(g2<128&&g3<0)){data2[pix1]=0}else{if(g3>255)
data2[pix1]=255;else
data2[pix1]=g3;}
if(((b3=2*(b2=data2[pix2=pix+2])+data[pix2]-256)<0)||(b2<128&&b3<0)){data2[pix2]=0}else{if(b3>255)
data2[pix2]=255;else
data2[pix2]=b3;}}
dataChanged=true;break;case"vividlight":while(p--){if((r2=data2[pix-=4])<128){if(r2){if((r3=255-((255-data[pix])<<8)/(2*r2))<0)
data2[pix]=0;else
data2[pix]=r3}else{data2[pix]=0;}}else if((r3=(r4=2*r2-256))<255){if((r3=(data[pix]<<8)/(255-r4))>255)
data2[pix]=255;else
data2[pix]=r3;}else{if(r3<0)
data2[pix]=0;else
data2[pix]=r3}
if((g2=data2[pix1=pix+1])<128){if(g2){if((g3=255-((255-data[pix1])<<8)/(2*g2))<0)
data2[pix1]=0;else
data2[pix1]=g3;}else{data2[pix1]=0;}}else if((g3=(g4=2*g2-256))<255){if((g3=(data[pix1]<<8)/(255-g4))>255)
data2[pix1]=255;else
data2[pix1]=g3;}else{if(g3<0)
data2[pix1]=0;else
data2[pix1]=g3;}
if((b2=data2[pix2=pix+2])<128){if(b2){if((b3=255-((255-data[pix2])<<8)/(2*b2))<0)
data2[pix2]=0;else
data2[pix2]=b3;}else{data2[pix2]=0;}}else if((b3=(b4=2*b2-256))<255){if((b3=(data[pix2]<<8)/(255-b4))>255)
data2[pix2]=255;else
data2[pix2]=b3;}else{if(b3<0)
data2[pix2]=0;else
data2[pix2]=b3;}}
dataChanged=true;break;case"pinlight":while(p--){if((r2=data2[pix-=4])<128)
if((r1=data[pix])<(r4=2*r2))
data2[pix]=r1;else
data2[pix]=r4;else
if((r1=data[pix])>(r4=2*r2-256))
data2[pix]=r1;else
data2[pix]=r4;if((g2=data2[pix1=pix+1])<128)
if((g1=data[pix1])<(g4=2*g2))
data2[pix1]=g1;else
data2[pix1]=g4;else
if((g1=data[pix1])>(g4=2*g2-256))
data2[pix1]=g1;else
data2[pix1]=g4;if((r2=data2[pix2=pix+2])<128)
if((r1=data[pix2])<(r4=2*r2))
data2[pix2]=r1;else
data2[pix2]=r4;else
if((r1=data[pix2])>(r4=2*r2-256))
data2[pix2]=r1;else
data2[pix2]=r4;}
dataChanged=true;break;case"hardmix":while(p--){if((r2=data2[pix-=4])<128)
if(255-((255-data[pix])<<8)/(2*r2)<128||r2==0)
data2[pix]=0;else
data2[pix]=255;else if((r4=2*r2-256)<255&&(data[pix]<<8)/(255-r4)<128)
data2[pix]=0;else
data2[pix]=255;if((g2=data2[pix1=pix+1])<128)
if(255-((255-data[pix1])<<8)/(2*g2)<128||g2==0)
data2[pix1]=0;else
data2[pix1]=255;else if((g4=2*g2-256)<255&&(data[pix1]<<8)/(255-g4)<128)
data2[pix1]=0;else
data2[pix1]=255;if((b2=data2[pix2=pix+2])<128)
if(255-((255-data[pix2])<<8)/(2*b2)<128||b2==0)
data2[pix2]=0;else
data2[pix2]=255;else if((b4=2*b2-256)<255&&(data[pix2]<<8)/(255-b4)<128)
data2[pix2]=0;else
data2[pix2]=255;}
dataChanged=true;break;}
if(dataChanged)
otherCtx.putImageData(dataDesc2,0,0);if(amount!=1&&!Pixastic.Client.hasGlobalAlpha()){var p=w*h;var amount2=amount;var amount1=1-amount;while(p--){var pix=p*4;var r=(data[pix]*amount1+data2[pix]*amount2)>>0;var g=(data[pix+1]*amount1+data2[pix+1]*amount2)>>0;var b=(data[pix+2]*amount1+data2[pix+2]*amount2)>>0;data[pix]=r;data[pix+1]=g;data[pix+2]=b;}
params.useData=true;}else{var ctx=params.canvas.getContext("2d");ctx.save();ctx.globalAlpha=amount;ctx.drawImage(otherCanvas,0,0,rect.width,rect.height,rect.left,rect.top,rect.width,rect.height);ctx.globalAlpha=1;ctx.restore();}
return true;}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData();}}
Pixastic.Actions.blur={process:function(params){if(typeof params.options.fixMargin=="undefined")
params.options.fixMargin=true;if(Pixastic.Client.hasCanvasImageData()){var data=Pixastic.prepareData(params);var dataCopy=Pixastic.prepareData(params,true)
var kernel=[[0,1,0],[1,2,1],[0,1,0]];var weight=0;for(var i=0;i<3;i++){for(var j=0;j<3;j++){weight+=kernel[i][j];}}
weight=1/(weight*2);var rect=params.options.rect;var w=rect.width;var h=rect.height;var w4=w*4;var y=h;do{var offsetY=(y-1)*w4;var prevY=(y==1)?0:y-2;var nextY=(y==h)?y-1:y;var offsetYPrev=prevY*w*4;var offsetYNext=nextY*w*4;var x=w;do{var offset=offsetY+(x*4-4);var offsetPrev=offsetYPrev+((x==1)?0:x-2)*4;var offsetNext=offsetYNext+((x==w)?x-1:x)*4;data[offset]=((dataCopy[offsetPrev]
+dataCopy[offset-4]
+dataCopy[offset+4]
+dataCopy[offsetNext])*2
+dataCopy[offset]*4)*weight;data[offset+1]=((dataCopy[offsetPrev+1]
+dataCopy[offset-3]
+dataCopy[offset+5]
+dataCopy[offsetNext+1])*2
+dataCopy[offset+1]*4)*weight;data[offset+2]=((dataCopy[offsetPrev+2]
+dataCopy[offset-2]
+dataCopy[offset+6]
+dataCopy[offsetNext+2])*2
+dataCopy[offset+2]*4)*weight;}while(--x);}while(--y);return true;}else if(Pixastic.Client.isIE()){params.image.style.filter+=" progid:DXImageTransform.Microsoft.Blur(pixelradius=1.5)";if(params.options.fixMargin){params.image.style.marginLeft=(parseInt(params.image.style.marginLeft,10)||0)-2+"px";params.image.style.marginTop=(parseInt(params.image.style.marginTop,10)||0)-2+"px";}
return true;}},checkSupport:function(){return(Pixastic.Client.hasCanvasImageData()||Pixastic.Client.isIE());}}
Pixastic.Actions.blurfast={process:function(params){var amount=parseFloat(params.options.amount)||0;var clear=!!(params.options.clear&&params.options.clear!="false");amount=Math.max(0,Math.min(5,amount));if(Pixastic.Client.hasCanvas()){var rect=params.options.rect;var ctx=params.canvas.getContext("2d");ctx.save();ctx.beginPath();ctx.rect(rect.left,rect.top,rect.width,rect.height);ctx.clip();var scale=2;var smallWidth=Math.round(params.width/scale);var smallHeight=Math.round(params.height/scale);var copy=document.createElement("canvas");copy.width=smallWidth;copy.height=smallHeight;var clear=false;var steps=Math.round(amount*20);var copyCtx=copy.getContext("2d");for(var i=0;i<steps;i++){var scaledWidth=Math.max(1,Math.round(smallWidth-i));var scaledHeight=Math.max(1,Math.round(smallHeight-i));copyCtx.clearRect(0,0,smallWidth,smallHeight);copyCtx.drawImage(params.canvas,0,0,params.width,params.height,0,0,scaledWidth,scaledHeight);if(clear)
ctx.clearRect(rect.left,rect.top,rect.width,rect.height);ctx.drawImage(copy,0,0,scaledWidth,scaledHeight,0,0,params.width,params.height);}
ctx.restore();params.useData=false;return true;}else if(Pixastic.Client.isIE()){var radius=10*amount;params.image.style.filter+=" progid:DXImageTransform.Microsoft.Blur(pixelradius="+radius+")";if(params.options.fixMargin||1){params.image.style.marginLeft=(parseInt(params.image.style.marginLeft,10)||0)-Math.round(radius)+"px";params.image.style.marginTop=(parseInt(params.image.style.marginTop,10)||0)-Math.round(radius)+"px";}
return true;}},checkSupport:function(){return(Pixastic.Client.hasCanvas()||Pixastic.Client.isIE());}}
Pixastic.Actions.desaturate={process:function(params){var useAverage=!!(params.options.average&&params.options.average!="false");if(Pixastic.Client.hasCanvasImageData()){var data=Pixastic.prepareData(params);var rect=params.options.rect;var w=rect.width;var h=rect.height;var p=w*h;var pix=p*4,pix1,pix2;if(useAverage){while(p--)
data[pix-=4]=data[pix1=pix+1]=data[pix2=pix+2]=(data[pix]+data[pix1]+data[pix2])/3}else{while(p--)
data[pix-=4]=data[pix1=pix+1]=data[pix2=pix+2]=(data[pix]*0.3+data[pix1]*0.59+data[pix2]*0.11);}
return true;}else if(Pixastic.Client.isIE()){params.image.style.filter+=" gray";return true;}},checkSupport:function(){return(Pixastic.Client.hasCanvasImageData()||Pixastic.Client.isIE());}}
Pixastic.Actions.hsl={process:function(params){var hue=parseInt(params.options.hue,10)||0;var saturation=(parseInt(params.options.saturation,10)||0)/100;var lightness=(parseInt(params.options.lightness,10)||0)/100;if(saturation<0){var satMul=1+saturation;}else{var satMul=1+saturation*2;}
hue=(hue%360)/360;var hue6=hue*6;var rgbDiv=1/255;var light255=lightness*255;var lightp1=1+lightness;var lightm1=1-lightness;if(Pixastic.Client.hasCanvasImageData()){var data=Pixastic.prepareData(params);var rect=params.options.rect;var p=rect.width*rect.height;var pix=p*4,pix1=pix+1,pix2=pix+2,pix3=pix+3;while(p--){var r=data[pix-=4];var g=data[pix1=pix+1];var b=data[pix2=pix+2];if(hue!=0||saturation!=0){var vs=r;if(g>vs)vs=g;if(b>vs)vs=b;var ms=r;if(g<ms)ms=g;if(b<ms)ms=b;var vm=(vs-ms);var l=(ms+vs)/510;if(l>0){if(vm>0){if(l<=0.5){var s=vm/(vs+ms)*satMul;if(s>1)s=1;var v=(l*(1+s));}else{var s=vm/(510-vs-ms)*satMul;if(s>1)s=1;var v=(l+s-l*s);}
if(r==vs){if(g==ms)
var h=5+((vs-b)/vm)+hue6;else
var h=1-((vs-g)/vm)+hue6;}else if(g==vs){if(b==ms)
var h=1+((vs-r)/vm)+hue6;else
var h=3-((vs-b)/vm)+hue6;}else{if(r==ms)
var h=3+((vs-g)/vm)+hue6;else
var h=5-((vs-r)/vm)+hue6;}
if(h<0)h+=6;if(h>=6)h-=6;var m=(l+l-v);var sextant=h>>0;if(sextant==0){r=v*255;g=(m+((v-m)*(h-sextant)))*255;b=m*255;}else if(sextant==1){r=(v-((v-m)*(h-sextant)))*255;g=v*255;b=m*255;}else if(sextant==2){r=m*255;g=v*255;b=(m+((v-m)*(h-sextant)))*255;}else if(sextant==3){r=m*255;g=(v-((v-m)*(h-sextant)))*255;b=v*255;}else if(sextant==4){r=(m+((v-m)*(h-sextant)))*255;g=m*255;b=v*255;}else if(sextant==5){r=v*255;g=m*255;b=(v-((v-m)*(h-sextant)))*255;}}}}
if(lightness<0){r*=lightp1;g*=lightp1;b*=lightp1;}else if(lightness>0){r=r*lightm1+light255;g=g*lightm1+light255;b=b*lightm1+light255;}
if(r<0)
data[pix]=0
else if(r>255)
data[pix]=255
else
data[pix]=r;if(g<0)
data[pix1]=0
else if(g>255)
data[pix1]=255
else
data[pix1]=g;if(b<0)
data[pix2]=0
else if(b>255)
data[pix2]=255
else
data[pix2]=b;}
return true;}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData();}}
Pixastic.Actions.sharpen={process:function(params){var strength=0;if(typeof params.options.amount!="undefined")
strength=parseFloat(params.options.amount)||0;if(strength<0)strength=0;if(strength>1)strength=1;if(Pixastic.Client.hasCanvasImageData()){var data=Pixastic.prepareData(params);var dataCopy=Pixastic.prepareData(params,true)
var mul=15;var mulOther=1+3*strength;var kernel=[[0,-mulOther,0],[-mulOther,mul,-mulOther],[0,-mulOther,0]];var weight=0;for(var i=0;i<3;i++){for(var j=0;j<3;j++){weight+=kernel[i][j];}}
weight=1/weight;var rect=params.options.rect;var w=rect.width;var h=rect.height;mul*=weight;mulOther*=weight;var w4=w*4;var y=h;do{var offsetY=(y-1)*w4;var nextY=(y==h)?y-1:y;var prevY=(y==1)?0:y-2;var offsetYPrev=prevY*w4;var offsetYNext=nextY*w4;var x=w;do{var offset=offsetY+(x*4-4);var offsetPrev=offsetYPrev+((x==1)?0:x-2)*4;var offsetNext=offsetYNext+((x==w)?x-1:x)*4;var r=((-dataCopy[offsetPrev]
-dataCopy[offset-4]
-dataCopy[offset+4]
-dataCopy[offsetNext])*mulOther
+dataCopy[offset]*mul);var g=((-dataCopy[offsetPrev+1]
-dataCopy[offset-3]
-dataCopy[offset+5]
-dataCopy[offsetNext+1])*mulOther
+dataCopy[offset+1]*mul);var b=((-dataCopy[offsetPrev+2]
-dataCopy[offset-2]
-dataCopy[offset+6]
-dataCopy[offsetNext+2])*mulOther
+dataCopy[offset+2]*mul);if(r<0)r=0;if(g<0)g=0;if(b<0)b=0;if(r>255)r=255;if(g>255)g=255;if(b>255)b=255;data[offset]=r;data[offset+1]=g;data[offset+2]=b;}while(--x);}while(--y);return true;}},checkSupport:function(){return Pixastic.Client.hasCanvasImageData();}}