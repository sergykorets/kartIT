Rails.application.routes.draw do
  root 'pages#index'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  devise_for :users, :controllers => { registrations: 'registrations', omniauth_callbacks: 'omniauth_callbacks' }
  resources :races, only: [:index, :show] do
    collection do
      post :check_in
      get :next_race
      get :grouped_qualify
      post :group_qualify
    end
  end

  get 'racer/:id', to: 'users#info'
  get 'pages', to: 'pages#index'
  get 'standings', to: 'pages#standings'
  get 'regulations', to: 'pages#regulations'
  get 'reactivate/edit', 'reactivate#edit'
  put 'reactivate/update', 'reactivate#update'
end