class PagesController < ApplicationController

  def index
    @next_race_date = Banner.first&.next_race_date&.strftime('%d.%m.%Y %H:%M')
    @admin = current_user&.admin?
    @logged = current_user.present?
  end

  def standings
    @admin = current_user&.admin?
    @standings = User.in_season(params[:season] || '2020').map do |user|
      { id: user.id,
        racer: user.name,
        company: user.company,
        specialization: user.specialization,
        points: user.points_in_season(params[:season] || '2020')
      }
    end.sort_by {|s| s[:points]}.reverse
    respond_to do |format|
      format.html { render :standings }
      format.json {{standings: @standings, admin: @admin }}
    end
  end

  def regulations

  end
end