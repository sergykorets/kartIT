class CreateRaceStandings < ActiveRecord::Migration[5.1]
  def change
    create_table :race_standings do |t|
      t.integer :place
      t.integer :user_id
      t.integer :race_id
      t.string :name
      t.string :company
      t.string :specialization
    end
  end
end
