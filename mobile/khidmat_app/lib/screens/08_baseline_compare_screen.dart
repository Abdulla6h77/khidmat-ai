import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../constants/app_colors.dart';
import '../constants/app_strings.dart';
import '../constants/app_text_styles.dart';
import '../providers/booking_provider.dart';
import '../widgets/bilingual_text.dart';

class BaselineCompareScreen extends StatelessWidget {
  const BaselineCompareScreen({super.key});

  @override
  Widget build(BuildContext context) {
    final bookingProvider = Provider.of<BookingProvider>(context);

    final List<Map<String, dynamic>> _metrics = [
      {
        "metricEn": "Booking Latency",
        "metricUr": "بکنگ کی رفتار",
        "legacy": "92 seconds",
        "khidmat": "3 seconds",
        "improvement": "96.7% Faster",
        "isFaster": true,
      },
      {
        "metricEn": "Matching Accuracy",
        "metricUr": "ملانے کی درستگی",
        "legacy": "42%",
        "khidmat": "98%",
        "improvement": "2.3x Better",
        "isFaster": true,
      },
      {
        "metricEn": "Dispute Resolution",
        "metricUr": "شکایت کا ازالہ",
        "legacy": "48 hours",
        "khidmat": "Instant (3s)",
        "improvement": "Immediate",
        "isFaster": true,
      },
      {
        "metricEn": "Bilingual Recognition",
        "metricUr": "رومن اردو کی سمجھ",
        "legacy": "Fails (0%)",
        "khidmat": "Succeeds (99%)",
        "improvement": "Flawless",
        "isFaster": true,
      },
    ];

    return Scaffold(
      backgroundColor: AppColors.background,
      appBar: AppBar(
        title: BilingualText(
          english: AppStrings.whyKhidmatEn,
          urdu: AppStrings.whyKhidmatUr,
          englishStyle: AppTextStyles.headingMediumEn.copyWith(
            color: Colors.white,
          ),
          urduStyle: AppTextStyles.headingMediumUr.copyWith(
            color: Colors.white,
          ),
        ),
        backgroundColor: AppColors.primary,
        elevation: 0,
        iconTheme: const IconThemeData(color: Colors.white),
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Analytics Dashboard Header Card
            Card(
              elevation: 0,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12.0),
                side: const BorderSide(color: AppColors.divider),
              ),
              color: AppColors.surface,
              child: Padding(
                padding: const EdgeInsets.all(16.0),
                child: Column(
                  children: [
                    const Icon(
                      Icons.analytics,
                      color: AppColors.primary,
                      size: 48,
                    ).animate().scale(duration: 400.ms, curve: Curves.easeIn),
                    const SizedBox(height: 12),
                    const BilingualText(
                      english: "AI Automation Baseline Analysis",
                      urdu: "خودکار کارکردگی کا موازنہ",
                      englishStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 16,
                      ),
                      urduStyle: TextStyle(
                        fontWeight: FontWeight.bold,
                        color: AppColors.textPrimary,
                        fontSize: 15,
                      ),
                      crossAxisAlignment: CrossAxisAlignment.center,
                    ),
                    const SizedBox(height: 6),
                    const BilingualText(
                      english:
                          "Real-time comparison between Legacy Keyword search and KhidmatAI natural conversational workflows.",
                      urdu:
                          "روایتی کی ورڈ سرچ اور جدید گفتگو کے طریقے کار کے درمیان فرق۔",
                      englishStyle: TextStyle(
                        fontSize: 11,
                        color: AppColors.textSecondary,
                      ),
                      urduStyle: TextStyle(
                        fontSize: 10,
                        color: AppColors.textSecondary,
                      ),
                      crossAxisAlignment: CrossAxisAlignment.center,
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),
            // Comparison Cards
            const Padding(
              padding: EdgeInsets.symmetric(horizontal: 4.0),
              child: BilingualText(
                english: "Performance Metrics & KPIs",
                urdu: "کارکردگی کی تفصیلات",
                englishStyle: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                  fontSize: 15,
                ),
                urduStyle: TextStyle(
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                  fontSize: 14,
                ),
              ),
            ),
            const SizedBox(height: 8),
            ListView.builder(
              shrinkWrap: true,
              physics: const NeverScrollableScrollPhysics(),
              itemCount: _metrics.length,
              itemBuilder: (context, index) {
                final m = _metrics[index];
                return Card(
                  elevation: 0,
                  margin: const EdgeInsets.only(bottom: 12.0),
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
                        Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            BilingualText(
                              english: m['metricEn'],
                              urdu: m['metricUr'],
                              englishStyle: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                                fontSize: 14,
                              ),
                              urduStyle: const TextStyle(
                                fontWeight: FontWeight.bold,
                                color: AppColors.textPrimary,
                                fontSize: 13,
                              ),
                            ),
                            Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 8,
                                vertical: 4,
                              ),
                              decoration: BoxDecoration(
                                color: AppColors.primarySurface,
                                borderRadius: BorderRadius.circular(4.0),
                              ),
                              child: Text(
                                m['improvement'],
                                style: const TextStyle(
                                  color: AppColors.primary,
                                  fontWeight: FontWeight.bold,
                                  fontSize: 11,
                                ),
                              ),
                            ),
                          ],
                        ),
                        const Divider(height: 20, color: AppColors.divider),
                        Row(
                          children: [
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  const Text(
                                    "LEGACY KEYWORDS",
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: AppColors.textDisabled,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    m['legacy'],
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.error,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                            const Icon(
                              Icons.arrow_forward,
                              color: AppColors.textDisabled,
                              size: 16,
                            ),
                            Expanded(
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.end,
                                children: [
                                  const Text(
                                    "KHIDMATAI VOICE",
                                    style: TextStyle(
                                      fontSize: 10,
                                      color: AppColors.primary,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                  const SizedBox(height: 4),
                                  Text(
                                    m['khidmat'],
                                    style: const TextStyle(
                                      fontWeight: FontWeight.bold,
                                      color: AppColors.success,
                                      fontSize: 14,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),
                      ],
                    ),
                  ),
                );
              },
            ),
            const SizedBox(height: 24),
            // Finish session back home button
            SizedBox(
              width: double.infinity,
              child: ElevatedButton(
                onPressed: () {
                  bookingProvider.clearBooking();
                  Navigator.of(context).popUntil((route) => route.isFirst);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  padding: const EdgeInsets.symmetric(vertical: 14),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(8.0),
                  ),
                ),
                child: const BilingualText(
                  english: "Complete Flow & Reset",
                  urdu: "پورے سیشن کو ری سیٹ کریں",
                  englishStyle: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  urduStyle: TextStyle(
                    color: Colors.white,
                    fontWeight: FontWeight.bold,
                  ),
                  crossAxisAlignment: CrossAxisAlignment.center,
                ),
              ),
            ),
            const SizedBox(height: 32),
          ],
        ),
      ),
    );
  }
}
