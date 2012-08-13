Placibo::Application.routes.draw do
  get "pages/home"
  
  resource :searches
  resources :inspiras do
    member {post :vote}
  end
end
