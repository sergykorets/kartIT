class RacesController < ApplicationController

  def index
    @races = Race.where(season: '2019').map do |race|
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
end