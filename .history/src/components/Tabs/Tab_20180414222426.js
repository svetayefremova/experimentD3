import React from 'react';

const Tab = (props) => {
  return (
    <li className="Tab">
      <a className={`Tab-link ${props.isActive ? 'active' : ''}`}
        onClick={(event) => {
            event.preventDefault();
            props.onClick(props.tabIndex);
        }}>
      </a>
    </li>
  )
}

export default Tab;