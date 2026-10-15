class CreateResumes < ActiveRecord::Migration[8.1]
  def change
    create_table :resumes do |t|
      t.references :candidate, null: false, foreign_key: { to_table: :users }, index: { unique: true }
      t.string :source_type, default: "file", null: false
      t.string :status, default: "pending", null: false
      t.text :source_text
      t.text :raw_text
      t.float :embedding, array: true, default: []
      t.text :error_message

      t.timestamps
    end

    add_index :resumes, :status
  end
end
