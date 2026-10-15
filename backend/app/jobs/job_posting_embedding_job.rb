class JobPostingEmbeddingJob < ApplicationJob
  queue_as :default

  def perform(job_posting_id)
    job_posting = JobPosting.find(job_posting_id)
    job_posting.update!(embedding_status: :processing, error_message: nil)

    embedding = EmbeddingService.new.embed_document(job_posting.embedding_text)
    job_posting.update!(embedding: embedding, embedding_status: :completed)

    MatchGenerationJob.perform_later(job_posting_id: job_posting.id)
  rescue => e
    job_posting&.update(embedding_status: :failed, error_message: e.message)
    raise
  end
end
