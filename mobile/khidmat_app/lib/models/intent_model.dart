class IntentModel {
  final String originalQuery;
  final String language;
  final String detectedCategory;
  final String detectedArea;
  final double confidenceScore;
  final String slotNote;
  final String suggestedSlot;

  IntentModel({
    required this.originalQuery,
    required this.language,
    required this.detectedCategory,
    required this.detectedArea,
    required this.confidenceScore,
    required this.slotNote,
    required this.suggestedSlot,
  });

  factory IntentModel.fromJson(Map<String, dynamic> json) {
    return IntentModel(
      originalQuery: json['original_query']?.toString() ?? '',
      language: json['language']?.toString() ?? 'english',
      detectedCategory:
          json['detected_category']?.toString() ??
          json['category']?.toString() ??
          '',
      detectedArea:
          json['detected_area']?.toString() ??
          json['area']?.toString() ??
          'F-8',
      confidenceScore: (json['confidence_score'] as num?)?.toDouble() ?? 0.95,
      slotNote: json['slot_note']?.toString() ?? '',
      suggestedSlot: json['suggested_slot']?.toString() ?? '3PM',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'original_query': originalQuery,
      'language': language,
      'detected_category': detectedCategory,
      'detected_area': detectedArea,
      'confidence_score': confidenceScore,
      'slot_note': slotNote,
      'suggested_slot': suggestedSlot,
    };
  }
}
