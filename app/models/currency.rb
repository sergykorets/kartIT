class Currency < ApplicationRecord
  has_many :sell_actions, class_name: 'Action', foreign_key: :currency_id_sell
  has_many :buy_actions, class_name: 'Action', foreign_key: :currency_id_buy
  has_many :cashdesk_actions, class_name: 'Action', foreign_key: :currency_id
  has_many :balances

  has_paper_trail only: [:buy_price, :sell_price], on: :update, versions: {
      class_name: 'Version'
  }

  def get_current_amount
    if yesterday_balance = balances.where('balances.created_at >= ?', 1.day.ago).last
      plus_amounts = cashdesk_actions.replenishment.after_time(yesterday_balance.created_at)
      plus_amounts_exchange = buy_actions.after_time(yesterday_balance.created_at)
      minus_amounts = cashdesk_actions.collection.after_time(yesterday_balance.created_at)
      minus_amounts_exchange = sell_actions.after_time(yesterday_balance.created_at)
      if plus_amounts.any? || minus_amounts.any? || plus_amounts_exchange.any? || minus_amounts_exchange.any?
        yesterday_balance.interim_balance + plus_amounts.sum(:amount) + plus_amounts_exchange.sum(:buy_amount) - minus_amounts.sum(:amount) - minus_amounts_exchange.sum(:sell_amount)
      else
        yesterday_balance.interim_balance
      end
    elsif last_balance = balances.last
      plus_amounts = cashdesk_actions.replenishment.after_time(last_balance.created_at)
      plus_amounts_exchange = buy_actions.after_time(last_balance.created_at)
      minus_amounts = cashdesk_actions.collection.after_time(last_balance.created_at)
      minus_amounts_exchange = sell_actions.after_time(last_balance.created_at)
      current_amount = if plus_amounts.any? || minus_amounts.any? || plus_amounts_exchange.any? || minus_amounts_exchange.any?
        last_balance.interim_balance + plus_amounts.sum(:amount) + plus_amounts_exchange.sum(:buy_amount) - minus_amounts.sum(:amount) - minus_amounts_exchange.sum(:sell_amount)
      else
        last_balance.interim_balance
      end
      balances.create(interim_balance: current_amount)
      current_amount
    else
      plus_amounts = cashdesk_actions.replenishment.sum(:amount)
      plus_amounts_exchange = buy_actions.sum(:buy_amount)
      minus_amounts = cashdesk_actions.collection.sum(:amount)
      minus_amounts_exchange = sell_actions.sum(:sell_amount)
      current_amount = plus_amounts + plus_amounts_exchange - minus_amounts - minus_amounts_exchange
      balances.create(interim_balance: current_amount)
      current_amount
    end
  end

end
