import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input } from 'reactstrap';

export default class Actions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: this.props.actions
    };
  }

  render() {
    const translations = {
      collection: 'Інкасація',
      replenishment: 'Поповнення',
    };
    return (
      <Fragment>
        <div className="container" style={{marginTop: 100 + 'px'}}>
          <table className='dark' style={{marginTop: 20 + 'px'}}>
            <thead>
            <tr>
              <th><h1>Тип</h1></th>
              <th><h1>Валюта</h1></th>
              <th><h1>Кількість</h1></th>
              <th><h1>Дата</h1></th>
            </tr>
            </thead>
            <tbody>
            { this.state.actions.map((action, index) => {
              return (
                <tr key={index}>
                  <td>{translations[action.action_type]}</td>
                  <td>{action.currency}</td>
                  <td>{action.amount}</td>
                  <td>{action.created_at}</td>
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
