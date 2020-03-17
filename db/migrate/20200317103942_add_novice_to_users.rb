class AddNoviceToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :novice, :boolean, default: true
  end
end
