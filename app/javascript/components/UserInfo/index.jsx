import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ReactGA from 'react-ga';
import Masonry from 'react-masonry-css';

export default class UserInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', `/racer/${this.props.info.name}`);
    }
  }

  handleClick = (url) => {
    window.location = url;
  };

  render() {
    const user = this.props.info;
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container wow fadeInUp">
            <div className="row">
              <div className="col-12">
                <div className="rela-block container">
                  <div className="rela-block profile-card">
                    {user.championships.map((c, i) => {
                      return (
                        <i title={`Чемпіон сезону ${c}`} className="fa fa-star" key={i}/>
                      )})}
                    <div className="profile-pic" id="profile_pic" style={{backgroundImage: `url(${user.avatar})`}}/>
                    <div className="rela-block profile-name-container">
                      <div className="rela-block user-name" id="user_name">{user.name}</div>
                      <div className="rela-block user-desc" id="user_description">{user.company} ({user.specialization})</div>
                    </div>
                    <div className="rela-block profile-card-stats">
                      <div className="floated profile-stat works">{user.wins}<br/></div>
                      <div className="floated profile-stat followers">{user.podiums}<br/></div>
                      <div className="floated profile-stat following">{user.finals}<br/></div>
                      <div className="floated profile-stat best-laps">{user.best_laps}<br/></div>
                    </div>
                    <div className="rela-block profile-card-stats">
                      <div className="floated profile-stat races-count">{user.races_count}<br/></div>
                      <div className="floated profile-stat best-place">{user.best_place || 0}<br/></div>
                      <div className="floated profile-stat worst-place">{user.worst_place || 0}<br/></div>
                    </div>
                  </div>
                  <div className="rela-block content">
                    <Masonry breakpointCols={{default: this.props.edit_page ? 2 : 4, 1199:  this.props.edit_page ? 1 : 3, 991:  this.props.edit_page ? 1 : 2, 750: 1}}>
                      {user.races.map((r,i) => {return(
                        <div onClick={() => this.handleClick(`/races/${r.id}`)} title={`${r.number} етап сезону ${r.season}`} key={i} style={{backgroundImage: `url(${r.picture})`}} className="rela-inline image">
                          <span className='race-title'>{`${r.number} етап сезону ${r.season}`}</span>
                        </div>
                      )})}
                    </Masonry>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
