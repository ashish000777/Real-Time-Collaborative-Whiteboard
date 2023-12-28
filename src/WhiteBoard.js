import React, { useEffect, useState } from 'react';
import rough from 'roughjs';
const roughgenerator=rough.generator();

function WhiteBoard({canvasRef,ctxRef,elements,setElements}) {
   

    function handleMouseDown(e)
    {
        const {offsetX,offsetY}=e.nativeEvent;
        console.log('CO-Ords are=',offsetX+" "+offsetY);
        setElements([...elements,{type:'pencil',offsetX,offsetY,path:[[offsetX,offsetY]],stroke:"black"}]);
        setDrawing(true);
     }
   function handleMouseMove(e)
   {
    const {offsetX,offsetY}=e.nativeEvent;
    if(drawing)
    {
      console.log(elements.length);
      const {path}=elements[elements.length-1];
      console.log(elements.length-1);
      const newPath=[...path,[offsetX,offsetY]];
   setElements((previousElements)=>{
previousElements.map((ele,index)=>{
  if(index===elements.length-1)
  {
    return{
      ...ele,
      path:newPath
    }
  }
  else{
    return ele;
  }
})
   }) 
  }
   }
    function handleMouseUp(e)
    {
        setDrawing(false);
    }
  return (
    <>
  <canvas height="100%" width="100%" className='bg-white h-100 w-100' ref={canvasRef} onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}></canvas>
  </>
  )
}

export default WhiteBoard
