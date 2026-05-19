import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/intent_model.dart';

class RequestProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  IntentModel? _intent;
  IntentModel? get intent => _intent;

  Future<void> submitQuery(String query) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiService.requestService(query);
      if (res['success'] == true) {
        _intent = IntentModel.fromJson(res);
      } else {
        _errorMessage = "Query analysis failed.";
      }
    } catch (e) {
      _errorMessage = "Connection error occurred.";
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  void clearIntent() {
    _intent = null;
    notifyListeners();
  }
}
