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
      width: "100000px",
      marginLeft: `calc(-${this.state.elementWidth * 2.5}px + 50%)`
    };

    return (
      <div
        style={{
          overflow: "hidden",
          position: "relative"
        }}
      >
        <div style={wrapperStyle}>
          <div
            style={{
              width: "100%",
              height: "100%",
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
                  "This should not happen! Please file a bug: https://github.com/michalczaplinski/sawa"
                );
              }
            }}
          >
            {this.state.elements.map((child, index) => (
              <div
                style={{
                  overflow: "hidden",
                  float: "left",
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
  children: arrayOf(node).isRequired,
  direction: oneOf(["left", "right"]),
  marginWidth: number,
  transitionDuration: number,
  transitionTimingFunction: string
};

Carousel.defaultProps = {
  autoplay: true,
  buttonPrev: null,
  buttonNext: null,
  direction: "left",
  marginWidth: 10,
  transitionDuration: 700,
  transitionTimingFunction: "ease"
};
