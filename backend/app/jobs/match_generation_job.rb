# Recomputes Match scores (plain Ruby cosine similarity, no pgvector — see
# README) whenever a job posting or a resume gets a fresh embedding. Scoring
# is cheap so it runs eagerly for every relevant pair; the LLM explanation is
# expensive so it stays nil here and is generated lazily on demand
# (MatchExplanationService, triggered from MatchesController#explain).
class MatchGenerationJob < ApplicationJob
  queue_as :default

  def perform(job_posting_id: nil, resume_id: nil)
    if job_posting_id
      match_job_posting(JobPosting.find(job_posting_id))
    elsif resume_id
      match_resume(Resume.find(resume_id))
    end
  end

  private

  def match_job_posting(job_posting)
    return unless job_posting.embedding_completed?

    Resume.completed.find_each do |resume|
      upsert_score(job_posting, resume)
    end
  end

  def match_resume(resume)
    return unless resume.completed?

    JobPosting.active.embedding_completed.find_each do |job_posting|
      upsert_score(job_posting, resume)
    end
  end

  def upsert_score(job_posting, resume)
    score = job_posting.cosine_similarity(resume.embedding)
    match = Match.find_or_initialize_by(job_posting: job_posting, resume: resume)
    match.score = score
    match.save!
  end
end
