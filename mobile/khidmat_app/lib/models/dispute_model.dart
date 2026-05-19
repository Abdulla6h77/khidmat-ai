class DisputeModel {
  final String disputeId;
  final String bookingId;
  final String disputeType;
  final String resolutionText;
  final int compensationAmount;
  final int escalationLevel; // 1 = Minor, 2 = Moderate, 3 = Escalated
  final String status;

  DisputeModel({
    required this.disputeId,
    required this.bookingId,
    required this.disputeType,
    required this.resolutionText,
    required this.compensationAmount,
    required this.escalationLevel,
    required this.status,
  });

  factory DisputeModel.fromJson(Map<String, dynamic> json) {
    return DisputeModel(
      disputeId:
          json['dispute_id']?.toString() ??
          json['id']?.toString() ??
          'DISP-8921',
      bookingId: json['booking_id']?.toString() ?? '',
      disputeType: json['dispute_type']?.toString() ?? 'Quality',
      resolutionText:
          json['resolution']?.toString() ??
          json['resolution_text']?.toString() ??
          'Auto-Refund approved due to verified quality complaint.',
      compensationAmount:
          (json['compensation'] as num?)?.toInt() ??
          json['compensation_amount']?.toInt() ??
          300,
      escalationLevel: (json['escalation_level'] as num?)?.toInt() ?? 1,
      status: json['status']?.toString() ?? 'resolved',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'dispute_id': disputeId,
      'booking_id': bookingId,
      'dispute_type': disputeType,
      'resolution_text': resolutionText,
      'compensation_amount': compensationAmount,
      'escalation_level': escalationLevel,
      'status': status,
    };
  }
}
