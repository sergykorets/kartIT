class AddQualifyGroupedToRaces < ActiveRecord::Migration[5.1]
  def change
    add_column :races, :qualify_grouped, :boolean, default: false
  end
end
