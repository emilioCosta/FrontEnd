import React from 'react';
import {AnalyticTable} from './table'
import ForAllCharts from './VideoViews'
import { Tab } from 'semantic-ui-react'
import './index.css';

export class Analytics extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      offeringId: props.offeringId,
    }
  }
  
  render() {
    console.log('xxx', this.state)
    const { offeringId } = this.state
    const { playlists } = this.props
    const panes = [
      { menuItem: 'Performance', render: () => <AnalyticTable offeringId={offeringId}/> },
      { menuItem: 'Charts', render: () => <ForAllCharts offeringId={offeringId} playlists={playlists} />},
      // { menuItem: 'To be developed', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
    ]

    return (
      <div className="outer">
        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
      </div>
    );
  }
}