import React from 'react';

export const SummaryFilterVerticalMenu = ({menuRecords, currentlySelected, onSelection}) => {
  return (
    <div>
      <div className="pure-menu pure-menu-scrollable summary-filter-vertical-menu">
        <ul className="pure-menu-list">
          <span className="pure-menu-link" onClick={() => onSelection(null)}>Clear Selection</span>
          {menuRecords.map( (record, index) => {
            if (record.get('key') === currentlySelected) {
              return <li className="pure-menu-item" key={index} onClick={() => onSelection(record.get('key'))}><span className="pure-menu-link"><b>{record.get('value')}</b></span></li>;
            }
            else {
              return <li className="pure-menu-item" key={index} onClick={() => onSelection(record.get('key'))}><span className="pure-menu-link">{record.get('value')}</span></li>;
            }
          })}
        </ul>
      </div>
    </div>
  );
};

export default SummaryFilterVerticalMenu;
