import logo from './logo.svg';
import './App.css';
import { useState ,useRef,useEffect, useLayoutEffect} from 'react';
import WhiteBoard from './WhiteBoard';
import rough from 'roughjs';

const roughgenerator=rough.generator();

function App() {
  const [tool,setTool]=useState("pencil");
  const [color,setColor]=useState("black");
  const canvasRef=useRef(null);
  const ctxRef=useRef(null);
  const [elements,setElements]=useState([]);
  const [history,setHistory]=useState([]);
  const [range,setRange]=useState(1);
  useEffect(()=>{
    const canvas=canvasRef.current;
    canvas.height=window.innerHeight*2;
    canvas.width=window.innerWidth*2;
    const ctx=canvas.getContext("2d");
    ctx.strokeStyle=color;
    ctx.lineWidth=range;
    ctx.lineCap="round";
    ctxRef.current=ctx;

},[]);

useEffect(()=>{
  ctxRef.current.strokeStyle=color;
},[color]);

useLayoutEffect(()=>{

  console.log("Elements are=",elements);
  const roughCanvas=rough.canvas(canvasRef.current);
  if(elements.length>0)
  {
    ctxRef.current.clearRect(0,0, canvasRef.current.width,canvasRef.current.height)
  }
  elements.forEach((element)=>{
    if(element.type==="pencil")
    {
roughCanvas.linearPath(element.path,{stroke:element.stroke,strokeWidth:element.range,roughness:0});
    }
    if(element.type==="line")
    {
      roughCanvas.draw(
      roughgenerator.line(element.offsetX,element.offsetY,element.width,element.height,{stroke:element.stroke,strokeWidth:element.range,roughness:0}));
    }

    if(element.type==="rect")
    {
      roughCanvas.draw(
        roughgenerator.rectangle(element.offsetX,element.offsetY,element.width,element.height,{stroke:element.stroke,strokeWidth:element.range,roughness:0})
      )
    }
  })
},[elements]);



function undo()
{
  setHistory([...history,elements[elements.length-1]]);
  if(elements.length>1)
  {
 
    setElements(elements.filter((value,index)=>index!==elements.length-1));
  }
  else{
    const canvas=canvasRef.current;
  const ctx=canvas.getContext("2d");
  ctx.fillRect="white";
  ctx.clearRect(0,0, canvasRef.current.width,canvasRef.current.height)
    setElements([]);
  }
 
  
  
}



function redo()
{
  setElements([...elements,history[history.length-1]]);
  setHistory(history.slice(0,history.length-1));
}



function handleMouseDown(e)
{
  
    const {offsetX,offsetY}=e.nativeEvent;
    if(tool==="pencil")
    {
    setElements([...elements,{type:'pencil',offsetX,offsetY,path:[[offsetX,offsetY]],stroke:color,range:range}]);
    }
    else if(tool==="line")
    {
      setElements([...elements,{type:'line',offsetX,offsetY,width:offsetX,height:offsetY,stroke:color,range:range}])
    }
    else if(tool==="rect")
    {
      setElements([...elements,{type:'rect',offsetX,offsetY,width:0,height:0,stroke:color,range:range}]);
    }
    setDrawing(true);
    e.preventDefault();
 }
function handleMouseMove(e)
{
const {offsetX,offsetY}=e.nativeEvent;
if(drawing)
{
  console.log(typeof(elements)+" "+elements.length);
//   console.log(elements.length);
 

  if(tool==="pencil")
  {
    const {path}=elements[elements.length-1];
    console.log("Path is=",path)
  //   console.log(elements.length-1);
    const newPath=[...path,[offsetX,offsetY]];
  const myslice=elements.slice();
  myslice[myslice.length-1].path=newPath;
  console.log("MySlice is=",myslice);
  setElements(myslice);
  }
  else if(tool==="line")
  {
    const myslice=elements.slice();
  myslice[myslice.length-1].width=offsetX;
  myslice[myslice.length-1].height=offsetY;
  console.log("MySlice is=",myslice);
  setElements(myslice);
  }
  else if(tool==="rect")
  {
    const myslice=elements.slice();
  myslice[myslice.length-1].width=offsetX-myslice[myslice.length-1].offsetX;
  myslice[myslice.length-1].height=offsetY-myslice[myslice.length-1].offsetY;
  console.log("MySlice is=",myslice);
  setElements(myslice);
  }

e.preventDefault();
}
}
function handleMouseUp(e)
{
    setDrawing(false);
    e.preventDefault();
}

function myclear()
{
  const canvas=canvasRef.current;
  const ctx=canvas.getContext("2d");
  ctx.fillRect="white";
  ctx.clearRect(0,0, canvasRef.current.width,canvasRef.current.height)
  setElements([]);
  setHistory([]);
}



const [drawing,setDrawing]=useState(false);
  return (
    <div className="myapp row">
      <div className='container-fluid'>
    <h1 className='py-2 text-center'>WhiteBoard App</h1>

    <div className="col-md-12 mt-4 mb-5 d-flex align-items-center justify-content-around mx-auto py-2">
  <div className='d-flex col-md-4 justify-content-center gap-1'>
    <div className='d-flex gap-1 align-items-center'>
    <label htmlFor='pencil'>pencil</label>
    <input type='radio' name='tool' value='pencil' onChange={(e)=>setTool(e.target.value)} id='pencil'></input>
   
    </div>
    <div className='d-flex gap-1 align-items-center'>
    <label htmlFor='line'>line</label>
    <input type='radio' name='tool' value='line' onChange={(e)=>setTool(e.target.value)} id='line' className='mt-1'></input>
 
    </div>
    <div className='d-flex gap-1 align-items-center'>
    <label htmlFor='rect'>rectangle</label>
    <input type='radio' name='tool' value='rect' onChange={(e)=>setTool(e.target.value)} id='rect' className='mt-1'></input>
   
    </div>
  </div>

    <div className='col-md-2 gap-2 d-flex align-items-center mx-auto'>
      <label htmlFor='color' className='ml-3'>Select Color</label>
      <input type='color' id='color' className='mt-1 mx-2' onChange={(e)=>setColor(e.target.value)} value={color} ></input>
    </div>

<div className='col-md-2 gap-2'>
    <div className='d-flex align-items-center mx-auto'>
      <label htmlFor='color' className='ml-3'>Select Brush Range:</label>
      <input type='range' id='range' className='mt-1 mx-2' onChange={(e)=>setRange(e.target.value)} value={range} min={1} max={5}></input>
    </div>
</div>

<div className='col-md-3 d-flex gap-2'>
  <button className='btn btn-primary mt-1' disabled={elements.length===0} onClick={undo}>Undo</button>
  <button className='btn btn-outline-primary mt-1' disabled={history.length<1} onClick={redo}>Redo</button>
</div>

<div className='col-md-3'>
  <button className='btn btn-danger' onClick={myclear}>
    Clear Canvas
  </button>
</div>
</div>
   
<div className='border border-dark border-2 col-12 canvasbox'>
  <div className='h-100 w-100 overflow-hidden' onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUp}>
<canvas ref={canvasRef} />
</div>
</div>
</div>
</div>
  
  );
}

export default App;
