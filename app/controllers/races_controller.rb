class RacesController < ApplicationController
  before_action :authenticate_user!, only: :check_in

  def index
    @races = Race.past.where(season: '2019').map do |race|
      { id: race.id,
        number: race.number,
        date: race.date.strftime('%d.%m.%Y %H:%M'),
        avatar: race.photos&.first&.picture.present? ? race.photos&.first&.picture : race.photos&.first&.picture_url,
        weather: race.weather,
        season: race.season,
        configuration: race.track,
        best_lap_user: {
          name: race.best_lap_user.name,
          company: race.best_lap_user.company,
          specialization: race.best_lap_user.specialization,
          time: race.best_lap
        }
      }
    end
  end

  def show
    race = Race.find(params[:id])
    @race = {
      id: race.id,
      number: race.number,
      date: race.date.strftime('%d.%m.%Y %H:%M'),
      avatar: race.photos&.first&.picture,
      weather: race.weather,
      season: race.season,
      configuration: race.track,
      best_lap_user: {
          name: race.best_lap_user.name,
          company: race.best_lap_user.company,
          specialization: race.best_lap_user.specialization,
          time: race.best_lap
      },
      photos: race.photos.map {|p| p.picture.present? ? p.picture : p.picture_url},
      standings: race.race_standings.order(:place).map do |s|
        { place: s.place,
          name: s.user&.name || s.name,
          company: s.user&.company || s.company,
          specialization: s.user&.specialization || s.specialization,
          points: s.points(race.season, s.place)
        }
      end
    }
  end

  def check_in
    race = Race.next_races.first
    check_in = RaceStanding.new(race: race, user: current_user)
    if check_in.save
      render json: {success: true}
    else
      render json: {success: false}
    end
  end

  def next_race
    race = Race.next_races.first
    @admin = current_user&.admin?
    @registered_users = RaceStanding.joins(:user).where(race_standings: {race: race}).order("race_standings.created_at").map do |s|
      { name: s.user.name,
        company: s.user.company,
        specialization: s.user.specialization,
        novice: s.user.novice,
        created_at: s.created_at.strftime('%d.%m.%Y %H:%M')
      }
    end
  end
end