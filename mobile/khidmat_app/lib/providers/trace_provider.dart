import 'package:flutter/material.dart';
import '../services/api_service.dart';

class TraceProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  List<dynamic> _traces = [];
  List<dynamic> get traces => _traces;

  double _processingTime = 0.0;
  double get processingTime => _processingTime;

  Future<void> fetchAgentTrace(String bookingId) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiService.getTrace(bookingId);
      _traces = res['agents'] ?? [];
      _processingTime =
          (res['processing_time_seconds'] as num?)?.toDouble() ?? 0.0;
    } catch (e) {
      _errorMessage = "Failed to load agent transaction log traces.";
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }
}
