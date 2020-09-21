class NextRaceNotifierJob < ApplicationJob
  queue_as :default

  def perform
    ItRacingMailer.next_race_notifier.deliver
  end
end