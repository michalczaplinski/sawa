/* global test, expect, document */

import React from "react";
import { mount } from "enzyme";
import Carousel from "../src/components/Carousel";

const elements = [
  { src: "https://www.placecage.com/400/300" },
  { src: "https://www.placecage.com/c/400/300" },
  { src: "https://www.placecage.com/g/400/300" },
  { src: "https://www.placecage.com/400/300" },
  { src: "https://www.placecage.com/c/400/300" },
  { src: "https://www.placecage.com/g/400/300" }
];

test("default Carousel", () => {
  const carousel = mount(
    <Carousel>
      {elements.map((el, index) => (
        <img key={index} src={el.src} alt="carousel" />
      ))}
    </Carousel>,
    { attachTo: document.body }
  );

  expect(carousel.find(".sawa-slider-element")).toHaveLength(6);
});
