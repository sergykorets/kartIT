class Action < ApplicationRecord
  belongs_to :sell_currency, class_name: 'Currency', foreign_key: :currency_id_sell, optional: true
  belongs_to :buy_currency, class_name: 'Currency', foreign_key: :currency_id_buy, optional: true
  belongs_to :cashdesk_currency, class_name: 'Currency', foreign_key: :currency_id, optional: true

  enum action_type: [:exchange, :collection, :replenishment]

  scope :after_time, ->(time) { where('created_at >= ?', time) }
  scope :not_canceled, -> { where(canceled: false) }
  scope :for_today, -> {where('created_at >= ?', Date.today.beginning_of_day)}

  validates :amount, numericality: { greater_than: 0 }, if: -> { collection? || replenishment? }
  validates :buy_amount, numericality: { greater_than: 0 }, if: -> { exchange? }
end
