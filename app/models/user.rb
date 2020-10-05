class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable and :omniauthable
  devise :database_authenticatable, :registerable, :omniauthable,
         :recoverable, :rememberable, :trackable, :validatable

  has_attached_file :avatar, styles: { medium: "200x200#", thumb: "100x100#" }, default_url: "/images/missing.jpg"
  validates_attachment_content_type :avatar, content_type: /\Aimage\/.*\z/

  has_many :race_standings
  has_many :races, through: :race_standings
  has_many :best_lap_races, class_name: 'Race', foreign_key: :best_lap_user_id

  enum role: [:racer, :admin, :manager]

  scope :in_season, ->(season) {joins(:races).where(races: {season: season}).uniq}

  validates_presence_of :first_name, :last_name, :company, :specialization

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
    races = {}
    race_standings.joins(:race).where(races: {season: season}).where("date < ?", Date.today).each do |s|
      is_best_lap = s.race.best_lap_user_id == s.user.id
      races[s.race.number] = {
          id: s.race.id,
          number: s.race.number,
          place: s.place,
          points: is_best_lap ? s.points(season, s.place) + 1 : s.points(season, s.place),
          best_lap: is_best_lap
      }
    end
    total_points = if races.compact.any?
      season_races = Race.in_season(season).past.count
      min_points = races.values.size < season_races ? 0 : races.values.map {|r| r[:points]}.min
      min_race = races.values.detect {|r| r[:points] == min_points}.try(:[], :number)
      if (races.values.size < season_races) || season_races == 1
        races.values.map {|r| r[:points]}.sum
      else
        races.values.map {|r| r[:points]}.sum - min_points
      end
    else
      0
    end
    {total_points: total_points, races: races, min_race: min_race}
  end

  def places(place, season = 'all')
    if season == 'all'
      race_standings.where("race_standings.place <= ?", place).count
    else
      race_standings.joins(:race).where(races: {season: season}).where("race_standings.place <= ?", place).count
    end
  end

  def best_laps(season = 'all')
    if season == 'all'
      best_lap_races.count
    else
      best_lap_races.where(races: {season: season}).count
    end
  end

  def edge_place(place, season = 'all')
    if season == 'all'
      race_standings.pluck(:place).compact.public_send(place)
    else
      race_standings.joins(:race).where(races: {season: season}).pluck(:place).compact.public_send(place)
    end
  end

  def races_count(season = 'all')
    if season == 'all'
      races.past.count
    else
      races.past.where(season: season).count
    end
  end
end