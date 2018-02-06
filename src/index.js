/* global document */

import React from "react";
import { render } from "react-dom";
import Carousel from "./Carousel";

const elements = [
  { src: "https://www.placecage.com/400/300" },
  { src: "https://www.placecage.com/c/400/300" },
  { src: "https://www.placecage.com/g/400/300" },
  { src: "https://www.placecage.com/400/300" },
  { src: "https://www.placecage.com/c/400/300" },
  { src: "https://www.placecage.com/g/400/300" }
];

render(
  <Carousel>
    {elements.map(el => <img src={el.src} alt="carousel" />)}
  </Carousel>,
  document.getElementById("root")
);
