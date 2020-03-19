class RegistrationsController < Devise::RegistrationsController

  def edit
    @admin = current_user&.admin?
    @info = {
        name: @user.name,
        company: @user.company,
        avatar: @user.avatar.url,
        specialization: @user.specialization,
        wins: @user.places(1),
        podiums: @user.places(3),
        finals: @user.places(10),
        best_laps: @user.best_laps,
        championships: @user.championships,
        best_place: @user.edge_place('min'),
        worst_place: @user.edge_place('max'),
        races_count: @user.races_count,
        races: @user.races.past.order('date DESC').map do |r|
          {
              id: r.id,
              number: r.number,
              season: r.season,
              picture: r.photos&.first&.picture.present? ? r.photos&.first&.picture : r.photos&.first&.picture_url
          }
        end
    }
    super
  end

  protected

  def update_resource(resource, params)
    resource.update_without_password(params.except("current_password"))
  end

  private

  def sign_up_params
    params.require(:user).permit(:first_name, :email, :password, :password_confirmation, :remote_avatar_url, :last_name, :company, :specialization, :avatar)
  end

  def account_update_params
    params.require(:user).permit(:first_name, :email, :avatar, :password, :password_confirmation, :remote_avatar_url, :last_name, :company, :specialization)
  end
end