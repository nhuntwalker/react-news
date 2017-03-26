import React, { PropTypes } from 'react';
import './index.css';

const Button = ({ onClick, className, children}) =>
  <button onClick={ onClick } className={ className } type="button">
    { children }
  </button>

Button.propTypes = {
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
  children: PropTypes.node.isRequired
};

Button.defaultProps = {
  className: '',
}

const Loading = () =>
  <div>
    Loading...
  </div>

const withLoading = (Component) => ({ isLoading, ...rest }) =>
  isLoading ? <Loading /> : <Component { ...rest } />

const ButtonWithLoading = withLoading(Button);

export default Button;

export {
    ButtonWithLoading,
};