class ResumeEmbeddingJob < ApplicationJob
  queue_as :default

  def perform(resume_id)
    resume = Resume.find(resume_id)
    resume.update!(status: :processing, error_message: nil)

    text = ResumeTextExtractorService.new(resume).extract
    embedding = EmbeddingService.new.embed_document(text)
    resume.update!(raw_text: text, embedding: embedding, status: :completed)

    MatchGenerationJob.perform_later(resume_id: resume.id)
  rescue => e
    resume&.update(status: :failed, error_message: e.message)
    raise
  end
end
