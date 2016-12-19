import React, {PropTypes} from 'react';

const TabsExample = React.createClass({
    getInitialState: function() {
        return {
            activeTabId: 1,
            tabs: [
                {title: 'first', content: 'Content 1', id: 1},
                {title: 'second', content: 'Content 2', id: 2}
            ]
        };
    };
    handleTabClick: function(item) {
        // Call `setState` so React knows about the updated tab item.
        this.setState({activeTabId: item.id});
    },
    render: function() {
        return (
            <div>
                <TabsSwitcher items={this.state.tabs}
                              activeItemId={this.state.activeTabId}
                              onTabClick={this.handleTabClick}/>
                <TabsContent items={this.state.tabs}
                             activeItemId={this.state.activeTabId}/>
            </div>
        );
    }
});



export default TabsExample;