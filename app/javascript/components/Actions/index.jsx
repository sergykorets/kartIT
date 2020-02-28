import React, {Fragment} from 'react';
import Pagination from "react-js-pagination";

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
      url: '/actions.json',
      type: 'GET',
      data: { page: page },
      success: (resp) => {
        this.setState({actions: resp.actions, activePage: page})
      }
    });
  };

  render() {
    const translations = {
      collection: 'Інкасація',
      replenishment: 'Поповнення'
    };
    return (
      <Fragment>
        <div className="container inside">
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
