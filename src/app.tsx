import * as React from 'react';
import { createRoot } from 'react-dom/client';
import {Button} from "./components/button";

const root = createRoot(document.body);
root.render(<App/>
);

function App() {
  const [a, setA] = React.useState(5);
  return (
    <div><h2>Hello from React!</h2><Button label={"penis " + a} onClick={() => console.log("test")}/></div>
  )
}
