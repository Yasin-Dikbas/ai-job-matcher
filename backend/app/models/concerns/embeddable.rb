# Shared by JobPosting and Resume: both store a single whole-document Gemini
# embedding (no chunking, unlike the RAG chatbot project) and are compared to
# each other with plain Ruby cosine similarity in place of pgvector.
module Embeddable
  extend ActiveSupport::Concern

  def cosine_similarity(other_vector)
    return 0.0 if embedding.blank? || other_vector.blank?

    dot = embedding.each_with_index.sum { |v, i| v * other_vector[i].to_f }
    magnitude_a = Math.sqrt(embedding.sum { |v| v * v })
    magnitude_b = Math.sqrt(other_vector.sum { |v| v * v })
    return 0.0 if magnitude_a.zero? || magnitude_b.zero?

    dot / (magnitude_a * magnitude_b)
  end
end
