import React from "react";
import { storiesOf } from "@storybook/react";
import SyntaxHighlighter from "react-syntax-highlighter/prism";
import { solarizedLight } from "react-syntax-highlighter/styles/prism";
import Carousel from "../../src/components/Carousel";

const elements = [
  { src: "https://www.placecage.com/400/300" },
  { src: "https://www.placecage.com/c/400/300" },
  { src: "https://www.placecage.com/g/400/300" },
  { src: "https://www.placecage.com/gif/400/300" }
];

const images = elements.map((el, index) => (
  <img key={index} src={el.src} alt="carousel" />
));

// const styles = { height: 320 };
const CodeExample = props => storyFn => (
  <div>
    <div style={styles}>{storyFn()}</div>
    source:
    <SyntaxHighlighter
      customStyle={{
        fontFamily: '"Operator Mono SSm A","Operator Mono SSm B",monospace',
        fontSize: "smaller",
        cursor: "text",
        width: 580
      }}
      language="jsx"
      style={solarizedLight}
    >
      {`<Carousel>
  <img src="https://www.placecage.com/400/300" alt="carousel" />
  <img src="https://www.placecage.com/c/400/300" alt="carousel" />
  <img src="https://www.placecage.com/g/400/300" alt="carousel" />
  <img src="https://www.placecage.com/gif/400/300" alt="carousel" />
</Carousel>`}
    </SyntaxHighlighter>
  </div>
);

storiesOf("Examples", module)
  // .addDecorator(CodeExample())
  .add("default", () => <Carousel>{images}</Carousel>)
  .add("adaptive", () => (
    <Carousel numElementsToShow="adaptive" maxNumElements={2}>
      {images}
    </Carousel>
  ))
  .add("2 slides version", () => (
    <Carousel numElementsToShow={2}>{images}</Carousel>
  ))
  .add("3 slides version", () => (
    <Carousel numElementsToShow={3}>{images}</Carousel>
  ))
  .add("with prev and next buttons", () => (
    <Carousel
      buttonPrev={<button> prev </button>}
      buttonNext={<button> next </button>}
    >
      {images}
    </Carousel>
  ))
  .add("2 slides (with prev and next buttons_", () => (
    <Carousel
      numElementsToShow={2}
      buttonPrev={<button> prev </button>}
      buttonNext={<button> next </button>}
    >
      {images}
    </Carousel>
  ));
