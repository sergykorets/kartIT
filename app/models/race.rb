class Race < ApplicationRecord
  has_many :race_standings
  has_many :photos
  has_many :users, through: :race_standings

  enum season: ['2019', '2020']
  enum track: [:one, :one_r, :two, :two_r, :tree, :tree_r, :four, :four_r, :five, :five_r, :six, :six_r,
                       :seven, :seven_r, :eight, :eight_r, :nine, :nine_r, :ten, :ten_r, :eleven, :eleven_r,
                       :twelve, :twelve_r, :thirteen, :thirteen_r, :fourteen, :fourteen_r, :fifteen, :fifteen_r]
  enum weather: [:sunny, :cloudy, :rain]

end