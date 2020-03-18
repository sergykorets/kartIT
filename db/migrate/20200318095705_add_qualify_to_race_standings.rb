class AddQualifyToRaceStandings < ActiveRecord::Migration[5.1]
  def change
    add_column :race_standings, :qualify_group, :integer
  end
end
