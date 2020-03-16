class Race < ApplicationRecord
  has_many :race_standings
  has_many :photos
  has_many :users, through: :race_standings

  enum season: ['2019', '2020']
  enum weather: [:sunny, :cloudy, :rain]

end