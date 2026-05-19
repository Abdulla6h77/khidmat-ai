class BookingModel {
  final String bookingId;
  final String providerId;
  final String providerName;
  final String serviceType;
  final String timeSlot;
  final int price;
  final String
  status; // 'confirmed', 'en_route', 'arrived', 'in_progress', 'completed'
  final String code; // 6-digit confirmation code
  final String eta;

  BookingModel({
    required this.bookingId,
    required this.providerId,
    required this.providerName,
    required this.serviceType,
    required this.timeSlot,
    required this.price,
    required this.status,
    required this.code,
    required this.eta,
  });

  factory BookingModel.fromJson(Map<String, dynamic> json) {
    return BookingModel(
      bookingId: json['booking_id']?.toString() ?? json['id']?.toString() ?? '',
      providerId: json['provider_id']?.toString() ?? '',
      providerName: json['provider_name']?.toString() ?? '',
      serviceType: json['service_type']?.toString() ?? '',
      timeSlot: json['time_slot']?.toString() ?? '',
      price: (json['price'] as num?)?.toInt() ?? 0,
      status: json['status']?.toString() ?? 'confirmed',
      code: json['code']?.toString() ?? '526377',
      eta: json['eta']?.toString() ?? '15-20 min',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'booking_id': bookingId,
      'provider_id': providerId,
      'provider_name': providerName,
      'service_type': serviceType,
      'time_slot': timeSlot,
      'price': price,
      'status': status,
      'code': code,
      'eta': eta,
    };
  }

  BookingModel copyWith({
    String? bookingId,
    String? providerId,
    String? providerName,
    String? serviceType,
    String? timeSlot,
    int? price,
    String? status,
    String? code,
    String? eta,
  }) {
    return BookingModel(
      bookingId: bookingId ?? this.bookingId,
      providerId: providerId ?? this.providerId,
      providerName: providerName ?? this.providerName,
      serviceType: serviceType ?? this.serviceType,
      timeSlot: timeSlot ?? this.timeSlot,
      price: price ?? this.price,
      status: status ?? this.status,
      code: code ?? this.code,
      eta: eta ?? this.eta,
    );
  }
}
