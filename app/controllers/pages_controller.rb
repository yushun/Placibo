class PagesController < ApplicationController
  def home
    @images = Dir.glob('public/images/*')
    @welcome_image = "/welcome_pic.jpeg"
    @search_text = 'Search'
    @messages= ['helnksjjkfwkhgfejwewbfuwefnkjswjfe','world','this is the day','time is money', 'jump jump']
  end
end
