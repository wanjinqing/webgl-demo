import { useEffect } from "react";
import { main } from "./code/line";



function App() {
  useEffect(() => {
    main();
  }, [])

  return (
    <canvas id="webgl" width="400" height="400">
    Please use a browser that supports "canvas"
    </canvas>
  )
}

export default App
