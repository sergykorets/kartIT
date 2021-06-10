class RacesController < ApplicationController
  before_action :authenticate_user!, only: :check_in
  before_action :set_next_race, only: [:check_in, :next_race, :group_qualify, :grouped_qualify]

  def index
    @admin = current_user&.admin?
    @seasons = Race.seasons.keys
    @races = Race.past.order('date DESC').where(season: params[:season] || '2021').map do |race|
      { id: race.id,
        number: race.number,
        date: race.date.strftime('%d.%m.%Y %H:%M'),
        avatar: race.photos&.first&.picture.present? ? race.photos&.first&.picture : race.photos&.first&.picture_url,
        weather: race.weather,
        season: race.season,
        configuration: race.track,
        best_lap_user: {
          name: race.best_lap_user&.name,
          company: race.best_lap_user&.company,
          specialization: race.best_lap_user&.specialization,
          time: race.best_lap
        }
      }
    end
    respond_to do |format|
      format.html { render :index }
      format.json {{races: @races, admin: @admin }}
    end
  end

  def show
    @admin = current_user&.admin?
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
          name: race.best_lap_user&.name,
          company: race.best_lap_user&.company,
          specialization: race.best_lap_user&.specialization,
          time: race.best_lap
      },
      photos: race.photos.map {|p| p.picture.present? ? p.picture : p.picture_url},
      standings: race.race_standings.order(:place).map do |s|
        { place: s.place,
          name: s.user&.name || s.name,
          avatar: s.user.avatar,
          user_id: s.user&.id,
          company: s.user&.company || s.company,
          specialization: s.user&.specialization || s.specialization,
          points: s.points(race.season, s.place) + (s.user_id == race.best_lap_user_id ? 1 : 0)
        }
      end
    }
  end

  def check_in
    check_in = RaceStanding.new(race: @next_race, user: current_user)
    if check_in.save
      render json: {success: true}
    else
      render json: {success: false}
    end
  end

  def next_race
    @admin = current_user&.admin?
    @grouped = @next_race.qualify_grouped
    @registered_users = RaceStanding.joins(:user).where(race_standings: {race: @next_race}).order("race_standings.created_at").map do |s|
      { id: s.user.id,
        name: s.user.name,
        avatar: s.user.avatar,
        company: s.user.company,
        specialization: s.user.specialization,
        races: s.user.race_standings.count - 1,
        created_at: s.created_at.strftime('%d.%m.%Y %H:%M')
      }
    end
  end

  def grouped_qualify
    @users = @next_race.race_standings.map do |s|
      { name: s.user.name,
        company: s.user.company,
        specialization: s.user.specialization,
        group: s.qualify_group
      }
    end.group_by { |s| s[:group] }.values
  end

  def group_qualify
    unless @next_race.qualify_grouped
      group = params[:group].to_i
      randomized_order = @next_race.race_standings.order("RANDOM()")
      randomized_order.each_with_index do |s, i|
        qualify_group = (i / group).floor + 1
        s.update_column(:qualify_group, qualify_group)
      end
      @next_race.update_column(:qualify_grouped, true)
    end
    redirect_to grouped_qualify_races_path
  end

  private

  def set_next_race
    @next_race = Race.next_races.first
  end
end