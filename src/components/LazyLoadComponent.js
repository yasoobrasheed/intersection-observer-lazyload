// imports
import React, { useState, useEffect, useReducer, useContext, createContext, useRef } from "react";

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

// wrap LazyLoader in context to make code simpler in LazyLoader component function
const Context = createContext();

// eslint-disable-next-line react/prop-types
function Provider({ children }) {
  // initial state of data, dispatch event to reducer to give new state
  const [state, dispatch] = useReducer(reducer, {
    loading: false, // are the images being loaded
    more: true, // are there more images to load
    data: [], // current data
    after: 0 // start point of slice
  });

  const {loading, more, data, after} = state;
    
  // load more images into data from state
  const loadData = (data, after) => {
    dispatch({ type: "START_LOADING" });
    const endAfter = after + PER_PAGE;
    for (let i = after; i < endAfter; i += 1) {
      data.push(1500348260 + (i * 20));
    }
    dispatch({ type: "FINISH_LOADING" });
  };
  
  return <Context.Provider value={{loading, more, data, after, loadData}}>{children}</Context.Provider>;
}

// component that does the lazy loading
function LazyLoader() {
  const { loading, more, data, after, loadData } = useContext(Context);
  // create infinite scroll, lazy loading images
  const loader = React.useRef(loadData);
  let options = {
    threshold: 0.5
  };
  const observer = useRef(new IntersectionObserver((entries) => {
    const firstEntry = entries[0];
    if (firstEntry.isIntersecting) {
      loader.current(data, after);
    }
  }, options));
  const [element, setElement] = useState(null);

  useEffect(() => {
    loader.current = loadData;
  }, [loadData]);

  useEffect(() => {
    const currentElement = element;
    const currentObserver = observer.current;

    // make sure currentElement isn't null so observer isn't observing null
    if (currentElement) {
      currentObserver.observe(currentElement);
    }

    return () => {
      // stop observering initial element and start observing the next one
      if (currentElement) {
        currentObserver.unobserve(currentElement);
      }
    };
  }, [element]);

  // render images
  return (
    <div>
      {data.map(row => (
        <img
          key={row}
          src={`https://hiring.verkada.com/thumbs/${row}.jpg`}
          alt="img"
        />
      ))}

      {loading && more && <p> Loading... </p>}

      {!more && <p> Finished Loading All Images </p>}
      
      {!loading && more &&
        <div ref={setElement}>
        </div>
      }
    </div>
  );
}

export default function LazyLoadComponent() {
  return (
    <Provider>
      <LazyLoader />
    </Provider>
  );
}