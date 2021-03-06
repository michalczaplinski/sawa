/* global window */

import React from "react";
import PropTypes from "prop-types";
import shortid from "shortid";

const triggerEvent = (target, type, callback) => {
  const doc = window.document;
  if (doc.createEvent) {
    const event = doc.createEvent("HTMLEvents");
    event.initEvent(type, true, true);
    target.dispatchEvent(event);
  } else {
    const event = doc.createEventObject();
    target.fireEvent(`on${type}`, event);
  }
  callback();
};

const CenterWrapper = ({ children }) => (
  <div
    style={{
      display: "flex",
      flexFlow: "row nowrap",
      justifyContent: "center"
    }}
  >
    {children}
  </div>
);

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: props.children.concat(props.children).map(e => ({
        element: e,
        id: shortid.generate()
      })),
      elementWidth: props.elementWidth,
      totalPadding:
        // TODO: update to take into account maxSlides
        props.numElementsToShow === "adaptive"
          ? (props.children.length - 2) * props.elementPaddingWidth
          : (props.numElementsToShow - 1) * props.elementPaddingWidth,
      numSlides: props.children.length,
      transitionNext: false,
      transitionPrev: false
    };

    this.elements = [];
    if (props.autoplay) this.autoplay();

    this.updateWidth = this.updateWidth.bind(this);
    this.renderSlide = this.renderSlide.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
    setTimeout(() => {
      triggerEvent(window, "resize", () => this.updateWidth());
    }, 0);
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener("resize", this.updateWidth);
  }

  autoplay() {
    this.intervalId = setInterval(() => {
      if (this.props.direction === "left") {
        this.next();
      } else {
        this.prev();
      }
    }, this.props.delay);
  }

  updateWidth() {
    this.setState({
      elementWidth: this.elements[0].offsetWidth
    });
  }

  updateContentForward() {
    this.setState(state => ({
      transitionNext: false,
      elements: [...state.elements.slice(1), state.elements[0]]
    }));
  }

  updateContentBackwards() {
    this.setState(state => ({
      transitionPrev: false,
      elements: [...state.elements.slice(-1), ...state.elements.slice(0, -1)]
    }));
  }

  next() {
    clearInterval(this.intervalId);
    if (this.props.autoplay) {
      this.autoplay();
    }
    this.setState({ transitionNext: true });
  }

  prev() {
    clearInterval(this.intervalId);
    if (this.props.autoplay) {
      this.autoplay();
    }
    this.setState({ transitionPrev: true });
  }

  wrapperStyle() {
    const style = {
      overflow: "hidden",
      height: "100%"
    };

    if (this.props.numElementsToShow === "adaptive") {
      return {
        ...style,
        width: 10000,
        marginLeft: `calc(-${this.state.elementWidth *
          (this.state.numSlides - 1.5) + // TODO: change the hardcoded "1.5" when not centered
          this.state.totalPadding}px + 50%)`
      };
    } else if ([1, 2, 3, 4, 5, 6, 7].includes(this.props.numElementsToShow)) {
      return {
        ...style,
        width:
          // TODO: This still needs to be adjusted so the there is not empty slide when "prev"
          this.state.elementWidth * this.props.numElementsToShow +
          this.state.totalPadding
      };
    }
    throw new Error("Prop `elementsToShow` has an incorrect value");
  }

  sliderTrackStyle() {
    let length;
    if (this.state.transitionNext) {
      length = `-${this.state.elementWidth + this.props.elementPaddingWidth}`;
    } else if (this.state.transitionPrev) {
      length = this.state.elementWidth + this.props.elementPaddingWidth;
    } else {
      return {};
    }
    return {
      transform: `translateX(${length}px)`,
      transitionProperty: "transform",
      transitionDuration: `${this.props.transitionDuration}ms`,
      transitionTimingFunction: this.props.transitionTimingFunction
    };
  }

  renderSlide(slide, index) {
    return (
      <div
        style={{
          // The first item must have no margin
          marginLeft: index === 0 ? 0 : this.props.elementPaddingWidth
        }}
        key={slide.id}
        className="sawa-slider-element"
        ref={element => {
          this.elements[index] = element;
        }}
      >
        {slide.element}
      </div>
    );
  }

  render() {
    const {
      elements,
      elementWidth,
      totalPadding,
      numSlides,
      transitionNext,
      transitionPrev
    } = this.state;

    const { buttonPrev, buttonNext, centered } = this.props;
    const output = (
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          overflow: "auto",
          width: "100%",
          maxWidth: (numSlides - 1) * elementWidth + totalPadding
        }}
      >
        {buttonPrev &&
          React.cloneElement(buttonPrev, {
            style: { position: "absolute", zIndex: 9999, left: 0 },
            onClick: () => this.prev()
          })}
        {buttonNext &&
          React.cloneElement(buttonNext, {
            style: { position: "absolute", zIndex: 9999, right: 0 },
            onClick: () => this.next()
          })}

        <div style={this.wrapperStyle()}>
          <div
            style={{
              width: "100%",
              height: "100%",
              display: "flex",
              justifyContent: "row",
              ...this.sliderTrackStyle()
            }}
            onTransitionEnd={() => {
              // hack so that this.updateContentForward in only called once after
              // the transition.
              if (transitionNext) {
                this.updateContentForward();
              } else if (transitionPrev) {
                this.updateContentBackwards();
              } else {
                console.error(
                  "This should not happen! Please file a bug: https://github.com/michalczaplinski/sawa/issues"
                );
              }
            }}
          >
            {elements.map(this.renderSlide)}
          </div>
        </div>
      </div>
    );

    if (centered) {
      return <CenterWrapper> {output} </CenterWrapper>;
    }
    return output;
  }
}

const { arrayOf, node, bool, number, string, oneOf, element } = PropTypes;

Carousel.propTypes = {
  autoplay: bool,
  buttonPrev: element,
  buttonNext: element,
  centered: bool,
  delay: number,
  children: arrayOf(node).isRequired,
  direction: oneOf(["left", "right"]),
  elementWidth: number,
  elementPaddingWidth: number,
  maxNumElements: number,
  maxWidthAdaptive: number,
  numElementsToShow: oneOf([1, 2, 3, 4, 5, 6, 7, "adaptive"]),
  transitionDuration: number, // in miliseconds
  transitionTimingFunction: string
};

Carousel.defaultProps = {
  autoplay: true,
  buttonPrev: null,
  buttonNext: null,
  centered: true,
  delay: 2000,
  direction: "left",
  elementWidth: 1000,
  elementPaddingWidth: 10,
  maxNumElements: 1,
  maxWidthAdaptive: 600,
  numElementsToShow: 1,
  transitionDuration: 700,
  transitionTimingFunction: "ease"
};

/**
 *
 *  - fix the adaptive mode
 *  - fix the first slide
 *  - add the dynamic height when the numElementsToShow is defined
 *  - simplify padding and width calcuations
 *  - fix the onClicks (debounce or something)
 *  - allow the user to set custom styles that will be merged with existing styles
 *  - test SSR
 *  - test with react 15
 *  - cross browser test
 *  - test with different kinds of content
 *  - add touch
 *  - try to shed a bit of the size
 *
 *  - maybe move the CSS to a separate file (so that SSR & responsiveness works well) ?
 *
 *  REQUIREMENTS:
 *  - all elements must be the same height / width
 *  - if you want SSR, you must specify initial element width
 *
 *
 *
 *    switch(numElementsToShow):
 *      case(number):
 *        - centered / not
 *        - adaptiveHeight / not
 *        if(adaptiveHeight):
 *          - maxHeight
 *          - minHeight
 *      case("adaptive"):
 *        - centered / not
 *        - maxNumElementsToShow
 *
 */
