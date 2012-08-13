class CreateInspiras < ActiveRecord::Migration
  def change
    create_table :inspiras do |t|
      t.string :message

      t.timestamps
    end
  end
end
