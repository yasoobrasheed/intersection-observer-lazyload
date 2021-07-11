import React, {useRef, useEffect, useState} from "react";

let callbacks = new WeakMap();

let observer;

// handle intersections checks if target image is currently in view, if it is in view, it renders the image
function handleIntersections(entries) {
  entries.forEach(entry => {
    if (callbacks.has(entry.target)) {
      let callback = callbacks.get(entry.target);

      if (entry.isIntersecting || entry.intersectionRatio > 0) {
        observer.unobserve(entry.target);
        callbacks.delete(entry.target);
        callback();
      }
    }
  });
}

// create intersection observer with handler: handleIntersections
function getIntersectionObserver() {
  if (observer == undefined) {
    observer = new IntersectionObserver(handleIntersections, {
      rootMargin: "0px",
      threshold: "0"
    });
  }
  return observer;
}

// function that sets image in view when observer observes element
function useIntersection(element, callback) {
  useEffect(() => {
    const target = element.current;
    observer = getIntersectionObserver();
    callbacks.set(target, callback);
    observer.observe(target);

    return () => {
      callbacks.delete(target);
      observer.unobserve(target);
    };
  }, []);
}

// component that does the lazy loading
export default function LazyLoadImages({ url }) {
  const imgRef = useRef(null);
  const [isInView, setIsInView] = useState(false);
  useIntersection(imgRef, () => {
    setIsInView(true);
  });


  return (
    <div
      ref={imgRef}
    >
      {isInView &&
        <img
          src={url}
          style={{
            width: "30vw"
          }}
        />
      }
    </div>
  );
}