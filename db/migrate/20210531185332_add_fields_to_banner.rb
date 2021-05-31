class AddFieldsToBanner < ActiveRecord::Migration[5.1]
  def change
    add_column :banners, :circuit, :string
    add_column :banners, :register, :string
  end
end
