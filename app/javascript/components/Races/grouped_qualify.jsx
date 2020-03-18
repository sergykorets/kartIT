import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class GroupedQualify extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
    };
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


  render() {
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container wow fadeInUp">
            <div className="col-12 main-heading text-center mt-5">
              <h1>Групи кваліфікації</h1>
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
                  </tr>
                  </thead>
                  <tbody>
                  { this.props.users.map((group, index) => {
                    return (
                      <Fragment>
                        <tr>
                          <td colspan='4' className='text-center'>Група {index+1}</td>
                        </tr>
                        <Fragment>
                          { group.map((u, i) => {
                            return (
                              <tr key={i}>
                                <td>{i+1}</td>
                                <td>{u.name}</td>
                                <td>{u.company}</td>
                                <td>{u.specialization}</td>
                              </tr>
                            )})}
                        </Fragment>
                      </Fragment>
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
