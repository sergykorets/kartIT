class UsersController < ApplicationController

  def info
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