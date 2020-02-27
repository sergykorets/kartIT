class TransactionsController < ApplicationController

  def index
    @actions = Action.exchange.order('created_at DESC').map do |action|
      { id: action.id,
        currency_buy: action.sell_currency.name,
        currency_sell: action.buy_currency.name,
        buy_amount: action.buy_amount,
        sell_amount: action.sell_amount,
        rate: action.rate,
        comment: action.comment,
        created_at: action.created_at.strftime('%d.%m.%Y %H:%M')
      }
    end
    @admin = current_user&.admin?
  end
end