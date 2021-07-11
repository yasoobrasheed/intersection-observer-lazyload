import React from "react";
import LazyLoadImages from "./components/LazyLoadImages.js";
import _ from "lodash";

const NUM_IMAGES = (1503031520 - 1500348260) / 20;

function App() {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gridAutoRows: "50vh",
        justifyItems: "center",
        alignItems: "center"
      }}
    >
      {
        _.times(NUM_IMAGES, i => (
          <LazyLoadImages
            key={i}
            url={`https://hiring.verkada.com/thumbs/${1500348260 + (i * 20)}.jpg`} 
          />
        ))
      }
    </div>
  );
}

export default App;