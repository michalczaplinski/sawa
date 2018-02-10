/* global window */

import React from "react";
import PropTypes from "prop-types";
import shortid from "shortid";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: props.children.concat(props.children).map(e => ({
        element: e,
        id: shortid.generate()
      })),
      totalPadding:
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
    this.updateWidth();
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
          (this.state.numSlides - 1.5) + // TODO: change the hardcoded "1.5" perhaps
          this.state.totalPadding}px + 50%)`
      };
    } else if ([1, 2, 3, 4, 5, 6, 7].includes(this.props.numElementsToShow)) {
      return {
        ...style,
        width:
          // TODO: This still needs to be adjusted so the there is not empty slide when "prev"
          (this.state.elementWidth || this.props.elementWidth) *
            this.props.numElementsToShow +
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
          width: this.state.elementWidth,
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

    const { buttonPrev, buttonNext } = this.props;
    return (
      <div
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden",
          maxWidth:
            (numSlides - 1) * (elementWidth || this.props.elementWidth) +
            totalPadding
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
  }
}

const { arrayOf, node, bool, number, string, oneOf, element } = PropTypes;

Carousel.propTypes = {
  autoplay: bool,
  buttonPrev: element,
  buttonNext: element,
  // centered: bool,
  delay: number,
  children: arrayOf(node).isRequired,
  direction: oneOf(["left", "right"]),
  elementWidth: number,
  elementPaddingWidth: number,
  numElementsToShow: oneOf([1, 2, 3, 4, 5, 6, 7, "adaptive"]),
  transitionDuration: number, // in miliseconds
  transitionTimingFunction: string
};

Carousel.defaultProps = {
  autoplay: false,
  buttonPrev: <button> prev </button>,
  buttonNext: <button> next </button>,
  // centered: true,
  delay: 2000,
  direction: "left",
  elementWidth: 0,
  elementPaddingWidth: 10,
  numElementsToShow: 3,
  transitionDuration: 700,
  transitionTimingFunction: "ease"
};

/**
 *  TODO
 *  - add ability to have adaptive + responsive mode
 *  - test with react 15
 *  - simplify padding and width calcuations
 *  - cross browser test
 *  - add touch
 *  - try to shed a bit of the size
 *
 *  - modes:
 *    • 1, 2, 3 slides
 *    • centered / not centered
 *    • iTunes carousel mode
 *    • (?) adaptive height mode (fixed number of images)
 *
 */
