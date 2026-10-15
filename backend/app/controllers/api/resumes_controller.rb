module Api
  class ResumesController < ApplicationController
    MAX_FILE_BYTES = 15.megabytes

    before_action :require_candidate!

    # GET /api/resume
    def show
      resume = current_user.resume
      resume ? render(json: resume_json(resume)) : render(json: nil)
    end

    # POST /api/resume
    def create
      current_user.resume&.destroy

      resume = build_resume

      if resume.nil?
        render json: { errors: [ "Dosya veya metin gerekli" ] }, status: :unprocessable_entity
        return
      end

      if resume.save
        ResumeEmbeddingJob.perform_later(resume.id)
        render json: resume_json(resume), status: :created
      else
        render json: { errors: resume.errors.full_messages }, status: :unprocessable_entity
      end
    end

    # DELETE /api/resume
    def destroy
      current_user.resume&.destroy
      head :no_content
    end

    private

    def build_resume
      if params[:file].present?
        build_file_resume
      elsif params[:source_text].present?
        build_text_resume
      end
    end

    def build_file_resume
      upload = params[:file]

      unless Resume::SUPPORTED_CONTENT_TYPES.include?(upload.content_type)
        return current_user.build_resume.tap { |r| r.errors.add(:file, "sadece PDF, Markdown veya metin dosyası yüklenebilir") }
      end

      if upload.size > MAX_FILE_BYTES
        return current_user.build_resume.tap { |r| r.errors.add(:file, "15 MB'tan büyük olamaz") }
      end

      Resume.new(candidate: current_user, source_type: :file).tap { |r| r.file.attach(upload) }
    end

    def build_text_resume
      Resume.new(candidate: current_user, source_type: :text, source_text: params[:source_text])
    end

    def resume_json(resume)
      {
        id: resume.id,
        source_type: resume.source_type,
        status: resume.status,
        error_message: resume.error_message,
        char_count: resume.raw_text&.length,
        created_at: resume.created_at
      }
    end
  end
end
