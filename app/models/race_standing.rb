class RaceStanding < ApplicationRecord
  belongs_to :race
  belongs_to :user, optional: true

  validates_uniqueness_of :user_id, scope: :race_id

  def points(season, place)
    table = {
        1 => [30,50],
        2 => [25,45],
        3 => [22,40],
        4 => [20,37],
        5 => [18,34],
        6 => [16,32],
        7 => [15,30],
        8 => [14,28],
        9 => [13,26],
        10 => [12,25],
        11 => [10,20],
        12 => [9,19],
        13 => [8,18],
        14 => [7,17],
        15 => [6,16],
        16 => [5,15],
        17 => [4,14],
        18 => [3,13],
        19 => [2,12],
        20 => [1,11],
        21 => [0,10],
        22 => [0, 9],
        23 => [0, 8],
        24 => [0, 7],
        25 => [0, 6],
        26 => [0, 5],
        27 => [0, 4],
        28 => [0, 3],
        29 => [0, 2],
        30 => [0, 1]
    }
    (season != '2020' ? table[place].try(:first) : table[place].try(:last)) || 0
  end
end