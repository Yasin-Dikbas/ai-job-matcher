Rails.application.routes.draw do
  get "up" => "rails/health#show", as: :rails_health_check

  namespace :api do
    post "signup", to: "registrations#create"
    post "login", to: "sessions#create"
    get "me", to: "sessions#show"

    resources :job_postings, only: [ :index, :create, :show, :update, :destroy ] do
      resources :matches, only: [ :index ], controller: "job_posting_matches"
    end

    resource :resume, only: [ :show, :create, :destroy ]

    get "matches", to: "matches#index"
    post "matches/:id/explain", to: "matches#explain"
  end
end
