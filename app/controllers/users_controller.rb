class UsersController < ApplicationController

  def send_emails
    NextRaceNotifierJob.perform_later
    redirect_to root_path
  end

  def info
    @admin = current_user&.admin?
    user = User.find_by(id: params[:id])
    @info = {
        name: user.name,
        company: user.company,
        avatar: user.avatar.url,
        specialization: user.specialization,
        wins: user.places(1),
        podiums: user.places(3),
        finals: user.places(10),
        best_laps: user.best_laps,
        championships: user.championships,
        best_place: user.edge_place('min'),
        worst_place: user.edge_place('max'),
        races_count: user.races_count,
        races: user.races.past.order('date DESC').map do |r|
          {
              id: r.id,
              number: r.number,
              season: r.season,
              picture: r.photos&.first&.picture.present? ? r.photos&.first&.picture : r.photos&.first&.picture_url
          }
        end
    }
  end
end