class CreateRaces < ActiveRecord::Migration[5.1]
  def change
    create_table :races do |t|
      t.integer :number
      t.integer :season
      t.datetime :date
      t.integer :configuration
      t.integer :weather
      t.decimal :best_lap
      t.integer :best_lap_user_id
    end
  end
end
