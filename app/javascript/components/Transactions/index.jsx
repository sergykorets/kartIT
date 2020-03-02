import React, {Fragment} from 'react';
import ReactDOMServer from 'react-dom/server'
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
          if (resp.success) {
            NotificationManager.success('Транзакцію відмінено');
            this.setState({actions: resp.actions, activePage: this.state.activePage})
          } else {
            NotificationManager.error('Можна відміняти лише сьогоднішні транзакції', 'Транзакцію не відмінено');
          }
        }
      });
    }
  };

  printAction = (action_id) => {
    if (window.confirm("Роздрукувати чек?")) {
      const content =
        <div className='container'>
          <h3 style={{lineHeight: 0.1+'rem'}}>Товариство з обмеженою відповідальністю "Фінансова компанія Октава Фінанс"</h3>
          <h3 style={{lineHeight: 0.1+'rem'}}>Рівненське відділення №15</h3>
          <h3 style={{lineHeight: 0.1+'rem'}}>34700 Рівненська обл. м. Корець, пл. Київська, 3</h3>
          <p style={{textAlign: 'center', marginTop: 3+'rem', marginBottom: 3+'rem'}}>КВИТАНЦІЯ №{this.state.actions[action_id].number}</p>
          <table>
            <tbody>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>Сума</td>
                <td>{this.state.actions[action_id].buy_amount} {this.state.actions[action_id].currency_sell}</td>
              </tr>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>До видачі</td>
                <td>{this.state.actions[action_id].sell_amount} {this.state.actions[action_id].currency_buy}</td>
              </tr>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>Курс</td>
                <td>{this.state.actions[action_id].rate}</td>
              </tr>
              <tr>
                <td style={{paddingRight: 3+'rem'}}>Дата</td>
                <td>{this.state.actions[action_id].created_at}</td>
              </tr>
            </tbody>
          </table>
          <div style={{display: 'flex', justifyContent: 'space-between', marginTop: 6+'rem'}}>
            <span>ФІСКАЛЬНИЙ ЧЕК</span><span>ІКС</span>
          </div>
        </div>;
      const pri = document.getElementById("ifmcontentstoprint").contentWindow;
      pri.document.open();
      pri.document.write(ReactDOMServer.renderToString(content));
      pri.document.close();
      pri.focus();
      pri.print();
    }
  };

  render() {
    return (
      <Fragment>
        <NotificationContainer/>
        <iframe id="ifmcontentstoprint" style={{height: 0+'px', width: 0+'px', position: 'absolute'}}/>
        <div className="container inside">
          <table className='dark' style={{marginTop: 20 + 'px'}}>
            <thead>
            <tr>
              <th><h1>№</h1></th>
              <th><h1>Валюта купівлі</h1></th>
              <th><h1>Валюта продажу</h1></th>
              <th><h1>Сума купівлі</h1></th>
              <th><h1>Сума продажу</h1></th>
              <th><h1>Курс</h1></th>
              <th><h1>Дата</h1></th>
              <th><h1>Дії</h1></th>
            </tr>
            </thead>
            <tbody>
              { Object.values(this.state.actions).reverse().map((action, index) => {
                return (
                  <tr key={index} className={action.is_canceled ? 'canceled' : (action.currency_sell == 'UAH' ? 'sell' : 'buy')}>
                    <td>{action.number}</td>
                    <td>{action.currency_sell}</td>
                    <td>{action.currency_buy}</td>
                    <td>{action.buy_amount}</td>
                    <td>{action.sell_amount}</td>
                    <td>{action.rate}</td>
                    <td>{action.created_at}</td>
                    <td>
                      <i onClick={() => this.cancelAction(action.id)} className="fa fa-ban"></i>
                      <i onClick={() => this.printAction(action.id)} className="fa fa-print"></i>
                    </td>
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
