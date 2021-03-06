import React, { Component } from 'react';
import './Tabs.scss';

class Tabs extends Component {
    constructor(props) {
      super(props);
      this.state = {
        activeTabIndex: this.props.defaultActiveTabIndex
      };
    }

    handleTabClick = (tabIndex) => {
        this.setState({
          activeTabIndex: tabIndex === this.state.activeTabIndex ? this.props.defaultActiveTabIndex : tabIndex
        });
    }

    renderChildrenWithTabsApiAsProps() {
      return React.Children.map(this.props.children, (child, index) => {
        return React.cloneElement(child, {
          onClick : this.handleTabClick,
          tabIndex: index,
          isActive: index === this.state.activeTabIndex,
          text: child.props.text
        });
      });
    }

    renderActiveTabContent() {
      const { children } = this.props;
      const { activeTabIndex } = this.state;
      if (children[activeTabIndex]) {
        return children[activeTabIndex].props.children;
      }
    }

    render() {
      return (
        <div className="Tabs">
          <ul className="Tabs-nav">
            {this.renderChildrenWithTabsApiAsProps()}
          </ul>
          <div className="Tabs-active-content">
            {this.renderActiveTabContent()}
          </div>
        </div>
      );
    }
};

export default Tabs;