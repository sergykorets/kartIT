class AddChampionshipsToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :championships, :text, array: true, default: []
  end
end
