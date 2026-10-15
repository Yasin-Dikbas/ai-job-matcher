class CreateJobPostings < ActiveRecord::Migration[8.1]
  def change
    create_table :job_postings do |t|
      t.references :employer, null: false, foreign_key: { to_table: :users }
      t.string :title, null: false
      t.text :description, null: false
      t.text :requirements
      t.string :status, default: "draft", null: false
      t.string :embedding_status, default: "pending", null: false
      t.float :embedding, array: true, default: []
      t.text :error_message

      t.timestamps
    end

    add_index :job_postings, :status
    add_index :job_postings, :embedding_status
  end
end
