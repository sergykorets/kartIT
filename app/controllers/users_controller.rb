class UsersController < ApplicationController

  def submit_new_rates_acknowledgment
    current_user.update(new_rates_acknowleged: true)
    redirect_to versions_path
  end
end