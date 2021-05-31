class PagesController < ApplicationController

  def index
    banner = Banner.first
    @banner = {
        race_date: banner.next_race_date.strftime('%d.%m.%Y %H:%M'),
        circuit: banner.circuit,
        register: banner.register}
    @admin = current_user&.admin?
    @logged = current_user.present?
  end

  def standings
    @admin = current_user&.admin?
    @races = Race.in_season(params[:season] || '2021').past.count
    @seasons = Race.seasons.keys
    @standings = User.in_season(params[:season] || '2021').map do |user|
      stat = user.points_in_season(params[:season] || '2021')
      { id: user.id,
        racer: user.name,
        avatar: user.avatar,
        company: user.company,
        specialization: user.specialization,
        points: stat[:total_points],
        races: stat[:races],
        min_race: stat[:min_race]
      }
    end.sort_by {|s| s[:points]}.reverse
    respond_to do |format|
      format.html { render :standings }
      format.json {{standings: @standings, admin: @admin, races: @races}}
    end
  end

  def regulations

  end
end