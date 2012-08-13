class PagesController < ApplicationController
  def home
    session["user"] = User.first
    @images = Dir.glob('public/images/background/*')
    @welcome_image = "/images/welcome_pic.jpeg"
    @create_image = "/images/create.png"
    @search_text = 'Search'
    @inspiras = Inspira.find_with_reputation(:votes, :all, order: "votes desc")
  end
end
