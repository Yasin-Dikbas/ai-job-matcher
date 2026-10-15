require "pdf-reader"

class ResumeTextExtractorService
  class ExtractionError < StandardError; end

  def initialize(resume)
    @resume = resume
  end

  def extract
    return @resume.source_text if @resume.text?

    raise ExtractionError, "Dosya eklenmemiş" unless @resume.file.attached?

    case @resume.file.content_type
    when "application/pdf"
      extract_pdf
    else
      @resume.file.download.force_encoding("UTF-8").scrub
    end
  end

  private

  def extract_pdf
    @resume.file.open do |tempfile|
      reader = PDF::Reader.new(tempfile.path)
      text = reader.pages.map(&:text).join("\n\n")
      raise ExtractionError, "PDF'ten metin çıkarılamadı (muhtemelen taranmış görüntü)" if text.strip.empty?
      text
    end
  rescue PDF::Reader::MalformedPDFError => e
    raise ExtractionError, "Geçersiz veya bozuk PDF: #{e.message}"
  end
end
