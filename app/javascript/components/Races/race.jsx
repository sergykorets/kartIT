import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import ReactGA from 'react-ga';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ImageGallery from "react-image-gallery";

export default class Race extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', `/races/${this.props.race.number}(${this.props.race.season})`);
    }
  }

  render() {
    const images = this.props.race.photos.map((photo) => {return ({ original: photo, thumbnail: photo})});
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
          <div className="container wow fadeInUp">
            <div className="col-12 main-heading text-center mt-5">
              <h1>{this.props.race.number} етап сезону {this.props.race.season} "IT Racing"</h1>
            </div>
            <div className='container'>
              <div className='row'>
                <div className='col-3'>
                  <i className='fa fa-calendar'/> <span>{this.props.race.date}</span>
                </div>
                <div className='col-3'>
                  <i className='fa fa-cloud'/> <span>{translations[this.props.race.weather]}</span>
                </div>
                <div className='col-3'>
                  <i className='fa fa-road'/> <span>{track_translations[this.props.race.configuration]}</span>
                </div>
                <div className='col-3'>
                  <i className='fa fa-tachometer'/> <span>{this.props.race.best_lap_user.name} - {this.props.race.best_lap_user.time} сек</span>
                </div>
              </div>
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
                    <th><h1>Очки</h1></th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.props.race.standings.map((s, index) => {
                    return (
                      <tr key={index}>
                        <td>{s.place}</td>
                        <td><div className='user-pic' style={{backgroundImage: `url(${s.avatar})`}}/></td>
                        <td><a href={`/racer/${s.user_id}`}>{s.name}</a></td>
                        <td>{s.company}</td>
                        <td>{s.specialization}</td>
                        <td>{s.points}</td>
                      </tr>
                    )
                  })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='gallery mt-4'>
              <ImageGallery items={images} showThumbnails={false}/>
            </div>
          </div>
        </section>
      </Fragment>
    );
  }
}
