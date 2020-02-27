import React, {Fragment} from 'react';
import { Modal, ModalHeader, FormGroup, Label, Input, ButtonToggle } from 'reactstrap';
import {NotificationContainer, NotificationManager} from 'react-notifications';

export default class Currencies extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      loaded: false,
      currencies: this.props.currencies,
      cashDeskModal: false,
      exchangeModal: false,
      ratesModal: false,
      cashDesk: {
        currency_id: Object.values(this.props.currencies)[0].id,
        amount: '',
        action_type: 'replenishment',
        comment: ''
      },
      exchange: {
        sell_currency_id: Object.values(this.props.currencies)[1].id.toString(),
        buy_currency_id: Object.values(this.props.currencies)[0].id.toString(),
        rate: '',
        sell_amount: '',
        amount: '',
        comment: ''
      },
      rates: {}
    };
  }

  componentDidMount() {
    let rates = {};
    Object.values(this.props.currencies).map((currency) => {
      if (currency.name != 'UAH') {
        return rates[currency.id] = {buy_amount: currency.buy, sell_amount: currency.sell, id: currency.id}
      }
    });
    const buy_currency = this.state.currencies[this.state.exchange.buy_currency_id];
    const sell_currency = this.state.currencies[this.state.exchange.sell_currency_id];
    let rate = 0;
    if (buy_currency.name == 'UAH') {
      rate = parseFloat(sell_currency.sell)
    } else {
      rate = parseFloat(buy_currency.buy)
    }
    this.setState({
      ...this.state,
      loaded: true,
      exchange: {
        ...this.state.exchange,
        rate: rate
      },
      rates: rates
    })
  }

  handleRatesChange = (currency_id, field, value) => {
    this.setState({
      ...this.state,
      rates: {
        ...this.state.rates,
        [currency_id]: {
          ...this.state.rates[currency_id],
          [field]: value
        }
      }
    })
  }

  cutFloat = (value) => {
    return (Math.floor(value * 100) / 100);
  }

  changeSellAmount = (type, field, value) => {
    const buy_currency = this.state.currencies[this.state.exchange.buy_currency_id];
    const sell_currency = this.state.currencies[this.state.exchange.sell_currency_id];
    let rate = 0;
    let sell_amount = 0;
    if (buy_currency.name == 'UAH') {
      rate = parseFloat(sell_currency.sell)
      sell_amount = parseFloat(value) / rate
    } else {
      rate = parseFloat(buy_currency.buy)
      sell_amount = parseFloat(value) * rate
    }
    this.setState({
      ...this.state,
      exchange: {
        ...this.state.exchange,
        sell_amount: this.cutFloat(sell_amount),
        amount: value
      }
    })
  }

  handleInputChange = (type, field, value) => {
    if (type == 'exchange' && field == 'amount') {
      this.changeSellAmount(type, field, value);
    } else if (type == 'exchange' && field == 'sell_currency_id') {
      let rate = parseFloat(this.state.currencies[value].sell);
      this.setState({
        ...this.state,
        exchange: {
          ...this.state.exchange,
          sell_currency_id: value.toString(),
          rate: parseFloat(this.state.currencies[value].sell),
          sell_amount: this.cutFloat(parseFloat(this.state.exchange.amount) / rate)
        }
      })
    } else {
      this.setState({
        ...this.state,
        [type]: {
          ...this.state[type],
          [field]: value
        }
      })
    }
  };

  handleBuyCurrency = (value) => {
    let sell_currency_id = this.state.exchange.sell_currency_id;
    const is_uah = this.state.currencies[value].name == 'UAH'
    let rate = 0;
    let sell_amount = 0;
    if (is_uah) {
      const myArray = Object.values(this.state.currencies).filter(function( obj ) {
        return obj.id != value;
      });
      rate = parseFloat(this.state.currencies[myArray[0].id].sell)
      sell_currency_id = myArray[0].id.toString();
      sell_amount = this.cutFloat(parseFloat(this.state.exchange.amount) / rate)
    } else {
      const myArray = Object.values(this.state.currencies).filter(function( obj ) {
        return obj.name == 'UAH';
      });
      rate = parseFloat(this.state.currencies[value].buy)
      sell_currency_id = myArray[0].id
      sell_amount = this.cutFloat(parseFloat(this.state.exchange.amount) * rate)
    }
    this.setState({
      ...this.state,
      exchange: {
        ...this.state.exchange,
        buy_currency_id: value,
        sell_currency_id: sell_currency_id.toString(),
        rate: rate,
        sell_amount: sell_amount
      }
    })
  };

  handleModal = (modal) => {
    this.setState({
      ...this.state,
      [modal]: !this.state[modal]
    })
  }

  submitCashDesk = () => {
    $.ajax({
      url: `/currencies/${this.state.cashDesk.currency_id}/cashdesk.json`,
      type: 'POST',
      data: {
        cashdesk: {
          currency_id: this.state.cashDesk.currency_id,
          amount: this.state.cashDesk.amount,
          action_type: this.state.cashDesk.action_type
        }
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          cashDeskModal: false,
          cashDesk: {
            currency_id: Object.values(this.props.currencies)[0].id,
            amount: '',
            action_type: 'replenishment',
            comment: ''
          },
          currencies: {
            ...this.state.currencies,
            [resp.currency_id]: {
              ...this.state.currencies[resp.currency_id],
              total_amount: resp.total_amount
            }
          }
        })
        if (resp.action_type == 'replenishment') {
          NotificationManager.success('Касу поповнено');
        } else {
          NotificationManager.success('Касу проінкасовано');
        }
      } else {
        NotificationManager.error('Залишок валюти замалий', 'Неможливо зробити дію');
      }
    });
  }

  submitExchange = () => {
    $.ajax({
      url: `/currencies/${this.state.exchange.buy_currency_id}/exchange.json`,
      type: 'POST',
      data: {
        exchange: {
          currency_id_sell: this.state.exchange.sell_currency_id,
          currency_id_buy: this.state.exchange.buy_currency_id,
          buy_amount: this.state.exchange.amount,
          comment: this.state.exchange.comment
        }
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          exchangeModal: false,
          exchange: {
            sell_currency_id: Object.values(this.props.currencies)[1].id.toString(),
            buy_currency_id: Object.values(this.props.currencies)[0].id.toString(),
            amount: '',
            comment: ''
          },
          currencies: resp.currencies
        })
        NotificationManager.success('Обмін валют виконано');
      } else {
        NotificationManager.error('Залишок валюти продажі замалий', 'Неможливо зробити дію');
      }
    });
  }

  submitRates = () => {
    $.ajax({
      url: `/currencies/change_rates.json`,
      type: 'POST',
      data: {
        rates: this.state.rates
      }
    }).then((resp) => {
      if (resp.success) {
        this.setState({
          ...this.state,
          ratesModal: false,
          currencies: resp.currencies
        })
        NotificationManager.success('Зміну курсів валют виконано');
      } else {
        NotificationManager.error('Перезавантажте сторінку', 'Неможливо зробити дію');
      }
    });
  }

  render() {
    console.log(this.state);
    const state = this.state;
    const is_buy_uah = this.state.currencies[this.state.exchange.buy_currency_id].name == 'UAH'
    const myArray = Object.values(this.state.currencies).filter(function( obj ) {
      return obj.name == 'UAH';
    });
    return (
      <Fragment>
        { this.state.loaded &&
          <Fragment>
            <NotificationContainer/>
            <div className="container" style={{marginTop: 100 + 'px'}}>
              <div className="input-submit">
                { this.props.admin &&
                  <Fragment>
                    <button onClick={() => this.setState({cashDeskModal: true})}>Дії з касою</button>
                    <button className='btn-primary' onClick={() => this.setState({ratesModal: true})}>Зміна курсу валют</button>
                  </Fragment>}
                <button className='btn-danger' onClick={() => this.setState({exchangeModal: true})}>Обмін валюти</button>
              </div>
              <table className='dark' style={{marginTop: 20 + 'px'}}>
                <thead>
                  <tr>
                    <th><h1>Валюта</h1></th>
                    <th><h1>Купівля</h1></th>
                    <th><h1>Продаж</h1></th>
                    <th><h1>Каса</h1></th>
                  </tr>
                </thead>
                <tbody>
                { Object.values(this.state.currencies).map((currency) => {
                  return (
                    <tr key={currency.id}>
                      <td>{currency.name}</td>
                      <td>{currency.buy || '-'}</td>
                      <td>{currency.sell || '-'}</td>
                      <td>{currency.total_amount}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>

            <Modal isOpen={this.state.cashDeskModal} toggle={() => this.handleModal('cashDeskModal')} size="lg">
              <div className='container'>
                <ModalHeader className='text-center' toggle={() => this.handleModal('cashDeskModal')}>Дії з касою</ModalHeader>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="cashdesk_action_type" checked={this.state.cashDesk.action_type == 'replenishment'} onClick={(e) => this.handleInputChange('cashDesk','action_type', 'replenishment')} />
                    Поповнення
                  </Label>
                  <Label check>
                    <Input type="radio" name="cashdesk_action_type" checked={this.state.cashDesk.action_type == 'collection'} onClick={(e) => this.handleInputChange('cashDesk','action_type', 'collection')}/>
                    Інкасація
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label for="currency">Валюта</Label>
                  <Input type="select" name="currency" id="currency" defaultValue={this.state.cashDesk.currency_id} onChange={(e) => this.handleInputChange('cashDesk','currency_id', e.target.value)}>
                    { Object.values(this.state.currencies).map((currency) => {
                      return <option key={currency.id} value={currency.id}>{currency.name}</option>
                    })}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="amount">Кількість</Label>
                  <Input type='number' id='amount' value={this.state.cashDesk.amount} onChange={(e) => this.handleInputChange('cashDesk','amount', e.target.value)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="comment">Опис</Label>
                  <Input type='textarea' id='comment' value={this.state.cashDesk.comment} onChange={(e) => this.handleInputChange('cashDesk','comment', e.target.value)}/>
                </FormGroup>
                <FormGroup>
                  <ButtonToggle color="secondary" onClick={() => this.handleModal('cashDeskModal')}>Відміна</ButtonToggle>
                  <ButtonToggle color="success" onClick={this.submitCashDesk}>Зберегти</ButtonToggle>
                </FormGroup>
              </div>
            </Modal>

            <Modal isOpen={this.state.exchangeModal} toggle={() => this.handleModal('exchangeModal')} size="lg">
              <div className='container'>
                <ModalHeader className='text-center'  toggle={() => this.handleModal('exchangeModal')}>Обмін валюти</ModalHeader>
                <FormGroup>
                  <Label for="buy_currency">Валюта купівлі</Label>
                  <Input type="select" name="buy_currency" id="buy_currency" defaultValue={this.state.exchange.buy_currency_id} onChange={(e) => this.handleBuyCurrency(e.target.value)}>
                    { Object.values(this.state.currencies).map((currency) => {
                      return <option key={currency.id} value={currency.id}>{currency.name}</option>
                    })}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="buy_amount">Кількість</Label>
                  <Input type='number' id='buy_amount' value={this.state.exchange.amount} onChange={(e) => this.handleInputChange('exchange','amount', e.target.value)}/>
                </FormGroup>
                <FormGroup>
                  <Label for="sell_currency">Валюта продажу</Label>
                  <Input type="select" name="sell_currency" id="sell_currency" defaultValue={this.state.exchange.sell_currency_id} onChange={(e) => this.handleInputChange('exchange','sell_currency_id', e.target.value)}>
                    <Fragment>
                      { is_buy_uah ?
                        <Fragment>
                          { Object.values(this.state.currencies).map((currency) => {
                            return (
                              <Fragment>
                                { currency.name != 'UAH' &&
                                <option key={currency.id} value={currency.id}>{currency.name}</option>}
                              </Fragment>
                            )
                          })}
                        </Fragment>
                      :
                        <option key={myArray[0].id} value={myArray[0].id}>{myArray[0].name}</option>
                      }
                    </Fragment>
                  </Input>
                </FormGroup>
                <FormGroup>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Label>Курс обміну</Label>
                      <p><b>{this.state.exchange.rate || '-'}</b></p>
                    </div>
                    <div className='col-sm-6'>
                      <Label>Сума продажу</Label>
                      <p><b>{this.state.exchange.sell_amount || '-'}</b></p>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="exchange_comment">Опис</Label>
                  <Input type='textarea' id='exchange_comment' value={this.state.exchange.comment} onChange={(e) => this.handleInputChange('exchange','comment', e.target.value)}/>
                </FormGroup>
                <FormGroup>
                  <ButtonToggle color="secondary" onClick={() => this.handleModal('exchangeModal')}>Відміна</ButtonToggle>
                  <ButtonToggle color="success" onClick={this.submitExchange}>Зберегти</ButtonToggle>
                </FormGroup>
              </div>
            </Modal>

            <Modal isOpen={this.state.ratesModal} toggle={() => this.handleModal('ratesModal')} size="lg">
              <div className='container'>
                <ModalHeader className='text-center'  toggle={() => this.handleModal('ratesModal')}>Зміна курсу валют</ModalHeader>
                <FormGroup>
                  <table className='table' style={{marginTop: 20 + 'px'}}>
                    <thead>
                    <tr>
                      <th><h1>Валюта</h1></th>
                      <th><h1>Купівля</h1></th>
                      <th><h1>Продаж</h1></th>
                    </tr>
                    </thead>
                    <tbody>
                    { Object.values(this.state.currencies).map((currency) => {
                      return (
                        <Fragment>
                          { currency.name != 'UAH' &&
                            <tr key={currency.id}>
                              <td>{currency.name}</td>
                              <td><Input type='number' id={`buy_amount_${currency.id}`} value={this.state.rates[currency.id].buy_amount} onChange={(e) => this.handleRatesChange(currency.id, 'buy_amount', e.target.value)}/></td>
                              <td><Input type='number' id={`sell_amount_${currency.id}`} value={this.state.rates[currency.id].sell_amount} onChange={(e) => this.handleRatesChange(currency.id, 'sell_amount',  e.target.value)}/></td>
                            </tr>}
                        </Fragment>
                      )
                    })}
                    </tbody>
                  </table>
                </FormGroup>
                <FormGroup>
                  <ButtonToggle color="secondary" onClick={() => this.handleModal('ratesModal')}>Відміна</ButtonToggle>
                  <ButtonToggle color="success" onClick={this.submitRates}>Зберегти</ButtonToggle>
                </FormGroup>
              </div>
            </Modal>
          </Fragment>}
      </Fragment>
    );
  }
}
