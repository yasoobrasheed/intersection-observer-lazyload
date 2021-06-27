// imports
import React, { useReducer } from "react";

// constants
const PER_PAGE = 9;
const NUM_IMAGES = (1503031520 - 1500348260) / 20;

// current data and an action that occurred
const reducer = (state, action) => {
  switch (action.type) {
  case "START_LOADING":
    return {...state, loading: true, after: state.after + PER_PAGE};
  case "FINISH_LOADING":
    if (state.after >= NUM_IMAGES) {
      return {...state, more: false, loading: false};
    }
    return {...state, loading: false};
  default:
    throw Error("Issue with the action");
  }
};

function LazyLoader() {
  // initial state of data, dispatch event to reducer to give new state
  const [state, dispatch] = useReducer(reducer, {
    loading: false, // are the images being loaded
    more: true, // are there more images to load
    data: [], // current data
    after: 0 // start point of slice
  });
  
  // load more images into data from state
  const loadData = (data, after) => {
    dispatch({ type: "START_LOADING" });
    const endAfter = after + PER_PAGE;
    for (let i = after; i < endAfter; i += 1) {
      data.push(1500348260 + (i * 20));
    }
    dispatch({ type: "FINISH_LOADING" });
  };

  // render images
  return (
    <div>
      {state.data.map(row => (
        <img
          key={row}
          src={`https://hiring.verkada.com/thumbs/${row}.jpg`}
          alt="img"
        />
      ))}

      {state.loading && state.more && <p> Loading... </p>}

      {!state.more && <p> Finished Loading All Images </p>}
      
      {!state.loading && state.more &&
        <button onClick={() => {
          loadData(state.data, state.after);
        }}>Load More</button>
      }
    </div>
  );
}

export default LazyLoader;