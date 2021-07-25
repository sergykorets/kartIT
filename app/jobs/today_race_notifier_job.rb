class TodayRaceNotifierJob < ApplicationJob
  queue_as :default

  def perform
    User.where("email NOT ILIKE ?", '%user.com').each do |user|
      ItRacingMailer.today_race_notifier(user).deliver
    end
  end
end