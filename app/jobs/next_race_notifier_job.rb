class NextRaceNotifierJob < ApplicationJob
  queue_as :default

  def perform
    User.where("email NOT ILIKE ?", '%user.com').each do |user|
      ItRacingMailer.next_race_notifier(user).deliver
    end
  end
end