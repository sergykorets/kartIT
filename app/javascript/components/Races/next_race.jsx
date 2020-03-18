import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class NextRace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {

    };
  }

  render() {
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container wow fadeInUp">
            <div className="col-12 main-heading text-center mt-5">
              <h1>Зареєстровані учасники</h1>
            </div>
            <div className='row'>
              <div className='col-2'>
                <button onClick={() => this.handleCheckIn()} className="btn btn-block custom-button">Check-In</button>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <table className='dark' style={{marginTop: 20 + 'px'}}>
                  <thead>
                  <tr>
                    <th><h1>#</h1></th>
                    <th><h1>Ім'я</h1></th>
                    <th><h1>Компанія</h1></th>
                    <th><h1>Спеціалізація</h1></th>
                    <th><h1>Новачок</h1></th>
                    <th><h1>Дата реєстрації</h1></th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.props.users.map((u, index) => {
                    return (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td>{u.name}</td>
                        <td>{u.company}</td>
                        <td>{u.specialization}</td>
                        <td style={{color: u.novice ? 'green' : 'red'}}>{u.novice ? 'Так' : 'Ні'}</td>
                        <td>{u.created_at}</td>
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
