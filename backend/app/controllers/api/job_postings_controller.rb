module Api
  class JobPostingsController < ApplicationController
    before_action :require_employer!
    before_action :set_job_posting, only: [ :show, :update, :destroy ]

    # GET /api/job_postings
    def index
      render json: current_user.job_postings.order(created_at: :desc).map { |jp| job_posting_json(jp) }
    end

    # POST /api/job_postings
    def create
      job_posting = current_user.job_postings.new(job_posting_params.reverse_merge(status: "active"))

      if job_posting.save
        JobPostingEmbeddingJob.perform_later(job_posting.id)
        render json: job_posting_json(job_posting), status: :created
      else
        render json: { errors: job_posting.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # GET /api/job_postings/:id
    def show
      render json: job_posting_json(@job_posting)
    end

    # PATCH /api/job_postings/:id
    def update
      if @job_posting.update(job_posting_params)
        render json: job_posting_json(@job_posting)
      else
        render json: { errors: @job_posting.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/job_postings/:id
    def destroy
      @job_posting.destroy
      head :no_content
    end

    private

    def set_job_posting
      @job_posting = current_user.job_postings.find(params[:id])
    end

    def job_posting_params
      params.permit(:title, :description, :requirements, :status)
    end

    def job_posting_json(job_posting)
      {
        id: job_posting.id,
        title: job_posting.title,
        description: job_posting.description,
        requirements: job_posting.requirements,
        status: job_posting.status,
        embedding_status: job_posting.embedding_status,
        error_message: job_posting.error_message,
        matches_count: job_posting.matches.count,
        created_at: job_posting.created_at
      }
    end
  end
end
