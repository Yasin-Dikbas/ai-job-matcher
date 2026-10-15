class User < ApplicationRecord
  has_secure_password

  has_many :job_postings, foreign_key: :employer_id, dependent: :destroy
  has_one :resume, foreign_key: :candidate_id, dependent: :destroy

  enum :role, { employer: "employer", candidate: "candidate" }, default: "candidate", validate: true

  normalizes :email, with: ->(email) { email.strip.downcase }

  validates :email, presence: true, uniqueness: true,
    format: { with: URI::MailTo::EMAIL_REGEXP }
  validates :password, length: { minimum: 8 }, allow_nil: true
end
