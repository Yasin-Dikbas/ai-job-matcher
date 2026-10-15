class CreateMatches < ActiveRecord::Migration[8.1]
  def change
    create_table :matches do |t|
      t.references :job_posting, null: false, foreign_key: true
      t.references :resume, null: false, foreign_key: true
      t.float :score, null: false
      t.text :explanation
      t.datetime :explanation_generated_at

      t.timestamps
    end

    add_index :matches, [ :job_posting_id, :resume_id ], unique: true
    add_index :matches, :score
  end
end
