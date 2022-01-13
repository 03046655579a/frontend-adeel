import React from "react";
import { Container } from "reactstrap";
// used for making the prop types of this component
import PropTypes from "prop-types";
import { Link, Redirect } from "react-router-dom";

class Footer extends React.Component {
  render() {
    return (
      <footer
        className={"footer" + (this.props.default ? " footer-default" : "")}
      >
        <Container fluid={this.props.fluid ? true : false}>
          <nav>
            <ul>
              <li>
                <a href="" target="_blank"></a>
              </li>
              <li>
                <a href="" target="_blank"></a>
              </li>
              <li>
                <a href="" target="_blank"></a>
              </li>
            </ul>
          </nav>
          <div className="copyright">
            &copy; {1900 + new Date().getYear()}, Designed by{" "}
            <a href="" target="_blank" rel="noopener noreferrer">
              creative Team
            </a>
            . Coded by{" "}
            <a href="" target="_blank" rel="noopener noreferrer">
              Creative Team
            </a>
            .
          </div>
        </Container>
      </footer>
    );
  }
}

Footer.propTypes = {
  default: PropTypes.bool,
  fluid: PropTypes.bool,
};

export default Footer;
