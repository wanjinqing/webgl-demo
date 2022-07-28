import { useEffect, useRef } from "react";
import { main } from "./code/cube";



function App() {
  const single = useRef(true);
  useEffect(() => {
    if (single.current) {
      single.current = false;
      main();
    }
  }, [single])

  return (
    <canvas id="webgl" width="400" height="400">
    Please use a browser that supports "canvas"
    </canvas>
  )
}

export default App
