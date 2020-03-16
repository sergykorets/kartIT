class ChangeColumns < ActiveRecord::Migration[5.1]
  def change
    rename_column :users, :name, :first_name
    rename_column :races, :configuration, :track
  end
end
