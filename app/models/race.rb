class Race < ApplicationRecord
  has_many :race_standings
  has_many :photos
  has_many :users, through: :race_standings
  belongs_to :best_lap_user, class_name: 'User', foreign_key: :best_lap_user_id

  enum season: ['2019', '2020']
  enum track: [:one, :one_r, :two, :two_r, :tree, :tree_r, :four, :four_r, :five, :five_r, :six, :six_r,
                       :seven, :seven_r, :eight, :eight_r, :nine, :nine_r, :ten, :ten_r, :eleven, :eleven_r,
                       :twelve, :twelve_r, :thirteen, :thirteen_r, :fourteen, :fourteen_r, :fifteen, :fifteen_r]
  enum weather: [:sunny, :cloudy, :rain]

  scope :in_season, ->(season) {where(season: season)}

  def title
    "#{number} (#{season})"
  end
end