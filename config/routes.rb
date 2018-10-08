Rails.application.routes.draw do
  root 'hotels#index'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  devise_for :users, :controllers => { registrations: 'registrations',
                                       sessions: 'sessions',
                                       omniauth_callbacks: 'omniauth_callbacks' }
  resources :hotels do
    resources :reviews
    resources :photos
    end
  resources :restaurants, only: :index
  get 'reactivate/edit', 'reactivate#edit'
  put 'reactivate/update', 'reactivate#update'
end