class CreateBanners < ActiveRecord::Migration[5.1]
  def change
    create_table :banners do |t|
      t.datetime :next_race_date
    end
  end
end
