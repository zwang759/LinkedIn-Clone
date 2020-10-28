import {useEffect, useRef, useState} from "react";

const useInfiniteScroll = (callback) => {
  const [isFetching, setIsFetching] = useState(false);
  const _isMounted = useRef(true);

  const handleScroll = () => {
    if (_isMounted.current) {
      if ((window.innerHeight + window.pageYOffset) < document.body.offsetHeight) {
        return;
      }
      setIsFetching(true);
    }
  };

  const debounce = function(fn) {
    // Setup a timer
    let timeout;
    // Return a function to run debounced
    return function() {
      // Setup the arguments
      let context = this;
      let args = arguments;
      // If there's a timer, cancel it
      if (timeout) {
        window.cancelAnimationFrame(timeout);
      }
      // Setup the new requestAnimationFrame()
      timeout = window.requestAnimationFrame(function() {
        fn.apply(context, args);
      });
    };
  };

  useEffect(() => {
    if (_isMounted) {
      window.addEventListener("scroll", debounce(handleScroll), false);
    }
    return () => {
      _isMounted.current = false;
      window.removeEventListener("scroll", debounce(handleScroll), false);
    };
  }, []);

  useEffect(() => {
    if (isFetching) callback();
  }, [isFetching]);

  return [isFetching, setIsFetching];
};

export default useInfiniteScroll;