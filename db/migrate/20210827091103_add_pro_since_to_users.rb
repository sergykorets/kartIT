class AddProSinceToUsers < ActiveRecord::Migration[5.1]
  def change
    add_column :users, :pro_since, :integer
  end
end
