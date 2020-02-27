import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input } from 'reactstrap';

export default class Versions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versions: this.props.versions
    };
  }

  render() {
    console.log(this.state);
    return (
      <Fragment>
        <div className="container" style={{marginTop: 100 + 'px'}}>
          <table className='dark' style={{marginTop: 20 + 'px'}}>
            <thead>
            <tr>
              <th><h1>Валюта</h1></th>
              <th><h1>Купівля</h1></th>
              <th><h1>Продаж</h1></th>
              <th><h1>Дата</h1></th>
            </tr>
            </thead>
            <tbody>
            { this.state.versions.map((version, index) => {
              return (
                <tr key={index}>
                  <td>{version.currency}</td>
                  <td>{version.currency_buy_rate}</td>
                  <td>{version.currency_sell_rate}</td>
                  <td>{version.created_at}</td>
                </tr>
              )
            })}
            </tbody>
          </table>
        </div>
      </Fragment>
    );
  }
}
