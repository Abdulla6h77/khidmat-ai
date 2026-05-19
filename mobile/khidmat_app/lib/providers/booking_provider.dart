import 'package:flutter/material.dart';
import '../services/api_service.dart';
import '../models/provider_model.dart';
import '../models/booking_model.dart';
import '../models/dispute_model.dart';

class BookingProvider with ChangeNotifier {
  final ApiService _apiService = ApiService();

  bool _isLoading = false;
  bool get isLoading => _isLoading;

  String? _errorMessage;
  String? get errorMessage => _errorMessage;

  List<ProviderModel> _providers = [];
  List<ProviderModel> get providers => _providers;

  BookingModel? _activeBooking;
  BookingModel? get activeBooking => _activeBooking;

  DisputeModel? _activeDispute;
  DisputeModel? get activeDispute => _activeDispute;

  Future<void> fetchProviders() async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final list = await _apiService.getProviders();
      _providers = list.map((json) => ProviderModel.fromJson(json)).toList();
    } catch (e) {
      _errorMessage = "Failed to load providers list.";
    } finally {
      _isLoading = false;
      notifyListeners();
    }
  }

  Future<bool> createBooking({
    required String providerId,
    required String providerName,
    required String serviceType,
    required String timeSlot,
    required int price,
  }) async {
    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiService.bookService({
        'provider_id': providerId,
        'provider_name': providerName,
        'service_type': serviceType,
        'time_slot': timeSlot,
        'price': price,
      });

      if (res['success'] == true) {
        _activeBooking = BookingModel.fromJson(res);
        _isLoading = false;
        notifyListeners();
        return true;
      } else {
        _errorMessage = "Failed to finalize booking.";
      }
    } catch (e) {
      _errorMessage = "Network booking request failed.";
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  Future<void> updateTrackingStatus() async {
    if (_activeBooking == null) return;

    try {
      final res = await _apiService.getFollowup(_activeBooking!.bookingId);
      if (res['success'] == true) {
        _activeBooking = _activeBooking!.copyWith(
          status: res['status']?.toString(),
          eta: res['eta']?.toString(),
        );
        notifyListeners();
      }
    } catch (_) {}
  }

  Future<void> simulateStatusProgression() async {
    if (_activeBooking == null) return;

    const statuses = [
      'confirmed',
      'en_route',
      'arrived',
      'in_progress',
      'completed',
    ];
    int currentIndex = statuses.indexOf(_activeBooking!.status);
    if (currentIndex != -1 && currentIndex < statuses.length - 1) {
      final nextStatus = statuses[currentIndex + 1];

      _isLoading = true;
      notifyListeners();

      try {
        final res = await _apiService.advanceFollowupStatus(
          _activeBooking!.bookingId,
          nextStatus,
        );
        if (res['success'] == true) {
          _activeBooking = _activeBooking!.copyWith(
            status: res['status']?.toString(),
            eta: res['eta']?.toString(),
          );
        }
      } catch (_) {
        // Direct state advance in case of offline simulation
        _activeBooking = _activeBooking!.copyWith(
          status: nextStatus,
          eta: nextStatus == 'completed' ? '0 min' : '8 min',
        );
      } finally {
        _isLoading = false;
        notifyListeners();
      }
    }
  }

  Future<bool> submitDispute(String type, String details) async {
    if (_activeBooking == null) return false;

    _isLoading = true;
    _errorMessage = null;
    notifyListeners();

    try {
      final res = await _apiService.raiseDispute({
        'booking_id': _activeBooking!.bookingId,
        'dispute_type': type,
        'details': details,
      });

      if (res['success'] == true) {
        _activeDispute = DisputeModel.fromJson(res);
        _isLoading = false;
        notifyListeners();
        return true;
      }
    } catch (e) {
      _errorMessage = "Failed to lodge dispute ticket.";
    }

    _isLoading = false;
    notifyListeners();
    return false;
  }

  void resetDispute() {
    _activeDispute = null;
    notifyListeners();
  }

  void clearBooking() {
    _activeBooking = null;
    _activeDispute = null;
    notifyListeners();
  }
}
