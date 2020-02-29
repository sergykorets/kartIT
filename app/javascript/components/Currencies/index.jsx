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
        uah_currency_id: '',
        currency_id: '',
        rate: '',
        sell_amount: '',
        amount: '',
        comment: '',
        action_type: 'buy'
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
    const currency = Object.values(this.props.currencies).filter((currency) => {
      return currency.name != 'UAH'
    })[0];
    const uah_currency = Object.values(this.props.currencies).filter((currency) => {
      return currency.name == 'UAH'
    })[0];
    const rate = parseFloat(currency.buy);
    this.setState({
      ...this.state,
      loaded: true,
      exchange: {
        ...this.state.exchange,
        rate: rate,
        currency_id: currency.id,
        uah_currency_id: uah_currency.id
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
  };

  cutFloat = (value) => {
    return (Math.floor(value * 100) / 100);
  };

  handleExchangeTypeChange = (type) => {
    let rate = 0;
    if (type == 'sell') {
      rate = this.state.currencies[this.state.exchange.currency_id].sell
    } else {
      rate = this.state.currencies[this.state.exchange.currency_id].buy
    }
    this.setState({
      ...this.state,
      exchange: {
        ...this.state.exchange,
        action_type: type,
        rate: rate,
        sell_amount: this.cutFloat(this.state.exchange.amount * rate)
      }
    });
  };

  handleExchangeAmountChange = (value) => {
    this.setState({
      ...this.state,
      exchange: {
        ...this.state.exchange,
        sell_amount: this.cutFloat(parseFloat(value) * this.state.exchange.rate),
        amount: value
      }
    })
  }

  handleInputChange = (type, field, value) => {
    this.setState({
      ...this.state,
      [type]: {
        ...this.state[type],
        [field]: value
      }
    })
  };

  handleChangeCurrency = (value) => {
    let rate = 0;
    let sell_amount = 0;
    rate = parseFloat(this.state.currencies[value][this.state.exchange.action_type])
    sell_amount = this.cutFloat(parseFloat(this.state.exchange.amount) * rate)
    this.setState({
      ...this.state,
      exchange: {
        ...this.state.exchange,
        currency_id: value,
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
    let currency_id_sell = 0;
    let currency_id_buy = 0;
    if (this.state.exchange.action_type == 'buy') {
      currency_id_sell = this.state.exchange.uah_currency_id
      currency_id_buy = this.state.exchange.currency_id
    } else {
      currency_id_sell = this.state.exchange.currency_id
      currency_id_buy = this.state.exchange.uah_currency_id
    }
    $.ajax({
      url: `/currencies/exchange.json`,
      type: 'POST',
      data: {
        exchange: {
          currency_id_sell: currency_id_sell,
          currency_id_buy: currency_id_buy,
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
            ...this.state.exchange,
            amount: '',
            comment: '',
            sell_amount: ''
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
    return (
      <Fragment>
        { this.state.loaded &&
          <Fragment>
            <NotificationContainer/>
            <div className="container inside">
              <div className="input-submit">
                { this.props.admin &&
                  <Fragment>
                    <button className='btn-success' onClick={() => this.setState({cashDeskModal: true})}>Дії з касою</button>
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
                    <th><h1>Куплено</h1></th>
                    <th><h1>Продано</h1></th>
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
                      <td>{currency.bought_today}</td>
                      <td>{currency.sold_today}</td>
                      <td>{currency.total_amount}</td>
                    </tr>
                  )
                })}
                </tbody>
              </table>
            </div>

            <Modal isOpen={this.state.cashDeskModal} toggle={() => this.handleModal('cashDeskModal')} size="lg">
              <div className='container'>
                <ModalHeader className='text-center'>Дії з касою</ModalHeader>
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
                <ModalHeader className='text-center'>Обмін валюти</ModalHeader>
                <FormGroup check>
                  <Label check>
                    <Input type="radio" name="exchange_action_type" checked={this.state.exchange.action_type == 'buy'} onClick={(e) => this.handleExchangeTypeChange('buy')} />
                    Купівля
                  </Label>
                  <Label check>
                    <Input type="radio" name="exchange_action_type" checked={this.state.exchange.action_type == 'sell'} onClick={(e) => this.handleExchangeTypeChange('sell')}/>
                    Продаж
                  </Label>
                </FormGroup>
                <FormGroup>
                  <Label for="buy_currency">Валюта</Label>
                  <Input type="select" name="currency" id="currency" defaultValue={this.state.exchange.currency_id} onChange={(e) => this.handleChangeCurrency(e.target.value)}>
                    { Object.values(this.state.currencies).map((currency) => {
                      return (
                        <Fragment>
                          { currency.name != 'UAH' &&
                            <option key={currency.id} value={currency.id}>{currency.name}</option>}
                        </Fragment>)
                    })}
                  </Input>
                </FormGroup>
                <FormGroup>
                  <Label for="amount">Кількість</Label>
                  <Input type='number' id='amount' value={this.state.exchange.amount} onChange={(e) => this.handleExchangeAmountChange(e.target.value)}/>
                </FormGroup>
                <FormGroup>
                  <div className='row'>
                    <div className='col-sm-6'>
                      <Label>Курс обміну</Label>
                      <p><b>{this.state.exchange.rate || '-'}</b></p>
                    </div>
                    <div className='col-sm-6'>
                      <Label>Сума</Label>
                      <p><b>{this.state.exchange.sell_amount || '0'}</b> грн</p>
                    </div>
                  </div>
                </FormGroup>
                <FormGroup>
                  <Label for="exchange_comment">Опис</Label>
                  <Input type='textarea' id='exchange_comment' value={this.state.exchange.comment} onChange={(e) => this.handleInputChange('exchange','comment', e.target.value)}/>
                </FormGroup>
                <FormGroup>
                  <ButtonToggle color="secondary" onClick={() => this.handleModal('exchangeModal')}>Відміна</ButtonToggle>
                  <ButtonToggle color={this.state.exchange.action_type == 'buy' ? 'success' : 'warning'} onClick={this.submitExchange}>{this.state.exchange.action_type == 'buy' ? 'Купити' : 'Продати'}</ButtonToggle>
                </FormGroup>
              </div>
            </Modal>

            <Modal isOpen={this.state.ratesModal} toggle={() => this.handleModal('ratesModal')} size="lg">
              <div className='container'>
                <ModalHeader className='text-center'>Зміна курсу валют</ModalHeader>
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
