import React, {Fragment} from 'react';
import Pagination from "react-js-pagination";
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Actions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      actions: this.props.actions,
      activePage: 1,
      count: this.props.count
    };
  }

  handlePageChange = (page) => {
    $.ajax({
      url: '/transactions.json',
      type: 'GET',
      data: { page: page },
      success: (resp) => {
        this.setState({actions: resp.actions, activePage: page})
      }
    });
  };

  cancelAction = (action_id) => {
    if (window.confirm("Відмінити транзакцію?")) {
      $.ajax({
        url: `/transactions/${action_id}/cancel.json`,
        type: 'PATCH',
        data: {
          page: this.state.activePage
        },
        success: (resp) => {
          NotificationManager.success('Транзакцію відмінено');
          this.setState({actions: resp.actions, activePage: this.state.activePage})
        }
      });
    }
  };

  render() {
    return (
      <Fragment>
        <NotificationContainer/>
        <div className="container inside">
          <table className='dark' style={{marginTop: 20 + 'px'}}>
            <thead>
            <tr>
              <th><h1>Валюта купівлі</h1></th>
              <th><h1>Валюта продажу</h1></th>
              <th><h1>Кількість купівлі</h1></th>
              <th><h1>Кількість продажі</h1></th>
              <th><h1>Курс</h1></th>
              <th><h1>Дата</h1></th>
              <th><h1>Дії</h1></th>
            </tr>
            </thead>
            <tbody>
            { this.state.actions.map((action, index) => {
              return (
                <tr key={index} className={action.is_canceled ? 'canceled' : (action.currency_sell == 'UAH' ? 'sell' : 'buy')}>
                  <td>{action.currency_sell}</td>
                  <td>{action.currency_buy}</td>
                  <td>{action.buy_amount}</td>
                  <td>{action.sell_amount}</td>
                  <td>{action.rate}</td>
                  <td>{action.created_at}</td>
                  <td className='actions' onClick={() => this.cancelAction(action.id)}><i className="fa fa-ban"></i></td>
                </tr>
              )
            })}
            </tbody>
          </table>
          { this.state.count > 10 &&
          <Fragment>
            <Pagination
              activePage={this.state.activePage}
              itemsCountPerPage={10}
              totalItemsCount={this.state.count}
              pageRangeDisplayed={Math.ceil(this.state.count/10)}
              onChange={this.handlePageChange}
            />
            <hr/>
          </Fragment>}
        </div>
      </Fragment>
    );
  }
}
