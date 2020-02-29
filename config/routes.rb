Rails.application.routes.draw do
  root 'currencies#index'

  mount RailsAdmin::Engine => '/admin', as: 'rails_admin'

  devise_for :users, :controllers => { registrations: 'registrations',
                                       omniauth_callbacks: 'omniauth_callbacks' }
  resources :actions
  resources :versions, only: :index
  resources :transactions, only: :index do
    member do
      patch :cancel
    end
  end
  resources :currencies do
    member do
      post :cashdesk
    end
    collection do
      post :change_rates
      post :exchange
    end
  end
  get 'reactivate/edit', 'reactivate#edit'
  put 'reactivate/update', 'reactivate#update'
  patch 'users/submit_new_rates_acknowledgment', 'users#submit_new_rates_acknowledgment'
end