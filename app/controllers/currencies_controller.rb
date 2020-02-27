class CurrenciesController < ApplicationController

  def index
    @currencies = Currency.all.each_with_object({}) { |currency, hash|
      hash[currency.id] = { id: currency.id,
                            name: currency.name,
                            sell: currency.sell_price,
                            buy: currency.buy_price,
                            total_amount: currency.get_current_amount}
    }
    @admin = current_user&.admin?
  end

  def cashdesk
    action = Action.new(cashdesk_params)
    currency = Currency.find(action.currency_id)
    check_amount = if action.collection?
      currency.get_current_amount - action.amount
    else
      currency.get_current_amount + action.amount
    end
    if check_amount >= 0
      action.save
      render json: {
        success: true,
        action_type: action.action_type,
        total_amount: check_amount,
        currency_id: currency.id
      }
    else
      render json: { success: false }
    end
  end

  def exchange
    action = Action.new(exchange_params)
    sell_currency = Currency.find(action.currency_id_sell)
    buy_currency = Currency.find(action.currency_id_buy)
    rate = 0
    sell_amount = 0
    sell_amount = if buy_currency.name == 'UAH'
      rate = sell_currency.sell_price
      action.buy_amount / rate
    else
      rate = buy_currency.buy_price
      action.buy_amount * rate
    end
    check_amount = sell_currency.get_current_amount - sell_amount.to_d.truncate(2).to_f
    if check_amount >= 0
      action.rate = rate
      action.action_type = :exchange
      action.sell_amount = sell_amount.to_d.truncate(2).to_f
      action.save
      render json: {
          success: true,
          total_amount: check_amount,
          currencies: Currency.all.each_with_object({}) { |currency, hash|
            hash[currency.id] = { id: currency.id,
                                  name: currency.name,
                                  sell: currency.sell_price,
                                  buy: currency.buy_price,
                                  total_amount: currency.get_current_amount}
          }
      }
    else
      render json: { success: false }
    end
  end

  def change_rates
    rates = params[:rates]
    rates.each do |rate|
      Currency.find(rate).update(buy_price: rates[rate][:buy_amount], sell_price: rates[rate][:sell_amount])
    end
    render json: { success: true,
                   currencies: Currency.all.each_with_object({}) { |currency, hash|
                     hash[currency.id] = { id: currency.id,
                                           name: currency.name,
                                           sell: currency.sell_price,
                                           buy: currency.buy_price,
                                           total_amount: currency.get_current_amount
                   }
                 }
    }
  end

  private

  def cashdesk_params
    params.require(:cashdesk).permit(:currency_id, :amount, :action_type, :comment)
  end

  def exchange_params
    params.require(:exchange).permit(:currency_id_buy, :currency_id_sell, :buy_amount, :comment)
  end

end