class InspirasController < ApplicationController
  def vote
    value = params[:type] == "up" ? 1: -1
    @inspira = Inspira.find(params[:id])
    @inspira.add_or_update_evaluation(:votes, value, session["user"])
    redirect_to :back, notice: "Thank you for voting"
  end
end