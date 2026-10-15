require "faraday"

# Asks Gemini to explain, in Turkish, why a job posting and a candidate's
# resume do or don't match — called lazily (only when a user opens a
# specific match's detail), since unlike the cosine-similarity score this
# costs an LLM call. See Match#explanation.
class MatchExplanationService
  API_BASE = "https://generativelanguage.googleapis.com/v1beta/"

  def initialize(model: ENV.fetch("GEMINI_CHAT_MODEL", "gemini-2.5-flash"))
    @api_key = ENV.fetch("GEMINI_API_KEY")
    @model = model
  end

  def explain(job_posting:, resume:, score:)
    response = connection.post("models/#{@model}:generateContent") do |req|
      req.params["key"] = @api_key
      req.body = {
        system_instruction: { parts: [ { text: system_prompt } ] },
        contents: [ { role: "user", parts: [ { text: user_prompt(job_posting, resume, score) } ] } ],
        generationConfig: { temperature: 0.3 }
      }
    end

    raise "Gemini API error (#{response.status}): #{response.body}" unless response.success?

    response.body.dig("candidates", 0, "content", "parts", 0, "text").to_s.strip
  end

  private

  def system_prompt
    <<~PROMPT
      Sen bir işe alım asistanısın. Sana bir iş ilanı ile bir adayın özgeçmişi
      verilecek. Görevin, bu ikisinin ne kadar uyumlu olduğunu 2-4 cümlelik
      Türkçe bir açıklamayla anlatmak.

      Somut ol: ilanda istenen ve CV'de geçen beceri/deneyim örtüşmelerini
      ("React ve Rails deneyimi örtüşüyor" gibi) ve varsa önemli eksiklikleri
      ("ilan 5+ yıl deneyim istiyor, CV'de 2 yıl görünüyor" gibi) açıkça belirt.
      Sadece verilen metinlere dayan, uydurma bilgi verme. Markdown kullanma,
      düz metin yaz.
    PROMPT
  end

  def user_prompt(job_posting, resume, score)
    <<~PROMPT
      Benzerlik skoru: %#{(score * 100).round}

      İlan: #{job_posting.title}
      #{job_posting.description}
      #{job_posting.requirements.presence}

      Aday özgeçmişi:
      #{resume.raw_text}
    PROMPT
  end

  def connection
    Faraday.new(url: API_BASE) do |f|
      f.request :json
      f.response :json
      f.adapter Faraday.default_adapter
    end
  end
end
