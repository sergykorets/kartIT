Rails.application.routes.draw do
  root 'currencies#index'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  devise_for :users, :controllers => { registrations: 'registrations',
                                       omniauth_callbacks: 'omniauth_callbacks' }
  resources :actions
  resources :versions, only: :index
  resources :transactions, only: :index
  resources :currencies do
    member do
      post :cashdesk
      post :exchange
    end
    collection do
      post :change_rates
    end
  end
  get 'reactivate/edit', 'reactivate#edit'
  put 'reactivate/update', 'reactivate#update'
end