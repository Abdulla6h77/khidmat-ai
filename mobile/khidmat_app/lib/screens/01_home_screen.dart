import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../constants/app_text_styles.dart';
import '../providers/request_provider.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';
import '02_providers_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final TextEditingController _queryController = TextEditingController();
  bool _isListening = false;

  final List<Map<String, String>> _suggestions = [
    {
      "en": "plumber chahiye urgent F-8 mein",
      "ur": "F-8 میں پلمبر چاہیے، ارجنٹ",
    },
    {
      "en": "AC thand nahi kar raha, urgent technician bhejein",
      "ur": "اے سی ٹھنڈ نہیں کر رہا، ارجنٹ ٹیکنیشن بھیجیں",
    },
    {
      "en": "room ki safai karwani hai, cleaner chahiye",
      "ur": "کمرے کی صفائی کروانی ہے، کلینر چاہیے",
    },
    {
      "en": "bijli ka short circuit check karna hai, electrician bhejein",
      "ur": "بجلی کا شارٹ سرکٹ چیک کرنا ہے، الیکٹریشن بھیجیں",
    },
  ];

  @override
  void dispose() {
    _queryController.dispose();
    super.dispose();
  }

  void _simulateVoiceListening() {
    setState(() {
      _isListening = true;
    });

    // Simulate speech-to-text response
    Future.delayed(const Duration(seconds: 2), () {
      if (!mounted) return;
      setState(() {
        _isListening = false;
        _queryController.text = "plumber chahiye urgent F-8 mein";
      });
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text("Voice input captured in Urdu successfully!"),
          backgroundColor: AppColors.success,
        ),
      );
    });
  }

  Future<void> _handleSearch() async {
    final query = _queryController.text.trim();
    if (query.isEmpty) return;

    final requestProvider = Provider.of<RequestProvider>(
      context,
      listen: false,
    );
    final bookingProvider = Provider.of<BookingProvider>(
      context,
      listen: false,
    );

    await requestProvider.submitQuery(query);

    if (requestProvider.errorMessage == null &&
        requestProvider.intent != null) {
      // Trigger provider listing fetch
      await bookingProvider.fetchProviders();

      if (!mounted) return;
      Navigator.push(
        context,
        MaterialPageRoute(builder: (context) => const ProvidersScreen()),
      );
    } else if (requestProvider.errorMessage != null) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: Text(requestProvider.errorMessage!),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: Row(
          children: [
            const Icon(Icons.bolt, color: AppColors.accent, size: 28),
            const SizedBox(width: 8),
            BilingualText(
              english: AppStrings.appNameEn,
              urdu: AppStrings.appNameUr,
              englishStyle: AppTextStyles.headingLargeEn.copyWith(
                color: Colors.white,
                fontSize: 20,
              ),
              urduStyle: AppTextStyles.headingLargeUr.copyWith(
                color: Colors.white,
                fontSize: 18,
              ),
            ),
          ],
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            // Green Banner Card
            Container(
              width: double.infinity,
              color: AppColors.primary,
              padding: const EdgeInsets.symmetric(
                horizontal: 20.0,
                vertical: 24.0,
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  BilingualText(
                    english: "Pakistan's First AI Home Service Marketplace",
                    urdu:
                        "پاکستان کا پہلا آرٹیفیشل انٹیلیجنس ہوم سروسز نیٹ ورک",
                    englishStyle: AppTextStyles.headingLargeEn.copyWith(
                      color: Colors.white,
                      fontSize: 22,
                    ),
                    urduStyle: AppTextStyles.headingLargeUr.copyWith(
                      color: Colors.white,
                      fontSize: 18,
                    ),
                  ).animate().fadeIn(duration: 400.ms).slideY(begin: 0.2, end: 0),
                  const SizedBox(height: 12),
                  BilingualText(
                    english:
                        "Book reliable help instantly via direct voice request.",
                    urdu: "اپنی آواز کے ذریعے گھر بیٹھے فوری خدمات حاصل کریں۔",
                    englishStyle: AppTextStyles.bodyEn.copyWith(
                      color: Colors.white70,
                    ),
                    urduStyle: AppTextStyles.bodyUr.copyWith(
                      color: Colors.white70,
                    ),
                  ),
                ],
              ),
            ),
            const SizedBox(height: 16),
            // Search Area
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: Card(
                elevation: 0,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(12.0),
                  side: const BorderSide(color: AppColors.divider),
                ),
                color: AppColors.surface,
                child: Padding(
                  padding: const EdgeInsets.all(16.0),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const BilingualText(
                        english: "Describe what you need:",
                        urdu: "بتائیں کہ آپ کو کس چیز کی ضرورت ہے:",
                        englishStyle: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                        urduStyle: TextStyle(
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 12),
                      // Text input + Search
                      Row(
                        children: [
                          Expanded(
                            child: TextField(
                              controller: _queryController,
                              style: const TextStyle(fontSize: 14),
                              decoration: InputDecoration(
                                hintText: AppStrings.searchHintEn,
                                hintStyle: const TextStyle(
                                  color: AppColors.textDisabled,
                                  fontSize: 13,
                                ),
                                fillColor: AppColors.background,
                                filled: true,
                                border: OutlineInputBorder(
                                  borderRadius: BorderRadius.circular(8.0),
                                  borderSide: BorderSide.none,
                                ),
                                contentPadding: const EdgeInsets.symmetric(
                                  horizontal: 12,
                                  vertical: 10,
                                ),
                              ),
                            ),
                          ),
                          const SizedBox(width: 8),
                          // Microphone button (Urdu Voice simulated)
                          GestureDetector(
                            onTap: _simulateVoiceListening,
                            child: CircleAvatar(
                              radius: 22,
                              backgroundColor: _isListening
                                  ? AppColors.accent
                                  : AppColors.primarySurface,
                              child: Icon(
                                _isListening ? Icons.mic : Icons.mic_none,
                                color: _isListening
                                    ? Colors.white
                                    : AppColors.primary,
                              ),
                            ),
                          ),
                        ],
                      ),
                      const SizedBox(height: 12),
                      // Submit button
                      Consumer<RequestProvider>(
                        builder: (context, request, child) {
                          return SizedBox(
                            width: double.infinity,
                            child: ElevatedButton(
                              onPressed: request.isLoading
                                  ? null
                                  : () => _handleSearch(),
                              style: ElevatedButton.styleFrom(
                                backgroundColor: AppColors.primary,
                                padding: const EdgeInsets.symmetric(
                                  vertical: 12,
                                ),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(8.0),
                                ),
                              ),
                              child: request.isLoading
                                  ? const SizedBox(
                                      height: 20,
                                      width: 20,
                                      child: CircularProgressIndicator(
                                        color: Colors.white,
                                        strokeWidth: 2,
                                      ),
                                    )
                                  : const BilingualText(
                                      english: AppStrings.findServiceEn,
                                      urdu: AppStrings.findServiceUr,
                                      englishStyle: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      urduStyle: TextStyle(
                                        color: Colors.white,
                                        fontWeight: FontWeight.bold,
                                      ),
                                      crossAxisAlignment:
                                          CrossAxisAlignment.center,
                                    ),
                            ),
                          );
                        },
                      ),
                    ],
                  ),
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Suggestions header
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 20.0),
              child: Align(
                alignment: Alignment.centerLeft,
                child: const BilingualText(
                  english: "Try saying these (Bilingual Hints):",
                  urdu: "یہ کوشش کر کے دیکھیں:",
                  englishStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                  urduStyle: TextStyle(
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
              ),
            ),
            const SizedBox(height: 8),
            // Suggestion chip cards
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _suggestions.length,
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              itemBuilder: (context, index) {
                final item = _suggestions[index];
                return Card(
                  elevation: 0,
                  color: AppColors.surface,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                    side: const BorderSide(color: AppColors.divider),
                  ),
                  margin: const EdgeInsets.only(bottom: 8.0),
                  child: InkWell(
                    onTap: () {
                      _queryController.text = item['en']!;
                    },
                    borderRadius: BorderRadius.circular(8.0),
                    child: Padding(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 16.0,
                        vertical: 12.0,
                      ),
                      child: Row(
                        children: [
                          const Icon(
                            Icons.chat_bubble_outline,
                            size: 18,
                            color: AppColors.primary,
                          ),
                          const SizedBox(width: 12),
                          Expanded(
                            child: BilingualText(
                              english: item['en']!,
                              urdu: item['ur']!,
                              englishStyle: AppTextStyles.bodyEn.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                              urduStyle: AppTextStyles.bodyUr.copyWith(
                                fontWeight: FontWeight.w500,
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
