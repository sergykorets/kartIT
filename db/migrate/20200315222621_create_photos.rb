class CreatePhotos < ActiveRecord::Migration[5.1]
  def change
    create_table :photos do |t|
      t.attachment :picture
      t.string :picture_url
      t.integer :race_id
      t.string :comment
    end
  end
end
