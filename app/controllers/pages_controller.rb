class PagesController < ApplicationController

  def index
    @next_race_date = Banner.first.next_race_date.strftime('%d.%m.%Y %H:%M')
  end

  def standings
    @standings = User.in_season('2019').map do |user|
      { racer: user.name,
        company: user.company,
        specialization: user.specialization,
        points: user.points_in_season('2019')
      }
    end.sort_by {|s| s[:points]}.reverse
  end

  def regulations

  end
end