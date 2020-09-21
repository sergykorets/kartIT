class ItRacingMailer < ApplicationMailer
  default from: 'karting.it.racing@gmail.com'

  def next_race_notifier
    @next_race = Race.last.date.strftime("%d.%m.%Y %H:%M")
    users = User.where("email NOT ILIKE ?", 'racer%user.com').collect(&:email).join(", ")
    mail(to: users, subject: "Наступна гонка ІТ Racing (#{@next_race})")
  end

end