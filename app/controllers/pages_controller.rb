class PagesController < ApplicationController
  def home
    session["user"] = User.first
    @images = Dir.glob('public/images/*')
    @welcome_image = "/welcome_pic.jpeg"
    @search_text = 'Search'
    @inspiras = Inspira.find_with_reputation(:votes, :all, order: "votes desc")
  end
end
