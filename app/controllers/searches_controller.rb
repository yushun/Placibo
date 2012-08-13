class SearchesController < ApplicationController

  def new
	text = "http://www.google.com/search?hl=en&btnI=I%27m+Feeling+Lucky&q="+ CGI::escape(params[:search])
	redirect_to text
  end
  
end
