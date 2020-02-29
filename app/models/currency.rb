class Currency < ApplicationRecord
  has_many :sell_actions, class_name: 'Action', foreign_key: :currency_id_sell
  has_many :buy_actions, class_name: 'Action', foreign_key: :currency_id_buy
  has_many :cashdesk_actions, class_name: 'Action', foreign_key: :currency_id
  has_many :balances

  has_paper_trail only: [:buy_price, :sell_price], on: :update, versions: { class_name: 'Version' }

  def get_current_amount
    if last_balance = balances.last
      plus_amounts = cashdesk_actions.replenishment.after_time(last_balance.created_at.beginning_of_day)
      plus_amounts_exchange = buy_actions.not_canceled.after_time(last_balance.created_at.beginning_of_day)
      minus_amounts = cashdesk_actions.collection.after_time(last_balance.created_at.beginning_of_day)
      minus_amounts_exchange = sell_actions.not_canceled.after_time(last_balance.created_at.beginning_of_day)
      current_amount = if plus_amounts.any? || minus_amounts.any? || plus_amounts_exchange.any? || minus_amounts_exchange.any?
        last_balance.interim_balance + plus_amounts.sum(:amount) + plus_amounts_exchange.sum(:buy_amount) - minus_amounts.sum(:amount) - minus_amounts_exchange.sum(:sell_amount)
      else
        last_balance.interim_balance
      end
      balances.create(interim_balance: current_amount) unless balances.where('balances.created_at >= ?', Date.yesterday.beginning_of_day).exists?
      current_amount
    else
      plus_amounts = cashdesk_actions.replenishment.sum(:amount)
      plus_amounts_exchange = buy_actions.not_canceled.sum(:buy_amount)
      minus_amounts = cashdesk_actions.collection.sum(:amount)
      minus_amounts_exchange = sell_actions.not_canceled.sum(:sell_amount)
      current_amount = plus_amounts + plus_amounts_exchange - minus_amounts - minus_amounts_exchange
      balances.create(interim_balance: current_amount)
      current_amount
    end
  end

  def sold_today
    sell_actions.not_canceled.after_time(Date.today.beginning_of_day).sum(:sell_amount)
  end

  def bought_today
    buy_actions.not_canceled.after_time(Date.today.beginning_of_day).sum(:buy_amount)
  end
end
