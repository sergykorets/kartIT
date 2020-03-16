class RacesController < ApplicationController

  def index
    @races = Race.where(season: '2019').map do |race|
      { id: race.id,
        number: race.number,
        date: race.date.strftime('%d.%m.%Y %H:%M'),
        avatar: race.photos&.first&.picture.present? ? race.photos&.first&.picture : race.photos&.first&.picture_url,
        weather: race.weather,
        season: race.season,
        configuration: race.track
      }
    end
  end

  def show
    race = Race.find(params[:id])
    @race = { id: race.id,
              number: race.number,
              date: race.date.strftime('%d.%m.%Y %H:%M'),
              avatar: race.photos&.first&.picture,
              weather: race.weather,
              season: race.season,
              configuration: race.track,
              photos: race.photos.map {|p| p.picture.present? ? p.picture : p.picture_url},
              standings: race.race_standings.order(:place).map do |s|
                { place: s.place,
                  name: s.user&.full_name || s.name,
                  company: s.user&.company || s.company,
                  specialization: s.user&.specialization || s.specialization,
                  points: s.points(race.season, s.place)
                }
              end
    }
  end
end