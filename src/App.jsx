import "./App.css";
import { useState, useRef } from "react";
import { removeAnnotation, getSelectionObject } from "./utils";
import { renderAnnotation } from "./selection";

export default function App() {
  const containerRef = useRef(null);
  const [state, setState] = useState([]);

  function handleAnnotate() {
    const selectionObj = getSelectionObject(containerRef.current);
    setState((prev) => [...prev, selectionObj]);
    renderAnnotation(containerRef.current, selectionObj);
    window.getSelection().removeAllRanges();
    window.getSelection().empty();
  }

  function remove() {
    removeAnnotation();
  }

  function restore() {
    state.forEach((selectionObj) =>
      renderAnnotation(containerRef.current, selectionObj)
    );
  }

  return (
    <>
      <button onClick={() => handleAnnotate()}>Annotate</button>
      <button onClick={remove}>Remove</button>
      <button onClick={restore}>Restore</button>
      <div className="App" ref={containerRef}>
        <h1>Hello CodeSandbox</h1>
        <h2>Start magic editing to see some magic happen!</h2>
        <p>Test text 12345</p>
        <p>This is soome text to highlight</p>
        <p>League of legends is the best game</p>
      </div>
    </>
  );
}
