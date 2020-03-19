import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import ReactGA from 'react-ga';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class NextRace extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      qualifyModal: false,
      qualifyCount: 10
    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', '/races/next_race');
    }
  }

  handleModal = (modal) => {
    this.setState({
      ...this.state,
      [modal]: !this.state[modal]
    })
  }

  handleChange = (field, value) => {
    this.setState({
      ...this.state,
        [field]: value
      }
    )
  }

  submitQualify = () => {
    $.ajax({
      url: '/races/group_qualify.json',
      type: 'POST',
      data: {
        group: this.state.qualifyCount
      }
    }).then((resp) => {
      if (resp.success) {
        NotificationManager.success('Групи сформовано');
      } else {
        NotificationManager.error('Групи вже сформовано','Неможливо зробити дію');
      }
    });
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
            { this.props.admin &&
              <Fragment>
              <div className='row'>
                <div className='col-2'>
                  <button onClick={() => this.handleModal('qualifyModal')} className="btn btn-warning">Групування</button>
                </div>
              </div>
              <hr/>
              </Fragment>}
            { this.props.grouped &&
              <div className='row'>
                <div className='col-sm-6'>
                    <a href='/races/grouped_qualify' className="btn btn-warning">Групи кваліфікації</a>
                </div>
              </div>}
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
                        <td><a href={`/racer/${u.id}`}>{u.name}</a></td>
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

        <Modal isOpen={this.state.qualifyModal} toggle={() => this.handleModal('qualifyModal')} size="lg">
          <div className='container'>
            <ModalHeader>Групування кваліфікації</ModalHeader>
            <div className='row'>
              <div className='col-12'>
                <FormGroup>
                  <Label for="qualify_count">Кількість гонщиків в заїзді</Label>
                  <Input type="select" name="qualify_count" id="qualify_count" defaultValue={this.state.qualifyCount} onChange={(e) => this.handleChange('qualifyCount', e.target.value)}>
                    { [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((count) => {
                      return <option key={count} value={count}>{count}</option>
                    })}
                  </Input>
                </FormGroup>
              </div>
            </div>
            <FormGroup>
              <ButtonToggle color="secondary" onClick={() => this.handleModal('qualifyModal')}>Відміна</ButtonToggle>
              <ButtonToggle color="success" onClick={this.submitQualify}>Групувати</ButtonToggle>
            </FormGroup>
          </div>
        </Modal>
      </Fragment>
    );
  }
}
