# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[8.1].define(version: 2026_10_15_114334) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "pg_catalog.plpgsql"

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.bigint "record_id", null: false
    t.bigint "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.string "service_name", null: false
    t.bigint "byte_size", null: false
    t.string "checksum"
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "active_storage_variant_records", force: :cascade do |t|
    t.bigint "blob_id", null: false
    t.string "variation_digest", null: false
    t.index ["blob_id", "variation_digest"], name: "index_active_storage_variant_records_uniqueness", unique: true
  end

  create_table "job_postings", force: :cascade do |t|
    t.bigint "employer_id", null: false
    t.string "title", null: false
    t.text "description", null: false
    t.text "requirements"
    t.string "status", default: "draft", null: false
    t.string "embedding_status", default: "pending", null: false
    t.float "embedding", default: [], array: true
    t.text "error_message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["embedding_status"], name: "index_job_postings_on_embedding_status"
    t.index ["employer_id"], name: "index_job_postings_on_employer_id"
    t.index ["status"], name: "index_job_postings_on_status"
  end

  create_table "matches", force: :cascade do |t|
    t.bigint "job_posting_id", null: false
    t.bigint "resume_id", null: false
    t.float "score", null: false
    t.text "explanation"
    t.datetime "explanation_generated_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["job_posting_id", "resume_id"], name: "index_matches_on_job_posting_id_and_resume_id", unique: true
    t.index ["job_posting_id"], name: "index_matches_on_job_posting_id"
    t.index ["resume_id"], name: "index_matches_on_resume_id"
    t.index ["score"], name: "index_matches_on_score"
  end

  create_table "resumes", force: :cascade do |t|
    t.bigint "candidate_id", null: false
    t.string "source_type", default: "file", null: false
    t.string "status", default: "pending", null: false
    t.text "source_text"
    t.text "raw_text"
    t.float "embedding", default: [], array: true
    t.text "error_message"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["candidate_id"], name: "index_resumes_on_candidate_id", unique: true
    t.index ["status"], name: "index_resumes_on_status"
  end

  create_table "users", force: :cascade do |t|
    t.string "email"
    t.string "password_digest"
    t.string "role", default: "candidate", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["email"], name: "index_users_on_email", unique: true
  end

  add_foreign_key "active_storage_attachments", "active_storage_blobs", column: "blob_id"
  add_foreign_key "active_storage_variant_records", "active_storage_blobs", column: "blob_id"
  add_foreign_key "job_postings", "users", column: "employer_id"
  add_foreign_key "matches", "job_postings"
  add_foreign_key "matches", "resumes"
  add_foreign_key "resumes", "users", column: "candidate_id"
end
