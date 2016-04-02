'use strict';

import React from 'react'; // eslint-disable-line no-unused-vars
import {Column, Cell} from 'fixed-data-table';
import {LinkCell, DateCell, MetadataCell} from '../CellTypes.jsx';

const DEFAULT_WIDTH = 150;

/**
 * This module exports plain functions that return Column Components, rather
 * than exporting Components. FixedDataTable requires that the children of
 * Table be Column Components.
 */

const linkColumnComponent = (header='', changeProp, route='/') =>
  ({data, width=DEFAULT_WIDTH}) =>
    <Column
        key={changeProp}
        columnKey={changeProp}
        header={<Cell>{header}</Cell>}
        fixed={true}
        width={width}
        cell={<LinkCell data={data} col={changeProp} route={route} />} />;

export const stIdsCol = linkColumnComponent('ST ID', 'stId', '/samples');
export const labIdsCol = linkColumnComponent('Lab ID', 'labId', '/samples');

const metadataColumnComponent = (header, changeProp, isResizable=true, flexGrow=1) =>
  ({data, width=DEFAULT_WIDTH, metadata}) => (
    <Column
        key={changeProp}
        columnKey={changeProp}
        header={<Cell>{header}</Cell>}
        width={width}
        isResizable={isResizable}
        flexGrow={flexGrow}
        cell={<MetadataCell
                data={data}
                col={changeProp}
                metadata={metadata} />} />
  );

export const stagesCol = metadataColumnComponent('Stage', 'stage');
export const statusesCol = metadataColumnComponent('Status', 'status');
export const artifactsCol = metadataColumnComponent('Sample', 'artifactType');
export const labTestsCol = metadataColumnComponent('Test', 'testType');
export const rejectionsCol = metadataColumnComponent('Rejection', 'labRejection');
export const facilitiesCol = metadataColumnComponent('Facility' ,'facility');
export const peopleCol = metadataColumnComponent('Rider', 'person');

export const statusDatesCol = ({data, width=DEFAULT_WIDTH}) =>
  <Column
      key='statusDate'
      columnKey='statusDate'
      header={<Cell>Date</Cell>}
      width={width}
      cell={<DateCell data={data} col='statusDate' />} />;
