import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Races extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  handleClick = (id) => {
    window.location = `/races/${id}`
  }

  render() {
    const translations = {
      sunny: 'Сонячно',
      cloudy: 'Хмарно',
      rain: 'Дощ'
    };
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container">
            <div className="row">
              <div className="col-12">
                <div className='races'>
                  { this.props.races.map((race) => {
                    return (
                      <div className='race' onClick={() => this.handleClick(race.id)}>
                        <div className='race-img'>
                          <img src={race.avatar}/>
                        </div>
                        <div className='race-text'>
                          <h5 className='race-date'>{race.date}</h5>
                          <h2 className='race-heading'>{race.number} етап сезону {race.season} "IT Racing"</h2>
                          <h5 className='race-weather'>Погода: {translations[race.weather]}</h5>
                          <h5 className='race-track'>Конфігурація: {race.configuration}</h5>
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
