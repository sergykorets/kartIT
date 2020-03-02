import React, {Fragment} from 'react';
import Pagination from "react-js-pagination";

export default class Versions extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      versions: this.props.versions,
      activePage: 1,
      count: this.props.count
    };
  }

  handlePageChange = (page) => {
    $.ajax({
      url: '/versions.json',
      type: 'GET',
      data: { page: page },
      success: (resp) => {
        this.setState({versions: resp.versions, activePage: page})
      }
    });
  };

  render() {
    return (
      <Fragment>
        <div className="container inside">
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
                  <td>
                    { version.currency_buy_change_rate ?
                      `${version.currency_buy_change_rate[0]} => ${version.currency_buy_change_rate[1]}` : 'Без змін'}
                  </td>
                  <td>
                    { version.currency_sell_change_rate ?
                      `${version.currency_sell_change_rate[0]} => ${version.currency_sell_change_rate[1]}` : 'Без змін'}
                  </td>
                  <td>{version.created_at}</td>
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
