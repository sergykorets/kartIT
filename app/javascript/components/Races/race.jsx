import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ImageGallery from "react-image-gallery";

export default class Race extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    console.log(this.props)
    const images = this.props.race.photos.map((photo) => {return ({ original: photo, thumbnail: photo})});
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container wow fadeInUp">
            <div className="col-12 main-heading text-center mt-5">
              <h1>{this.props.race.number} етап сезону {this.props.race.season} "IT Racing"</h1>
            </div>
            <div className="row">
              <div className="col-12">
                <table className='dark' style={{marginTop: 20 + 'px'}}>
                  <thead>
                  <tr>
                    <th><h1>Місце</h1></th>
                    <th><h1>Ім'я</h1></th>
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
                        <td>{s.name}</td>
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
