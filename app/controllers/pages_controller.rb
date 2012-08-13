class PagesController < ApplicationController
  def home
    @images = Dir.glob('public/images/*')
    @welcome_image = "/welcome_pic.jpeg"
    @search_text = 'Search'
    @inspiras = Inspira.all
  end
end
