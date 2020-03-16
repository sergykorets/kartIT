class Photo < ApplicationRecord
  belongs_to :race

  has_attached_file :picture
  validates_attachment_content_type :picture, content_type: /\Aimage\/.*\z/

end