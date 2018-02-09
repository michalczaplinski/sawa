/* global window */

import React from "react";
import PropTypes from "prop-types";
import shortid from "shortid";

export default class Carousel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      elements: props.children.map(e => ({
        element: e,
        id: shortid.generate()
      })),
      transitionNext: false,
      transitionPrev: false
    };

    this.elements = [];
    this.play();

    this.updateWidth = this.updateWidth.bind(this);
  }

  componentDidMount() {
    window.addEventListener("resize", this.updateWidth);
    this.updateWidth();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener("resize", this.updateWidth);
  }

  play() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 2000);
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
      this.play();
    }
    this.setState({ transitionNext: true });
  }

  prev() {
    clearInterval(this.intervalId);
    if (this.props.autoplay) {
      this.play();
    }
    this.setState({ transitionPrev: true });
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

  wrapperStyle() {
    const style = {
      overflow: "hidden",
      height: "100%"
    };

    if (this.props.numElementsToShow === "adaptive") {
      return {
        ...style,
        width: 10000,
        marginLeft: `calc(-${this.state.elementWidth * 2.5}px + 50%)`
      };
    } else if ([1, 2, 3, 4, 5, 6, 7].includes(this.props.numElementsToShow)) {
      return {
        ...style,
        width:
          (this.state.elementWidth || this.props.elementWidth) *
          this.props.numElementsToShow
      };
    }
    throw new Error("Prop `elementsToShow` has an incorrect value");
  }

  render() {
    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center",
          overflow: "hidden"
        }}
      >
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
              if (this.state.transitionNext) {
                this.updateContentForward();
              } else if (this.state.transitionPrev) {
                this.updateContentBackwards();
              } else {
                console.error(
                  "This should not happen! Please file a bug: https://github.com/michalczaplinski/sawa/issues"
                );
              }
            }}
          >
            {this.state.elements.map((child, index) => (
              <div
                style={{
                  width: this.state.elementWidth,
                  // The first item must have no margin
                  marginLeft: index === 0 ? 0 : this.props.elementPaddingWidth
                }}
                key={child.id}
                className="sawa-slider-element"
                ref={element => {
                  this.elements[index] = element;
                }}
              >
                {child.element}
              </div>
            ))}
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
  centered: bool,
  children: arrayOf(node).isRequired,
  direction: oneOf(["left", "right"]),
  elementWidth: number,
  elementPaddingWidth: number,
  numElementsToShow: oneOf([1, 2, 3, 4, 5, 6, 7, "adaptive"]),
  transitionDuration: number, // in miliseconds
  transitionTimingFunction: string
};

Carousel.defaultProps = {
  autoplay: true,
  buttonPrev: null,
  buttonNext: null,
  centered: true,
  direction: "left",
  elementWidth: 0,
  elementPaddingWidth: 10,
  numElementsToShow: "adaptive",
  transitionDuration: 700,
  transitionTimingFunction: "ease"
};

/**
 * Add the ability to make the
 */
