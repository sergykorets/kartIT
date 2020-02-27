class ActionsController < ApplicationController

  def index
    @actions = Action.where(action_type: [:collection, :replenishment]).order('created_at DESC').map do |action|
      { id: action.id,
        action_type: action.action_type,
        currency_buy: action.currency_id_buy,
        currency_sell: action.currency_id_sell,
        currency: action.cashdesk_currency.name,
        amount: action.amount,
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