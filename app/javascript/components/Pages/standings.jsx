import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import ReactGA from 'react-ga';
import {NotificationContainer, NotificationManager} from 'react-notifications';
import ImageGallery from "react-image-gallery";

export default class Standings extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      standings: this.props.standings,
      season: '2019'
    };
  }

  componentDidMount() {
    if (!this.props.admin) {
      ReactGA.initialize('UA-116820611-4');
      ReactGA.ga('send', 'pageview', '/standings');
    }
  }

  handleChange = (field, value) => {
    $.ajax({
      url: '/standings.json',
      type: 'GET',
      data: {
        season: value
      }
    }).then((resp) => {
      this.setState({
          ...this.state,
          standings: resp.standings,
          [field]: value
        }
      )
    });
  };

  render() {
    return (
      <Fragment>
        <NotificationContainer/>
        <section id="services" className="services page">
          <div className="container wow fadeInUp">
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
                <table className='dark' style={{marginTop: 20 + 'px'}}>
                  <thead>
                  <tr>
                    <th><h1>#</h1></th>
                    <th><h1>Ім'я</h1></th>
                    <th><h1>Компанія</h1></th>
                    <th><h1>Спеціалізація</h1></th>
                    <th><h1>Очки</h1></th>
                  </tr>
                  </thead>
                  <tbody>
                  { this.state.standings.map((s, index) => {
                    return (
                      <tr key={index}>
                        <td>{index+1}</td>
                        <td><a href={`/racer/${s.id}`}>{s.racer}</a></td>
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
          </div>
        </section>
      </Fragment>
    );
  }
}
