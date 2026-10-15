module Api
  # Employer-side view: ranked candidates for one of the employer's own job
  # postings. Candidate-side ranking (jobs matched to a resume) lives in
  # MatchesController#index.
  class JobPostingMatchesController < ApplicationController
    before_action :require_employer!

    TOP_N = 20

    # GET /api/job_postings/:job_posting_id/matches
    def index
      job_posting = current_user.job_postings.find(params[:job_posting_id])
      matches = job_posting.matches.includes(resume: :candidate).order(score: :desc).limit(TOP_N)

      render json: matches.map { |m| match_json(m, counterpart: m.resume.candidate.email) }
    end

    private

    def match_json(match, counterpart:)
      {
        id: match.id,
        score: match.score,
        explanation: match.explanation,
        counterpart: counterpart,
        resume_status: match.resume.status
      }
    end
  end
end
