/* global window, document */

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
    this.updateWidth = this.updateWidth.bind(this);
  }

  componentDidMount() {
    this.initialize();
    window.addEventListener("resize", this.updateWidth);
    this.updateWidth();
  }

  componentWillUnmount() {
    clearInterval(this.intervalId);
    window.removeEventListener("resize", this.updateWidth);
  }

  initialize() {
    this.intervalId = setInterval(() => {
      this.next();
    }, 2000);
  }

  updateWidth() {
    this.setState({
      elementWidth: document.getElementsByClassName("rc-slider-element")[0]
        .offsetWidth
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
    this.initialize();
    this.setState({ transitionNext: true });
  }

  prev() {
    clearInterval(this.intervalId);
    this.initialize();
    this.setState({ transitionPrev: true });
  }

  sliderTrackStyle() {
    let length;
    if (this.state.transitionNext) {
      length = `-${this.state.elementWidth}`;
    } else if (this.state.transitionPrev) {
      length = `${this.state.elementWidth}`;
    } else {
      return {};
    }
    return {
      transform: `translateX(${length}px)`,
      transition: "transform 0.7s ease"
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
          position: "relative",
          marginBottom: 55
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
                console.log("this should not happen :D");
              }
            }}
          >
            {this.state.elements.map(child => (
              <div
                style={{
                  overflow: "hidden",
                  float: "left",
                  width: this.state.elementWidth
                }}
                key={child.id}
                className="rc-slider-element"
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

const { arrayOf, node } = PropTypes;
Carousel.propTypes = {
  children: arrayOf(node).isRequired
};
