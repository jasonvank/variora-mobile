import _ from 'lodash';
import React, { Component } from 'react';
import * as actions from '../actions';
import { connect } from 'react-redux';
import Navbar from './nav_bar';
import CircularProgress from '@material-ui/core/CircularProgress';
import TimeAgo from 'react-timeago'
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import GridListTileBar from '@material-ui/core/GridListTileBar';
import Card from '@material-ui/core/Card';

import { Tabs, WhiteSpace, List } from 'antd-mobile';
import { StickyContainer, Sticky } from 'react-sticky';

class Explore extends Component {

  componentDidMount() {
    this.props.getExploreDocuments();
    this.props.getExploreReadlists();
  }

  renderReactSticky(props) {
    return (
      <Sticky>
        {({ style }) =>
          <div style={{ ...style, zIndex: 1 }}>
            <Tabs.DefaultTabBar {...props} />
          </div>
        }
      </Sticky>
    )
  }

  renderDocumentsSubgrid(documents, title) {
    console.log(documents)
    const data = documents.map((element) => {
      return (
        <div>
          <GridListTile key={element.image} onClick={(element) => {console.log(element.slug)}}>
            <div>
              <img src={element.image} alt={element.title} style={{maxHeight: '44vw', width: '38vw'}}/>
              <GridListTileBar
                style={{height: '25%'}}
                title={element.title}
                subtitle={<span>{<TimeAgo date={element.upload_time} />}</span>}
              />
            </div>
          </GridListTile>
        </div>
      )
    });

    return (
      <div>
        <WhiteSpace />
        <div style={{color: '#888', fontSize: '14px'}}>{title}</div>
        <WhiteSpace />
        <div styles={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          overflow: 'hidden'      
        }}>
          <GridList cols={2} style={{flexWrap: 'nowrap'}}>
            {data}
          </GridList>
        </div>
      </div>
    )
  }

  renderReadlistsSublist(readlists, title) {
    const data = readlists.map(element => {
      return (
        <List.Item
          key={element.slug}
          extra={<TimeAgo date={element.create_time} />}
          thumb={element.owner.portrait_url}
          multipleLine
          onClick={() => {this.props.history.push(`${element.url}`)}}
        >
          {element.name}
          <List.Item.Brief>{element.owner.nickname}</List.Item.Brief>
        </List.Item>
      )
    })
    return (
      <div>
        <List renderHeader={() => title}>
          {data}
        </List>
      </div>
    )
  }

  renderExploreDocuments() {
    const documents = this.props.explore.documents;
    return (
      <div>
        {this.renderDocumentsSubgrid(documents.mostViewsDocuments, "Most Views")}
        {this.renderDocumentsSubgrid(documents.mostStarsDocuments, "Most Stars")}
        {this.renderDocumentsSubgrid(documents.mostAnnotationsDocuments, "Most Annotations")}
      </div>
    )
  }

  renderExploreReadlists() {
    const readlists = this.props.explore.readlists;
    return (
      <div>
        {this.renderReadlistsSublist(readlists.newestReadlists, "Trending Lists")}
        {this.renderReadlistsSublist(readlists.newestReadlists, "Recent Lists")}
      </div>
    )
  }

  renderStickyTab() {
    return (
      <div>
        <WhiteSpace />
        <StickyContainer>
          <Tabs
            tabs={[{ title: "Documents"}, { title: "Readlists"}]}
            initalPage={'t2'}
            swipeable={false}
            renderTabBar={this.renderReactSticky}
          >
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderExploreDocuments()}
            </div>
            <div style={{ justifyContent: 'center', height: '100%'}}>
              {this.renderExploreReadlists()}
            </div>
          </Tabs>
        </StickyContainer>
        <WhiteSpace />
      </div>
    )
  }

  render() {
    if (_.isEmpty(this.props.explore) || _.isEmpty(this.props.explore.documents) || _.isEmpty(this.props.explore.readlists)) {
      return (
        <div>
          <Navbar title="Explore" history={this.props.history}/>
          <CircularProgress style={{color:"#1BA39C",  marginTop: "38vh"}} size='10vw' thickness={5} />
        </div>
      );
    }

    return (
      <div>
        <Navbar title="Explore" history={this.props.history}/>
        {this.renderStickyTab()}
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    explore: state.explore
  };
}

export default connect(mapStateToProps, actions)(Explore);
