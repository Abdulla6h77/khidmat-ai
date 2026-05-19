class PricingModel {
  final int base;
  final int distance;
  final double urgency;
  final double complexity;
  final int total;
  final String reasoning;

  PricingModel({
    required this.base,
    required this.distance,
    required this.urgency,
    required this.complexity,
    required this.total,
    required this.reasoning,
  });

  factory PricingModel.fromJson(Map<String, dynamic> json) {
    return PricingModel(
      base: (json['base'] as num?)?.toInt() ?? 1000,
      distance: (json['distance'] as num?)?.toInt() ?? 360,
      urgency: (json['urgency'] as num?)?.toDouble() ?? 1.0,
      complexity: (json['complexity'] as num?)?.toDouble() ?? 1.0,
      total: (json['total'] as num?)?.toInt() ?? 1360,
      reasoning:
          json['reasoning']?.toString() ??
          'Dynamic price calculated based on 1.5 km distance travel adjustments and standard service baseline.',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'base': base,
      'distance': distance,
      'urgency': urgency,
      'complexity': complexity,
      'total': total,
      'reasoning': reasoning,
    };
  }
}
