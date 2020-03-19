import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import ReactGA from 'react-ga';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Races extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      races: this.props.races,
      season: '2019'
    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', '/races');
    }
  }

  handleClick = (id) => {
    window.location = `/races/${id}`
  }

  handleChange = (field, value) => {
    $.ajax({
      url: '/races.json',
      type: 'GET',
      data: {
        season: value
      }
    }).then((resp) => {
      this.setState({
          ...this.state,
          races: resp.races,
          [field]: value
        }
      )
    });
  };

  render() {
    const translations = {
      sunny: 'Сонячно',
      cloudy: 'Хмарно',
      rain: 'Дощ'
    };
    const track_translations = {
      one: 1, one_r: '1 (реверс)', two: 2, two_r: '2 (реверс)', tree: 3, tree_r: '3 (реверс)', four: 4, four_r: '4 (реверс)',
      five: 5, five_r: '5 (реверс)', six: 6, six_r: '6 (реверс)', seven: 7, seven_r: '7 (реверс)', eight: 8, eight_r: '8 (реверс)',
      nine: 9, nine_r: '9 (реверс)', ten: 10, ten_r: '10 (реверс)', eleven: 11, eleven_r: '11 (реверс)',
      twelve: 12, twelve_r: '12 (реверс)', thirteen: 13, thirteen_r: '13 (реверс)', fourteen: 14, fourteen_r: '14 (реверс)',
      fifteen: 15, fifteen_r: '15 (реверс)'
    };
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container">
            <div className="col-sm-12 col-md-6 col-lg-4 mt-5">
              <FormGroup>
                <Label for="season">Сезон</Label>
                <Input type="select" name="season" id="season" defaultValue={this.state.season} onChange={(e) => this.handleChange('season', e.target.value)}>
                  { ['2019', '2020'].map((season, index) => {
                    return <option key={index} value={season}>{season}</option>
                  })}
                </Input>
              </FormGroup>
            </div>
            <div className="row">
              <div className="col-12">
                <div className='races'>
                  { this.state.races.map((race) => {
                    return (
                      <div className='race' onClick={() => this.handleClick(race.id)}>
                        <div className='race-img'>
                          <img src={race.avatar}/>
                        </div>
                        <div className='race-text'>
                          <h5 className='race-date'>{race.date}</h5>
                          <h2 className='race-heading'>{race.number} етап сезону {race.season} "IT Racing"</h2>
                          <h5 className='race-weather'>Погода: {translations[race.weather]}</h5>
                          <h5 className='race-track'>Конфігурація: {track_translations[race.configuration]}</h5>
                          <h5 className='race-best-lap'>
                            Швидке коло: {race.best_lap_user.name} ({race.best_lap_user.company}/{race.best_lap_user.specialization}) - {race.best_lap_user.time} сек
                          </h5>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
