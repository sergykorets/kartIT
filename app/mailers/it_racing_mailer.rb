class ItRacingMailer < ApplicationMailer
  default from: 'karting.it.racing@gmail.com'

  def next_race_notifier(user)
    @next_race = Race.last.date.strftime("%d.%m.%Y %H:%M")
    mail(to: user.email, subject: "Наступна гонка ІТ Racing (#{@next_race})")
  end

  def today_race_notifier(user)
    @next_race = Race.last.date.strftime("%H:%M")
    @track = Banner.first.circuit
    mail(to: user.email, subject: "Сьогодні гонка ІТ Racing")
  end
end