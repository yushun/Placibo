class Inspira < ActiveRecord::Base
  attr_accessible :message
  
  has_reputation :votes, source: :user, aggregated_by: :sum
end
