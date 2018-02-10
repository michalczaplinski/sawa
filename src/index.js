/* global document */

import React from "react";
import { render } from "react-dom";
import Carousel from "./components/Carousel";

const elements = [
  { src: "https://www.placecage.com/400/300" },
  { src: "https://www.placecage.com/c/400/300" },
  { src: "https://www.placecage.com/g/400/300" },
  { src: "https://www.placecage.com/gif/400/300" }
];

render(
  <div
    style={{
      display: "flex",
      justifyContent: "center"
    }}
  >
    <Carousel>
      {elements.map((el, index) => (
        <img key={index} src={el.src} alt="carousel" />
      ))}
    </Carousel>
  </div>,
  document.getElementById("root")
);
