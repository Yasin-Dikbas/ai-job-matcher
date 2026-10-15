class Match < ApplicationRecord
  belongs_to :job_posting
  belongs_to :resume

  validates :score, presence: true
  validates :resume_id, uniqueness: { scope: :job_posting_id }

  def explained?
    explanation.present?
  end
end
