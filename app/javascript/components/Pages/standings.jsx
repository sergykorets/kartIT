import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import ReactGA from 'react-ga';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ImageGallery from "react-image-gallery";

export default class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      races: this.props.races,
      standings: this.props.standings,
      season: '2021',
      is_pro: ''
    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', '/standings');
    }
  }

  handleChange = (field, value) => {
    const params = {
      season: field == 'season' ? value : this.state.season,
      is_pro: field == 'is_pro' ? value : this.state.is_pro
    }
    $.ajax({
      url: '/standings.json',
      type: 'GET',
      data: params
    }).then((resp) => {
      this.setState({
          ...this.state,
          races: resp.races,
          standings: resp.standings,
          [field]: value
        }
      )
    });
  };

  cellColor = (place, min_race, race) => {
    if (min_race === race) {
      return ({color: 'red'});
    } else {
      if (place === 1) {
        return ({color: 'gold'});
      } else if (place === 2) {
        return ({color: '#797979'});
      } else if (place === 3) {
        return ({color: '#cd7f32'});
      } else {
        return ({});
      }
    }
  };

  render() {
    console.log(this.state)
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container wow fadeInUp">
            <div className="row">
              <div className="col-sm-12 col-md-6 col-lg-4 mt-5">
                <FormGroup>
                  <Label for="season">Сезон</Label>
                  <Input type="select" name="season" id="season" defaultValue={this.state.season} onChange={(e) => this.handleChange('season', e.target.value)}>
                    { this.props.seasons.map((season, index) => {
                      return <option key={index} value={season}>{season}</option>
                    })}
                  </Input>
                </FormGroup>
              </div>
              { parseInt(this.state.season) >= 2021 &&
                <div className="col-sm-12 col-md-6 col-lg-4 mt-5">
                  <FormGroup>
                    <Label for="is_pro">Залік</Label>
                    <Input type="select" name="is_pro" id="is_pro" defaultValue={this.state.is_pro} onChange={(e) => this.handleChange('is_pro', e.target.value)}>
                      <option value={''}>Загальний</option>
                      <option value={true}>PRO</option>
                      <option value={false}>STREET</option>
                    </Input>
                  </FormGroup>
                </div>}
            </div>
            <div className="row">
              <div className="col-12">
                <table className='dark' style={{marginTop: 20 + 'px'}}>
                  <thead>
                  <tr>
                    <th><h1>#</h1></th>
                    <th colSpan={2}><h1>Ім'я</h1></th>
                    <th><h1>Компанія</h1></th>
                    <th><h1>Спеціалізація</h1></th>
                    {
                      [...Array(this.state.races)].map((race, i) => {
                        return (
                          <th key={i}><h1>{i+1} етап</h1></th>
                        )
                      })
                    }
                    <th><h1>Очки</h1></th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.state.standings.map((s, index) => {
                    return (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td><div className='user-pic' style={{backgroundImage: `url(${s.avatar})`}}/></td>
                        <td><a href={`/racer/${s.id}`}>{s.racer}</a></td>
                        <td>{s.company}</td>
                        <td>{s.specialization}</td>
                        { [...Array(this.state.races)].map((race, i) => { return (
                          <td key={i}>
                            <a style={this.cellColor(s.races[i+1] && s.races[i+1]['place'], s.min_race, i+1)}
                               href={s.races[i+1] ? `/races/${s.races[i+1]['id']}` : '#'}>
                              {(s.races[i+1] && s.races[i+1]['points']) || '-'}{s.races[i+1] && s.races[i+1]['best_lap'] ? '*' : ''}
                            </a>
                          </td>)
                        })}
                        <td>{s.points}</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
