class Resume < ApplicationRecord
  include Embeddable

  SUPPORTED_CONTENT_TYPES = %w[application/pdf text/markdown text/plain].freeze

  belongs_to :candidate, class_name: "User"
  has_many :matches, dependent: :destroy
  has_one_attached :file

  enum :source_type, { file: "file", text: "text" }, default: "file", validate: true
  enum :status, { pending: "pending", processing: "processing", completed: "completed", failed: "failed" },
    default: "pending", validate: true

  validates :source_text, presence: true, if: -> { text? }
  validate :file_attached_for_file_source

  private

  def file_attached_for_file_source
    errors.add(:file, "bir dosya veya metin gerekli") if file? && !file.attached? && new_record?
  end
end
