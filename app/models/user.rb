class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  has_attached_file :avatar, styles: { medium: "200x200#", thumb: "100x100#" }, default_url: "/images/missing.jpg"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  has_many :race_standings
  has_many :races, through: :race_standings

  enum role: [:racer, :admin, :manager]

  scope :in_season, ->(season) {joins(:races).where(races: {season: season}).uniq}

  validates_presence_of :name, :last_name, :company, :specialization

  def self.find_for_oauth(auth)
    user = User.where(uid: auth.uid, provider: auth.provider).first
    unless user
      user = User.create(
        uid:      auth.uid,
        provider: auth.provider,
        email:    auth.info.email,
        name:     auth.info.name,
        password: Devise.friendly_token[0, 20],
        remote_avatar_url: auth.info.image)
    end
    user
  end

  def self.new_with_session(params, session)
    super.tap do |user|
      if data = session["devise.facebook_data"] && session["devise.facebook_data"]["extra"]["raw_info"]
        user.email = data["email"] if user.email.blank?
      end
    end
  end

  def password_required?
    super && provider.blank?
  end

  def update_without_password(params, *options)
    if params[:password].blank?
      params.delete(:password)
      params.delete(:password_confirmation) if params[:password_confirmation].blank?
    end
    result = update_attributes(params, *options)
    clean_up_passwords
    result
  end

  def soft_delete
    update_attribute(:deleted_at, Time.current)
  end

  def name
    "#{first_name} #{last_name}"
  end

  def points_in_season(season)
    sum = []
    race_standings.joins(:race).where(races: {season: season}).each do |s|
      sum << s.points(season, s.place)
    end
    sum.sum - sum.min
  end
end