class ProviderModel {
  final String id;
  final String name;
  final List<String> serviceTypes;
  final List<String> areas;
  final double rating;
  final int reviewCount;
  final String lastReviewDate;
  final double onTimeScore;
  final double cancellationRate;
  final int baseRatePerHour;
  final List<String> availabilitySlots;
  final String specializationLevel;
  final double distanceKm;
  final bool active;
  final double matchScore;
  final String availabilityType; // 'exact', 'nearest', 'none'

  ProviderModel({
    required this.id,
    required this.name,
    required this.serviceTypes,
    required this.areas,
    required this.rating,
    required this.reviewCount,
    required this.lastReviewDate,
    required this.onTimeScore,
    required this.cancellationRate,
    required this.baseRatePerHour,
    required this.availabilitySlots,
    required this.specializationLevel,
    required this.distanceKm,
    required this.active,
    this.matchScore = 0.95,
    this.availabilityType = 'exact',
  });

  factory ProviderModel.fromJson(Map<String, dynamic> json) {
    return ProviderModel(
      id: json['id']?.toString() ?? '',
      name: json['name']?.toString() ?? '',
      serviceTypes: List<String>.from(
        json['service_types'] ?? json['service_types_list'] ?? [],
      ),
      areas: List<String>.from(json['areas'] ?? []),
      rating: (json['rating'] as num?)?.toDouble() ?? 0.0,
      reviewCount: (json['review_count'] as num?)?.toInt() ?? 0,
      lastReviewDate: json['last_review_date']?.toString() ?? '',
      onTimeScore: (json['on_time_score'] as num?)?.toDouble() ?? 0.0,
      cancellationRate: (json['cancellation_rate'] as num?)?.toDouble() ?? 0.0,
      baseRatePerHour: (json['base_rate_per_hour'] as num?)?.toInt() ?? 0,
      availabilitySlots: List<String>.from(json['availability_slots'] ?? []),
      specializationLevel: json['specialization_level']?.toString() ?? '',
      distanceKm: (json['distance_km'] as num?)?.toDouble() ?? 0.0,
      active: json['active'] as bool? ?? true,
      matchScore: (json['match_score'] as num?)?.toDouble() ?? 0.92,
      availabilityType: json['availability_type']?.toString() ?? 'exact',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'name': name,
      'service_types': serviceTypes,
      'areas': areas,
      'rating': rating,
      'review_count': reviewCount,
      'last_review_date': lastReviewDate,
      'on_time_score': onTimeScore,
      'cancellation_rate': cancellationRate,
      'base_rate_per_hour': baseRatePerHour,
      'availability_slots': availabilitySlots,
      'specialization_level': specializationLevel,
      'distance_km': distanceKm,
      'active': active,
      'match_score': matchScore,
      'availability_type': availabilityType,
    };
  }
}
