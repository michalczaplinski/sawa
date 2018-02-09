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
      length = `-${this.state.elementWidth}`;
    } else if (this.state.transitionPrev) {
      length = this.state.elementWidth;
    } else {
      return {};
    }
    return {
      transform: `translateX(${length}px)`,
      transitionProperty: "transform",
      transitionDuration: "0.7s",
      transitionTimingFunction: "ease"
    };
  }

  render() {
    const wrapperStyle = {
      width: this.state.elementWidth * 2,
      overflow: "hidden",
      height: "100%"
    };

    return (
      <div
        style={{
          position: "relative",
          display: "flex",
          justifyContent: "center"
        }}
      >
        <div style={wrapperStyle}>
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
                  width: this.state.elementWidth
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
  marginWidth: number,
  numElementsToShow: oneOf([1, 2, 3, 4, 5, 6, 7]),
  transitionDuration: number,
  transitionTimingFunction: string
};

Carousel.defaultProps = {
  autoplay: true,
  buttonPrev: null,
  buttonNext: null,
  centered: true,
  direction: "left",
  marginWidth: 10,
  numElementsToShow: 2,
  transitionDuration: 700,
  transitionTimingFunction: "ease"
};

/**
 * if num of elements to show is more than there are elements, this might be a problem
 */
