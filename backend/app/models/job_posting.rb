class JobPosting < ApplicationRecord
  include Embeddable

  belongs_to :employer, class_name: "User"
  has_many :matches, dependent: :destroy

  enum :status, { draft: "draft", active: "active", closed: "closed" }, default: "draft", validate: true
  enum :embedding_status, { pending: "pending", processing: "processing", completed: "completed", failed: "failed" },
    default: "pending", validate: true, prefix: :embedding

  validates :title, presence: true
  validates :description, presence: true

  def embedding_text
    [ title, description, requirements ].compact_blank.join("\n\n")
  end
end
