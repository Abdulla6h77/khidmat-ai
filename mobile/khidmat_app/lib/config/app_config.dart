class AppConfig {
  static const bool isEmulator = true;
  static String get baseUrl =>
      isEmulator ? 'http://10.0.2.2:8000' : 'http://localhost:8000';
}
