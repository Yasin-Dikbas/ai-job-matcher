module Api
  class MatchesController < ApplicationController
    before_action :require_candidate!, only: :index

    TOP_N = 20

    # GET /api/matches — candidate's own ranked job postings
    def index
      resume = current_user.resume
      matches = resume ? resume.matches.includes(:job_posting).order(score: :desc).limit(TOP_N) : []

      render json: matches.map { |m| match_json(m, counterpart: m.job_posting.title) }
    end

    # POST /api/matches/:id/explain
    def explain
      match = Match.includes(:job_posting, :resume).find(params[:id])
      return render(json: { error: "Unauthorized" }, status: :forbidden) unless authorized_for?(match)

      if match.explanation.blank?
        explanation = MatchExplanationService.new.explain(
          job_posting: match.job_posting, resume: match.resume, score: match.score
        )
        match.update!(explanation: explanation, explanation_generated_at: Time.current)
      end

      render json: match_json(match, counterpart: counterpart_label(match))
    end

    private

    def authorized_for?(match)
      match.job_posting.employer_id == current_user.id || match.resume.candidate_id == current_user.id
    end

    def counterpart_label(match)
      current_user.employer? ? match.resume.candidate.email : match.job_posting.title
    end

    def match_json(match, counterpart:)
      {
        id: match.id,
        score: match.score,
        explanation: match.explanation,
        counterpart: counterpart
      }
    end
  end
end
