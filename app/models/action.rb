class Action < ApplicationRecord
  belongs_to :sell_currency, class_name: 'Currency', foreign_key: :currency_id_sell, optional: true
  belongs_to :buy_currency, class_name: 'Currency', foreign_key: :currency_id_buy, optional: true
  belongs_to :cashdesk_currency, class_name: 'Currency', foreign_key: :currency_id, optional: true

  enum action_type: [:exchange, :collection, :replenishment]

  scope :after_time, ->(time) { where('created_at >= ?', time) }
end
